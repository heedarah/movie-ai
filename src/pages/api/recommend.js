import { PrismaClient } from "@prisma/client";
import axios from "axios";

const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { genre, type, mood, foreign, watchingWith, ending } = req.body;

  try {
    // Fetch Recommendations (Same logic as before)
    const prompt = `Recommend 9 ${type.toLowerCase()}s in the ${genre} genre 
      that match the following mood: ${mood}. It should be suitable for ${watchingWith}.
      The movie should have a ${
        ending === "happy" ? "happy ending" : "twist ending"
      }.
      Also, provide a catchy title for this recommendation list. Only return a list of movie names and the title.`;

    const gptResponse = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 150,
      },
      { headers: { Authorization: `Bearer ${OPENAI_API_KEY}` } }
    );

    const responseLines = gptResponse.data.choices[0].message.content
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const rawTitle = responseLines[0]?.replace(/^[0-9]+\.\s*/, "").trim();
    const title = rawTitle
      .replace(/^Recommendation List:\s*"?/, "")
      .replace(/"?$/, "");

    const movieList = responseLines.slice(1).map((m) =>
      m
        .replace(/^[0-9]+\.\s*/, "")
        .replace(/\(\d{4}.*?\)/, "")
        .trim()
    );

    // Fetch Movie Details from TMDB
    const moviesWithDetails = await Promise.all(
      movieList.map(async (movie) => {
        const searchRes = await axios.get(
          `https://api.themoviedb.org/3/search/movie`,
          {
            params: {
              api_key: TMDB_API_KEY,
              query: movie,
              include_adult: false,
            },
          }
        );

        const movieData = searchRes.data.results[0]; // Take first result
        return movieData
          ? {
              title: movieData.title,
              overview: movieData.overview,
              poster: movieData.poster_path
                ? `https://image.tmdb.org/t/p/w500${movieData.poster_path}`
                : null,
              release_date: movieData.release_date,
              rating: movieData.vote_average,
              id: movieData.id,
            }
          : null;
      })
    );

    // Remove null values (movies not found)
    const finalMovies = moviesWithDetails.filter(Boolean);

    // Step 3: Store in Database
    const savedRecommendation = await prisma.recommendation.create({
      data: {
        title,
        movies: {
          create: finalMovies.map((movie) => ({
            title: movie.title,
            overview: movie.overview || "",
            poster: movie.poster || "",
            release_date: movie.release_date || "",
            rating: movie.rating || 0,
            movieId: `${movie.id}`,
          })),
        },
      },
      include: { movies: true },
    });

    res.status(200).json({
      title,
      recommendations: savedRecommendation.movies,
      id: savedRecommendation.id,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(400).json({ error: "Something went wrong" });
  }
}

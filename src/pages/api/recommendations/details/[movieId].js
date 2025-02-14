import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { movieId } = req.query;

  if (!movieId || typeof movieId !== "string") {
    return res.status(400).json({ error: "Invalid or missing movieId" });
  }

  try {
    // Fetch movie from DB using movieId
    const movie = await prisma.movie.findFirst({
      where: { movieId },
    });

    if (!movie) {
      return res.status(404).json({ error: "Movie not found in database" });
    }

    // Fetch full movie details from TMDb
    const tmdbRes = await fetch(
      `${TMDB_BASE_URL}/movie/${movie.movieId}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos`
    );

    if (!tmdbRes.ok) throw new Error("Failed to fetch movie details from TMDb");

    const tmdbData = await tmdbRes.json();

    // Structure the response
    const movieDetails = {
      id: tmdbData.id,
      title: tmdbData.title,
      description: tmdbData.overview || "No description available",
      rating: tmdbData.vote_average || "N/A",
      banner: tmdbData.backdrop_path
        ? `https://image.tmdb.org/t/p/original${tmdbData.backdrop_path}`
        : null,
      poster: tmdbData.poster_path
        ? `https://image.tmdb.org/t/p/w500${tmdbData.poster_path}`
        : null,
      trailer: getTrailerUrl(tmdbData.videos?.results || []),
      releaseDate: tmdbData.release_date || "Unknown",
      runtime: tmdbData.runtime || "Unknown",
      genres: tmdbData.genres?.map((g) => g.name) || [],
      language: tmdbData.original_language || "Unknown",
      directors: getDirectors(tmdbData.credits?.crew || []),
      cast: getCastList(tmdbData.credits?.cast || []),
    };

    res.status(200).json(movieDetails);
  } catch (error) {
    console.error("Error fetching movie:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

/**
 * Get trailer video URL from TMDb video results
 */
function getTrailerUrl(videos) {
  const trailer = videos.find(
    (video) => video.type === "Trailer" && video.site === "YouTube"
  );
  return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
}

/**
 * Get directors from the crew list
 */
function getDirectors(crew) {
  return crew
    .filter((member) => member.job === "Director")
    .map((director) => director.name);
}

/**
 * Get top 10 cast members
 */
function getCastList(cast) {
  return cast.slice(0, 10).map((member) => ({
    name: member.name,
    character: member.character,
    profile: member.profile_path
      ? `https://image.tmdb.org/t/p/w500${member.profile_path}`
      : null,
  }));
}

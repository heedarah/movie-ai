import Questions from "../../components/questions";
import Logo from "../../components/logo";

export default function MovieList({ recommendation }) {
  console.log(recommendation, "ss");
  if (!recommendation) {
    return <p className="text-center">Recommendation not found.</p>;
  }

  return (
    <div className="flex flex-col gap-10 md:gap-20 pb-[50px]">
      <Logo
        title={recommendation?.title}
        description={recommendation?.description}
        banner={recommendation?.banner}
        link={recommendation?.trailer}
      />
      <div className="container">
        <div className="flex gap-6">
          <img
            src={recommendation?.poster}
            alt=""
            className="md:w-[35%] w-full object-cover hidden md:block"
          />
          <div>
            <h2 className="text-2xl">
              <b>Storyline</b>
            </h2>
            <p className="mt-3">{recommendation?.description}</p>
            <div className="mt-5 flex flex-col gap-3">
              <p>
                <b>Release Date:</b> {recommendation?.releaseDate}
              </p>
              <p>
                <b>Runtime:</b> {recommendation?.runtime} mins
              </p>
              <p>
                <b>Directors:</b> {recommendation?.directors.join(", ")}
              </p>
              <p>
                <b>Language:</b> {recommendation?.language}
              </p>
              <p>
                <b>Rating:</b> {recommendation?.rating}
              </p>
              <p>
                <b>Genres:</b> {recommendation?.genres.join(", ")}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-20">
          <h2 className="text-2xl">
            <b>Cast</b>
          </h2>
          <div className="grid mt-6 grid-cols-2 md:grid-cols-4 gap-5">
            {recommendation?.cast.map((actor, index) => (
              <div key={index} className="flex flex-col items-center">
                <img
                  src={actor.profile}
                  alt=""
                  className="w-full h-[250px] object-cover rounded-[10px]"
                />
                <p className="mt-2 text-center">{actor.name}</p>
                <p className="text-xs text-gray-400">{actor.character}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { movieId } = context.query;

  if (!movieId) {
    return {
      notFound: true, // Show 404 page if no ID is provided
    };
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/recommendations/details/${movieId}` // Updated API URL
    );
    if (!res.ok) throw new Error("Failed to fetch recommendation");

    const data = await res.json();

    return {
      props: { recommendation: data },
    };
  } catch (error) {
    console.error("Error fetching recommendation:", error);
    return {
      props: { recommendation: null },
    };
  }
}

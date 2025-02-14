import Logo from "../../components/logo";
import MovieList from "../../components/movie-list";

export default function Movies({ recommendation }) {
  if (!recommendation) {
    return <p className="text-center">Recommendation not found.</p>;
  }

  return (
    <div className="flex flex-col gap-10 md:gap-20 pb-[50px]">
      <Logo title={recommendation.title} description="Recommended Movies" />
      <MovieList movies={recommendation.movies} />
    </div>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.query;

  if (!id) {
    return {
      notFound: true, // Show 404 if no ID is provided
    };
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/recommendations/${id}`
    );
    if (!res.ok) throw new Error("Failed to fetch recommendation");

    const recommendation = await res.json();

    return {
      props: { recommendation },
    };
  } catch (error) {
    console.error("Error fetching recommendation:", error);
    return {
      props: { recommendation: null },
    };
  }
}

import Link from "next/link";
import React from "react";

export default function MovieList({ movies }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px] container">
      {movies?.map((movie, index) => (
        <Link
          href={`/recommendations/${movie.movieId}`}
          key={index}
          className="bg-[#111111] rounded-[20px] overflow-hidden group h-[400px] relative"
        >
          <div className="relative w-full h-full overflow-hidden">
            <img
              src={movie.poster}
              alt="movie"
              className="w-full h-full bg-[#414141] object-cover object-center group-hover:scale-[1.2] transition-all duration-300"
            />
          </div>
          <div className="p-[20px] gap-2 flex flex-col absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-xl">
            <h3 className="text-lg font-bold text-white">{movie.title}</h3>
            <p className="text-xs text-gray-400 line-clamp-2">
              {movie.overview}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}

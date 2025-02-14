import Link from "next/link";
import React from "react";

export default function Logo({
  title = "Welcome to your Movie AI.",
  description = "I will help your find your next watch.",
  banner = "https://cdn.prod.website-files.com/659178d9da05eabf7b580b7c/65a9a57acc09aa9f9b7ff02c_Footer_Art_updated.webp",
  link,
}) {
  return (
    <div>
      <div className="w-full h-[100px] bg-black">
        <div className="container h-full flex items-center justify-between">
          <Link href="/">
            <h1 className="text-white text-2xl font-bold">MovieAI</h1>
          </Link>

          <div className="flex items-center gap-6">
            <a
              href="https://github.com/matt-west/movieai"
              className="text-white text-sm"
            >
              Share
            </a>
            <a
              href="https://github.com/matt-west/movieai"
              className="text-white text-sm"
            >
              Rate on Github
            </a>
          </div>
        </div>
      </div>
      <div
        className="w-full bg-cover bg-bottom relative pb-10"
        style={{
          backgroundImage: `url(${banner})`,
        }}
      >
        <div className="container relative z-10 md:h-[400px] h-[500px] flex items-end">
          <div>
            <h1 className="text-[58px] font-bold font-[Chewy] leading-none mb-4">
              {title}
            </h1>
            <p
              className="text-base line-clamp-1 text-black dark:text-white
            "
            >
              {description}
            </p>
            {link && (
              <a
                href={link}
                target="_blank"
                className={
                  "text-white cursor-pointer text-sm bg-[#FF0000] px-4 py-2 mt-4 inline-block rounded-[20px] hover:bg-[#FF0000] transition-all duration-300"
                }
              >
                Watch Trailer
              </a>
            )}
          </div>
        </div>

        {banner && (
          <div
            className="absolute bottom-0 left-0 w-full h-[300px]
        bg-gradient-to-t dark:from-black from-white to-transparent
        "
          ></div>
        )}
      </div>
    </div>
  );
}

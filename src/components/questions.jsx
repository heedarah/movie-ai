import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

const questions = [
  {
    id: "genre",
    text: "What genre do you enjoy the most?",
    options: ["Action", "Comedy", "Sci-Fi", "Horror", "Romance"],
  },
  {
    id: "type",
    text: "Do you prefer movies or TV shows?",
    options: ["Movies", "TV Shows"],
  },
  {
    id: "mood",
    text: "What kind of movie are you in the mood for?",
    options: ["Funny", "Suspenseful", "Emotional", "Mind-blowing"],
  },
  {
    id: "foreign",
    text: "Do you enjoy foreign-language films?",
    options: ["Yes", "No"],
  },
  {
    id: "watchingWith",
    text: "Are you watching alone or with family/friends?",
    options: ["Alone", "Family", "Friends"],
  },
  {
    id: "ending",
    text: "Do you prefer movies with a happy ending or unpredictable twists?",
    options: ["Happy", "Twist"],
  },
];

export default function Questions() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSelect = (option) => {
    setAnswers({ ...answers, [questions[step].id]: option });
    setStep(step + 1);
  };

  const handlePrev = () => setStep(step - 1);

  const router = useRouter();

  const handleGetRecommendations = async () => {
    setLoading(true);
    await axios
      .post("/api/recommend", {
        genre: answers.genre,
        type: answers.type,
        mood: answers.mood,
        foreign: answers.foreign,
        watchingWith: answers.watchingWith,
      })
      .then((res) => {
        router.push(`/recommendations?id=${res.data.id}`);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="w-full container text-white">
      {step < questions.length ? (
        <div className="md:p-[50px] p-6 py-10 bg-[#111111] rounded-[50px]">
          <h2 className="text-lg font-bold mb-4">{questions[step].text}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {questions[step].options.map((option) => (
              <button
                key={option}
                className={`px-4 py-2 bg-[#414141] h-[150px] text-white hover:bg-blue-700 rounded-[50px]`}
                onClick={() => handleSelect(option)}
              >
                {option}
              </button>
            ))}
          </div>
          {step > 0 && (
            <button
              onClick={handlePrev}
              className="mt-4 px-4 py-2 bg-gray-600 rounded-lg"
            >
              Previous
            </button>
          )}
        </div>
      ) : (
        <div className="md:p-[50px] p-6 py-10 bg-[#111111] rounded-[50px]">
          <h2 className="text-xl font-bold mb-4">Your Selections:</h2>
          <ul className="text-left flex flex-col gap-5">
            {Object.entries(answers).map(([key, value]) => (
              <li key={key} className="mb-2 flex items-center justify-between">
                <strong>{key.replace(/([A-Z])/g, " $1").toUpperCase()}:</strong>{" "}
                {value}
              </li>
            ))}
          </ul>
          <div className="flex justify-between mt-10">
            <button
              onClick={handlePrev}
              className=" px-4 py-2 bg-gray-600 rounded-lg"
            >
              Previous
            </button>
            <button
              className=" px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg"
              onClick={handleGetRecommendations}
              disabled={loading}
            >
              {loading ? "Loading..." : "Get Recommendations"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

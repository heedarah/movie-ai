import Questions from "../components/questions";
import Logo from "../components/logo";

export default function Home() {
  return (
    <div className="flex flex-col gap-10 md:gap-20 pb-[50px]">
      <Logo />
      <Questions />
    </div>
  );
}

import Image from "next/image";
import MenuBar from "./components/MenuBar";
import UserContent from "./components/UserContent";

export default function Home() {
  return (
    <main className="h-screen md:overflow-hidden ">
      <UserContent />
    </main>
  );
}

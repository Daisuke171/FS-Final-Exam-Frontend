import Navbar from "@/app/components/ui/Navbar";
import MainCard from "./main-card";

const MOCK_NAV_PROPS = {
  username: "Nombre", 
  avatar: "/default-pfp.jpg", 
  users: 124 
};

export default function Home() {
  return (
    <>
      <Navbar {...MOCK_NAV_PROPS} />
      <div className="flex flex-col h-screen items-center justify-center bg-gradient-one">
        <MainCard />
      </div>
    </>
  );
}

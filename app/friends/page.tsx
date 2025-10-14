import Navbar from "../components/Navbar";
import MainContent from "../components/MainContent";
import BottomBar from "../components/BottomBar";

export default function Page() {
  return (
    <>
      <Navbar username="Usuario" avatar="/default-pfp.jpg" users={1200} />
      
      <BottomBar />
    </>
  );
}

import Navbar from "@/components/ui/general/landing-page/Navbar";
import RoomComponent from "./room-component";

const MOCK_NAV_PROPS = {
  username: "Nombre",
  avatar: "/default-pfp.jpg",
  users: 124,
};

export default function Room() {
  return (
    <>
      <Navbar {...MOCK_NAV_PROPS} />
      <div className="flex flex-col h-screen items-center justify-center">
        <RoomComponent />
      </div>
    </>
  );
}

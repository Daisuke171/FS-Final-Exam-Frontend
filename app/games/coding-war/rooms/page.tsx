import PublicRoomsList from "./public-rooms-list";

export default function Rooms() {
  return (
    <div className="flex flex-col h-screen items-center justify-center pt-[calc(75px+2.5rem)]">
      <PublicRoomsList />
    </div>
  );
}

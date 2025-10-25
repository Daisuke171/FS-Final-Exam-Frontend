import RoomComponent from "./room-component";

export default function Room() {
  return (
    <>
      <div className="flex flex-col h-screen items-center justify-center pt-[calc(75px+2.5rem)]">
        <RoomComponent />
      </div>
    </>
  );
}

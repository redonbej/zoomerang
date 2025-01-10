import CreateJoinRoomControls from "@/app/(main)/room/createJoinRoomControls";

export default function Room() {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="sm:w-[1000px] w-full sm:h-4/5 shadow-2xl rounded-lg p-10 sm:m-10 m-5 flex flex-col">
        <h1 className="text-4xl text-gray-200 font-normal text-center mb-10">
          Video calls and meetings free of charge
        </h1>

        <p className="text-gray-100 text-2xl text-center mb-10">
          Get in touch with your friends or family by live chatting, sending
          reactions and collaborating
        </p>

        <CreateJoinRoomControls></CreateJoinRoomControls>
      </div>
    </div>
  );
}

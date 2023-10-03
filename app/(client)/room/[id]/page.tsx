import VoteUI from "@/(client)/room/[id]/VoteUI";

export const runtime = "edge";

export default function Room() {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-2">
      <VoteUI />
    </div>
  );
}

import RoomList from "@/app/_components/RoomList";
import { FaShieldAlt } from "react-icons/fa";
import { GiStarFormation } from "react-icons/gi";
import { isAdmin, isVIP } from "@/utils/helpers";
import { currentUser } from "@clerk/nextjs";
import { Suspense } from "react";
import Loading from "../_components/Loading";

export const runtime = "edge";
export const preferredRegion = ["pdx1"];

export default async function Dashboard() {
  const user = await currentUser();

  return (
    <div className="flex flex-col text-center items-center justify-center px-4 py-16 gap-4">
      <h1 className="flex flex-row flex-wrap text-center justify-center items-center gap-1 text-4xl font-bold mx-auto">
        Hi, {user?.firstName}!{" "}
        {isAdmin(user?.publicMetadata) && (
          <FaShieldAlt className="inline-block text-primary" />
        )}
        {isVIP(user?.publicMetadata) && (
          <GiStarFormation className="inline-block text-secondary" />
        )}
      </h1>

      <Suspense fallback={<Loading />}>
        <RoomList />
      </Suspense>
    </div>
  );
}

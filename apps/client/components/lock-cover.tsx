import { tokenStore } from "@/utils/token-store";
import Image from "next/image";

const LockCover = () => {
  const isLoggedIn = tokenStore().getAccessToken();

  if (isLoggedIn) return null;
  return (
    <div className="absolute inset-0 bg-black/10 backdrop-blur-xs z-50 h-full flex items-center justify-center">
      <div className="bg-white/80 rounded-lg p-6 shadow-lg w-full ">
        <h2 className="text-2xl font-semibold mb-4">Access Restricted</h2>
        <p className="text-gray-700 mb-4">
          You need to be logged in to view this content. Please log in or sign
          up to continue.
        </p>
        <div className="flex justify-center gap-x-4">
          <Image src="/lock.png" alt="lock image " width={200} height={200} />
        </div>
      </div>
    </div>
  );
};

export default LockCover;

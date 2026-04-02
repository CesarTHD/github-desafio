'use client';
import { Search } from "lucide-react";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [userName, setUserName] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const searchUser = () => {
    if (!userName) {
      setError('Type user name.');
      return;
    };

    router.push(`/profile/${userName}`);
  }

  return (
    <div className="flex flex-col flex-1 gap-10 items-center justify-center bg-white font-sans px-2">
      <h1 className="text-5xl text-blue-700 font-medium">Search <span className="text-purple-700">d_evs</span></h1>
      <div>
        <div className="flex w-lg gap-6 max-w-full">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />

            <input
              type="text"
              placeholder="Search"
              value={userName}
              onChange={(value) => setUserName(value.target.value)}
              className="outline-1 rounded-sm outline-gray-200 text-sm p-2 pl-8 w-full"
            />
          </div>

          <button onClick={searchUser} className="bg-purple-700 text-white py-1 px-10 text-sm rounded-sm cursor-pointer">
            Search
          </button>
        </div>
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      </div>
    </div>
  );
}

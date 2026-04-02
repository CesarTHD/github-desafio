'use client';
import {
  BadgePlusIcon,
  ClipboardList,
  Heart,
  LinkIcon,
  MailIcon,
  MapPin,
  Search,
  StarIcon,
  Users
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchUser, fetchUserRepos } from "@/api/github";
import UserSkeleton from "@/components/skeletons/user";

export default function Profile() {
  const [userName, setUserName] = useState('');

  const params = useParams();
  const username = Array.isArray(params.username)
    ? params.username[0]
    : params.username;

  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [error, setError] = useState(null);
  const [sort, setSort] = useState("created");
  const [direction, setDirection] = useState("desc");

  const observerRef = useRef(null);
  const sentinelRef = useRef(null);

  const router = useRouter();

  useEffect(() => {
    if (!username) return;

    setLoadingUser(true);
    setError(null);

    fetchUser(username)
      .then(setUser)
      .catch(() => {
        setError("Erro ao buscar usuário");
      })
      .finally(() => setLoadingUser(false));
  }, [username]);

  const loadRepos = useCallback(
    async (pageNum, reset = false) => {
      if (!username || loadingRepos) return;

      setLoadingRepos(true);

      try {
        const data = await fetchUserRepos(username, pageNum, sort, direction);

        setRepos((prev) => (reset ? data : [...prev, ...data]));
        setHasMore(data.length === 10);
        setPage(pageNum);
      } catch {
      } finally {
        setLoadingRepos(false);
      }
    },
    [username, sort, direction, loadingRepos]
  );

  useEffect(() => {
    setRepos([]);
    setPage(1);
    setHasMore(true);
    loadRepos(1, true);
  }, [sort, direction, username]);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingRepos) {
          loadRepos(page + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [hasMore, loadingRepos, page, loadRepos]);

  const searchUser = () => {
    if (!userName) {
      setError('Type user name.');
      return;
    };

    router.push(`/profile/${userName}`);
  }

  const goToHome = () => {
    router.push('/');
  }

  return (
    <div className="bg-gray-50">
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-10 py-5 bg-white">
        <button onClick={goToHome} className="text-2xl w-full cursor-pointer max-w-fit text-end text-blue-700 font-medium">
          Search <span className="text-purple-700">d_evs</span>
        </button>
        <div className="relative ">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input type="text" placeholder="Search" value={userName} onChange={(value) => setUserName(value.target.value)}
            className={"outline-1 rounded-sm outline-gray-200 text-sm p-2 pl-8 w-full max-w-lg focus:outline-purple-700 focus:outline-2"}
          />
        </div>
        <button onClick={searchUser} className="bg-purple-700 text-white py-2 px-10 text-sm rounded-sm cursor-pointer">
          Search
        </button>
      </div>

      {loadingUser ? (
        <UserSkeleton />
      ) : !user ? (
        <div className="bg-gray-50 flex justify-center items-center h-96">
          <h2 className="text-xl text-red-600">
            Não há usuários com esse nome: <span className="text-blue-400">{username}</span>
          </h2>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row p-4 md:p-12 lg:p-16 text-gray-700 gap-8 min-h-screen">
          <div className="flex flex-col w-full lg:w-1/3 xl:w-1/5 gap-8">
            <div className="flex flex-col gap-8  bg-white p-6 h-fit">
              <div className="flex gap-2">
                {user?.avatar_url && (
                  <Image
                    src={user.avatar_url}
                    width={50}
                    height={50}
                    alt="avatar"
                    className="rounded-full"
                  />
                )}
                <div className="">
                  <p className="font-semibold text-base text-black">{user?.name}</p>
                  <p className="text-sm text-gray-400">@{user?.login}</p>
                </div>
              </div>
              <p className="text-sm">{user?.bio}</p>
              <div className="flex flex-col gap-2">
                <div className="flex gap-2 items-end">
                  <Users className="" />
                  <p className="text-sm"> {user?.followers} seguidores </p>
                </div>
                <div className="flex gap-2 items-end"> <Heart className="" />
                  <p className="text-sm"> {user?.following} seguindo </p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex gap-2 items-end"> <ClipboardList className="" />
                  <p className="text-sm"> {user?.company ?? 'Não informado'} </p>
                </div>
                <div className="flex gap-2 items-end"> <MapPin className="" />
                  <p className="text-sm"> {user?.location ?? 'Não informado'} </p>
                </div>
                <div className="flex gap-2 items-end"> <MailIcon className="" />
                  <p className="text-sm"> {user?.email ?? 'Não informado'} </p>
                </div>
                {user?.blog &&
                  <div className="flex gap-2 items-end"> <LinkIcon className="" />
                    <a href={user?.blog} target="_blank" className="text-sm"> {user?.blog ?? 'Não informado'} </a>
                  </div>
                }
                <div className="flex gap-2 items-end">
                  <BadgePlusIcon className="" />
                  <a href={user?.twitter_username} className="text-sm"> {user?.twitter_username ? `@${user?.twitter_username}` : 'Não informado'} </a>
                </div>
              </div>
            </div>

            <a className="bg-purple-700 text-white py-3 text-sm rounded-sm cursor-pointer text-center">
              Contato
            </a>
          </div>

          <div className="w-full lg:w-2/3 bg-white p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-lg font-semibold text-black">Repositórios</h2>

              <div className="flex gap-2 items-center">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="outline-1 outline-gray-200 rounded-sm text-sm p-2 focus:outline-purple-700"
                >
                  <option value="created">Mais recentes</option>
                  <option value="updated">Última atualização</option>
                  <option value="pushed">Último push</option>
                  <option value="full_name">Nome</option>
                </select>

                <button
                  onClick={() =>
                    setDirection((prev) => (prev === "asc" ? "desc" : "asc"))
                  }
                  className="text-sm px-3 py-2 border border-gray-200 rounded-sm hover:bg-gray-100"
                >
                  {direction === "asc" ? "↑ ASC" : "↓ DESC"}
                </button>
              </div>
            </div>

            {repos.map((repository) => (
              <div key={repository.id}>
                <div className="flex flex-col gap-2">
                  <a href={repository.html_url} target="_blank" className="font-semibold text-black">{repository.name}</a>
                  <p className="text-sm text-gray-600">{repository.description}</p>
                  <div className="flex gap-2 items-center">
                    <StarIcon width={20} />
                    <span className="text-sm">{repository.stargazers_count}</span> •
                    <p className="text-sm">
                      Atualizado há {Math.floor((Date.now() - Date.parse(repository.updated_at)) / (1000 * 60 * 60 * 24))} dias
                    </p>
                  </div>
                </div>
                <hr className="text-gray-200 my-6" />
                <div ref={sentinelRef} className="" />
              </div >
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
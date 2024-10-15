"use client";

import { useState, useEffect, useMemo } from "react";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import axios from "axios";
import {
  Trophy,
  Search,
  GitCommit,
  GitPullRequest,
  AlertCircle,
  Star,
  Loader2,
  ChevronUp,
  ChevronDown,
  Github,
  Swords,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Player = {
  rank: number;
  name: string;
  avatar: string;
  level: number;
  commits: number;
  pullRequests: number;
  issues: number;
};

type SortKey = "rank" | "level" | "commits" | "pullRequests" | "issues";

export default function GitHubGamingArena() {
  const { isSignedIn, user } = useUser();
  const [theme, setTheme] = useState("dark");
  const [searchTerm, setSearchTerm] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRank, setUserRank] = useState<number | string | null>(null);
  const [userGitHubData, setUserGitHubData] = useState<Player | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("rank");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    fetchTopUsers();
  }, []);

  useEffect(() => {
    if (isSignedIn && user?.externalAccounts.length > 0) {
      fetchUserGitHubData(user.externalAccounts[0]?.username || "");
    }
  }, [isSignedIn, user]);

  const fetchTopUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/github/top-users");
      const data = await response.json();
      const detailedUsers = data.items.map((user: any, index: number) => ({
        rank: index + 1,
        name: user.login,
        avatar: user.avatar_url,
        level: calculateLevel(user.public_repos, user.followers),
        commits: user.public_repos * 50,
        pullRequests: Math.floor(user.public_repos * 0.7),
        issues: Math.floor(user.public_repos * 1.2),
      }));
      setPlayers(detailedUsers);
      if (isSignedIn && userGitHubData) {
        const userRank =
          detailedUsers.findIndex(
            (player: any) => player.name === userGitHubData.name
          ) + 1;
        setUserRank(userRank > 0 ? userRank : "Not in top 100");
      }
    } catch (err) {
      setError("Failed to fetch users. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserGitHubData = async (username: string) => {
    try {
      const res = await axios.get(
        `/api/github/user-details?username=${username}`
      );
      const userData = {
        name: res.data.login,
        avatar: res.data.avatar_url,
        level: calculateLevel(res.data.public_repos, res.data.followers),
        commits: res.data.public_repos * 50,
        pullRequests: Math.floor(res.data.public_repos * 0.7),
        issues: Math.floor(res.data.public_repos * 1.2),
        rank: 0,
      };
      setUserGitHubData(userData);
      const userRank =
        players.findIndex((player) => player.name === username) + 1;
      setUserRank(userRank > 0 ? userRank : "Not in top 100");
    } catch (err) {
      console.error("Failed to fetch user GitHub data", err);
    }
  };

  const calculateLevel = (repos: number, followers: number) => {
    return Math.floor((repos * 2 + followers * 0.5) / 10);
  };

  const filteredPlayers = useMemo(() => {
    return players
      .filter((player) =>
        player.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (a[sortKey] < b[sortKey]) return sortOrder === "asc" ? -1 : 1;
        if (a[sortKey] > b[sortKey]) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
  }, [players, searchTerm, sortKey, sortOrder]);

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const getMedalColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-400";
      case 2:
        return "bg-gray-300";
      case 3:
        return "bg-amber-600";
      default:
        return "bg-blue-500";
    }
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white overflow-hidden pt-6 pl-6 pr-6">
      <header className="mb-6 ml-6 mr-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Swords className="w-16 h-16 mr-2 text-yellow-400" />
          <div>
            <motion.h1
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
              className=" flex items-center text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600"
            >
              GitHub Arena
            </motion.h1>
            <p className="text-blue-300">Battle for Open Source Glory!</p>
          </div>
        </div>
        {isSignedIn ? (
          <div className="flex items-center space-x-2 p-2 rounded-lg bg-gray-700 bg-opacity-50">
            <UserButton afterSignOutUrl="/" />
            <div className="flex-grow">
              <p className="text-sm font-semibold">{user?.fullName}</p>
              <p className="text-xs text-gray-400">
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>
        ) : (
          // <div className="flex items-center rounded-lg bg-gray-700 bg-opacity-50">
          //   <SignInButton mode="modal">
          //     <Button className="w-full bg-green-600 hover:bg-green-700">
          //       <Github className="mr-2 h-4 w-4" /> See Your Standing
          //     </Button>
          //   </SignInButton>
          // </div>
          <div className="relative p-[2px] overflow-hidden rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 group">
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient-xy"></div>
              <div className="absolute inset-[-10px] bg-transparent border-[10px] border-transparent rounded-lg light-effect"></div>
            </div>
            <div className="relative flex items-center rounded-lg bg-gray-900">
              <SignInButton mode="modal">
                <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 ease-in-out transform relative z-10">
                  <Github className="mr-2 h-5 w-5" /> See Your Standing
                </Button>
              </SignInButton>
            </div>
          </div>
        )}
      </header>
      <main className="flex-1 overflow-auto pl-6 pr-6 pt-6">
        <div
          className={`${isSignedIn ? "lg:grid lg:grid-cols-3 lg:gap-6" : ""}`}
        >
          <div className={isSignedIn ? "lg:col-span-2" : ""}>
            <LeaderboardContent
              loading={loading}
              error={error}
              filteredPlayers={filteredPlayers}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              handleSort={handleSort}
              sortKey={sortKey}
              sortOrder={sortOrder}
            />
          </div>
          {isSignedIn && (
            <ProfileContent
              userGitHubData={userGitHubData}
              userRank={userRank}
              triggerConfetti={triggerConfetti}
            />
          )}
        </div>
      </main>
    </div>
  );
}

function LeaderboardContent({
  loading,
  error,
  filteredPlayers,
  searchTerm,
  setSearchTerm,
  handleSort,
  sortKey,
  sortOrder,
}: {
  loading: boolean;
  error: string | null;
  filteredPlayers: Player[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleSort: (key: SortKey) => void;
  sortKey: SortKey;
  sortOrder: "asc" | "desc";
}) {
  return (
    <>
      <OlympicPodium players={filteredPlayers.slice(0, 3)} />
      <Card className="bg-gray-800 bg-opacity-50 border-gray-700 shadow-xl">
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search combatants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800 bg-opacity-50 border-gray-700 text-white"
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : error ? (
            <div className="text-red-500 text-center">{error}</div>
          ) : (
            <div className="max-h-[45vh] overflow-y-auto pb-10">
              <Table>
                <TableHeader>
                  <TableRow>
                    {[
                      "Rank",
                      "Player",
                      "Level",
                      "Commits",
                      "PRs",
                      "Issues",
                    ].map((header) => (
                      <TableHead
                        key={header}
                        className="text-blue-300 cursor-pointer hover:text-blue-100 transition-colors"
                        onClick={() =>
                          handleSort(header.toLowerCase() as SortKey)
                        }
                      >
                        <div className="flex items-center space-x-1">
                          <span>{header}</span>
                          {sortKey === header.toLowerCase() &&
                            (sortOrder === "asc" ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            ))}
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {filteredPlayers.map((player, index) => (
                      <motion.tr
                        key={player.rank}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-700 hover:bg-opacity-50 transition-colors"
                      >
                        <TableCell className="font-medium">
                          {player.rank <= 3 ? (
                            <span className="text-2xl">
                              {player.rank === 1
                                ? "🥇"
                                : player.rank === 2
                                  ? "🥈"
                                  : "🥉"}
                            </span>
                          ) : (
                            player.rank
                          )}
                        </TableCell>
                        <TableCell className="flex items-center gap-2">
                          <img
                            src={player.avatar}
                            alt={player.name}
                            className="w-10 h-10 rounded-full border-2 border-blue-500"
                          />
                          <span>{player.name}</span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="bg-blue-900 text-blue-200"
                          >
                            Lvl {player.level}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="flex items-center">
                            <GitCommit className="w-4 h-4 mr-1 text-green-400" />
                            {player.commits}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="flex items-center">
                            <GitPullRequest className="w-4 h-4 mr-1 text-purple-400" />
                            {player.pullRequests}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1 text-red-400" />
                            {player.issues}
                          </span>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}

function ProfileContent({
  userGitHubData,
  userRank,
  triggerConfetti,
}: {
  userGitHubData: Player | null;
  userRank: number | string | null;
  triggerConfetti: () => void;
}) {
  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 bg-opacity-50 border-gray-700">
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            <img
              src={userGitHubData?.avatar}
              alt={userGitHubData?.name}
              className="w-16 h-16 rounded-full mr-4 border-2 border-blue-500"
            />
            <div>
              <h3 className="text-xl font-bold">{userGitHubData?.name}</h3>
              <p className="text-blue-300">Rank: {userRank}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Stat
              icon={<GitCommit className="w-5 h-5 text-green-400" />}
              value={userGitHubData?.commits}
              label="Total Commits"
            />
            <Stat
              icon={<GitPullRequest className="w-5 h-5 text-purple-400" />}
              value={userGitHubData?.pullRequests}
              label="Pull Requests"
            />
            <Stat
              icon={<AlertCircle className="w-5 h-5 text-red-400" />}
              value={userGitHubData?.issues}
              label="Issues Closed"
            />
            <Stat
              icon={<Star className="w-5 h-5 text-yellow-400" />}
              value={userGitHubData?.level}
              label="Level"
            />
          </div>
        </CardContent>
      </Card>
      <div>
        <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500">
          Legendary Achievements
        </h2>
        <div className="overflow-y-scroll max-h-96 pb-14">
          <div className="grid grid-cols-1 md:grid-cols-1  gap-4">
            <AchievementCard
              icon={<GitCommit className="w-6 h-6 text-green-400" />}
              title="Code Warrior"
              description="1000+ commits"
              progress={
                userGitHubData
                  ? Math.min(
                      100,
                      Math.floor((userGitHubData.commits / 1000) * 100)
                    )
                  : 0
              }
              onComplete={triggerConfetti}
            />
            <AchievementCard
              icon={<AlertCircle className="w-6 h-6 text-red-400" />}
              title="Bug Slayer"
              description="100+ issues closed"
              progress={
                userGitHubData
                  ? Math.min(
                      100,
                      Math.floor((userGitHubData.issues / 100) * 100)
                    )
                  : 0
              }
              onComplete={triggerConfetti}
            />
            <AchievementCard
              icon={<GitPullRequest className="w-6 h-6 text-purple-400" />}
              title="Merge Master"
              description="50+ pull requests merged"
              progress={
                userGitHubData
                  ? Math.min(
                      100,
                      Math.floor((userGitHubData.pullRequests / 50) * 100)
                    )
                  : 0
              }
              onComplete={triggerConfetti}
            />
            <AchievementCard
              icon={<Star className="w-6 h-6 text-yellow-400" />}
              title="Open Source Legend"
              description="Level 50+"
              progress={
                userGitHubData
                  ? Math.min(100, Math.floor((userGitHubData.level / 50) * 100))
                  : 0
              }
              onComplete={triggerConfetti}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function OlympicPodium({ players }: { players: Player[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      // className="mb-12"
    >
      <div className="flex justify-center items-end space-x-4">
        {[2, 1, 3].map((position) => {
          const player = players[position - 1];
          if (!player) return null;
          return (
            <motion.div
              key={player.rank}
              className="flex flex-col items-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 300,
                delay: position * 0.1,
              }}
            >
              <img
                src={player.avatar}
                alt={player.name}
                className={`w-20 h-20 rounded-full border-4 ${getMedalColor(position)} mb-2`}
              />
              <div className="text-3xl font-bold mb-2">
                {position === 1 ? "🥇" : position === 2 ? "🥈" : "🥉"}
              </div>
              <div
                className={`${getMedalColor(position)} p-4 w-48 rounded-t-lg ${
                  position === 1 ? "h-40" : position === 2 ? "h-32" : "h-24"
                }`}
              >
                <p className="text-center font-bold">{player.name}</p>
                <p className="text-center text-sm">Level {player.level}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

function AchievementCard({
  icon,
  title,
  description,
  progress,
  onComplete,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  progress: number;
  onComplete: () => void;
}) {
  useEffect(() => {
    if (progress === 100) {
      onComplete();
    }
  }, [progress, onComplete]);

  return (
    <Card className="bg-gray-800 bg-opacity-50 border-gray-700 overflow-hidden">
      <CardHeader className="flex flex-row items-center space-x-4 pb-2">
        <div className="bg-blue-900 p-2 rounded-full">{icon}</div>
        <div>
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
          <motion.div
            className="bg-blue-600 h-2.5"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        <p className="text-right text-sm text-gray-400 mt-1">
          {progress}% Complete
        </p>
      </CardContent>
    </Card>
  );
}

function Stat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: number | undefined;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center bg-gray-700 bg-opacity-50 rounded-lg p-4">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-900 mb-2">
        {icon}
      </div>
      <motion.div
        className="text-2xl font-bold"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        {value}
      </motion.div>
      <div className="text-sm text-gray-400">{label}</div>
    </div>
  );
}

function getMedalColor(rank: number) {
  switch (rank) {
    case 1:
      return "bg-yellow-400";
    case 2:
      return "bg-gray-300";
    case 3:
      return "bg-amber-600";
    default:
      return "bg-blue-500";
  }
}

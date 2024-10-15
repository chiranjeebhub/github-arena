"use client";

import { useState, useEffect } from "react";
import { useUser, UserButton, SignInButton } from "@clerk/nextjs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Trophy,
  Github,
  Search,
  Users,
  Code,
  Star,
  GitCommit,
  GitPullRequest,
  AlertCircle,
  Award,
  Loader2,
  Home,
  Settings,
  LogOut,
  HelpCircle,
  BookOpen,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import axios from "axios";

export default function GitHubGamingArena() {
  const { isSignedIn, user } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRank, setUserRank] = useState(null);
  const [userGitHubData, setUserGitHubData] = useState(null);
  const [activeMenuItem, setActiveMenuItem] = useState("Leaderboard");

  useEffect(() => {
    fetchTopUsers();
  }, []);

  useEffect(() => {
    if (isSignedIn && user?.externalAccounts.length > 0) {
      fetchUserGitHubData(user.externalAccounts[0]?.username);
    }
  }, [isSignedIn, user]);

  const fetchTopUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/github/top-users");
      const data = await response.json();
      const detailedUsers = data.items.map((user, index) => ({
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
            (player) => player.name === userGitHubData.login
          ) + 1;
        setUserRank(userRank > 0 ? userRank : "Not in top 100");
      }
    } catch (err) {
      setError("Failed to fetch users. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserGitHubData = async (username) => {
    try {
      const res = await axios.get(
        `/api/github/user-details?username=${username}`
      );
      setUserGitHubData({
        name: res.data.login,
        avatar: res.data.avatar_url,
        level: calculateLevel(res.data.public_repos, res.data.followers),
        commits: res.data.public_repos * 50,
        pullRequests: Math.floor(res.data.public_repos * 0.7),
        issues: Math.floor(res.data.public_repos * 1.2),
      });
      const userRank =
        players.findIndex((player) => player.name === username) + 1;
      setUserRank(userRank > 0 ? userRank : "Not in top 100");
    } catch (err) {
      console.error("Failed to fetch user GitHub data", err);
    }
  };

  const calculateLevel = (repos, followers) => {
    return Math.floor((repos * 2 + followers * 0.5) / 10);
  };

  const filteredPlayers = players.filter((player) =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const getMedalColor = (rank) => {
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

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white overflow-hidden">
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="w-64 bg-gray-800 bg-opacity-70 backdrop-blur-md p-6 flex flex-col"
      >
        <div className="flex items-center justify-center mb-8">
          <Trophy className="w-10 h-10 mr-2 text-yellow-400" />
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-red-500">
            Git Arena
          </h1>
        </div>
        <nav className="space-y-4 flex-grow">
          {isSignedIn ? (
            <>
              {/* <NavItem
                icon={<Home className="w-5 h-5" />}
                text="Dashboard"
                active={activeMenuItem === "Dashboard"}
                onClick={() => setActiveMenuItem("Dashboard")}
              /> */}
              <NavItem
                icon={<Users className="w-5 h-5" />}
                text="Leaderboard"
                active={activeMenuItem === "Leaderboard"}
                onClick={() => setActiveMenuItem("Leaderboard")}
              />
              <NavItem
                icon={<Award className="w-5 h-5" />}
                text="Achievements"
                active={activeMenuItem === "Achievements"}
                onClick={() => setActiveMenuItem("Achievements")}
              />
              <NavItem
                icon={<Code className="w-5 h-5" />}
                text="Challenges"
                active={activeMenuItem === "Challenges"}
                onClick={() => setActiveMenuItem("Challenges")}
              />
              <NavItem
                icon={<Star className="w-5 h-5" />}
                text="Rewards"
                active={activeMenuItem === "Rewards"}
                onClick={() => setActiveMenuItem("Rewards")}
              />
              <NavItem
                icon={<Zap className="w-5 h-5" />}
                text="Battle Arena"
                active={activeMenuItem === "Battle Arena"}
                onClick={() => setActiveMenuItem("Battle Arena")}
              />
            </>
          ) : (
            <>
              <NavItem
                icon={<Home className="w-5 h-5" />}
                text="Home"
                active={activeMenuItem === "Home"}
                onClick={() => setActiveMenuItem("Home")}
              />
              <NavItem
                icon={<Users className="w-5 h-5" />}
                text="Leaderboard"
                active={activeMenuItem === "Leaderboard"}
                onClick={() => setActiveMenuItem("Leaderboard")}
              />
              <NavItem
                icon={<BookOpen className="w-5 h-5" />}
                text="How It Works"
                active={activeMenuItem === "How It Works"}
                onClick={() => setActiveMenuItem("How It Works")}
              />
              <NavItem
                icon={<HelpCircle className="w-5 h-5" />}
                text="FAQ"
                active={activeMenuItem === "FAQ"}
                onClick={() => setActiveMenuItem("FAQ")}
              />
            </>
          )}
        </nav>
        <div className="mt-auto space-y-4">
          {isSignedIn ? (
            <>
              <NavItem
                icon={<Settings className="w-5 h-5" />}
                text="Settings"
                active={activeMenuItem === "Settings"}
                onClick={() => setActiveMenuItem("Settings")}
              />
              <div className="flex items-center space-x-2 p-2 rounded-lg bg-gray-700 bg-opacity-50">
                <UserButton afterSignOutUrl="/" />
                <div className="flex-grow">
                  <p className="text-sm font-semibold">{user?.fullName}</p>
                  <p className="text-xs text-gray-400">
                    {user?.primaryEmailAddress?.emailAddress}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full bg-red-600 hover:bg-red-700 border-red-500"
                onClick={() => {
                  /* Add sign out logic */
                }}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </>
          ) : (
            <SignInButton mode="modal">
              <Button className="w-full bg-green-600 hover:bg-green-700">
                <Github className="mr-2 h-4 w-4" /> Connect GitHub
              </Button>
            </SignInButton>
          )}
        </div>
      </motion.aside>

      <main className="flex-1 overflow-auto pl-6 pr-6 pt-6">
        <div
          className={`${isSignedIn ? "lg:grid lg:grid-cols-3 lg:gap-6" : ""}`}
        >
          <div className={isSignedIn ? "lg:col-span-2" : ""}>
            <header className="mb-6">
              <motion.h2
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600"
              >
                Leaderboard of Legends
              </motion.h2>
              <p className="text-blue-300">Battle for Open Source Glory!</p>
            </header>

            {/* Olympic-style Podium */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-12"
            >
              {/* <h3 className="text-2xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Champions Podium
          </h3> */}
              <div className="flex justify-center items-end space-x-4">
                {[2, 1, 3].map((position) => {
                  const player = filteredPlayers[position - 1];
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
                        className={`${getMedalColor(position)} p-4 rounded-t-lg ${
                          position === 1
                            ? "h-40"
                            : position === 2
                              ? "h-32"
                              : "h-24"
                        }`}
                      >
                        <p className="text-center font-bold">{player.name}</p>
                        <p className="text-center text-sm">
                          Level {player.level}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
            <div className="mb-6 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search combatants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800 bg-opacity-50 border-gray-700 text-white"
              />
            </div>

            <Card className="bg-gray-800 bg-opacity-50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-2xl">Top Combatants</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center items-center h-40">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                  </div>
                ) : error ? (
                  <div className="text-red-500 text-center">{error}</div>
                ) : (
                  <div className="max-h-[400px] overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-blue-300">Rank</TableHead>
                          <TableHead className="text-blue-300">
                            Player
                          </TableHead>
                          <TableHead className="text-blue-300">Level</TableHead>
                          <TableHead className="text-blue-300">
                            Commits
                          </TableHead>
                          <TableHead className="text-blue-300">PRs</TableHead>
                          <TableHead className="text-blue-300">
                            Issues
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredPlayers.map((player, index) => (
                          <motion.tr
                            key={player.rank}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
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
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {isSignedIn && (
            <div className="mt-6 lg:mt-0">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
                    Your Battle Stats
                  </h2>
                  <Card className="bg-gray-800 bg-opacity-50 border-gray-700">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <img
                          src={userGitHubData?.avatar}
                          alt={userGitHubData?.name}
                          className="w-16 h-16 rounded-full mr-4 border-2 border-blue-500"
                        />
                        <div>
                          <h3 className="text-xl font-bold">
                            {userGitHubData?.name}
                          </h3>
                          <p className="text-blue-300">Rank: {userRank}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Stat
                          icon={
                            <GitCommit className="w-5 h-5 text-green-400" />
                          }
                          value={userGitHubData?.commits}
                          label="Total Commits"
                        />
                        <Stat
                          icon={
                            <GitPullRequest className="w-5 h-5 text-purple-400" />
                          }
                          value={userGitHubData?.pullRequests}
                          label="Pull Requests"
                        />
                        <Stat
                          icon={
                            <AlertCircle className="w-5 h-5 text-red-400" />
                          }
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
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500">
                    Legendary Achievements
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
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
                      icon={
                        <GitPullRequest className="w-6 h-6 text-purple-400" />
                      }
                      title="Merge Master"
                      description="50+ pull requests merged"
                      progress={
                        userGitHubData
                          ? Math.min(
                              100,
                              Math.floor(
                                (userGitHubData.pullRequests / 50) * 100
                              )
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
                          ? Math.min(
                              100,
                              Math.floor((userGitHubData.level / 50) * 100)
                            )
                          : 0
                      }
                      onComplete={triggerConfetti}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, text, active = false, onClick }) {
  return (
    <motion.a
      href="#"
      className={`flex items-center space-x-2 p-2 rounded-lg transition-colors ${
        active
          ? "bg-blue-600 text-white"
          : "text-gray-400 hover:bg-blue-700 hover:text-white"
      }`}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {icon}
      <span>{text}</span>
    </motion.a>
  );
}

function AchievementCard({ icon, title, description, progress, onComplete }) {
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

function Stat({ icon, value, label }) {
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

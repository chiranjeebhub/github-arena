"use client";

import { useState, useEffect, useCallback } from "react";
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
  Sword,
  Shield,
  Zap,
  Star,
  Trophy,
  Github,
  Search,
  Users,
  Code,
  GitPullRequest,
  GitCommit,
  AlertCircle,
  Award,
  Loader2,
} from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { HeatMapGrid } from "react-grid-heatmap";
import axios from "axios";

// const fetchUserDetails = (username) => {
//   return fetch(`/api/github/user-details?username=${username}`);
// });

export default function GitHubLeaderboard() {
  const { isSignedIn, user } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRank, setUserRank] = useState(null);
  const [userGitHubData, setUserGitHubData] = useState(null);
  const [commitData, setCommitData] = useState([]);

  useEffect(() => {
    fetchTopUsers();
  }, []);

  useEffect(() => {
    if (isSignedIn && user?.externalAccounts.length > 0) {
      fetchUserGitHubData(user.externalAccounts[0]?.username);
      fetchUserCommitData(user.externalAccounts[0]?.username);
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
      axios.get(`/api/github/user-details?username=${username}`).then((res) => {
        console.log(res.data, "lkwheflwkheflkwhlef");
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
      });
    } catch (err) {
      console.error("Failed to fetch user GitHub data", err);
    }
  };

  const fetchUserCommitData = async (username) => {
    try {
      const response = await fetch(
        `/api/github/commit-data?username=${username}`
      );
      const data = await response.json();
      setCommitData(data);
    } catch (err) {
      console.error("Failed to fetch user commit data", err);
    }
  };

  const calculateLevel = (repos, followers) => {
    return Math.floor((repos * 2 + followers * 0.5) / 10);
  };

  const filteredPlayers = players.filter((player) =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const prepareHeatmapData = () => {
    const today = new Date();
    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    const allDates = [];
    for (let d = new Date(oneYearAgo); d <= today; d.setDate(d.getDate() + 1)) {
      allDates.push(new Date(d));
    }

    const commitMap = new Map(
      commitData.map((item) => [item.date, item.count])
    );

    const heatmapData = allDates.map((date) => {
      const dateString = date.toISOString().split("T")[0];
      return commitMap.get(dateString) || 0;
    });

    const weeks = [];
    for (let i = 0; i < heatmapData.length; i += 7) {
      weeks.push(heatmapData.slice(i, i + 7));
    }

    return weeks;
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <aside className="w-64 bg-gray-800 p-6 flex flex-col">
        <div className="flex items-center justify-center mb-8">
          <Trophy className="w-8 h-8 mr-2 text-yellow-400" />
          <h1 className="text-2xl font-bold">Git Arena</h1>
        </div>
        <nav className="space-y-4">
          <NavItem
            icon={<Users className="w-5 h-5" />}
            text="Leaderboard"
            active
          />
          <NavItem icon={<Award className="w-5 h-5" />} text="Achievements" />
          <NavItem icon={<Code className="w-5 h-5" />} text="Challenges" />
          <NavItem icon={<Star className="w-5 h-5" />} text="Rewards" />
        </nav>
        <div className="mt-auto">
          {isSignedIn ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <SignInButton mode="modal">
              <Button className="w-full bg-green-600 hover:bg-green-700">
                <Github className="mr-2 h-4 w-4" /> Connect GitHub
              </Button>
            </SignInButton>
          )}
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <header className="bg-gray-800 p-6">
          <h2 className="text-3xl font-bold mb-2">Leaderboard of Legends</h2>
          <p className="text-gray-400">Battle for Open Source Glory!</p>
        </header>

        <div className="p-6">
          {isSignedIn && userGitHubData && (
            <Card className="bg-gray-800 border-gray-700 mb-6">
              <CardHeader>
                <CardTitle className="text-2xl">Your Battle Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-4">
                  <img
                    src={userGitHubData.avatar}
                    alt={userGitHubData.name}
                    className="w-16 h-16 rounded-full mr-4"
                  />
                  <div>
                    <h3 className="text-xl font-bold">{userGitHubData.name}</h3>
                    <p className="text-gray-400">Rank: {userRank}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <Stat
                    icon={<GitCommit className="w-5 h-5 text-green-400" />}
                    value={userGitHubData.commits}
                    label="Total Commits"
                  />
                  <Stat
                    icon={
                      <GitPullRequest className="w-5 h-5 text-purple-400" />
                    }
                    value={userGitHubData.pullRequests}
                    label="Pull Requests"
                  />
                  <Stat
                    icon={<AlertCircle className="w-5 h-5 text-red-400" />}
                    value={userGitHubData.issues}
                    label="Issues Closed"
                  />
                  <Stat
                    icon={<Star className="w-5 h-5 text-yellow-400" />}
                    value={userGitHubData.level}
                    label="Level"
                  />
                </div>
                <div className="mt-6">
                  <h4 className="text-lg font-semibold mb-2">
                    Your Commit Activity
                  </h4>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="mb-6 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search combatants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-700 border-gray-600 text-white"
            />
          </div>

          <Card className="bg-gray-800 border-gray-700">
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
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-gray-400">Rank</TableHead>
                      <TableHead className="text-gray-400">Player</TableHead>
                      <TableHead className="text-gray-400">Level</TableHead>
                      <TableHead className="text-gray-400">Commits</TableHead>
                      <TableHead className="text-gray-400">PRs</TableHead>
                      <TableHead className="text-gray-400">Issues</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPlayers.map((player) => (
                      <TableRow
                        key={player.rank}
                        className="hover:bg-gray-700 transition-colors"
                      >
                        <TableCell className="font-medium">
                          {player.rank}
                        </TableCell>
                        <TableCell className="flex items-center gap-2">
                          <img
                            src={player.avatar}
                            alt={player.name}
                            className="w-10 h-10 rounded-full"
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
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <h2 className="text-2xl font-bold mt-8 mb-4">
            Legendary Achievements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <AchievementCard
              icon={<Sword className="w-6 h-6 text-red-400" />}
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
            />
            <AchievementCard
              icon={<Shield className="w-6 h-6 text-blue-400" />}
              title="Bug Defender"
              description="100+ issues closed"
              progress={
                userGitHubData
                  ? Math.min(
                      100,
                      Math.floor((userGitHubData.issues / 100) * 100)
                    )
                  : 0
              }
            />
            <AchievementCard
              icon={<Zap className="w-6 h-6 text-yellow-400" />}
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
            />
            <AchievementCard
              icon={<Star className="w-6 h-6 text-purple-400" />}
              title="Open Source Hero"
              description="Level 50+"
              progress={
                userGitHubData
                  ? Math.min(100, Math.floor((userGitHubData.level / 50) * 100))
                  : 0
              }
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, text, active = false }) {
  return (
    <a
      href="#"
      className={`flex items-center space-x-2 p-2 rounded-lg transition-colors ${
        active
          ? "bg-gray-700 text-white"
          : "text-gray-400 hover:bg-gray-700 hover:text-white"
      }`}
    >
      {icon}
      <span>{text}</span>
    </a>
  );
}

function AchievementCard({ icon, title, description, progress }) {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="flex flex-row items-center space-x-4 pb-2">
        <div className="bg-gray-700 p-2 rounded-full">{icon}</div>
        <div>
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
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
    <div className="flex flex-col items-center">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-700 mb-2">
        {icon}
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm text-gray-400">{label}</div>
    </div>
  );
}

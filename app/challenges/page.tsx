import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Code, GitBranch, GitPullRequest, Clock } from "lucide-react";

export default function ChallengesPage() {
  const challenges = [
    {
      icon: <Code className="w-6 h-6 text-green-400" />,
      title: "30-Day Commit Challenge",
      description: "Commit code every day for 30 days",
      difficulty: "Medium",
      timeLeft: "20 days",
    },
    {
      icon: <GitBranch className="w-6 h-6 text-blue-400" />,
      title: "Branch Master",
      description: "Create and merge 10 feature branches",
      difficulty: "Easy",
      timeLeft: "15 days",
    },
    {
      icon: <GitPullRequest className="w-6 h-6 text-purple-400" />,
      title: "Pull Request Frenzy",
      description: "Submit 50 pull requests in a month",
      difficulty: "Hard",
      timeLeft: "25 days",
    },
  ];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
        Active Challenges
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {challenges.map((challenge, index) => (
          <Card
            key={index}
            className="bg-gray-800 bg-opacity-50 border-gray-700"
          >
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className="bg-gray-700 p-2 rounded-full">
                  {challenge.icon}
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold">
                    {challenge.title}
                  </CardTitle>
                  <p className="text-sm text-gray-400">
                    {challenge.description}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mt-4">
                <Badge
                  variant="outline"
                  className={`${challenge.difficulty === "Easy" ? "bg-green-900 text-green-200" : challenge.difficulty === "Medium" ? "bg-yellow-900 text-yellow-200" : "bg-red-900 text-red-200"}`}
                >
                  {challenge.difficulty}
                </Badge>
                <div className="flex items-center text-sm text-gray-400">
                  <Clock className="w-4 h-4 mr-1" />
                  {challenge.timeLeft} left
                </div>
              </div>
              <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                Join Challenge
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, Zap, Award } from "lucide-react";

export default function AchievementsPage() {
  const achievements = [
    {
      icon: <Trophy className="w-8 h-8 text-yellow-400" />,
      title: "Code Warrior",
      description: "Commit 1000 times",
      progress: 75,
    },
    {
      icon: <Star className="w-8 h-8 text-purple-400" />,
      title: "Pull Request Pro",
      description: "Merge 100 pull requests",
      progress: 50,
    },
    {
      icon: <Zap className="w-8 h-8 text-blue-400" />,
      title: "Issue Resolver",
      description: "Close 500 issues",
      progress: 30,
    },
    {
      icon: <Award className="w-8 h-8 text-green-400" />,
      title: "Open Source Legend",
      description: "Contribute to 50 repositories",
      progress: 60,
    },
  ];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
        Your Achievements
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((achievement, index) => (
          <Card
            key={index}
            className="bg-gray-800 bg-opacity-50 border-gray-700"
          >
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <div className="bg-gray-700 p-2 rounded-full">
                {achievement.icon}
              </div>
              <div>
                <CardTitle className="text-lg font-semibold">
                  {achievement.title}
                </CardTitle>
                <p className="text-sm text-gray-400">
                  {achievement.description}
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={achievement.progress} className="w-full mt-2" />
              <p className="text-right text-sm text-gray-400 mt-1">
                {achievement.progress}% Complete
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

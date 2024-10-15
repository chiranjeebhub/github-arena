import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GitCommit, GitPullRequest, Award, Zap } from "lucide-react";

export default function HowItWorksPage() {
  const steps = [
    {
      icon: <GitCommit className="w-12 h-12 text-green-400" />,
      title: "Commit Code",
      description:
        "Make commits to your repositories to earn points and level up your character.",
    },
    {
      icon: <GitPullRequest className="w-12 h-12 text-purple-400" />,
      title: "Create Pull Requests",
      description:
        "Submit and merge pull requests to gain experience and unlock achievements.",
    },
    {
      icon: <Award className="w-12 h-12 text-yellow-400" />,
      title: "Complete Challenges",
      description:
        "Participate in time-limited challenges to earn bonus rewards and climb the leaderboard.",
    },
    {
      icon: <Zap className="w-12  h-12 text-blue-400" />,
      title: "Battle Other Devs",
      description:
        "Use your earned stats to battle other developers in the Battle Arena.",
    },
  ];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
        How Git Arena Works
      </h1>
      <p className="text-xl text-center mb-12 text-gray-300">
        Turn your coding habits into an epic gaming experience!
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {steps.map((step, index) => (
          <Card
            key={index}
            className="bg-gray-800 bg-opacity-50 border-gray-700"
          >
            <CardHeader>
              <div className="flex justify-center mb-4">{step.icon}</div>
              <CardTitle className="text-2xl font-bold text-center">
                {step.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-300">{step.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-12 text-center">
        <h2 className="text-2xl font-bold mb-4">
          Ready to start your coding adventure?
        </h2>
        <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Sign Up Now
        </button>
      </div>
    </div>
  );
}

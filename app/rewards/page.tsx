import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gift, Coffee, Shirt, Laptop } from "lucide-react";

export default function RewardsPage() {
  const rewards = [
    {
      icon: <Coffee className="w-8 h-8 text-amber-400" />,
      title: "Coffee Mug",
      description: "Git-themed coffee mug",
      cost: 500,
      available: true,
    },
    {
      icon: <Shirt className="w-8 h-8 text-blue-400" />,
      title: "T-Shirt",
      description: "Exclusive Git Arena t-shirt",
      cost: 1000,
      available: true,
    },
    {
      icon: <Gift className="w-8 h-8 text-purple-400" />,
      title: "Sticker Pack",
      description: "Set of 10 developer stickers",
      cost: 300,
      available: true,
    },
    {
      icon: <Laptop className="w-8 h-8 text-gray-400" />,
      title: "Laptop Sleeve",
      description: "15-inch laptop sleeve",
      cost: 1500,
      available: false,
    },
  ];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500">
        Rewards Shop
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {rewards.map((reward, index) => (
          <Card
            key={index}
            className="bg-gray-800 bg-opacity-50 border-gray-700"
          >
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="bg-gray-700 p-4 rounded-full">
                  {reward.icon}
                </div>
              </div>
              <CardTitle className="text-lg font-semibold text-center">
                {reward.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400 text-center mb-4">
                {reward.description}
              </p>
              <div className="flex justify-between items-center mb-4">
                <Badge
                  variant="outline"
                  className="bg-yellow-900 text-yellow-200"
                >
                  {reward.cost} points
                </Badge>
                <Badge
                  variant="outline"
                  className={
                    reward.available
                      ? "bg-green-900 text-green-200"
                      : "bg-red-900 text-red-200"
                  }
                >
                  {reward.available ? "Available" : "Out of Stock"}
                </Badge>
              </div>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={!reward.available}
              >
                Redeem
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

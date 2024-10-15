"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function FAQPage() {
  const faqs = [
    {
      question: "What is Git Arena?",
      answer:
        "Git Arena is a gamified platform that turns your GitHub activity into an exciting gaming experience. It rewards you for your coding contributions and allows you to compete with other developers.",
    },
    {
      question: "How do I earn points?",
      answer:
        "You earn points by making commits, creating pull requests, and completing challenges. The more active you are on GitHub, the more points you'll earn!",
    },
    {
      question: "What are the rewards?",
      answer:
        "Rewards include exclusive digital items, real-world swag, and recognition in the developer community. You can redeem your points for various rewards in our Rewards Shop.",
    },
    {
      question: "How does the Battle Arena work?",
      answer:
        "The Battle Arena allows you to engage in friendly competition with other developers. Your battle stats are based on your GitHub activity and achievements. You can challenge others to coding duels and climb the leaderboard.",
    },
    {
      question: "Is my GitHub data safe?",
      answer:
        "Yes, we take data privacy very seriously. We only access public GitHub data that you explicitly allow us to use. Your private repositories and sensitive information are never accessed or stored.",
    },
    {
      question: "Can I participate if I'm new to coding?",
      answer:
        "Git Arena is designed for developers of all skill levels. We have challenges and rewards tailored for beginners, intermediate, and advanced coders.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index: any) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
        Frequently Asked Questions
      </h1>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <Card
            key={index}
            className="bg-gray-800 bg-opacity-50 border-gray-700"
          >
            <CardHeader
              className="cursor-pointer"
              onClick={() => toggleFAQ(index)}
            >
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl font-semibold">
                  {faq.question}
                </CardTitle>
                {openIndex === index ? (
                  <ChevronUp className="w-6 h-6 text-gray-400" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-gray-400" />
                )}
              </div>
            </CardHeader>
            {openIndex === index && (
              <CardContent>
                <p className="text-gray-300">{faq.answer}</p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

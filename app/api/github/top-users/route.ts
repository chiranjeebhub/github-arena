import axios from "axios";
import { NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(30, "1 m"),
});

type GitHubUser = {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  public_repos: number;
  followers: number;
};

export async function GET(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

  try {
    // Using Axios to fetch top users
    const { data } = await axios.get("https://api.github.com/search/users", {
      params: {
        q: "followers:>1000",
        sort: "followers",
        order: "desc",
        per_page: 100,
      },
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
      },
    });

    // Fetch additional details for the first user only
    const topUser = data.items[0];
    const detailsResponse = await fetch(
      `https://api.github.com/users/${topUser.login}`,
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
        },
      }
    );

    if (!detailsResponse.ok) {
      throw new Error("Failed to fetch user details");
    }

    const details = await detailsResponse.json();

    const detailedUser: GitHubUser = {
      ...topUser,
      public_repos: details.public_repos,
      followers: details.followers,
    };

    return NextResponse.json(detailedUser);
  } catch (error) {
    console.error("Error fetching user details:", error);
    return NextResponse.json(
      { error: "Failed to fetch user details" },
      { status: 500 }
    );
  }
}

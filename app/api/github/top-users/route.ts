// import { NextResponse } from "next/server";

// export async function GET() {
//   const response = await fetch(
//     "https://api.github.com/search/users?q=followers:%3E1000&sort=followers&order=desc&per_page=100",
//     {
//       headers: {
//         Authorization: `token ${process.env.GITHUB_TOKEN}`,
//       },
//     }
//   );
//   const data = await response.json();
//   console.log(data, "lkwheflwkheflkwhlef");
//   return NextResponse.json(data);
// }

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

export async function GET(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

  try {
    const response = await fetch(
      "https://api.github.com/search/users?q=followers:%3E1000&sort=followers&order=desc&per_page=100",
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch top users");
    }

    const data = await response.json();

    // Fetch additional details for each user
    const detailedUsers = await Promise.all(
      data.items.map(async (user) => {
        const detailsResponse = await fetch(
          `https://api.github.com/users/${user.login}`,
          {
            headers: {
              Authorization: `token ${GITHUB_TOKEN}`,
            },
          }
        );
        const details = await detailsResponse.json();
        return {
          ...user,
          public_repos: details.public_repos,
          followers: details.followers,
        };
      })
    );

    return NextResponse.json({ items: detailedUsers });
  } catch (error) {
    console.error("Error fetching top users:", error);
    return NextResponse.json(
      { error: "Failed to fetch top users" },
      { status: 500 }
    );
  }
}

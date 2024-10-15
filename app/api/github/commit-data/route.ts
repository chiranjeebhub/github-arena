// import { NextResponse } from "next/server";

// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url);
//   const username = searchParams.get("username");

//   if (!username) {
//     return NextResponse.json(
//       { error: "Username is required" },
//       { status: 400 }
//     );
//   }

//   const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

//   try {
//     const oneYearAgo = new Date();
//     oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
//     const since = oneYearAgo.toISOString();

//     const response = await fetch(
//       `https://api.github.com/users/${username}/events?per_page=100&since=${since}`,
//       {
//         headers: {
//           Authorization: `token ${GITHUB_TOKEN}`,
//         },
//       }
//     );

//     if (!response.ok) {
//       throw new Error("Failed to fetch commit data");
//     }

//     const events = await response.json();
//     const commitData = events
//       .filter((event: any) => event.type === "PushEvent")
//       .reduce((acc: any, event: any) => {
//         const date = event.created_at.split("T")[0];
//         acc[date] = (acc[date] || 0) + event.payload.size;
//         return acc;
//       }, {});

//     const formattedData = Object.entries(commitData).map(([date, count]) => ({
//       date,
//       count,
//     }));

//     return NextResponse.json(formattedData);
//   } catch (error) {
//     console.error("Error fetching commit data:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch commit data" },
//       { status: 500 }
//     );
//   }
// }

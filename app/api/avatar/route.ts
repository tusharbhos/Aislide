import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const resp = await fetch("https://api.heygen.com/v1/streaming.create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.HEYGEN_API_KEY || "" // keep API key secret
      },
      body: JSON.stringify({
        avatar_id: "your_avatar_id",
        voice: "en_us_001",
        input_text: message
      })
    });

    const data = await resp.json();
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

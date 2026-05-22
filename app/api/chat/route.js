import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const body = await req.json();
    const message = body.message;

    if (!message) {
      return Response.json(
        { reply: "No message provided" },
        { status: 400 }
      );
    }

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant inside a website chat widget.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const reply = response.choices[0].message.content;

    return Response.json({ reply });

  } catch (error) {
    console.error("Chat API Error:", error);

    return Response.json(
      { reply: "Server error occurred" },
      { status: 500 }
    );
  }
}
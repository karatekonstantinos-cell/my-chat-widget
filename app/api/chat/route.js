import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { searchParams } = new URL(req.url);
    const siteId = searchParams.get("siteId");

    const body = await req.json();
    const message = body.message;

    let systemPrompt = "You are a helpful assistant.";

    if (siteId === "demo") {
      systemPrompt = "You are a friendly website chatbot.";
    }

    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
    });

    const reply = response.choices?.[0]?.message?.content;

    return Response.json({
      reply: reply || "No response generated",
    });

  } catch (error) {
    console.error(error);

    return Response.json(
      { reply: "Server error" },
      { status: 500 }
    );
  }
}
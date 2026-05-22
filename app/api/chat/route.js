import OpenAI from "openai";

export async function POST(req) {
  try {
    const { message } = await req.json();

    console.log("MESSAGE:", message);
    console.log("KEY EXISTS:", !!process.env.OPENAI_API_KEY);

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: message },
      ],
    });

    return Response.json({
      reply: response.choices[0].message.content,
    });

  } catch (err) {
    console.error("FULL ERROR:", err); // IMPORTANT
    return Response.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
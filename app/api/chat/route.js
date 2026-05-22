import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error("Missing OPENAI_API_KEY");
}

const client = new OpenAI({
  apiKey,
});

export async function POST(req) {
  try {
    const { message, siteId } = await req.json();

    if (!message || !siteId) {
      return Response.json(
        { reply: "Missing message or siteId" },
        { status: 400 }
      );
    }

    // 1. Get site
    const { data: site, error: siteError } = await supabase
      .from("sites")
      .select("*")
      .eq("id", siteId)
      .single();

    if (siteError || !site) {
      return Response.json(
        { reply: "Invalid siteId" },
        { status: 400 }
      );
    }

    // 2. Update usage safely
    await supabase
      .from("sites")
      .update({
        messages_used: (site.messages_used || 0) + 1,
      })
      .eq("id", siteId);

    // 3. Call OpenAI
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant embedded in a SaaS chat widget.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const reply =
      completion?.choices?.[0]?.message?.content ||
      "No response from model";

    // 4. Store message (non-blocking safety)
    await supabase.from("messages").insert({
      site_id: siteId,
      message,
      response: reply,
    });

    // 5. Return response
    return Response.json({ reply });
  } catch (err) {
    console.error("API ERROR:", err);

    return Response.json(
      { reply: "Server error" },
      { status: 500 }
    );
  }
}
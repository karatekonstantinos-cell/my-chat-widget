import { supabase } from "@/lib/supabase";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { message, siteId } = await req.json();

    // 1. Get site
    const { data: site } = await supabase
      .from("sites")
      .select("*")
      .eq("id", siteId)
      .single();

    if (!site) {
      return Response.json({ reply: "Invalid siteId" }, { status: 400 });
    }

    // 2. Update usage count
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
          content: "You are a helpful assistant embedded in a SaaS chat widget.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const reply = completion.choices[0].message.content;

    // 4. Store message
    await supabase.from("messages").insert({
      site_id: siteId,
      message,
      response: reply,
    });

    // 5. Return response
    return Response.json({ reply });
  } catch (err) {
    console.error(err);
    return Response.json(
      { reply: "Server error" },
      { status: 500 }
    );
  }
}
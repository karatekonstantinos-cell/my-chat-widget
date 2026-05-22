import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("sites")
    .select("*");

  if (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return Response.json(data || []);
}

export async function POST(req) {
  try {
    const { name } = await req.json();

    if (!name) {
      return Response.json(
        { error: "Missing name" },
        { status: 400 }
      );
    }

    const id = crypto.randomUUID();

    const { error } = await supabase
      .from("sites")
      .insert({
        id,
        name,
        messages_used: 0,
      });

    if (error) {
      return Response.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      id,
    });
  } catch (err) {
    console.error(err);

    return Response.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
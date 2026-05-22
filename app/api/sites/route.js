import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("sites")
    .select("*");

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data);
}

export async function POST(req) {
  const { name } = await req.json();

  const { data, error } = await supabase
    .from("sites")
    .insert({
      name,
      messages_used: 0
    })
    .select()
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data);
}
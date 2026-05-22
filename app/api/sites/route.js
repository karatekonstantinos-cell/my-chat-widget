import { supabase } from "@/lib/supabase";

export async function GET() {
  return Response.json({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL ? "OK" : "MISSING",
    key: process.env.SUPABASE_SERVICE_ROLE_KEY ? "OK" : "MISSING"
  });
}
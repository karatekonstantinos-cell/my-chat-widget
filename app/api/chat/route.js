export async function POST(req) {
  return new Response(
    JSON.stringify({ reply: "API IS WORKING" }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}
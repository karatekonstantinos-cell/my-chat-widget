export async function POST(req) {
  const body = await req.json();

  console.log("BODY:", body);

  return Response.json({
    reply: "TEST RESPONSE WORKS",
  });
}
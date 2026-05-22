export async function GET() {
  return Response.json({ status: "sites route works" });
}

export async function POST() {
  return Response.json({ status: "post works" });
}
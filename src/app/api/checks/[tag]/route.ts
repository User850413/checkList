import dbConnect from '@/app/lib/db/dbConnect';
import Check from '@/app/lib/db/models/checks';

export async function GET({ params }: { params: { tag: string } }) {
  await dbConnect();
  const { tag } = params;

  const check = await Check.find({ tag }).lean();

  return new Response(JSON.stringify(check), { status: 200 });
}

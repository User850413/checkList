import dbConnect from '@/app/lib/db/dbConnect';
import mongoose from 'mongoose';
import Check from '@/app/lib/db/models/checks';

export async function GET() {
  // NOTE: 쿼리값 가져오기
  //   const searchParams = req.nextUrl.searchParams
  //   const query = searchParams.get('test')  -> query는 test(key)의 value값 string

  await dbConnect();
  console.log(Check);

  return new Response(`안녕 API!`, { status: 200 });
}

export async function PATCH() {
  return new Response('수정~', { status: 200 });
}

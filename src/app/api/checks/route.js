export async function GET(req) {
  // NOTE: 쿼리값 가져오기
  const searchParams = req.nextUrl.searchParams
  const query = searchParams.get('test')

  return new Response(`response: ${query}`, { status: 200 })
}

export async function PATCH() {
  return new Response('수정~', { status: 200 })
}

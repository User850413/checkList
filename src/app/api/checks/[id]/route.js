export async function GET(req, { params }) {
  // NOTE: 파라미터 가져오기
  const { id } = params
  return new Response(`id: ${id}`, { status: 200 })
}

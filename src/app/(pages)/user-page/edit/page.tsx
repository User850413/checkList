/**
 *  수정사항
 * 1. 프로필이미지
 * 2. 닉네임
 * 3. 한 마디
 * 4. 관심사
 */

import Header from '@/components/layout/header';

export default function Edit() {
  return (
    <>
      <Header />
      <header className="w-full flex items-center">
        <span>프로필 이미지 수정</span>
        <div className="flex">
          <span>닉네임 수정</span>
          <span>한 마디 수정</span>
        </div>
      </header>
      <main className="w-full">
        <span>관심사 수정</span>
      </main>
    </>
  );
}

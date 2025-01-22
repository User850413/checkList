'use client';

import StyledButton from '@/components/common/styledButton';
import MainSection from '@/components/layout/mainSection';
import { useRouter } from 'next/navigation';

export default function Landing() {
  const router = useRouter();

  const onClickSignup = () => {
    router.push('/signup');
  };
  const onClickLogin = () => {
    router.push('/login');
  };

  const studyImage = `/pics/study.jpg`;
  const goalImage = `/pics/goal.jpg`;
  const togetherImage = `/pics/together.jpg`;
  const memoImage = `/pics/memo.jpg`;

  return (
    <>
      <header className="-mt-16 flex h-screen items-center justify-center">
        <div className="flex cursor-default flex-col items-center">
          <h1 className="text-2xl font-bold">check:List</h1>
          <h2>내가 만든 리스트를 공유해 보세요</h2>
        </div>
      </header>
      <main className="w-full">
        <ul className="flex w-full flex-col items-center gap-5">
          <li className="w-full">
            <MainSection
              imageUrl={memoImage}
              imageAlt=""
              lettering={
                <p>
                  리스트를 추가하고, <br /> 세부 항목을 추가할 수 있어요
                </p>
              }
            />
          </li>
          <li className="w-full">
            <MainSection
              imageUrl={goalImage}
              imageAlt=""
              textArray="left"
              lettering={
                <p>
                  완료한 목록을 체크하고 <br /> 달성도를 올려봐요
                </p>
              }
            />
          </li>
          <li className="w-full">
            <MainSection
              imageUrl={togetherImage}
              lettering={<p>만든 리스트를 공유해봐요</p>}
              imageAlt=""
            />
          </li>
          <li className="w-full">
            <MainSection
              imageUrl={studyImage}
              imageAlt=""
              textArray="left"
              lettering={
                <p>
                  공유된 리스트를 가져와서 <br /> 내 리스트로 만들어요
                </p>
              }
            />
          </li>
        </ul>
        <div className="flex h-[600px] items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <StyledButton onClick={onClickSignup} color="dark" size={'2xl'}>
              시작하러 가기
            </StyledButton>
            <div className="flex cursor-default items-center gap-2 text-xs">
              <p>이미 계정이 있으신가요?</p>
              <button
                onClick={onClickLogin}
                className="font-bold hover:underline"
              >
                로그인하러 가기
              </button>
            </div>
          </div>
        </div>
      </main>
      <footer></footer>
    </>
  );
}

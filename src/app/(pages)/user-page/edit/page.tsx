'use client';

import { getMyData } from '@/app/services/api/user';
import StyledButton from '@/components/common/styledButton';
/**
 *  수정사항
 * 1. 프로필이미지
 * 2. 닉네임
 * 3. 한 마디
 * 4. 관심사
 */

import Header from '@/components/layout/header';
import Profile from '@/components/layout/profile';
import { User } from '@/types/user';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Edit() {
  const [myData, setMyData] = useState<User | undefined>();
  const route = useRouter();

  // NOTE : 내 데이터
  const {
    data,
    isLoading: dataLoading,
    isError: dataError,
  } = useQuery({ queryKey: ['user'], queryFn: () => getMyData() });
  useEffect(() => {
    if (data) setMyData(data.user);
  }, [data]);

  const onClickProfileImage = () => {
    console.log('profileImage clicked!');
  };

  const onClickCancelButton = () => {
    route.push('/user-page');
  };

  if (dataLoading) return <div>loading...</div>;
  if (dataError) return <div>Error</div>;

  return (
    <>
      <Header />
      <main className="w-full px-10 pt-10">
        {myData && (
          <Profile
            profileUrl={myData?.profileUrl}
            username={myData.username}
            clickable
            clickFn={onClickProfileImage}
            size="large"
          />
        )}
        <form>
          <span>닉네임 수정</span>
          <span>한 마디 수정</span>
          <span>관심사 수정</span>
          <div className="w-fit mx-auto flex gap-2">
            <StyledButton type="submit">확인</StyledButton>
            <StyledButton
              type="button"
              color="red"
              onClick={onClickCancelButton}
            >
              취소
            </StyledButton>
          </div>
        </form>
      </main>
    </>
  );
}

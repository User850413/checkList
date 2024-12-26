'use client';

import { userLogout } from '@/app/services/api/register';
import { getMyData, getMyDetailData } from '@/app/services/api/user';
import AddNewInterest from '@/components/check/addNewInterest';
import StyledButton from '@/components/common/styledButton';
import FieldButton from '@/components/layout/fieldButton';
import Header from '@/components/layout/header';
import Profile from '@/components/layout/profile';
import { User, UserDetail } from '@/types/user';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function UserPage() {
  const [myData, setMyData] = useState<User | undefined>();
  const [myDetailData, setMyDetailData] = useState<UserDetail>({
    bio: '',
    interest: [],
  });
  const route = useRouter();

  // NOTE : 내 데이터
  const {
    data,
    isLoading: dataLoading,
    isError: dataError,
  } = useQuery({
    queryKey: ['user'],
    queryFn: () => getMyData(),
  });

  // NOTE : 내 디테일 데이터
  const {
    data: detailData,
    isLoading: detailDataLoading,
    isError: detailDataError,
  } = useQuery({
    queryKey: ['userDetail'],
    queryFn: () => getMyDetailData(),
  });

  // NOTE : 로그아웃 로직
  const { mutate: logoutMutation } = useMutation({
    mutationFn: () => userLogout(),
    mutationKey: ['user'],
    onSuccess: () => route.push('/login?loggedOut=true'),
    onError: () => console.log('error'),
  });

  const onClickLogout = () => {
    logoutMutation();
  };

  // NOTE : 내 데이터
  useEffect(() => {
    if (data) setMyData(data.user);
  }, [data]);

  // NOTE : 내 디테일 데이터
  useEffect(() => {
    if (detailData) {
      setMyDetailData(() => ({
        ...detailData,
        bio: !detailData.bio
          ? '아직 작성되지 않았습니다. 한 마디 남겨주세요!'
          : detailData.bio,
      }));
    }
  }, [detailData]);

  if (dataLoading && detailDataLoading) return <div>Loading...</div>;
  if (dataError && detailDataError) return <div>Error</div>;

  // NOTE : 수정 페이지로 이동
  const onClickEditButton = () => {
    route.push('/user-page/edit');
  };

  return (
    <>
      <Header />
      <header className="bg-white shadow-card rounded-lg mx-14 p-6 mt-14 flex gap-8 items-center">
        {myData && (
          <>
            <Profile
              profileUrl={myData.profileUrl}
              username={myData.username}
              editable
              size="large"
            />
            <div className="flex flex-col items-start gap-4 w-full">
              <h1 className="font-bold text-xl">
                {myData.username}님의 페이지입니다.
              </h1>
              <div className="bg-slate-100 w-full p-4 rounded-md">
                <h2 className="font-semibold text-base">한 마디 🎤</h2>
                {myDetailData.bio && (
                  <span className="text-sm text-pretty">
                    {myDetailData.bio}
                  </span>
                )}
              </div>
              <div className="flex items-end justify-between w-full">
                <div className="flex flex-col gap-2">
                  {myDetailData.interest &&
                    myDetailData.interest.length > 0 && (
                      <>
                        <span className="text-sm">
                          {myData.username}님이 관심 있어하는 분야
                        </span>
                        <ul className="flex gap-1">
                          {myDetailData.interest.map((field, index) => (
                            <li key={index}>
                              <FieldButton fieldName={field} />
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                </div>
                <div className="flex items-center gap-2">
                  <StyledButton size={'sm'} onClick={onClickEditButton}>
                    수정
                  </StyledButton>
                  <StyledButton
                    color="dark"
                    size={'sm'}
                    onClick={onClickLogout}
                  >
                    로그아웃
                  </StyledButton>
                </div>
              </div>
            </div>
          </>
        )}
      </header>
      <main>
        <AddNewInterest />
      </main>
    </>
  );
}

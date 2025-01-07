import { userLogout } from '@/app/services/api/register';
import { getMyData, getMyDetailData } from '@/app/services/api/user';
import StyledButton from '@/components/common/styledButton';
import FieldButton from '@/components/common/fieldButton';
import Profile from '@/components/layout/profile';
import { User, UserDetail } from '@/types/user';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function UserProfile() {
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
    queryKey: ['me'],
    queryFn: () => getMyData(),
  });
  useEffect(() => {
    if (data) setMyData(data.user);
  }, [data]);

  // NOTE : 내 디테일 데이터
  const {
    data: detailData,
    isLoading: detailDataLoading,
    isError: detailDataError,
  } = useQuery({
    queryKey: ['me', 'detail'],
    queryFn: () => getMyDetailData(),
  });
  useEffect(() => {
    if (detailData) {
      setMyDetailData(() => ({
        ...detailData.data,
        bio: !detailData.data.bio
          ? '아직 작성되지 않았습니다. 한 마디 남겨주세요!'
          : detailData.data.bio,
      }));
    }
  }, [detailData]);

  // NOTE : 로그아웃 로직
  const { mutate: logoutMutation } = useMutation({
    mutationFn: () => userLogout(),
    mutationKey: ['me'],
    onSuccess: () => route.push('/login?loggedOut=true'),
    onError: () => console.log('error'),
  });

  const onClickLogout = () => {
    logoutMutation();
  };

  // NOTE : 수정 페이지로 이동
  const onClickEditButton = () => {
    route.push('/user-page/edit');
  };

  if (dataLoading && detailDataLoading) return <div>Loading...</div>;
  if (dataError && detailDataError) return <div>Error</div>;

  return (
    <div className="mx-14 mt-14 flex min-w-[800px] items-center gap-8 rounded-lg bg-white p-6 shadow-card">
      {myData && (
        <>
          <Profile
            profileUrl={myData.profileUrl}
            username={myData.username}
            editable
            size="large"
          />
          <div className="flex w-full flex-col items-start gap-4">
            <h1 className="text-xl font-bold">
              {myData.username}님의 페이지입니다.
            </h1>
            <div className="w-full rounded-md bg-slate-100 p-4">
              <h2 className="text-base font-semibold">한 마디 🎤</h2>
              {myDetailData.bio && (
                <span className="text-pretty text-sm">{myDetailData.bio}</span>
              )}
            </div>
            <div className="flex w-full items-end justify-between">
              <div className="flex flex-col items-start gap-2">
                {myDetailData.interest && myDetailData.interest.length > 0 && (
                  <>
                    <span className="text-sm">
                      {myData.username}님이 관심 있어하는 분야
                    </span>
                    <ul className="flex flex-wrap gap-2">
                      {myDetailData.interest.map((field) => (
                        <li key={field._id}>
                          <FieldButton fieldName={field.name} size="md" />
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
                <StyledButton color="dark" size={'sm'} onClick={onClickLogout}>
                  로그아웃
                </StyledButton>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

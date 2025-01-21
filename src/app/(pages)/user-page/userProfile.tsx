import { userLogout } from '@/app/services/api/register';
import { getMyData, getMyDetailData } from '@/app/services/api/user';
import StyledButton from '@/components/common/styledButton';
import FieldButton from '@/components/common/fieldButton';
import Profile from '@/components/layout/profile';
import { User, UserDetail } from '@/types/user';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { QueryKeys } from '@/app/lib/constants/queryKeys';
import {
  DialogActionTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTrigger,
} from '@/components/ui/dialog';

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
    queryKey: QueryKeys.USER_ME,
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
    queryKey: QueryKeys.USER_ME_DETAIL,
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
    mutationKey: QueryKeys.USER_ME,
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
    <div className="mx-14 mt-14 grid grid-cols-[auto_1fr] grid-rows-[auto_auto] gap-x-3 gap-y-2 rounded-lg bg-white p-6 shadow-card md:grid-cols-[auto_1fr] md:gap-y-6">
      {myData && (
        <>
          <div className="row-span-1 my-auto aspect-square h-min w-min md:row-span-2">
            <Profile
              profileUrl={myData.profileUrl}
              username={myData.username}
              editable
              size="large"
            />
          </div>
          <div className="flex flex-col gap-4">
            <h1 className="text-xl font-bold">
              {myData.username}님의 페이지입니다.
            </h1>
            <div className="min-h-24 w-full rounded-md bg-slate-100 p-4 text-slate-700 md:min-h-12">
              <h2 className="text-base font-semibold">한 마디 🎤</h2>
              {myDetailData.bio && (
                <span className="text-pretty text-sm">{myDetailData.bio}</span>
              )}
            </div>
          </div>
          <div className="col-span-2 flex w-full items-end justify-between md:col-span-1">
            <div className="flex w-full flex-col gap-1">
              <div className="flex justify-between gap-2">
                <span className="shrink-0 text-sm">
                  {myData.username}님이 관심 있어하는 분야
                </span>
                <span className="my-auto h-[2px] w-full bg-slate-100" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex flex-col items-start gap-2">
                  {myDetailData.interest &&
                    myDetailData.interest.length > 0 && (
                      <>
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
                  <DialogRoot placement={'center'}>
                    <DialogTrigger>
                      <span
                        role="button"
                        className="rounded-md bg-slate-500 px-2 py-2 text-white hover:bg-slate-600"
                      >
                        로그아웃
                      </span>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>정말로 로그아웃 하시겠습니까?</DialogHeader>
                      <DialogFooter>
                        <span
                          role="button"
                          tabIndex={1}
                          className="rounded-md bg-slate-500 px-3 py-[10px] text-white duration-100 hover:bg-slate-800"
                          onClick={onClickLogout}
                        >
                          로그아웃
                        </span>
                        <DialogActionTrigger>
                          <StyledButton>취소</StyledButton>
                        </DialogActionTrigger>
                      </DialogFooter>
                    </DialogContent>
                  </DialogRoot>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

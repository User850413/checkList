import { useRouter } from 'next/navigation';
import Profile from '../layout/profile';
import { useEffect, useState } from 'react';
import { User, UserDetail } from '@/types/user';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getMyData,
  getMyDetailData,
  patchMyData,
  patchMyDetailData,
} from '@/app/services/api/user';
import StyledButton from '../common/styledButton';
import InputBox from '../auth/inputBox';

const labels = {
  username: {
    type: 'text',
    en: 'username',
    ko: '닉네임',
    ariaLabel: '닉네임 변경',
  },
  bio: {
    type: 'textbox',
    en: 'bio',
    ko: '한마디',
    ariaLabel: '한마디 변경',
  },
};

// User 데이터 타입
interface UserState {
  username: string;
}

// UserDetail 데이터 타입
interface UserDetailState {
  bio: string;
}

export default function UserEditForm() {
  const queryClient = useQueryClient();

  const [myData, setMyData] = useState<User | undefined>();
  const [myDetailData, setMyDetailData] = useState<UserDetail | undefined>();
  const [userDataState, setUserDataState] = useState<UserState>({
    username: '',
  });
  const [userDetailDataState, setUserDetailDataState] =
    useState<UserDetailState>({ bio: '' });

  const route = useRouter();

  // User 데이터 관리
  const setUserKeyValue = <K extends keyof UserState>(
    key: K,
    newValue: UserState[K]
  ) => {
    setUserDataState((prev) => ({ ...prev, [key]: newValue }));
  };

  // UserDetail 데이터 관리
  const setUserDetailKeyValue = <K extends keyof UserDetailState>(
    key: K,
    newValue: UserDetailState[K]
  ) => {
    setUserDetailDataState((prev) => ({ ...prev, [key]: newValue }));
  };

  // NOTE : User 데이터 불러오기
  const {
    data,
    isLoading: dataLoading,
    isError: dataError,
  } = useQuery({ queryKey: ['me'], queryFn: () => getMyData() });
  useEffect(() => {
    if (data) setMyData(data.user);
    if (myData) setUserDataState({ username: myData.username });
  }, [data, myData]);

  // NOTE : UserDetail 데이터 불러오기
  const {
    data: detailData,
    isLoading: detailLoading,
    isError: detailError,
  } = useQuery({
    queryKey: ['me', 'detail'],
    queryFn: () => getMyDetailData(),
  });
  useEffect(() => {
    if (detailData) setMyDetailData(detailData.data);
    if (myDetailData) setUserDetailDataState({ bio: myDetailData.bio });
  }, [detailData, myDetailData]);

  const onClickProfileImage = () => {
    console.log('profileImage clicked!');
  };

  // NOTE : User 데이터 업데이트
  const { mutate: userDataMutate } = useMutation({
    mutationFn: ({ username }: { username: string }) =>
      patchMyData({ username }),
    mutationKey: ['me'],
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['me'] }),
  });

  // NOTE : UserDetail 데이터 업데이트
  const { mutate: userDetailMutate } = useMutation({
    mutationFn: ({ bio }: { bio: string }) => patchMyDetailData({ bio }),
    mutationKey: ['me', 'detail'],
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['me', 'detail'] }),
  });

  // NOTE : 확인 버튼 클릭 시
  const onClickSubmitButton = (e: React.FormEvent) => {
    e.preventDefault();

    if (!myData) return;
    userDataMutate({ username: userDataState.username });
    userDetailMutate({ bio: userDetailDataState.bio });

    console.log(`username : ${myData?.username}`);
    console.log(`myDetailData : ${myDetailData?.bio}`);
    route.push('/user-page');
  };

  // NOTE : 취소 버튼 클릭 시
  const onClickCancelButton = () => {
    route.push('/user-page');
  };

  if (dataLoading && detailLoading) return <div>loading...</div>;
  if (dataError && detailError) return <div>Error</div>;

  return (
    <>
      <span className="block w-fit mx-auto">
        {myData && (
          <Profile
            profileUrl={myData?.profileUrl}
            username={myData.username}
            clickable
            clickFn={onClickProfileImage}
            size="large"
          />
        )}
      </span>
      <form
        className="bg-white max-w-[800px] px-10 pt-24 pb-5 -mt-16 rounded-lg shadow-card mx-auto flex flex-col gap-5"
        onSubmit={onClickSubmitButton}
      >
        <InputBox
          inputValue={userDataState.username}
          label={labels.username}
          setKeyValue={(username) => setUserKeyValue('username', username)}
          maxLength={10}
        />
        <InputBox
          inputValue={userDetailDataState.bio}
          label={labels.bio}
          setKeyValue={(bio) => setUserDetailKeyValue('bio', bio)}
        />

        <span>관심사 수정</span>
        <div className="w-fit mx-auto flex gap-2">
          <StyledButton type="submit">확인</StyledButton>
          <StyledButton type="button" color="red" onClick={onClickCancelButton}>
            취소
          </StyledButton>
        </div>
      </form>
    </>
  );
}

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
import FieldButton from '../layout/fieldButton';
import { interest } from '@/types/interest';
import AddNewInterest from '../check/addNewInterest';

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
  interest: Pick<interest, 'name'>[];
}

export default function UserEditForm() {
  const queryClient = useQueryClient();

  // NOTE : 불러온 데이터 관리
  const [myData, setMyData] = useState<User | undefined>();
  const [myDetailData, setMyDetailData] = useState<UserDetail | undefined>();

  // NOTE : 업데이트된 데이터 관리
  const [userDataState, setUserDataState] = useState<UserState>({
    username: '',
  });
  const [userDetailDataState, setUserDetailDataState] =
    useState<UserDetailState>({ bio: '', interest: [] });

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
    if (detailData) {
      setMyDetailData(detailData.data);
      console.log(detailData.data.interest);
    }
    if (myDetailData)
      setUserDetailDataState({
        bio: myDetailData.bio,
        interest: myDetailData.interest,
      });
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
    mutationFn: ({
      bio,
      interest,
    }: {
      bio: string;
      interest: Pick<interest, 'name'>[];
    }) => patchMyDetailData({ bio, interest }),
    mutationKey: ['me', 'detail'],
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['me', 'detail'] }),
  });

  // interest 데이터 다루기
  const handleInterestData = (value: string) => {
    setUserDetailDataState((prev) => {
      const addNewInterest = [{ name: value }, ...prev.interest];

      // NOTE : 중복 삭제 로직
      const newInterest = Array.from(
        new Map(addNewInterest.map((item) => [item.name, item])).values()
      ) as interest[];
      return { bio: prev.bio, interest: newInterest };
    });
  };

  // interest 삭제 버튼 클릭 로직
  const handleDeleteInterest = (name: string) => {
    setUserDetailDataState((prev) => {
      const deletedInterest = prev.interest.filter(
        (item) => item.name !== name
      );
      return { ...prev, interest: deletedInterest };
    });
  };

  // NOTE : 확인 버튼 클릭 시
  const onClickSubmitButton = (e: React.FormEvent) => {
    e.preventDefault();

    // const form = e.currentTarget as HTMLFormElement;
    // const formData = new FormData(form);
    // console.log(formData.get('inputValue'));

    if (!myData) return;
    userDataMutate({ username: userDataState.username });
    userDetailMutate({
      bio: userDetailDataState.bio,
      interest: userDetailDataState.interest,
    });

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
        <div className="flex items-start w-full gap-5">
          <div className="flex flex-col items-start gap-2 flex-1">
            <span className="text-sm cursor-default">내 관심사</span>

            {userDetailDataState && userDetailDataState.interest.length > 0 && (
              <ul className="flex flex-col items-start gap-2 min-h-12 w-full rounded-lg">
                {userDetailDataState.interest.map((item, index) => (
                  <li key={index}>
                    <FieldButton
                      fieldName={item.name}
                      size="md"
                      deletable
                      deleteFn={() => handleDeleteInterest(item.name)}
                    />
                  </li>
                ))}
              </ul>
            )}
            {userDetailDataState &&
              userDetailDataState.interest.length === 0 && (
                <span className="text-xs w-full py-4 text-center cursor-default rounded-lg bg-slate-50">
                  추가된 관심사가 없습니다.
                </span>
              )}
          </div>
          <div className="flex flex-col gap-2 flex-1">
            <span className="text-sm cursor-default">새 관심사 추가</span>
            <AddNewInterest onSubmit={handleInterestData} />
          </div>
        </div>
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

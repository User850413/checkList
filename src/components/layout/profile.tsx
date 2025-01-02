import clsx from 'clsx';
import Image from 'next/image';

interface ProfileProps {
  profileUrl: string;
  username: string;
  clickable?: boolean;
  clickFn?: () => void;
  editable?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export default function Profile({
  profileUrl,
  username,
  clickFn,
  clickable = false,
  size = 'small',
}: ProfileProps) {
  const defaultProfile = `${
    process.env.PUBLIC_URL || ''
  }/icons/user-default.svg`;

  return (
    <button
      className={clsx(
        'relative inline-block flex-shrink-0 rounded-full border-2 border-gray-200 bg-white',
        { 'cursor-default': !clickable, 'cursor-pointer': clickable },
        {
          'h-[40px] w-[40px]': size == 'small',
          'h-[80px] w-[80px]': size == 'medium',
          'h-[160px] w-[160px]': size == 'large',
        },
      )}
      onClick={() => {
        if (clickFn) {
          clickFn();
        } else {
          throw new Error('클릭 시 실행할 함수가 필요합니다.');
        }
      }}
      aria-label={`${username}의 프로필`}
    >
      <Image
        fill
        objectFit="cover"
        src={profileUrl || defaultProfile}
        alt={username}
      />
    </button>
  );
}

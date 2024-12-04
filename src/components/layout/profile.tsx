import clsx from 'clsx';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface ProfileProps {
  profileUrl: string;
  username: string;
  clickable?: boolean;
}

export default function Profile({
  profileUrl,
  username,
  clickable = false,
}: ProfileProps) {
  const defaultProfile = process.env.PUBLIC_URL + '/icons/user-default.svg';

  const router = useRouter();

  return (
    <button
      className={clsx(
        'relative inline-block w-[40px] h-[40px] bg-white rounded-full border-2 border-gray-200',
        { 'cursor-default': !clickable, 'cursor-pointer': clickable }
      )}
      onClick={() => {
        if (clickable) return router.push('/user-page');
      }}
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

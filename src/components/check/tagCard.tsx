import clsx from 'clsx';
import { TagInPut } from './tagInput';

interface TagCardProps {
  className?: string;
  onUndo: () => void;
}

export default function TagCard({ className, onUndo }: TagCardProps) {
  return (
    <div
      className={clsx(
        'bg-slate-100 px-2 py-4 rounded-lg flex flex-col gap-2',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-medium w-fit">새 리스트 추가</h1>
        <button className="text-sm px-3 py-1 text-red-400" onClick={onUndo}>
          취소
        </button>
      </div>
      <TagInPut Undo={onUndo} />
    </div>
  );
}

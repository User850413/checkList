import { TagInPut } from './tagInput';

export default function TagCard() {
  return (
    <div className="bg-slate-100 px-2 py-4 rounded-lg flex flex-col gap-2">
      <h1 className="text-lg font-medium">새 리스트 추가</h1>
      <TagInPut />
    </div>
  );
}

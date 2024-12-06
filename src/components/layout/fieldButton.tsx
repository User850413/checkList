interface FieldButtonProps {
  fieldName: string;
  fieldIcon?: string;
}

export default function FieldButton({
  fieldName,
  fieldIcon,
}: FieldButtonProps) {
  return (
    <button className="flex text-sm items-center gap-0 px-3 py-1 bg-slate-200 hover:bg-slate-300 rounded-full">
      <span>{fieldName}</span>
      {fieldIcon && <span>{fieldIcon}</span>}
    </button>
  );
}

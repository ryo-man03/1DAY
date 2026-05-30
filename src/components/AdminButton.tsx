interface AdminButtonProps {
  onClick: () => void;
}

export function AdminButton({ onClick }: AdminButtonProps) {
  return (
    <button
      onClick={onClick}
      className="text-[10px] font-medium text-gray-300 hover:text-gray-500 transition-colors px-2 py-1 rounded tracking-widest uppercase"
      title="管理者モード"
    >
      管理
    </button>
  );
}

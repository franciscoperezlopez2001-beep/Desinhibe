import { AlertCircle } from "lucide-react";

export function FormAlert({ message }: { message: string }) {
  return (
    <div role="alert" className="flex items-start gap-3 border border-[#d9776f]/40 bg-[#d9776f]/10 p-4 text-sm leading-relaxed">
      <AlertCircle size={18} strokeWidth={1.5} className="mt-0.5 shrink-0 text-[#e0908a]" aria-hidden />
      <p>{message}</p>
    </div>
  );
}

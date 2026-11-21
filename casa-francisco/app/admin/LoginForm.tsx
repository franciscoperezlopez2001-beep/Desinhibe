"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { login } from "./actions";
import { buttonClass } from "@/components/Button";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);
  return (
    <form action={action} className="mt-10 space-y-6">
      <div>
        <label htmlFor="password" className="etiqueta text-[0.64rem] text-arena">Contraseña</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className="campo" />
      </div>
      {state?.error && <p role="alert" className="text-sm text-[#e0908a]">{state.error}</p>}
      <button type="submit" disabled={pending} className={buttonClass("primario", "w-full")}>
        {pending ? <Loader2 size={16} className="animate-spin" aria-hidden /> : "Entrar"}
      </button>
    </form>
  );
}

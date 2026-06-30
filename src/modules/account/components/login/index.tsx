import { login } from "@lib/data/customer"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"
import { useActionState, useEffect } from "react"
import { useRouter } from "next/navigation"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
  redirectTo?: string
}

const Login = ({ setCurrentView, redirectTo = "/" }: Props) => {
  const [message, formAction] = useActionState(login, null)
  const router = useRouter()

  useEffect(() => {
    if (message?.state === "success") {
      router.push(redirectTo)
    }
  }, [message, redirectTo, router])

  return (
    <div className="w-full flex flex-col items-center" data-testid="login-page">
      <h1 className="text-2xl font-black text-white uppercase mb-2">
        Bienvenido <span className="text-[#facc15]">de Vuelta</span>
      </h1>
      <p className="text-center text-sm text-[#888888] mb-6 max-w-xs">
        Inicia sesión para acceder a tu cuenta y compras.
      </p>

      {message?.state === "verification_required" && (
        <div className="w-full mb-6 text-center text-sm text-[#888888] bg-[#1a1a1a] border border-[#333333] rounded-xl p-5" data-testid="login-verification-message">
          <span className="text-[#facc15] font-bold">✓ Verifica tu email</span>
          <p className="mt-2">
            Enviamos un enlace de verificación a <strong className="text-white">{message.email}</strong>.
          </p>
          <p className="mt-1">Revisa tu bandeja de entrada y luego inicia sesión.</p>
        </div>
      )}

      <form className="w-full" action={formAction}>
        <div className="flex flex-col w-full gap-y-3">
          <Input label="Correo Electrónico" name="email" type="email" autoComplete="email" required data-testid="email-input" />
          <Input label="Contraseña" name="password" type="password" autoComplete="current-password" required data-testid="password-input" />
        </div>

        <ErrorMessage error={message?.state === "error" ? message.error : null} data-testid="login-error-message" />

        <SubmitButton data-testid="sign-in-button" className="w-full mt-6">
          Iniciar Sesión
        </SubmitButton>
      </form>

      <span className="text-center text-sm text-[#888888] mt-5">
        ¿No tienes cuenta?{" "}
        <button onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)} className="text-[#facc15] font-bold hover:underline" data-testid="register-button">
          Regístrate
        </button>
      </span>
    </div>
  )
}

export default Login

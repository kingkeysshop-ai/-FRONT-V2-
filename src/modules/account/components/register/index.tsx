"use client"

import { useActionState } from "react"
import Input from "@modules/common/components/input"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { signup } from "@lib/data/customer"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Register = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(signup, null)

  return (
    <div className="w-full flex flex-col items-center" data-testid="register-page">
      <h1 className="text-2xl font-black text-white uppercase mb-2">
        Crear <span className="text-[#facc15]">Cuenta</span>
      </h1>
      <p className="text-center text-sm text-[#888888] mb-6 max-w-xs">
        Regístrate para acceder a compras rápidas y ofertas exclusivas.
      </p>

      {message?.state === "verification_required" && (
        <div className="w-full mb-6 text-center text-sm text-[#888888] bg-[#1a1a1a] border border-[#333333] rounded-xl p-5" data-testid="register-verification-message">
          <span className="text-[#facc15] font-bold">✓ Verifica tu email</span>
          <p className="mt-2">
            Enviamos un enlace de verificación a <strong className="text-white">{message.email}</strong>.
          </p>
          <p className="mt-1">Revisa tu bandeja de entrada y luego inicia sesión.</p>
        </div>
      )}

      <form className="w-full flex flex-col" action={formAction}>
        <div className="flex flex-col w-full gap-y-3">
          <Input label="Nombre" name="first_name" required autoComplete="given-name" data-testid="first-name-input" />
          <Input label="Apellido" name="last_name" required autoComplete="family-name" data-testid="last-name-input" />
          <Input label="Correo Electrónico" name="email" required type="email" autoComplete="email" data-testid="email-input" />
          <Input label="Teléfono" name="phone" type="tel" autoComplete="tel" data-testid="phone-input" />
          <Input label="Contraseña" name="password" required type="password" autoComplete="new-password" data-testid="password-input" />
        </div>

        <ErrorMessage error={message?.state === "error" ? message.error : null} data-testid="register-error" />

        <span className="text-center text-xs text-[#666666] mt-5 leading-relaxed">
          Al crear una cuenta, aceptas nuestros{" "}
          <LocalizedClientLink href="/content/privacy-policy" className="text-[#facc15] hover:underline">
            Términos y Condiciones
          </LocalizedClientLink>{" "}
          y{" "}
          <LocalizedClientLink href="/content/terms-of-use" className="text-[#facc15] hover:underline">
            Política de Privacidad
          </LocalizedClientLink>.
        </span>

        <SubmitButton className="w-full mt-5" data-testid="register-button">
          Crear Cuenta
        </SubmitButton>
      </form>

      <span className="text-center text-sm text-[#888888] mt-5">
        ¿Ya tienes cuenta?{" "}
        <button onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)} className="text-[#facc15] font-bold hover:underline">
          Inicia Sesión
        </button>
      </span>
    </div>
  )
}

export default Register

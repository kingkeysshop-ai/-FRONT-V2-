import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { checkRateLimit } from "@lib/rate-limit"
import { setResetToken } from "@lib/reset-token-store"
import { sendEmail, recoveryEmailHtml } from "@lib/email-templates"

const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000"

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown"
    if (!checkRateLimit(`resend-recovery:${ip}`, 3, 60000)) {
      return NextResponse.json({ error: "Demasiadas solicitudes. Intenta en 1 minuto." }, { status: 429 })
    }

    const { email, countryCode } = await req.json()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 })
    }

    const token = crypto.randomBytes(32).toString("hex")
    setResetToken(token, email.toLowerCase())

    const cc = countryCode || "co"
    const resetUrl = `${NEXT_PUBLIC_BASE_URL}/${cc}/reset-password?token=${token}&email=${encodeURIComponent(email)}`

    const result = await sendEmail({
      to: email,
      subject: "Recupera tu contraseña - KING KEYS",
      html: recoveryEmailHtml(resetUrl),
    })

    if (!result.success) {
      console.error("[Resend] Error sending recovery email:", result.error)
      return NextResponse.json({ error: "Error al enviar el correo. Verifica tu API key de Resend." }, { status: 500 })
    }

    console.log(`[Resend] Recovery email sent to ${email}`)
    return NextResponse.json({ ok: true, message: "Correo enviado" })
  } catch (err: any) {
    console.error("[Resend] send-recovery error:", err.message)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}

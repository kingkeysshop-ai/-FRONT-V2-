const YEAR = new Date().getFullYear()

function baseHtml(content: string): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="dark light">
</head>
<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#d1d5db;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a;">
    <tr>
      <td align="center" style="padding:24px 16px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#1a1a1a;border-radius:16px;">
          <tr>
            <td style="padding:36px 32px 20px;text-align:center;background-color:#0a0a0a;border-radius:16px 16px 0 0;">
              <span style="font-size:28px;font-weight:900;letter-spacing:4px;color:#ffffff;">KING </span>
              <span style="font-size:28px;font-weight:900;letter-spacing:4px;color:#facc15;">KEYS</span>
            </td>
          </tr>
          ${content}
          <tr>
            <td style="padding:28px 32px 24px;background-color:#000000;border-radius:0 0 16px 16px;">
              <p style="font-size:12px;color:#6b7280;margin:0 0 4px;text-align:center;">&copy; ${YEAR} King Keys &mdash; Bogot&aacute;, Colombia</p>
              <p style="font-size:11px;color:#4b5563;margin:0;text-align:center;">El Reino Digital</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export function welcomeEmailHtml(name: string): string {
  const greeting = name ? `Hola, ${name}` : "Hola"
  return baseHtml(`
    <tr>
      <td style="padding:28px 32px 8px;">
        <h1 style="font-size:22px;font-weight:800;color:#ffffff;margin:0 0 8px;">${greeting}</h1>
        <p style="font-size:14px;color:#d1d5db;margin:0;line-height:1.6;">
          Bienvenido a <strong style="color:#facc15;">King Keys</strong>, el Reino Digital.
          Tu cuenta ha sido creada exitosamente.
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding:20px 32px 8px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#1a1a1a;border-radius:12px;border:1px solid #2a2a2a;">
          <tr>
            <td style="padding:20px 24px;text-align:center;">
              <span style="font-size:36px;line-height:1;">👑</span>
              <p style="font-size:14px;color:#d1d5db;margin:12px 0 0;line-height:1.5;">
                Ahora puedes comprar licencias originales para Windows, Office,
                Xbox, PlayStation y m&aacute;s con entrega inmediata.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:24px 32px;">
        <a href="${process.env.NEXT_PUBLIC_BASE_URL || "#"}/co/account"
           style="display:inline-block;background:#facc15;color:#0a0a0a;font-size:15px;font-weight:900;padding:14px 32px;border-radius:10px;text-decoration:none;">
          Ir a mi cuenta
        </a>
      </td>
    </tr>
  `)
}

export function recoveryEmailHtml(resetUrl: string): string {
  return baseHtml(`
    <tr>
      <td style="padding:28px 32px 8px;">
        <h1 style="font-size:20px;font-weight:800;color:#ffffff;margin:0 0 8px;">Recuper&aacute; tu contrase&ntilde;a</h1>
        <p style="font-size:14px;color:#d1d5db;margin:0;line-height:1.6;">
          Recibimos una solicitud para restablecer la contrase&ntilde;a de tu cuenta.
          Hac&eacute; clic en el bot&oacute;n de abajo para crear una nueva:
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding:24px 32px 8px;">
        <a href="${resetUrl}"
           style="display:inline-block;background:#facc15;color:#0a0a0a;font-size:15px;font-weight:900;padding:14px 32px;border-radius:10px;text-decoration:none;">
          Restablecer contrase&ntilde;a
        </a>
      </td>
    </tr>
    <tr>
      <td style="padding:16px 32px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#111;border-radius:10px;">
          <tr>
            <td style="padding:14px 20px;">
              <p style="margin:0;color:#666;font-size:13px;line-height:1.5;">
                ⚠ Este enlace expira en <strong style="color:#888;">1 hora</strong>.<br>
                Si no solicitaste este cambio, ignor&aacute; este correo.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:8px 32px 0;">
        <p style="margin:0;color:#555;font-size:11px;">
          Si ten&eacute;s problemas con el bot&oacute;n, copi&aacute; y peg&aacute; este enlace:<br>
          <span style="color:#666;word-break:break-all;font-size:10px;">${resetUrl}</span>
        </p>
      </td>
    </tr>
  `)
}

export function licenseEmailHtml(
  productName: string,
  licenseKey: string,
  orderShort: string,
  dateStr: string,
  greeting: string,
): string {
  return baseHtml(`
    <tr>
      <td style="padding:0 32px 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#facc15;border-radius:8px;">
          <tr>
            <td style="padding:14px 20px;text-align:center;">
              <span style="font-size:13px;font-weight:800;color:#0a0a0a;letter-spacing:1.5px;">&#10003;  ACTIVACI&Oacute;N COMPLETADA</span>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:0 32px 20px;">
        <h1 style="font-size:20px;font-weight:700;color:#ffffff;margin:0 0 10px;">${greeting}</h1>
        <p style="font-size:14px;color:#d1d5db;margin:0;line-height:1.6;">Tu pedido ha sido procesado y tu licencia digital est&aacute; lista para usar.</p>
      </td>
    </tr>
    <tr>
      <td style="padding:0 32px 16px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#1a1a1a;border-radius:8px;border:1px solid #facc15;">
          <tr>
            <td style="padding:16px 20px;">
              <p style="font-size:10px;font-weight:700;color:#facc15;letter-spacing:2px;margin:0 0 4px;text-transform:uppercase;">Producto</p>
              <p style="font-size:15px;font-weight:700;color:#ffffff;margin:0;">${productName}</p>
              <p style="font-size:11px;color:#6b7280;margin:6px 0 0;font-family:'Courier New',monospace;">Orden #${orderShort} &middot; ${dateStr}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:0 32px 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a;border-radius:8px;border:2px solid #facc15;">
          <tr>
            <td style="padding:24px 20px;">
              <p style="font-size:10px;font-weight:700;color:#facc15;letter-spacing:2px;margin:0 0 14px;text-transform:uppercase;text-align:center;">Tu Clave de Activaci&oacute;n</p>
              <p style="font-family:'Courier New',Consolas,monospace;font-size:18px;font-weight:700;color:#ffffff;letter-spacing:3px;text-align:center;word-break:break-all;margin:0;">${licenseKey}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:0 32px 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#1a1a1a;border-radius:8px;">
          <tr>
            <td style="padding:20px;">
              <p style="font-size:10px;font-weight:700;color:#facc15;letter-spacing:2px;margin:0 0 12px;text-transform:uppercase;">Instrucciones</p>
              <p style="font-size:13px;color:#d1d5db;margin:0 0 6px;">1. Ve a Configuraci&oacute;n &gt; Cuenta &gt; Activaci&oacute;n</p>
              <p style="font-size:13px;color:#d1d5db;margin:0 0 6px;">2. Ingresa la clave cuando te la soliciten</p>
              <p style="font-size:13px;color:#d1d5db;margin:0;">3. Sigue las instrucciones en pantalla</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `)
}

export async function sendEmail(args: {
  to: string
  subject: string
  html: string
  text?: string
}): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn("RESEND_API_KEY not configured. Email NOT sent.")
    return { success: false, error: "RESEND_API_KEY not configured" }
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "KING KEYS <noreply@elreino.digital>",
        to: args.to,
        subject: args.subject,
        html: args.html,
        text: args.text || "",
      }),
    })

    const data = await res.json()
    if (!res.ok) {
      return { success: false, error: `Resend error (HTTP ${res.status}): ${data?.message || res.statusText}` }
    }

    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message || "Unknown error sending email" }
  }
}

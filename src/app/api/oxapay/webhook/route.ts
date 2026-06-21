import { NextRequest } from "next/server"
import crypto from "crypto"
import { checkRateLimit } from "@lib/rate-limit"

const OXAPAY_MERCHANT_API_KEY = process.env.OXAPAY_MERCHANT_API_KEY
const MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL
const MEDUSA_API_KEY = process.env.MEDUSA_API_KEY

async function completeCart(cartId: string): Promise<boolean> {
  try {
    const checkRes = await fetch(
      `${MEDUSA_BACKEND_URL}/store/carts/${cartId}`,
      { headers: { "x-publishable-api-key": MEDUSA_API_KEY! } }
    )
    if (checkRes.ok) {
      const { cart } = await checkRes.json()
      if (cart?.completed_at) {
        console.log(`[Oxapay Webhook] Cart ${cartId} already completed`)
        return true
      }
    }
  } catch (e: any) {
    console.warn(`[Oxapay Webhook] Could not check cart ${cartId}: ${e.message}`)
  }

  try {
    const medusaRes = await fetch(
      `${MEDUSA_BACKEND_URL}/store/carts/${cartId}/complete`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": MEDUSA_API_KEY!,
        },
      }
    )

    const medusaData = await medusaRes.json()

    if (!medusaRes.ok) {
      if (medusaData?.type === "order") {
        console.log(`[Oxapay Webhook] Cart ${cartId} already has order ${medusaData?.data?.id}`)
        return true
      }
      console.error(`[Oxapay Webhook] Failed to complete cart ${cartId}: ${JSON.stringify(medusaData)}`)
      return false
    }

    console.log(`[Oxapay Webhook] Cart ${cartId} completed (order ${medusaData?.data?.id})`)
    return true
  } catch (e: any) {
    console.error(`[Oxapay Webhook] Error completing cart ${cartId}: ${e.message}`)
    return false
  }
}

export async function POST(req: NextRequest) {
  if (!OXAPAY_MERCHANT_API_KEY || !MEDUSA_BACKEND_URL || !MEDUSA_API_KEY) {
    return new Response("Server misconfigured", { status: 500 })
  }

  try {
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown"
    if (!checkRateLimit(`oxapay-webhook:${ip}`, 20, 60000)) {
      return new Response("Too many requests", { status: 429 })
    }

    const rawBody = await req.text()
    let body: any
    try {
      body = JSON.parse(rawBody)
    } catch {
      return new Response("Invalid JSON", { status: 400 })
    }

    const hmacHeader = req.headers.get("hmac") || req.headers.get("HMAC") || ""
    if (hmacHeader) {
      const calculatedHmac = crypto
        .createHmac("sha512", OXAPAY_MERCHANT_API_KEY)
        .update(rawBody)
        .digest("hex")
      if (calculatedHmac !== hmacHeader) {
        console.warn("[Oxapay Webhook] Invalid HMAC signature")
        return new Response("Invalid signature", { status: 403 })
      }
    }

    const { status, order_id } = body
    console.log(`[Oxapay Webhook] status="${status}" order_id="${order_id}"`)

    if (status !== "Paid") {
      return new Response("ok", { status: 200 })
    }

    if (!order_id) {
      return new Response("Missing order_id", { status: 400 })
    }

    const cartId = order_id
    const success = await completeCart(cartId)

    if (success) {
      return new Response("ok", { status: 200 })
    }

    return new Response("Failed to complete order", { status: 500 })
  } catch (err: any) {
    console.error(`[Oxapay Webhook] Internal error:`, err.message)
    return new Response("Internal error", { status: 500 })
  }
}

export async function GET() {
  return new Response("Method not allowed", { status: 405 })
}

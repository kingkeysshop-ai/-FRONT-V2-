import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { checkRateLimit } from "@lib/rate-limit"

const OXAPAY_API_KEY = process.env.OXAPAY_MERCHANT_API_KEY
const OXAPAY_API_BASE = process.env.OXAPAY_API_BASE || "https://api.oxapay.com/v1"
const MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL
const MEDUSA_API_KEY = process.env.MEDUSA_API_KEY
const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

export async function POST(req: NextRequest) {
  if (!OXAPAY_API_KEY || !NEXT_PUBLIC_BASE_URL) {
    return NextResponse.json(
      { error: "Oxapay env vars not configured" },
      { status: 500 }
    )
  }

  try {
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown"
    if (!checkRateLimit(`oxapay-create-invoice:${ip}`, 5, 60000)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 })
    }

    const { amount, currency, orderId: _orderId, cartId } = await req.json()

    if (!amount || !currency || !_orderId || !cartId) {
      return NextResponse.json(
        { error: "Missing required fields: amount, currency, orderId, cartId" },
        { status: 400 }
      )
    }

    if (MEDUSA_BACKEND_URL && MEDUSA_API_KEY) {
      try {
        const cartRes = await fetch(
          `${MEDUSA_BACKEND_URL}/store/carts/${cartId}`,
          { headers: { "x-publishable-api-key": MEDUSA_API_KEY } }
        )
        if (cartRes.ok) {
          const { cart: actualCart } = await cartRes.json()
          const expectedAmount = actualCart?.total != null
            ? (actualCart.total / 100).toFixed(2)
            : null
          if (expectedAmount && Number(amount).toFixed(2) !== expectedAmount) {
            return NextResponse.json(
              { error: "Amount does not match cart total" },
              { status: 400 }
            )
          }
        }
      } catch {}
    }

    const payload: Record<string, unknown> = {
      amount: Number(amount),
      currency: currency.toUpperCase(),
      order_id: cartId,
      return_url: `${NEXT_PUBLIC_BASE_URL}/payment/success?cart_id=${cartId}`,
      callback_url: `${NEXT_PUBLIC_BASE_URL}/api/oxapay/webhook`,
      sandbox: process.env.NODE_ENV !== "production",
    }

    const response = await fetch(`${OXAPAY_API_BASE}/payment/invoice`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        merchant_api_key: OXAPAY_API_KEY,
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()

    if (!response.ok || data.status !== 200) {
      return NextResponse.json(
        { error: data.message || data.error?.message || "Failed to create Oxapay invoice" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      url: data.data.payment_url,
      trackId: data.data.track_id,
    })
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}

export interface WhatsAppContactPayload {
  name: string
  email: string
  message: string
  template: string
}

export interface WhatsAppSubscriptionPayload {
  template: string
  planName: string
  period: string
  addOns: string[]
  noAddOnsLabel: string
  totalPrice: number
  currencySymbol?: string
}

function getSanitizedWhatsAppNumber(): string | null {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER

  if (!whatsappNumber) {
    console.error("WhatsApp number not configured")
    return null
  }

  const sanitizedNumber = whatsappNumber.replace(/\D/g, "")

  if (!sanitizedNumber) {
    console.error("Invalid WhatsApp number")
    return null
  }

  return sanitizedNumber
}

export function openWhatsAppContact(payload: WhatsAppContactPayload): boolean {
  if (typeof window === "undefined") {
    return false
  }

  const sanitizedNumber = getSanitizedWhatsAppNumber()
  if (!sanitizedNumber) {
    return false
  }

  const formattedMessage = payload.template
    .replace(/\{name\}/g, payload.name)
    .replace(/\{email\}/g, payload.email)
    .replace(/\{message\}/g, payload.message)

  // Create WhatsApp URL
  const whatsappUrl = `https://wa.me/${sanitizedNumber}?text=${encodeURIComponent(formattedMessage)}`

  // Open WhatsApp
  window.open(whatsappUrl, "_blank", "noopener,noreferrer")
  return true
}

export function buildWhatsAppSubscriptionUrl(
  payload: WhatsAppSubscriptionPayload,
): string | null {
  const sanitizedNumber = getSanitizedWhatsAppNumber()
  if (!sanitizedNumber) {
    return null
  }

  const selectedAddOns = payload.addOns.length
    ? payload.addOns.join(", ")
    : payload.noAddOnsLabel
  const total = `${payload.currencySymbol ?? "$"}${payload.totalPrice}`

  const message = payload.template
    .replace(/\{planName\}/g, payload.planName)
    .replace(/\{period\}/g, payload.period)
    .replace(/\{addOns\}/g, selectedAddOns)
    .replace(/\{total\}/g, total)

  return `https://wa.me/${sanitizedNumber}?text=${encodeURIComponent(message)}`
}

export interface WhatsAppContactPayload {
  name: string
  email: string
  message: string
  template: string
}

export function openWhatsAppContact(payload: WhatsAppContactPayload): boolean {
  if (typeof window === "undefined") {
    return false
  }

  // Get WhatsApp number from environment
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER

  if (!whatsappNumber) {
    console.error("WhatsApp number not configured")
    return false
  }

  const sanitizedNumber = whatsappNumber.replace(/\D/g, "")
  if (!sanitizedNumber) {
    console.error("Invalid WhatsApp number")
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

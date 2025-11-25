// Server-side validation for contact form
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const sanitizeInput = (input) => {
  if (typeof input !== "string") return ""
  // Remove HTML tags and script content
  return input
    .replace(/<[^>]*>/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+=/gi, "")
    .trim()
}

const validateContactForm = (data) => {
  const errors = []

  // Validate name
  if (!data.contactName || data.contactName.trim().length < 2) {
    errors.push("Name must be at least 2 characters long")
  }
  if (data.contactName && data.contactName.length > 100) {
    errors.push("Name must not exceed 100 characters")
  }

  // Validate email
  if (!data.contactEmail || !validateEmail(data.contactEmail)) {
    errors.push("Please provide a valid email address")
  }

  // Validate subject
  if (!data.contactSubject || data.contactSubject.trim().length < 3) {
    errors.push("Subject must be at least 3 characters long")
  }
  if (data.contactSubject && data.contactSubject.length > 200) {
    errors.push("Subject must not exceed 200 characters")
  }

  // Validate message
  if (!data.contactMessage || data.contactMessage.trim().length < 10) {
    errors.push("Message must be at least 10 characters long")
  }
  if (data.contactMessage && data.contactMessage.length > 5000) {
    errors.push("Message must not exceed 5000 characters")
  }

  return errors
}

const handleContactSubmission = async (formData) => {
  try {
    // Sanitize all inputs
    const sanitizedData = {
      contactName: sanitizeInput(formData.contactName),
      contactEmail: sanitizeInput(formData.contactEmail),
      contactSubject: sanitizeInput(formData.contactSubject),
      contactMessage: sanitizeInput(formData.contactMessage),
    }

    // Validate data
    const validationErrors = validateContactForm(sanitizedData)

    if (validationErrors.length > 0) {
      return {
        success: false,
        errors: validationErrors,
      }
    }

    // Additional security checks
    // Check for spam patterns
    const spamKeywords = ["viagra", "casino", "lottery", "prize"]
    const messageContent = sanitizedData.contactMessage.toLowerCase()
    const hasSpam = spamKeywords.some((keyword) => messageContent.includes(keyword))

    if (hasSpam) {
      return {
        success: false,
        errors: ["Message contains prohibited content"],
      }
    }

    // Rate limiting check (in production, use Redis or similar)
    // For now, just a simple timestamp check in localStorage

    // In production, send email using a service like SendGrid, AWS SES, etc.
    console.log("[v0] Contact form validated successfully:", sanitizedData)

    return {
      success: true,
      message: "Thank you for your message! I will get back to you soon.",
    }
  } catch (error) {
    console.error("[v0] Contact form error:", error)
    return {
      success: false,
      errors: ["An unexpected error occurred. Please try again later."],
    }
  }
}

// Export for use in the client-side script
if (typeof module !== "undefined" && module.exports) {
  module.exports = { handleContactSubmission, validateContactForm, sanitizeInput }
}

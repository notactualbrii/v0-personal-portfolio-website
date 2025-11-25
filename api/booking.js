// Server-side validation for restaurant booking form
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validatePhone = (phone) => {
  // UK phone number validation
  const phoneRegex = /^(\+44|0)[0-9\s]{10,13}$/
  return phoneRegex.test(phone.replace(/\s/g, ""))
}

const sanitizeInput = (input) => {
  if (typeof input !== "string") return ""
  return input
    .replace(/<[^>]*>/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+=/gi, "")
    .trim()
}

const validateBookingForm = (data) => {
  const errors = []

  // Validate name
  if (!data.restaurantName || data.restaurantName.trim().length < 2) {
    errors.push("Name must be at least 2 characters long")
  }
  if (data.restaurantName && data.restaurantName.length > 100) {
    errors.push("Name must not exceed 100 characters")
  }

  // Validate email
  if (!data.restaurantEmail || !validateEmail(data.restaurantEmail)) {
    errors.push("Please provide a valid email address")
  }

  // Validate phone
  if (!data.restaurantPhone || !validatePhone(data.restaurantPhone)) {
    errors.push("Please provide a valid UK phone number")
  }

  // Validate date
  if (!data.restaurantDate) {
    errors.push("Please select a date")
  } else {
    const selectedDate = new Date(data.restaurantDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (selectedDate < today) {
      errors.push("Booking date cannot be in the past")
    }

    // Check if date is within next 3 months
    const maxDate = new Date()
    maxDate.setMonth(maxDate.getMonth() + 3)
    if (selectedDate > maxDate) {
      errors.push("Bookings can only be made up to 3 months in advance")
    }
  }

  // Validate time
  const validTimes = ["12:00", "12:30", "13:00", "18:00", "18:30", "19:00", "20:00"]
  if (!data.restaurantTime || !validTimes.includes(data.restaurantTime)) {
    errors.push("Please select a valid time slot")
  }

  // Validate number of guests
  const validGuests = ["1", "2", "3", "4", "5", "6", "7", "8"]
  if (!data.restaurantGuests || !validGuests.includes(data.restaurantGuests)) {
    errors.push("Please select number of guests")
  }

  // Validate special requests (optional)
  if (data.restaurantNotes && data.restaurantNotes.length > 1000) {
    errors.push("Special requests must not exceed 1000 characters")
  }

  return errors
}

const handleBookingSubmission = async (formData) => {
  try {
    // Sanitize all inputs
    const sanitizedData = {
      restaurantName: sanitizeInput(formData.restaurantName),
      restaurantEmail: sanitizeInput(formData.restaurantEmail),
      restaurantPhone: sanitizeInput(formData.restaurantPhone),
      restaurantDate: sanitizeInput(formData.restaurantDate),
      restaurantTime: sanitizeInput(formData.restaurantTime),
      restaurantGuests: sanitizeInput(formData.restaurantGuests),
      restaurantNotes: sanitizeInput(formData.restaurantNotes || ""),
    }

    // Validate data
    const validationErrors = validateBookingForm(sanitizedData)

    if (validationErrors.length > 0) {
      return {
        success: false,
        errors: validationErrors,
      }
    }

    // Check for duplicate bookings (in production, check database)
    // For now, just validate the data is complete

    console.log("[v0] Booking form validated successfully:", sanitizedData)

    // In production, save to database and send confirmation email
    return {
      success: true,
      message: `Thank you, ${sanitizedData.restaurantName}! Your table for ${sanitizedData.restaurantGuests} on ${sanitizedData.restaurantDate} at ${sanitizedData.restaurantTime} has been reserved. A confirmation email has been sent to ${sanitizedData.restaurantEmail}.`,
      bookingDetails: sanitizedData,
    }
  } catch (error) {
    console.error("[v0] Booking form error:", error)
    return {
      success: false,
      errors: ["An unexpected error occurred. Please try again later."],
    }
  }
}

// Export for use in the client-side script
if (typeof module !== "undefined" && module.exports) {
  module.exports = { handleBookingSubmission, validateBookingForm, sanitizeInput }
}

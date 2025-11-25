document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("themeToggle")
  const body = document.body

  // Check for saved theme preference
  const savedTheme = localStorage.getItem("theme")
  if (savedTheme === "light") {
    body.classList.add("light-mode")
    const sunIcon = themeToggle?.querySelector(".sun-icon")
    const moonIcon = themeToggle?.querySelector(".moon-icon")
    if (sunIcon) sunIcon.style.display = "none"
    if (moonIcon) moonIcon.style.display = "block"
  }

  // Toggle theme when button is clicked
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      body.classList.toggle("light-mode")

      const sunIcon = this.querySelector(".sun-icon")
      const moonIcon = this.querySelector(".moon-icon")

      if (body.classList.contains("light-mode")) {
        localStorage.setItem("theme", "light")
        if (sunIcon) sunIcon.style.display = "none"
        if (moonIcon) moonIcon.style.display = "block"
      } else {
        localStorage.setItem("theme", "dark")
        if (sunIcon) sunIcon.style.display = "block"
        if (moonIcon) moonIcon.style.display = "none"
      }
    })
  }

  // Mobile Menu Toggle
  const hamburger = document.getElementById("hamburger")
  const navMenu = document.getElementById("navMenu")

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active")
      navMenu.classList.toggle("active")
    })

    // Close menu when link is clicked
    const navLinks = navMenu.querySelectorAll("a")
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("active")
        hamburger.classList.remove("active")
      })
    })
  }

  // Validation and sanitization utilities
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
    // Remove HTML tags, script content, and dangerous attributes
    return input
      .replace(/<[^>]*>/g, "")
      .replace(/javascript:/gi, "")
      .replace(/on\w+=/gi, "")
      .trim()
  }

  // Rate limiting helper
  const checkRateLimit = (formType) => {
    const lastSubmit = localStorage.getItem(`${formType}_lastSubmit`)
    if (lastSubmit) {
      const timeSinceLastSubmit = Date.now() - Number.parseInt(lastSubmit)
      const cooldownPeriod = 30000 // 30 seconds

      if (timeSinceLastSubmit < cooldownPeriod) {
        const remainingTime = Math.ceil((cooldownPeriod - timeSinceLastSubmit) / 1000)
        return {
          allowed: false,
          message: `Please wait ${remainingTime} seconds before submitting again.`,
        }
      }
    }
    return { allowed: true }
  }

  const setRateLimit = (formType) => {
    localStorage.setItem(`${formType}_lastSubmit`, Date.now().toString())
  }

  // Contact form validation
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

    // Check for spam patterns
    const spamKeywords = ["viagra", "casino", "lottery", "prize", "winner"]
    const messageContent = data.contactMessage.toLowerCase()
    const hasSpam = spamKeywords.some((keyword) => messageContent.includes(keyword))

    if (hasSpam) {
      errors.push("Message contains prohibited content")
    }

    return errors
  }

  // Booking form validation
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
      errors.push("Please provide a valid UK phone number (e.g., +44 7449 383899)")
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

  // Display validation errors
  const showErrors = (errors, formElement) => {
    // Remove existing error display
    const existingErrorDiv = formElement.querySelector(".validation-errors")
    if (existingErrorDiv) {
      existingErrorDiv.remove()
    }

    // Create new error display
    const errorDiv = document.createElement("div")
    errorDiv.className = "validation-errors"
    errorDiv.style.cssText =
      "background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; color: #ef4444; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;"

    const errorList = document.createElement("ul")
    errorList.style.cssText = "margin: 0; padding-left: 1.5rem;"

    errors.forEach((error) => {
      const li = document.createElement("li")
      li.textContent = error
      errorList.appendChild(li)
    })

    errorDiv.appendChild(errorList)
    formElement.insertBefore(errorDiv, formElement.firstChild)

    // Scroll to error message
    errorDiv.scrollIntoView({ behavior: "smooth", block: "nearest" })
  }

  // Contact Form Validation and Email Submission
  const contactForm = document.getElementById("contactForm")
  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault()

      // Check rate limiting
      const rateCheck = checkRateLimit("contact")
      if (!rateCheck.allowed) {
        showErrors([rateCheck.message], contactForm)
        return
      }

      // Get and sanitize form data
      const formData = {
        contactName: sanitizeInput(document.getElementById("contactName").value),
        contactEmail: sanitizeInput(document.getElementById("contactEmail").value),
        contactSubject: sanitizeInput(document.getElementById("contactSubject").value),
        contactMessage: sanitizeInput(document.getElementById("contactMessage").value),
      }

      // Validate form data
      const validationErrors = validateContactForm(formData)

      if (validationErrors.length > 0) {
        showErrors(validationErrors, contactForm)
        return
      }

      // Set rate limit
      setRateLimit("contact")

      // In production, this would send to your backend API
      console.log("[v0] Contact form validated and ready to submit:", formData)

      // Show success message
      alert(
        `Thank you ${formData.contactName}! Your message has been received. I'll get back to you shortly at ${formData.contactEmail}.`,
      )

      // Reset form and remove any error messages
      contactForm.reset()
      const existingErrorDiv = contactForm.querySelector(".validation-errors")
      if (existingErrorDiv) {
        existingErrorDiv.remove()
      }
    })
  }

  // Booking Form Validation
  const bookingForm = document.getElementById("bookingForm")
  if (bookingForm) {
    bookingForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const name = document.getElementById("demoName").value.trim()
      const date = document.getElementById("demoDate").value
      const time = document.getElementById("demoTime").value
      const guests = document.getElementById("demoGuests").value

      // Validate all fields are filled
      if (!name || !date || !time || !guests) {
        alert("Please fill in all fields before booking.")
        return
      }

      // Show confirmation
      const confirmationMessage = document.getElementById("confirmationMessage")
      const confirmationDiv = document.getElementById("bookingConfirmation")

      const bookingDate = new Date(date).toLocaleDateString("en-GB", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })

      confirmationMessage.textContent = `Booking confirmed for ${name}! ${guests} guest${guests > 1 ? "s" : ""} on ${bookingDate} at ${time}. We look forward to your visit!`
      confirmationDiv.style.display = "block"

      // Reset form
      bookingForm.reset()

      // Hide confirmation after 5 seconds
      setTimeout(() => {
        confirmationDiv.style.display = "none"
      }, 5000)
    })
  }

  // Update active nav link based on current page
  const currentPage = window.location.pathname.split("/").pop() || "index.html"
  const navLinks = document.querySelectorAll(".nav-link")
  navLinks.forEach((link) => {
    const href = link.getAttribute("href")
    if (href === currentPage || (currentPage === "" && href === "index.html")) {
      link.classList.add("active")
    } else {
      link.classList.remove("active")
    }
  })

  // Add smooth scroll to images on hover
  const images = document.querySelectorAll("img")
  images.forEach((img) => {
    img.addEventListener("mouseenter", function () {
      this.style.transition = "transform 0.3s ease"
    })
  })

  // Food Carousel Navigation
  const carouselTrack = document.getElementById("carouselTrack")
  const prevBtn = document.getElementById("prevBtn")
  const nextBtn = document.getElementById("nextBtn")
  const carouselContainer = document.getElementById("carouselContainer")

  if (carouselTrack && prevBtn && nextBtn) {
    const slideWidth = 280
    const gap = 16

    prevBtn.addEventListener("click", () => {
      carouselTrack.scrollBy({
        left: -(slideWidth + gap),
        behavior: "smooth",
      })
    })

    nextBtn.addEventListener("click", () => {
      carouselTrack.scrollBy({
        left: slideWidth + gap,
        behavior: "smooth",
      })
    })

    // Auto-scroll functionality
    let autoScrollInterval
    const startAutoScroll = () => {
      autoScrollInterval = setInterval(() => {
        if (carouselTrack.scrollLeft < carouselTrack.scrollWidth - carouselTrack.clientWidth) {
          carouselTrack.scrollBy({
            left: slideWidth + gap,
            behavior: "smooth",
          })
        } else {
          carouselTrack.scrollBy({
            left: -(carouselTrack.scrollWidth - carouselTrack.clientWidth),
            behavior: "smooth",
          })
        }
      }, 5000)
    }

    const stopAutoScroll = () => clearInterval(autoScrollInterval)

    carouselContainer.addEventListener("mouseenter", stopAutoScroll)
    carouselContainer.addEventListener("mouseleave", startAutoScroll)

    startAutoScroll()
  }

  // Menu Category Switching
  function switchMenuCategory(event, categoryId) {
    const tabs = document.querySelectorAll(".menu-tab")
    const categories = document.querySelectorAll(".menu-category")

    tabs.forEach((tab) => tab.classList.remove("active"))
    categories.forEach((cat) => cat.classList.remove("active"))

    event.target.classList.add("active")
    document.getElementById(categoryId).classList.add("active")
  }

  // Service Options Toggle
  function toggleOption(element, optionType) {
    const allOptions = document.querySelectorAll(".option-card")
    allOptions.forEach((option) => (option.style.borderColor = "#2d4a7b"))
    element.style.borderColor = "#14b8a6"
    alert(`Selected: ${optionType.replace("-", " ").toUpperCase()}`)
  }

  // Location Search
  function searchLocation() {
    const input = document.getElementById("locationInput").value.trim()
    if (input) {
      alert(`Searching for restaurants near: ${input}`)
    } else {
      alert("Please enter a postcode, town, or city")
    }
  }

  // Get Current Location
  function getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude
        const lon = position.coords.longitude
        alert(`Your location: ${lat.toFixed(4)}, ${lon.toFixed(4)}\nSearching nearby restaurants...`)
      })
    } else {
      alert("Geolocation is not supported by your browser")
    }
  }

  // Scroll to Section
  function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId)
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Restaurant Booking Form
  const restaurantBookingForm = document.getElementById("restaurantBookingForm")
  if (restaurantBookingForm) {
    restaurantBookingForm.addEventListener("submit", async (e) => {
      e.preventDefault()

      // Check rate limiting
      const rateCheck = checkRateLimit("booking")
      if (!rateCheck.allowed) {
        showErrors([rateCheck.message], restaurantBookingForm)
        return
      }

      // Get and sanitize form data
      const formData = {
        restaurantName: sanitizeInput(document.getElementById("restaurantName").value),
        restaurantEmail: sanitizeInput(document.getElementById("restaurantEmail").value),
        restaurantPhone: sanitizeInput(document.getElementById("restaurantPhone").value),
        restaurantDate: sanitizeInput(document.getElementById("restaurantDate").value),
        restaurantTime: sanitizeInput(document.getElementById("restaurantTime").value),
        restaurantGuests: sanitizeInput(document.getElementById("restaurantGuests").value),
        restaurantNotes: sanitizeInput(document.getElementById("restaurantNotes").value || ""),
      }

      // Validate form data
      const validationErrors = validateBookingForm(formData)

      if (validationErrors.length > 0) {
        showErrors(validationErrors, restaurantBookingForm)
        return
      }

      // Set rate limit
      setRateLimit("booking")

      // In production, this would send to your backend API
      console.log("[v0] Booking form validated and ready to submit:", formData)

      const bookingDate = new Date(formData.restaurantDate).toLocaleDateString("en-GB", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })

      const confirmationMessage = document.getElementById("bookingMessage")
      const confirmationDiv = document.getElementById("bookingConfirmation")

      confirmationMessage.textContent = `Booking confirmed, ${formData.restaurantName}! Table for ${formData.restaurantGuests} guest${formData.restaurantGuests > 1 ? "s" : ""} on ${bookingDate} at ${formData.restaurantTime}. A confirmation email has been sent to ${formData.restaurantEmail}.`
      confirmationDiv.style.display = "block"

      restaurantBookingForm.reset()

      // Remove any error messages
      const existingErrorDiv = restaurantBookingForm.querySelector(".validation-errors")
      if (existingErrorDiv) {
        existingErrorDiv.remove()
      }

      setTimeout(() => {
        confirmationDiv.style.display = "none"
      }, 6000)
    })
  }

  // Timeline Toggle Functionality
  const timelineButtons = document.querySelectorAll(".timeline-button")
  timelineButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const toggleId = this.getAttribute("data-toggle")
      const content = document.getElementById(toggleId)

      // Close all other open timeline items
      document.querySelectorAll(".timeline-content.active").forEach((item) => {
        if (item.id !== toggleId) {
          item.classList.remove("active")
        }
      })

      document.querySelectorAll(".timeline-button.active").forEach((btn) => {
        if (btn !== this) {
          btn.classList.remove("active")
        }
      })

      // Toggle current item
      if (content) {
        content.classList.toggle("active")
        this.classList.toggle("active")
      }
    })
  })

  // Cookie Consent Banner Functionality
  const cookieBanner = document.getElementById("cookieConsent")
  const acceptAllBtn = document.getElementById("acceptAll")
  const acceptSelectedBtn = document.getElementById("acceptSelected")
  const rejectAllBtn = document.getElementById("rejectAll")
  const analyticsCookies = document.getElementById("analyticsCookies")
  const marketingCookies = document.getElementById("marketingCookies")

  // Check if user has already made a choice
  const cookieConsent = localStorage.getItem("cookieConsent")

  if (!cookieConsent && cookieBanner) {
    // Show banner after a short delay
    setTimeout(() => {
      cookieBanner.classList.add("show")
    }, 1000)
  }

  // Accept all cookies
  if (acceptAllBtn) {
    acceptAllBtn.addEventListener("click", () => {
      const preferences = {
        essential: true,
        analytics: true,
        marketing: true,
        timestamp: new Date().toISOString(),
      }
      localStorage.setItem("cookieConsent", JSON.stringify(preferences))
      hideCookieBanner()
      console.log("[v0] All cookies accepted")
    })
  }

  // Accept selected cookies
  if (acceptSelectedBtn) {
    acceptSelectedBtn.addEventListener("click", () => {
      const preferences = {
        essential: true,
        analytics: analyticsCookies ? analyticsCookies.checked : false,
        marketing: marketingCookies ? marketingCookies.checked : false,
        timestamp: new Date().toISOString(),
      }
      localStorage.setItem("cookieConsent", JSON.stringify(preferences))
      hideCookieBanner()
      console.log("[v0] Selected cookie preferences saved:", preferences)
    })
  }

  // Reject optional cookies
  if (rejectAllBtn) {
    rejectAllBtn.addEventListener("click", () => {
      const preferences = {
        essential: true,
        analytics: false,
        marketing: false,
        timestamp: new Date().toISOString(),
      }
      localStorage.setItem("cookieConsent", JSON.stringify(preferences))
      hideCookieBanner()
      console.log("[v0] Only essential cookies accepted")
    })
  }

  function hideCookieBanner() {
    if (cookieBanner) {
      cookieBanner.classList.remove("show")
      setTimeout(() => {
        cookieBanner.style.display = "none"
      }, 400)
    }
  }
})

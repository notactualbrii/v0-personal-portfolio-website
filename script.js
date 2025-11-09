document.addEventListener("DOMContentLoaded", () => {
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

  // Contact Form Validation and Email Submission
  const contactForm = document.getElementById("contactForm")
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const name = document.getElementById("contactName").value.trim()
      const email = document.getElementById("contactEmail").value.trim()
      const subject = document.getElementById("contactSubject").value.trim()
      const message = document.getElementById("contactMessage").value.trim()

      if (!name || !email || !subject || !message) {
        alert("Please fill in all required fields before submitting.")
        return
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        alert("Please enter a valid email address.")
        return
      }

      alert(`Thank you ${name}! Your message has been received. I'll get back to you shortly at ${email}.`)

      console.log("[v0] Sending email to gheorghebriana5@gmail.com")
      console.log("[v0] From:", email)
      console.log("[v0] Subject:", subject)
      console.log("[v0] Message:", message)

      // In a real application, this would send to the backend
      // sendEmail(name, email, subject, message)

      // Reset form
      contactForm.reset()
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
    restaurantBookingForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const name = document.getElementById("restaurantName").value.trim()
      const email = document.getElementById("restaurantEmail").value.trim()
      const phone = document.getElementById("restaurantPhone").value.trim()
      const date = document.getElementById("restaurantDate").value
      const time = document.getElementById("restaurantTime").value
      const guests = document.getElementById("restaurantGuests").value
      const notes = document.getElementById("restaurantNotes").value.trim()

      if (!name || !email || !phone || !date || !time || !guests) {
        alert("Please fill in all required fields before booking.")
        return
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        alert("Please enter a valid email address.")
        return
      }

      const bookingDate = new Date(date).toLocaleDateString("en-GB", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })

      const confirmationMessage = document.getElementById("bookingMessage")
      const confirmationDiv = document.getElementById("bookingConfirmation")

      confirmationMessage.textContent = `Booking confirmed, ${name}! Table for ${guests} guest${guests > 1 ? "s" : ""} on ${bookingDate} at ${time}. A confirmation email has been sent to ${email}.`
      confirmationDiv.style.display = "block"

      restaurantBookingForm.reset()

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
})

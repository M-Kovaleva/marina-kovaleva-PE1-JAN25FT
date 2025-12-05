document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("register-form")
  const nameInput = document.getElementById("register-name")
  const emailInput = document.getElementById("register-email")
  const passwordInput = document.getElementById("password")
  // Validation
  /**
   * Shows error message in a specified span element
   * @param {string} id ID of the span element to display the error
   * @param {string} message error message to show.
   */
  function showError(id, message) {
    const span = document.getElementById(id)
    span.textContent = message
  }
  /**
   * Clears all error messages and removes error styles from input fields
   */
  function clearErrors() {
    document.querySelectorAll(".register-error-message").forEach(el => el.textContent = "")
    document.querySelectorAll(".register-form-input").forEach(el => el.classList.remove("register-input-error"))
  }
  // Toast and authModal
  const toast = document.getElementById("login-toast-success")
  const authModal = document.getElementById("auth-modal")
  const closeModalBtn = document.getElementById("close-modal")
  /**
   * Shows a success toast message and redirects the user to the login page after 2 seconds
   */
  function showToast() {
    toast.classList.add("show")
    setTimeout(() => {
      toast.classList.remove("show")
      window.location.href = "login.html" // Redirect after registration
    }, 2000)
  }
  /**
   * Opens the authentication modal window and stop scrolling
   */
  function openAuthModal() {
    authModal.style.display = "flex"
    document.body.style.overflow = "hidden"
  }
  /**
   * Closes the authentication modal window and restores scrolling
   */
  function closeAuthModal() {
    authModal.style.display = "none"
    document.body.style.overflow = "auto"
  }
  closeModalBtn.addEventListener("click", closeAuthModal)
  window.addEventListener("click", (e) => {
    if (e.target === authModal) closeAuthModal()
  })
  // Submit form
  /**
   * Handles the registration form submission: validates inputs
   * sends POST request to API, handles responses, and shows feedback
   * @param {Event} e submit event object
   */
  form.addEventListener("submit", async (e) => {
    e.preventDefault() // Stops page reloading
    clearErrors()

    const nameValue = nameInput.value.trim()
    const emailValue = emailInput.value.trim()
    const passwordValue = passwordInput.value.trim()

    let isValid = true
    // Name validation
    if (!nameValue) {
      showError("name-error", "Name is required")
      nameInput.classList.add("register-input-error")
      isValid = false
    } else if (!/^[a-zA-Z0-9_]+$/.test(nameValue)) {
      showError("name-error", "Name can only contain letters, numbers, and underscores")
      nameInput.classList.add("register-input-error")
      isValid = false
    }
    else if (nameValue.length > 20) {
      showError("name-error", "Name must be maximum 20 characters")
      nameInput.classList.add("register-input-error")
      isValid = false
    }
    // Email validation
    if (!emailValue) {
      showError("email-error", "Email is required")
      emailInput.classList.add("register-input-error")
      isValid = false
    } else if (!/^[\w\-.]+@(stud\.)?noroff\.no$/.test(emailValue)) {
      showError("email-error", "Email must be @noroff.no or @stud.noroff.no")
      emailInput.classList.add("register-input-error")
      isValid = false
    }
    // Password validation
    if (!passwordValue) {
      showError("password-error", "Password is required")
      passwordInput.classList.add("register-input-error")
      isValid = false
    } else if (passwordValue.length < 8) {
      showError("password-error", "Password must be at least 8 characters")
      passwordInput.classList.add("register-input-error")
      isValid = false
    }
    if (!isValid) return 
    // Sending POST request to API
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
      name: nameValue,
      email: emailValue,
      password: passwordValue
      }),
    }

    try {
      const response = await fetch("https://v2.api.noroff.dev/auth/register", requestOptions)
      const responseData = await response.json() 

      if (response.status === 201) {
          // Successful registration
          localStorage.setItem("user", JSON.stringify(responseData.data))
          showToast()
      } else if (response.status === 400 && responseData.errors?.some(err => err.message === "Profile already exists")) {
          // Failed - user is already registered
          openAuthModal()
      } else {
          console.warn("Registration error:", response.status, responseData)
          alert("Registration error, please try again.")
      }
    } catch (error) {
      console.error("Network error:", error)
      alert("Network error, please try again later.")
    }
  })
})


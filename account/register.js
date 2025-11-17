document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signup-form")
  const nameInput = document.getElementById("signup-name")
  const emailInput = document.getElementById("signup-email")
  const passwordInput = document.getElementById("password")
  const emailModal = document.getElementById("email-modal")
  const closeEmailModal = document.getElementById("close-email-modal")
  const successModal = document.getElementById("success-modal")
  const closeSuccessModal = document.getElementById("close-success-modal")
  // Modal windows
  function showEmailModal() {
    emailModal.style.display = "flex"
    document.body.style.overflow = "hidden"
  }

  function showSuccessModal() {
    successModal.style.display = "flex"
    document.body.style.overflow = "hidden"
  }

  function closeModal(modal) {
    modal.style.display = "none"
    document.body.style.overflow = "auto"
  }

  closeEmailModal.addEventListener("click", () => closeModal(emailModal))
  closeSuccessModal.addEventListener("click", () => {
    closeModal(successModal)
    window.location.href = "./account/login.html"
  })

  window.addEventListener("click", (e) => {
    if (e.target === emailModal) closeModal(emailModal)
    if (e.target === successModal) {
      closeModal(successModal)
      window.location.href = "./account/login.html"
    }
  })
  // Validation
  function showError(id, message) {
    const span = document.getElementById(id)
    span.textContent = message
  }

  function clearErrors() {
    document.querySelectorAll(".signup__error-message").forEach(el => el.textContent = "")
    document.querySelectorAll(".signup-form__input").forEach(el => el.classList.remove("signup__input--error"))
  }
  // Submit form
  form.addEventListener("submit", async (e) => {
    e.preventDefault()
    clearErrors()

    const nameValue = nameInput.value.trim()
    const emailValue = emailInput.value.trim()
    const passwordValue = passwordInput.value.trim()

    let isValid = true
    // Name validation
    if (!nameValue) {
      showError("name-error", "Name is required")
      nameInput.classList.add("signup__input--error")
      isValid = false
    } else if (!/^[a-zA-Z0-9_]+$/.test(nameValue)) {
      showError("name-error", "Name can only contain letters, numbers, and underscores")
      nameInput.classList.add("signup__input--error")
      isValid = false
    }
    // Email validation
    if (!emailValue) {
      showError("email-error", "Email is required")
      emailInput.classList.add("signup__input--error")
      isValid = false
    } else if (!/^[^\s@]+@stud\.noroff\.no$/.test(emailValue)) {
      showError("email-error", "Email must be a valid stud.noroff.no email")
      emailInput.classList.add("signup__input--error")
      isValid = false
    }
    // Password validation
    if (!passwordValue) {
      showError("password-error", "Password is required")
      passwordInput.classList.add("signup__input--error")
      isValid = false
    } else if (passwordValue.length < 8) {
      showError("password-error", "Password must be at least 8 characters")
      passwordInput.classList.add("signup__input--error")
      isValid = false
    }

    if (!isValid) return
    // Sending POST request to API
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({
        name: nameValue,
        email: emailValue,
        password: passwordValue,
      }),
    }

    try {
      const response = await fetch("https://v2.api.noroff.dev/auth/register", requestOptions)

      if (response.status === 201) {
        const data = await response.json()
    
        localStorage.setItem("user", JSON.stringify(data.data))
        showSuccessModal()
      } else {
        showEmailModal()
        console.warn("Registration error:", response.status, await response.text())
      }
    } catch (error) {
      console.error("Network error:", error)
      alert("Network error, please try again later.")
    }
  })
})


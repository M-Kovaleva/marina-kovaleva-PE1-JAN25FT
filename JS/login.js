document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("login-form")
    const emailInput = document.getElementById("login-email")
    const passwordInput = document.getElementById("login-password")
   

    // Validation
    function showError(id, message) {
        const span = document.getElementById(id)
        span.textContent = message
    }
    function clearErrors() {
        document.querySelectorAll(".login-error-message").forEach(el => el.textContent = "")
        document.querySelectorAll(".login-form-input").forEach(el => el.classList.remove("login-input-error"))
    }
    // Submit form
    form.addEventListener("submit", async (e) => {
        e.preventDefault()
        clearErrors()

        const emailValue = emailInput.value.trim()
        const passwordValue = passwordInput.value.trim()

        let isValid = true
        // Email validation
        if (!emailValue) {
            showError("login-email-error", "Email is required")
            emailInput.classList.add("login-input-error")
            isValid = false
        } else if (!/^[\w\-.]+@(stud\.)?noroff\.no$/.test(emailValue)) {
            showError("login-email-error", "Email must be stud.noroff.no or @stud.noroff.no email")
            emailInput.classList.add("login-input-error")
            isValid = false
        }
        // Passwrd validation
        if (!passwordValue) {
            showError("login-password-error", "Password is required")
            passwordInput.classList.add("login-input-error")
            isValid = false
        }
        if (!isValid) return
        try {
            const response = await fetch("https://v2.api.noroff.dev/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: emailValue,
                    password: passwordValue
                })
            })
            const data = await response.json()

            if (response.ok) {
    localStorage.setItem("accessToken", data.data.accessToken || "")
    localStorage.setItem("user", JSON.stringify({
        id: data.data.id,
        name: data.data.name,
        email: data.data.email
    }))

    showLoginToast()

    setTimeout(() => {
        window.location.href = "index.html"
    }, 2500)

} else {
    // User not found or incorrect password
    openAuthModal()
}

        } catch (error) {
            console.error("Network error:", error)
            alert("Network error, please try again later.")
        }
    })
    function showLoginToast() {
    const toast = document.getElementById("login-toast-success")
    
    toast.classList.add("show")

    setTimeout(() => {
        toast.classList.remove("show")
    }, 2000)
}
// authModal
const authModal = document.getElementById("auth-modal")
const closeModalBtn = document.getElementById("close-modal")

function openAuthModal() {
  authModal.style.display = "flex"
  document.body.style.overflow = "hidden"
}

function closeAuthModal() {
  authModal.style.display = "none"
  document.body.style.overflow = "auto"
}

closeModalBtn.addEventListener("click", closeAuthModal)

window.addEventListener("click", (e) => {
  if (e.target === authModal) closeAuthModal()
})
})

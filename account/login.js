document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("login-form")
    const emailInput = document.getElementById("login-email")
    const passwordInput = document.getElementById("login-password")
    const toastMobile = document.getElementById("login-toast-success-mobile")
    const toastDesktop = document.getElementById("login-toast-success-desktop")
    const closeToastButtons = document.querySelectorAll(".login-toast__close")
    // Show toast
    function showToast() {
        if (window.innerWidth <= 768) {
            toastMobile.hidden = false
        } else {
            toastDesktop.hidden = false
        }
    }
    // Close toast
    function closeToast() {
        toastMobile.hidden = true
        toastDesktop.hidden = true
    }

    closeToastButtons.forEach(btn => {
        btn.addEventListener("click", closeToast)
    })

    window.addEventListener("click", (e) => {
        if (e.target === toastMobile || e.target === toastDesktop) {
            closeToast();
        }
    })
    // Validation
    function showError(id, message) {
        const span = document.getElementById(id)
        span.textContent = message
    }
    function clearErrors() {
        document.querySelectorAll(".login__error-message").forEach(el => el.textContent = "")
        document.querySelectorAll(".login-form__input").forEach(el => el.classList.remove("login__input--error"))
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
            emailInput.classList.add("login__input--error")
            isValid = false
        } else if (!/^[^\s@]+@stud\.noroff\.no$/.test(emailValue)) {
            showError("login-email-error", "Email must be a valid stud.noroff.no email")
            emailInput.classList.add("login__input--error")
            isValid = false
        }
        // Passwrd validation
        if (!passwordValue) {
            showError("login-password-error", "Password is required")
            passwordInput.classList.add("login__input--error")
            isValid = false;
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
                showToast()
                // After 2s redirect to index page
                setTimeout(() => {
                    closeToast()
                    window.location.href = "../index.html"
                }, 4000)
            } else {
                if (data.errors && data.errors[0]?.message) {
                    alert("Login failed: " + data.errors[0].message)
                } else {
                    alert("Invalid email or password.")
                }
            }
        } catch (error) {
            console.error("Network error:", error)
            alert("Network error, please try again later.")
        }
    })
})

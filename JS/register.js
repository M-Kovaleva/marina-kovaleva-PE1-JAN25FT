document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signup-form")
  const nameInput = document.getElementById("signup-name")
  const emailInput = document.getElementById("signup-email")
  const passwordInput = document.getElementById("password")

  
  
  // Validation
  function showError(id, message) {
    const span = document.getElementById(id)
    span.textContent = message
  }

  function clearErrors() {
    document.querySelectorAll(".signup-error-message").forEach(el => el.textContent = "")
    document.querySelectorAll(".signup-form-input").forEach(el => el.classList.remove("signup-input-error"))
  }
  // Toast и Modal
  const toast = document.getElementById("login-toast-success");
  const authModal = document.getElementById("auth-modal");
  const closeModalBtn = document.getElementById("close-modal");
   // ===== Toast =====
  function showToast() {
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
      window.location.href = "login.html"; // перенаправление после успешной регистрации
    }, 2000);
  }

  // ===== Auth Modal =====
  function openAuthModal() {
    authModal.style.display = "flex";
    document.body.style.overflow = "hidden";
  }

  function closeAuthModal() {
    authModal.style.display = "none";
    document.body.style.overflow = "auto";
  }

  closeModalBtn.addEventListener("click", closeAuthModal);

  window.addEventListener("click", (e) => {
    if (e.target === authModal) closeAuthModal();
  });

  // Submit form
   form.addEventListener("submit", async (e) => {
    e.preventDefault(); // Важно! Останавливает перезагрузку страницы
    clearErrors();

    const nameValue = nameInput.value.trim()
    const emailValue = emailInput.value.trim()
    const passwordValue = passwordInput.value.trim()

    let isValid = true
    // Name validation
    if (!nameValue) {
      showError("name-error", "Name is required")
      nameInput.classList.add("signup-input-error")
      isValid = false
    } else if (!/^[a-zA-Z0-9_]+$/.test(nameValue)) {
      showError("name-error", "Name can only contain letters, numbers, and underscores")
      nameInput.classList.add("signup-input-error")
      isValid = false
    }
    else if (nameValue.length > 20) {
      showError("name-error", "Name must be maximum 20 characters")
      nameInput.classList.add("signup-input-error")
      isValid = false
    }
    // Email validation
    if (!emailValue) {
      showError("email-error", "Email is required")
      emailInput.classList.add("signup-input-error")
      isValid = false
    } else if (!/^[\w\-.]+@(stud\.)?noroff\.no$/.test(emailValue)) {
      showError("email-error", "Email must be @noroff.no or @stud.noroff.no")
      emailInput.classList.add("signup-input-error")
      isValid = false
    }
    // Password validation
    if (!passwordValue) {
      showError("password-error", "Password is required")
      passwordInput.classList.add("signup-input-error")
      isValid = false
    } else if (passwordValue.length < 8) {
      showError("password-error", "Password must be at least 8 characters")
      passwordInput.classList.add("signup-input-error")
      isValid = false
    }
    if (!isValid) return; // Если есть ошибки, не отправляем запрос


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
      const responseData = await response.json(); // всегда преобразуем в JSON

      if (response.status === 201) {
          // успешная регистрация
          localStorage.setItem("user", JSON.stringify(responseData.data));
          showToast();
      } else if (response.status === 400 && responseData.errors?.some(err => err.message === "Profile already exists")) {
          // пользователь уже зарегистрирован
          openAuthModal();
      } else {
          console.warn("Registration error:", response.status, responseData);
          alert("Registration error, please try again.");
      }
    } catch (error) {
      console.error("Network error:", error)
      alert("Network error, please try again later.")
    }
  })
})


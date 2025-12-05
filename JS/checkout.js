document.addEventListener("DOMContentLoaded", () => {
    const loader = document.querySelector("#loader") 
    const emailField = document.querySelector("#email")
    const payBtn = document.querySelector("#pay-btn")
    // authModal for empty cart
    const emptyCartModal = document.getElementById("empty-cart-modal")
    const closeEmptyCartModal = document.getElementById("close-empty-cart-modal")
    /**
     * Show loader
     * @returns {void}
     */
    function showLoader() { loader.style.display = "block" }
    /**
     * Hide loader
     * @returns {void}
     */
    function hideLoader() { loader.style.display = "none" }
    /**
     * Displays a modal window when the cart is empty
     * @returns {void}
     */
    function showEmptyCartModal() {
        emptyCartModal.style.display = "flex"
        document.body.style.overflow = "hidden"
    }
    /**
     * Close modal window for empty cart
     * @param {HTMLElement} modal HTML-element for modal window
     * @returns {void}
     */
    function closeModal(modal) {
        modal.style.display = "none"
        document.body.style.overflow = "auto"
    }

    closeEmptyCartModal.addEventListener("click", () => closeModal(emptyCartModal))
    window.addEventListener("click", (e) => {
        if (e.target === emptyCartModal) closeModal(emptyCartModal)
    })

    // Loading products from cart
    const cartItemsContainer = document.querySelector("#cart-items")
    const cartCount = document.querySelector("#cart-count")
    const cartTotal = document.querySelector("#cart-total")
    const checkoutTotals = document.querySelectorAll(".price-total .price")
    const DELIVERY_PRICE = 50
    /**
     * Gets the contents of the cart from localStorage
     * @returns {Array<Object>} array of items in the cart
     */
    function getCart() {
        return JSON.parse(localStorage.getItem("cart")) || []
    }
    /**
     * Renders the cart on the page: list of products, subtotal and total price
     * @async
     * @returns {Promise<void>}
     */
    async function renderCart() {
        showLoader()
        //await new Promise(res => setTimeout(res, 2000)) // Check loader
        const cart = getCart()
        cartItemsContainer.innerHTML = ""
        let subtotal = 0

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = "<p>Your cart is empty</p>"
            cartCount.textContent = "0"
            cartTotal.textContent = "0"
            checkoutTotals.forEach(el => el.textContent = "$0")
            hideLoader()
            return
        }

        cart.forEach(item => {
            const div = document.createElement("div")
            div.className = "cart-item"
            div.innerHTML = `
                <img src="${item.image.url}" class="cart-item-image" alt="${item.image.alt || item.title}">
                <h4 class="cart-item-title">${item.title}</h4>
                <p class="cart-item-price">$${item.price}</p>
            `
            cartItemsContainer.appendChild(div)
            subtotal += item.price
        })
        cartCount.textContent = cart.length
        cartTotal.textContent = subtotal.toFixed(2)
        checkoutTotals.forEach(el =>
            el.textContent = `$${(subtotal + DELIVERY_PRICE).toFixed(2)}`
        )
        hideLoader()
    }

    renderCart()
    // Duplicate contact info into delivery section
    const fields = {
        address: document.querySelector("#address"),
        city: document.querySelector("#city"),
        post: document.querySelector("#post"),
        country: document.querySelector("#country"),
        code: document.querySelector("#code"),
        phone: document.querySelector("#phone"),
    }

    const deliveryFields = {
        address: document.querySelector("#d-address"),
        cityPost: document.querySelector("#d-city-post"),
        country: document.querySelector("#d-country"),
        codePhone: document.querySelector("#d-code-phone"),
    }

    const storedUser = JSON.parse(localStorage.getItem("user"))
    if (storedUser && storedUser.email) {
        emailField.value = storedUser.email
        updateDeliveryInfo()
    }
    /**
     * Updates the delivery section data based on user input
     * @returns {void}
     */
    function updateDeliveryInfo() {
        deliveryFields.address.textContent = fields.address.value
        deliveryFields.cityPost.textContent = (fields.city.value || "") + " " + (fields.post.value || "")
        deliveryFields.country.textContent = fields.country.value
        deliveryFields.codePhone.textContent = (fields.code.value || "") + " " + (fields.phone.value || "")
    }

    Object.values(fields).forEach(input => {
        input.addEventListener("input", updateDeliveryInfo)
    })
    /**
     * Displays error message below form fields
     * @param {string} inputId - ID input field
     * @param {string} message - error text
     * @returns {void}
     */
    function showError(inputId, message) {
        const errorSpan = document.querySelector(`#${inputId}-error`)
        errorSpan.textContent = message
    }
    /**
    * Clear all error in the form
    * @returns {void}
    */
    function clearErrors() {
        document.querySelectorAll(".checkout__error-message").forEach(e => e.textContent = "")
    }
    /**
     * Validats form
     * Checks required fields
     * @returns {boolean} true - if the form is valid, false - if the form is not valid
     */
    function validateForm() {
        clearErrors()
        const requiredFields = ["email","name","surname","address","city","post","country","code","phone"]
        let isValid = true

        requiredFields.forEach(id => {
            const el = document.querySelector(`#${id}`)
            if (!el.value.trim()) {
                isValid = false
                showError(id, "Required field")
            }
        })
        // Email
        const email = document.querySelector("#email").value.trim()
        if (email && !/^[^\s@]+@stud\.noroff\.no$/.test(email)) {
            isValid = false
            showError("email", "Email must be @noroff.no or @stud.noroff.no")
        }
        // First name
        const firstName = document.querySelector("#name").value.trim()
        if (firstName && !/^[A-Za-z-]{1,20}$/.test(firstName)) {
            isValid = false
            showError("name", "First name must be letters or hyphen, max 20 chars")
        }
        // Surname
        const surname = document.querySelector("#surname").value.trim()
        if (surname && !/^[A-Za-z-]{1,20}$/.test(surname)) {
            isValid = false
            showError("surname", "Surname must be letters or hyphen, max 20 chars")
        }
        // Address
        const address = document.querySelector("#address").value.trim()
        if (address && !/^[A-Za-z0-9\s-]{1,40}$/.test(address)) {
            isValid = false
            showError("address", "Address can contain letters, numbers, space, /, -, max 40 chars")
        }
        // City
        const city = document.querySelector("#city").value.trim()
        if (city && !/^[A-Za-z\s]{1,20}$/.test(city)) {
            isValid = false
            showError("city", "City can contain only letters and space, max 20 chars")
        }
        // Post
        const post = document.querySelector("#post").value.trim()
        if (post && !/^\d{1,10}$/.test(post)) {
            isValid = false
            showError("post", "Post can contain only digits, max 10 characters")
        }
        // Country
        const country = document.querySelector("#country").value.trim()
        if (country && !/^[A-Za-z\s]{1,20}$/.test(country)) {
            isValid = false
            showError("country", "Country can contain only letters and space, max 20 chars")
        }
        // Code
        const code = document.querySelector("#code").value.trim()
        if (code && !/^\+\d{1,3}$/.test(code)) {
            isValid = false
            showError("code", "Code must start with '+' followed by 1 to 3 digits")
        }
        // Phone
        const phone = document.querySelector("#phone").value.trim()
        if (phone && !/^\d{1,15}$/.test(phone)) {
            isValid = false
            showError("phone", "Phone must contain only digits and be up to 15 characters")
        }
        // Payment selected
        const paymentSelected = document.querySelector("input[name='payment']:checked")
        if (!paymentSelected) {
            isValid = false
            showError("payment", "Select payment method")
        }
        return isValid
    }
    // Pay order button click
    payBtn.addEventListener("click", function (e) {
        e.preventDefault()
        const cart = getCart()

        if (cart.length === 0) {
            showEmptyCartModal()
            return
        }

        const valid = validateForm()
        if (!valid) return
        const userData = {
        email: document.querySelector("#email").value.trim(),
        firstName: document.querySelector("#name").value.trim(),
        surname: document.querySelector("#surname").value.trim(),
        address: document.querySelector("#address").value.trim(),
        city: document.querySelector("#city").value.trim(),
        post: document.querySelector("#post").value.trim(),
        country: document.querySelector("#country").value.trim(),
        code: document.querySelector("#code").value.trim(),
        phone: document.querySelector("#phone").value.trim(),
    }
    localStorage.setItem("userData", JSON.stringify(userData))
        localStorage.removeItem("cart") // Clear cart
        window.location.href = "success.html"
    })
})

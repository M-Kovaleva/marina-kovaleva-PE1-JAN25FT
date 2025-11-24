const container = document.querySelector("#container")
const loader = document.querySelector("#loader")
const categoryMap = {
    fashion: ["fashion", "shoes", "glasses", "jewelry", "watches", "accessories", "bags", "watch"],
    beauty: ["beauty", "perfume", "skin care", "shampoo"],
    electronics: ["electronics", "audio", "peripherals", "gaming", "computers", "storage", "watch"],
    lifestyle: ["toy", "wearables", "watch", "watches"],
    jewelry: ["jewelry"],
}
const errorContainer = document.querySelector("#products-error")
const API_URL = "https://v2.api.noroff.dev/online-shop"

let allProducts = []
async function fetchAndCreateProducts() {
    showLoader()
    try{
        const responce = await fetch(API_URL)
        const data = await responce.json()
        //await new Promise(res => setTimeout(res, 2000)) // Check loader
        allProducts = data.data

    renderProducts(allProducts)
  } catch (error) {
    errorContainer.textContent = "Failed to load items. Try again later."
    errorContainer.hidden = false
    } 
    finally {
    hideLoader()
    }
}
function renderProducts(products) {
    container.innerHTML = ""
  
    products.forEach(product =>{
        const card = document.createElement("div")
        const image = document.createElement("img")
        const content = document.createElement("div")
        const title = document.createElement("h2")
        const price = document.createElement("p")
        const anchor = document.createElement("a")

        card.className = 'card'
        image.className = 'card-image'
        content.className = 'card-content'
        title.className = 'card-title'
        price.className = 'card-price'
        image.src = product.image.url
        image.alt = product.image.alt || `Image of ${product.title}`
        title.textContent = product.title
        price.textContent = product.price
        //Sale
        if (product.discountedPrice < product.price) {
        price.innerHTML = `
            <span class="old-price">$${product.price}</span>
            <span class="new-price">$${product.discountedPrice}</span>
        `
        } else {
            price.textContent = `$${product.price}`
        }
        anchor.href = `product.html?id=${product.id}`
        anchor.setAttribute("aria-label", `View product ${product.title}`)
        anchor.setAttribute("title", `View details for ${product.title}`)
    
        content.appendChild(title)
        content.appendChild(price)
        card.appendChild(image)
        card.appendChild(content)
        anchor.appendChild(card)
        container.appendChild(anchor)
    })
}    
// Filter by category
const categoryButtons = document.querySelectorAll(".category-btn")
categoryButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
    const category = btn.textContent.trim().toLowerCase()
categoryButtons.forEach(b => b.setAttribute("aria-pressed", "false"))
btn.setAttribute("aria-pressed", "true")
    // Remove active class for all buttons
    categoryButtons.forEach((b) => b.classList.remove("active"))
    // Add active class for current button
    btn.classList.add("active")

    // If "All" is selected, all products will be shown
    if (category === "all") {
        renderProducts(allProducts)
        return
    }
    // Getting a list of tags for a category
    const categoryTags = categoryMap[category] || []
    // Filter products that have at least one matching tag
    const filteredProducts = allProducts.filter((product) =>
        product.tags.some((tag) => categoryTags.includes(tag.toLowerCase()))
    )
    // If nothing is found, a message will be displayed
    if (filteredProducts.length === 0) {
        errorContainer.textContent = "No products found in this category."
        errorContainer.hidden = false
        container.innerHTML = ""
    } else {
        errorContainer.hidden = true
        renderProducts(filteredProducts)
    }
  })
})
// Search by tags
const tagSearchInput = document.querySelector("#tag-search")
const searchBtn = document.querySelector("#search-btn")

function searchByTag() {
  const query = tagSearchInput.value.trim().toLowerCase()

  if (!query) {
    errorContainer.hidden = true
    renderProducts(allProducts)
    return
  }

  const filteredProducts = allProducts.filter((product) =>
    product.tags.some((tag) => tag.toLowerCase().includes(query))
  )

  if (filteredProducts.length === 0) {
    errorContainer.textContent = `No products found for tag: "${query}".`
    errorContainer.hidden = false
    container.innerHTML = ""
  } else {
    errorContainer.hidden = true
    renderProducts(filteredProducts)
  }
}

searchBtn.addEventListener("click", searchByTag)
tagSearchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") searchByTag()
})

//Loader
function showLoader() {
    loader.style.display = "block"
    container.style.display = "none"
}
function hideLoader() {
    loader.style.display = "none"
    container.style.display = "grid"
}


//Login/Logout in the Header
document.addEventListener("DOMContentLoaded", () => {
    const authLink = document.getElementById("auth-link")

    function updateAuthLink() {
        const token = localStorage.getItem("accessToken")

        if (token) {
            // User logged in → change Login → Logout
            authLink.textContent = "Logout"
            authLink.href = "#"
            authLink.addEventListener("click", logout)
        }
    }

    function logout(e) {
        e.preventDefault()

        // Remove all auth data & cart
        localStorage.removeItem("accessToken")
        localStorage.removeItem("user")
        localStorage.removeItem("cart")

        // Reload page
        window.location.reload()
    }

    updateAuthLink()
})

// Carusell
function initLatestCarousel() {
    if (!allProducts.length) return

    const slidesContainer = document.querySelector(".carousel-slides")
    const nextBtn = document.querySelector(".carousel-btn.next")
    const prevBtn = document.querySelector(".carousel-btn.prev")

    slidesContainer.innerHTML = ""

    const selectedProducts = [
        allProducts[5],
        allProducts[1],
        allProducts[12]
    ]

    const customImages = [
        "Images/slide-1-4-bag-red.jpng-removebg-preview.png",
        "Images/slide-2-12-toy-car.png",
        "Images/slide-3-15-watch-black-removebg-preview.png"
    ]

    selectedProducts.forEach((product, index) => {
        if (!product) return

        const slide = document.createElement("div")
        slide.className = "carousel-slide"
        if (index === 0) slide.classList.add("active")

        const img = document.createElement("img")
        img.src = customImages[index]
        img.alt = product.title

        const content = document.createElement("div")
        content.className = "carousel-content"

        content.innerHTML = `
            <h1 class="carousel-hero-title">Luxurious gifts for every occasion</h1>
            <h2 class="carousel-title">${product.title}</h2>
            <p class="carousel-description">${product.description}</p>
            <a class="cta-button" href="product.html?id=${product.id}">See product</a>
        `

        const wrapper = document.createElement("div")
        wrapper.className = "carousel-slide-wrapper"
        wrapper.append(img, content)

        slide.appendChild(wrapper)
        slidesContainer.appendChild(slide)
    })

    const slides = slidesContainer.children
    let currentIndex = 0
    const dotsContainer = document.querySelector(".carousel-dots")
    dotsContainer.innerHTML = ""

    // Carousel dots
    const dots = []

    Array.from(slides).forEach((_, index) => {
        const dot = document.createElement("span")
        dot.classList.add("carousel-dot")
        if (index === 0) dot.classList.add("active")

        dot.addEventListener("click", () => {
            currentIndex = index
            showSlide(currentIndex)
        })

        dotsContainer.appendChild(dot)
        dots.push(dot)
    })

    function showSlide(i) {
        Array.from(slides).forEach(s => s.classList.remove("active"))
        slides[i].classList.add("active")

        dots.forEach(dot => dot.classList.remove("active"))
        dots[i].classList.add("active")
    }

    // Swipe for small desktops
    let startX = 0

    function enableSwipe() {
        nextBtn.style.pointerEvents = "none"
        prevBtn.style.pointerEvents = "none"

        slidesContainer.addEventListener("touchstart", touchStart)
        slidesContainer.addEventListener("touchend", touchEnd)
    }

    function disableSwipe() {
        slidesContainer.removeEventListener("touchstart", touchStart)
        slidesContainer.removeEventListener("touchend", touchEnd)
    }

    function enableButtons() {
        nextBtn.style.pointerEvents = "auto"
        prevBtn.style.pointerEvents = "auto"
    }

    function handleResize() {
        if (window.innerWidth <= 900) {
            disableButtonsLogic()
            enableSwipe()
        } else {
            disableSwipe()
            enableButtonsLogic()
        }
    }

    function disableButtonsLogic() {
        nextBtn.onclick = null
        prevBtn.onclick = null
    }

    function enableButtonsLogic() {
        nextBtn.onclick = () => {
            currentIndex = (currentIndex + 1) % slides.length
            showSlide(currentIndex)
        }

        prevBtn.onclick = () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length
            showSlide(currentIndex)
        }
    }

    function touchStart(e) {
        startX = e.touches[0].clientX
    }

    function touchEnd(e) {
        const endX = e.changedTouches[0].clientX
        const diff = startX - endX

        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                currentIndex = (currentIndex + 1) % slides.length
            } else {
                currentIndex = (currentIndex - 1 + slides.length) % slides.length
            }
            showSlide(currentIndex)
        }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
}
// Launch after all products are loaded
const originalFetch = fetchAndCreateProducts
fetchAndCreateProducts = async function () {
    await originalFetch()
    initLatestCarousel()
}

// Sign up
document.addEventListener("DOMContentLoaded", () => {
  const emailInput = document.getElementById("sign-up-email")
  const emailError = document.getElementById("sign-up-email-error")
  const signupButton = document.querySelector(".sign-up .cta-button")

  function showEmailError(message) {
    emailError.textContent = message
    emailInput.classList.add("sign-up-input--error")
  }

  function clearEmailError() {
    emailError.textContent = ""
    emailInput.classList.remove("sign-up-input--error")
  }

  function validateEmail() {
    const emailValue = emailInput.value.trim()
    clearEmailError()

    let isValid = true

    if (!emailValue) {
      showEmailError("Email is required")
      isValid = false
    } else if (!/^[^\s@]+@stud\.noroff\.no$/.test(emailValue)) {
      showEmailError("Email must be a valid stud.noroff.no email")
      isValid = false
    }

    return isValid
  }
    function showToast(message) {
    const toast = document.createElement("div")
    toast.className = "toast"
    toast.textContent = message
    document.body.appendChild(toast)

    setTimeout(() => {
        toast.classList.add("show")
    }, 100)

    setTimeout(() => {
        toast.classList.remove("show")
        setTimeout(() => toast.remove(), 300)
    }, 3000)
    }

    signupButton.addEventListener("click", (e) => {
    e.preventDefault()

    if (!validateEmail()) return

    emailInput.value = ""
    showToast("You have successfully subscribed to the newsletter ✅")
    })
  // Validation
  emailInput.addEventListener("input", clearEmailError)
})

fetchAndCreateProducts()
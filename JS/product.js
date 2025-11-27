const container = document.querySelector("#product-container")
const loader = document.querySelector("#loader")
const errorContainer = document.querySelector("#products-error")
const reviewsContainer = document.querySelector("#reviews-container")
const reviewsSection = document.querySelector("#product-reviews-section")
const navPage = document.querySelector(".nav-page")
const breadcrumbLink = navPage.querySelector('a[aria-current="page"]')
const alsoContainer = document.querySelector("#also-container")
const params = new URLSearchParams(window.location.search)
const id = params.get("id")
const API_URL = "https://v2.api.noroff.dev/online-shop"

// Обновляем breadcrumb с id продукта
if (id && breadcrumbLink) {
    breadcrumbLink.href = `product.html?id=${id}`
}

// --- Функции Loader ---
function showLoader() {
    loader.style.display = "block"
    container.style.display = "none"
}
function hideLoader() {
    loader.style.display = "none"
    container.style.display = "block"
}

// --- Модальное окно авторизации ---
const authModal = document.getElementById("auth-modal")
const closeModalBtn = document.getElementById("close-modal")
authModal.setAttribute("tabindex", "-1")
authModal.focus()

function openAuthModal() {
    authModal.style.display = "flex"
    document.body.style.overflow = "hidden"
}
function closeAuthModal() {
    authModal.style.display = "none"
    document.body.style.overflow = "auto"
}
closeModalBtn.addEventListener("click", closeAuthModal)
window.addEventListener("click", (e) => { if (e.target === authModal) closeAuthModal() })

// --- Toast ---
function showToast(message) {
    let toast = document.createElement("div")
    toast.className = "toast"
    toast.textContent = message
    document.body.appendChild(toast)
    setTimeout(() => toast.classList.add("show"), 100)
    setTimeout(() => {
        toast.classList.remove("show")
        setTimeout(() => toast.remove(), 300)
    }, 3000)
}

// --- Добавление в корзину ---
function addToCart(product) {
    const cart = JSON.parse(localStorage.getItem("cart")) || []
    cart.push({
        id: product.id,
        title: product.title,
        price: product.discountedPrice < product.price ? product.discountedPrice : product.price,
        image: product.image
    })
    localStorage.setItem("cart", JSON.stringify(cart))
    showToast(`1 × ${product.title} added to cart ✅`)
}

// --- Рендер основного продукта ---
async function fetchAndCreateProducts() {
    showLoader()
    try {
        if (!id) {
            errorContainer.textContent = "No product ID provided!"
            errorContainer.hidden = false
            container.innerHTML = ""
            return
        }

        const response = await fetch(`${API_URL}/${id}`)
        const data = await response.json()
        const product = data.data

        // --- Создаем DOM элементы ---
        const productDiv = document.createElement("div")
        const imageWrapper = document.createElement("div")
        const infoWrapper = document.createElement("div")
        const buttonsWrapper = document.createElement("div")
        const layoutWrapper = document.createElement("div")
        const image = document.createElement("img")
        const title = document.createElement("h2")
        const rating = document.createElement("p")
        const price = document.createElement("p")
        const description = document.createElement("p")
        const addButton = document.createElement("button")
        const goToCartBtn = document.createElement("a")
        const shareButton = document.createElement("button")

        productDiv.className = "product-layout"
        imageWrapper.className = "product-image-wrapper"
        infoWrapper.className = "product-info"
        buttonsWrapper.className = "product-buttons-row"
        layoutWrapper.className = "product-layout-wrapper"

        image.className = "product-image"
        image.src = product.image.url
        image.alt = product.image.alt || `Image of ${product.title}`
        title.className = "product-title"
        title.textContent = product.title
        rating.className = "product-rating"
        rating.innerHTML = `Rating: ${"⭐".repeat(Math.round(product.rating))} (${product.rating})`
        rating.setAttribute("aria-label", `Rating ${product.rating} out of 5`)
        price.className = "product-price"
        price.innerHTML = product.discountedPrice < product.price ?
            `<span class="old-price">$${product.price}</span> <span class="new-price">$${product.discountedPrice}</span>` :
            `$${product.price}`
        description.className = "product-description"
        description.textContent = product.description

        addButton.className = "cta-button"
        addButton.textContent = "Add to cart"
        addButton.setAttribute("aria-label", `Add ${product.title} to cart`)
        addButton.setAttribute("title", `Add ${product.title} to cart`)

        goToCartBtn.className = "active-link"
        goToCartBtn.href = "cart.html"
        goToCartBtn.textContent = "Go to cart"
        const user = JSON.parse(localStorage.getItem("user"))
        goToCartBtn.style.display = user ? "inline-block" : "none"

        shareButton.className = "share-button"
        shareButton.innerHTML = `<i class="fa-solid fa-share-nodes"></i> Share`
        shareButton.setAttribute("aria-label", `Share ${product.title}`)
        shareButton.setAttribute("title", `Share ${product.title}`)

        // --- Добавляем обработчики ---
        addButton.addEventListener("click", () => {
            const user = JSON.parse(localStorage.getItem("user"))
            if (!user) openAuthModal()
            else addToCart(product)
        })

        shareButton.addEventListener("click", async () => {
            const shareUrl = `${window.location.origin}${window.location.pathname}?id=${product.id}`
            if (navigator.share) {
                try { await navigator.share({ title: product.title, text: "Check out this product!", url: shareUrl }) }
                catch (err) { console.warn("Share canceled or failed:", err) }
            } else {
                navigator.clipboard.writeText(shareUrl)
                showToast("Product link copied to clipboard.")
            }
        })

        // --- Сборка DOM ---
        imageWrapper.appendChild(image)
        buttonsWrapper.append(addButton, shareButton)
        infoWrapper.append(title, rating, price, description, buttonsWrapper, goToCartBtn)
        infoWrapper.appendChild(reviewsSection)
        productDiv.append(imageWrapper, infoWrapper)
        layoutWrapper.appendChild(productDiv)
        container.prepend(navPage)
        container.appendChild(layoutWrapper)

        // --- Рендер отзывов ---
        if (product.reviews && product.reviews.length > 0) {
            reviewsContainer.innerHTML = ""
            product.reviews.forEach(review => {
                const reviewCard = document.createElement("div")
                reviewCard.className = "review-card"
                reviewCard.innerHTML = `<h3>${review.username}</h3><p>${"⭐".repeat(review.rating)}</p><p>${review.description}</p>`
                reviewsContainer.appendChild(reviewCard)
            })
        } else {
            reviewsContainer.innerHTML = `<p>No reviews yet for this product.</p>`
        }

    } catch (error) {
        errorContainer.textContent = "Failed to load product. Try again later."
        errorContainer.hidden = false
        container.innerHTML = ""
        console.error(error)
    } finally {
        hideLoader()
    }
}

// --- Рендер "You might also like" ---
function renderAlsoProducts(products) {
    alsoContainer.innerHTML = ""
    products.forEach(product => {
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
        price.innerHTML = product.discountedPrice < product.price ?
            `<span class="old-price">$${product.price}</span> <span class="new-price">$${product.discountedPrice}</span>` :
            `$${product.price}`

        anchor.href = `product.html?id=${product.id}`
        anchor.setAttribute("aria-label", `View product ${product.title}`)
        anchor.setAttribute("title", `View details for ${product.title}`)

        content.append(title, price)
        card.append(image, content)
        anchor.appendChild(card)
        alsoContainer.appendChild(anchor)
    })
}

async function loadAlsoProducts(currentId) {
    try {
        const response = await fetch(API_URL)
        const data = await response.json()
        const allProducts = data.data
        const filtered = allProducts.filter(p => p.id !== currentId)
        const shuffled = filtered.sort(() => 0.5 - Math.random()).slice(0, 6)
        renderAlsoProducts(shuffled)
    } catch (error) {
        alsoContainer.innerHTML = `<p>Failed to load related products.</p>`
        console.error(error)
    }
}

// --- Инициализация страницы ---
async function initProductPage() {
    await fetchAndCreateProducts()
    if (id) loadAlsoProducts(id)
}

initProductPage()

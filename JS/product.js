const container = document.querySelector("#product-container")
const loader = document.querySelector("#loader")
const errorContainer = document.querySelector("#products-error")
const reviewsContainer = document.querySelector("#reviews-container")
const reviewsSection = document.querySelector("#product-reviews-section")
const navPage = document.querySelector(".nav-page")
const breadcrumbLink = navPage.querySelector('a[aria-current="page"]')
const params = new URLSearchParams(window.location.search)
const id = params.get("id")

if (id && breadcrumbLink) {
  breadcrumbLink.href = `product.html?id=${id}`
}
const API_URL = "https://v2.api.noroff.dev/online-shop"
async function fetchAndCreateProducts() {
  showLoader()
  try {
    const params = new URLSearchParams(window.location.search)
    const id = params.get("id")
    if (!id) {
      errorContainer.textContent = "No product ID provided!"
      errorContainer.hidden = false
      container.innerHTML = ""
      return
    }
    const response = await fetch(`${API_URL}/${id}`)
    const data = await response.json()
    const product = data.data
    const productDiv = document.createElement("div")
    const image = document.createElement("img")
    const title = document.createElement("h2")
    const tags = document.createElement("p")
    const rating = document.createElement("p")
    const price = document.createElement("p")
    const description = document.createElement("p")
    const addButton = document.createElement("button")
    const goToCartBtn = document.createElement("a")
    const shareButton = document.createElement("button")
    const imageWrapper = document.createElement("div")
    const infoWrapper = document.createElement("div")
    const buttonsWrapper = document.createElement("div")
    const layoutWrapper = document.createElement("div")
  
    productDiv.className = "product-layout"
    imageWrapper.className = "product-image-wrapper"
    infoWrapper.className = "product-info"
    image.className = "product-image"
    title.className = "product-title"
    tags.className = "product-tags"
    rating.className = "product-rating"
    price.className = "product-price"
    description.className = "product-description"
    addButton.className = "cta-button"
    goToCartBtn.className = "active-link"
    shareButton.className = "share-button"
    image.src = product.image.url
    image.alt = product.image.alt || `Image of ${product.title}`
    title.textContent = product.title
    tags.textContent = product.tags
    rating.innerHTML = `Rating: ${"⭐".repeat(Math.round(product.rating))} (${product.rating})`
    rating.setAttribute("aria-label", `Rating ${product.rating} out of 5`)
    price.textContent = product.price
    description.textContent = product.description
    buttonsWrapper.className = "product-buttons-row"
    layoutWrapper.className = "product-layout-wrapper"

    const tagsArray = product.tags || []
    const tagsContainer = document.createElement("div")
    tagsContainer.className = "product-tags-container"

    tagsArray.forEach(tag => {
      const tagBtn = document.createElement("span")
      tagBtn.className = "product-tag"
      tagBtn.textContent = tag
      tagsContainer.appendChild(tagBtn)
    })

    // Sale
    if (product.discountedPrice < product.price) {
        price.innerHTML = `
            <span class="old-price">$${product.price}</span>
            <span class="new-price">$${product.discountedPrice}</span>
        `
        } else {
            price.textContent = `$${product.price}`
        }
    description.textContent = product.description
    // Rviews
    if (product.reviews && product.reviews.length > 0) {
      reviewsContainer.innerHTML = "" // clean
      product.reviews.forEach((review) => {
        const reviewCard = document.createElement("div")
        reviewCard.className = "review-card"
        const user = document.createElement("h3")
        user.textContent = review.username
        const stars = document.createElement("p")
        stars.textContent = "⭐".repeat(review.rating)
        const text = document.createElement("p")
        text.textContent = review.description
        reviewCard.append(user, stars, text)
        reviewsContainer.appendChild(reviewCard)
      })
    } else {
      reviewsContainer.innerHTML = `<p>No reviews yet for this product.</p>`
    }
    addButton.textContent = "Add to cart"
    addButton.setAttribute("aria-label", `Add ${product.title} to cart`)
    addButton.setAttribute("title", `Add ${product.title} to cart`)
    goToCartBtn.href = "cart.html"
    goToCartBtn.textContent = "Go to cart"
    goToCartBtn.setAttribute("aria-label", "Go to shopping cart")
    goToCartBtn.setAttribute("title", "Go to shopping cart")
    shareButton.innerHTML = `<i class="fa-solid fa-share-nodes"></i> Share`
    shareButton.setAttribute("aria-label", `Share ${product.title}`)
    shareButton.setAttribute("title", `Share ${product.title}`)
    // Show "Go to cart" only for logged users
    const user = JSON.parse(localStorage.getItem("user"))
    if (!user) {
        goToCartBtn.style.display = "none" // hide
    } else {
        goToCartBtn.style.display = "inline-block" // show
    }
    // Login/Register modal window
    addButton.addEventListener("click", () => {
        const user = JSON.parse(localStorage.getItem("user"))
        if (!user) {
            openAuthModal()
        } else {
            addToCart(product)
            showToast(`1 × ${product.title} added to cart ✅`)
        }
    })
    // Copy the link with the product ID
    shareButton.addEventListener("click", async () => {
        const shareUrl = `${window.location.origin}${window.location.pathname}?id=${product.id}`
        // Use the browser's native API if available
        if (navigator.share) {
            try {
                await navigator.share({
                    title: product.title,
                    text: "Check out this product!",
                    url: shareUrl,
                })
            } catch (err) {
                console.warn("Share canceled or failed:", err)
             }
        } else {
    // Copy the link
    navigator.clipboard.writeText(shareUrl)
    showToast("Product link copied to clipboard.")
  }
})
    imageWrapper.appendChild(image)
    buttonsWrapper.append(addButton, shareButton)
    infoWrapper.append(
      title,
      tagsContainer,
      rating,
      price,
      description,
      buttonsWrapper,
      goToCartBtn
    )
    infoWrapper.appendChild(reviewsSection)
    productDiv.append(imageWrapper, infoWrapper)
    layoutWrapper.appendChild(productDiv)
    container.prepend(navPage)
    container.appendChild(layoutWrapper)

  } catch (error) {
    errorContainer.textContent = "Failed to load product. Try again later."
    errorContainer.hidden = false
    container.innerHTML = ""
  } finally {
    hideLoader()
  }
}
function addToCart(product) {
  const cart = JSON.parse(localStorage.getItem("cart")) || []
  cart.push({
    id: product.id,
    title: product.title,
    price:
      product.discountedPrice < product.price
        ? product.discountedPrice
        : product.price,
    image: product.image,
  })
  localStorage.setItem("cart", JSON.stringify(cart))
}
// Toast message
function showToast(message) {
    let toast = document.createElement("div")
    toast.className = "toast"
  toast.textContent = message
  document.body.appendChild(toast)
  // Message appearance animation
  setTimeout(() => {
    toast.classList.add("show")
  }, 100)
  // Notification disappears after 3 seconds
  setTimeout(() => {
    toast.classList.remove("show")
    setTimeout(() => toast.remove(), 300)
  }, 3000)
}
// Login/Register modal window
const authModal = document.getElementById("auth-modal")
const closeModalBtn = document.getElementById("close-modal")
authModal.setAttribute("tabindex", "-1")
authModal.focus()
function openAuthModal() {
  authModal.style.display = "flex"  // show
  document.body.style.overflow = "hidden"
}
function closeAuthModal() {
  authModal.style.display = "none" // hide
  document.body.style.overflow = "auto"
}
closeModalBtn.addEventListener("click", closeAuthModal)
window.addEventListener("click", (e) => {
  if (e.target === authModal) closeAuthModal()
})
function showLoader() {
  loader.style.display = "block"
  container.style.display = "none"
}
function hideLoader() {
  loader.style.display = "none"
  container.style.display = "block"
}

fetchAndCreateProducts()

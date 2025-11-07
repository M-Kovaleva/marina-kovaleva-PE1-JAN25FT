const container = document.querySelector("#product-container")
const loader = document.querySelector("#loader")
const errorContainer = document.querySelector("#products-error")
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
    const price = document.createElement("p")
    const description = document.createElement("p")
    const addButton = document.createElement("button")
    const goToCartBtn = document.createElement("a")

    productDiv.className = "product-details"
    image.className = "product-image"
    title.className = "product-title"
    price.className = "product-price"
    description.className = "product-description"
    addButton.className = "cta-button"
    goToCartBtn.className = "active"

    image.src = product.image.url
    image.alt = product.image.alt || product.title
    title.textContent = product.title
    price.textContent = product.price
    description.textContent = product.description

    // Sale
    if (product.discountedPrice < product.price) {
        price.innerHTML = `
            <span class="old-price">$${product.price}</span>
            <span class="new-price">$${product.discountedPrice}</span>
        `
        } else {
            price.textContent = `$${product.price}`;
        }

    description.textContent = product.description
    addButton.textContent = "Add to cart"
    goToCartBtn.href = "cart.html"
    goToCartBtn.textContent = "Go to cart"

    addButton.addEventListener("click", () => {
      addToCart(product);
      showToast(`${product.title} added to cart`);
    })

    productDiv.appendChild(image)
    productDiv.appendChild(title)
    productDiv.appendChild(price)
    productDiv.appendChild(description)
    productDiv.appendChild(addButton)
    productDiv.appendChild(goToCartBtn)
    container.appendChild(productDiv)
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
  });
  localStorage.setItem("cart", JSON.stringify(cart))
}
// Pop-up message
function showToast(message) {
    let toast = document.createElement("div");
    toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);

  // Message appearance animation
  setTimeout(() => {
    toast.classList.add("show");
  }, 100);

  // Notification disappears after 3 seconds
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function showLoader() {
  loader.style.display = "block";
  container.style.display = "none";
}

function hideLoader() {
  loader.style.display = "none";
  container.style.display = "grid";
}

fetchAndCreateProducts();
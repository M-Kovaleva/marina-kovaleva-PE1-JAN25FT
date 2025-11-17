const cartItemsContainer = document.querySelector("#cart-items")
const cartCount = document.querySelector("#cart-count")
const cartTotal = document.querySelector("#cart-total")
const cartEmpty = document.querySelector("#cart-empty")
const loader = document.querySelector("#loader")
const cartError = document.querySelector("#cart-error")
const checkoutButton = document.querySelector("#checkout-button")

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || []
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart))
}

function renderCart() {
  showLoader()
  try {
    const cart = getCart()
    cartItemsContainer.replaceChildren()

    if (cart.length === 0) {
      cartEmpty.hidden = false
      cartCount.textContent = "0"
      cartTotal.textContent = "0"
      checkoutButton.style.display = "none"
      hideLoader()
      return
    }

    cartEmpty.hidden = true
    let total = 0
    let count = 0
    /*throw new Error("Test error in renderCart")//error checking*/
    cart.forEach((item, index) => {

      const itemDiv = document.createElement("div")
      const img = document.createElement("img")
      const title = document.createElement("h3")
      const price = document.createElement("p")
      const removeBtn = document.createElement("span")
      
      itemDiv.className = "cart-item"
      img.className = "cart-item-image"
      title.className = "cart-item-title"
      price.className = "cart-item-price"
      removeBtn.className = "remove-link"
      
      
      img.src = item.image.url
      img.alt = item.image.alt
      title.textContent = item.title
      price.textContent = `$${item.price}`
      removeBtn.textContent = "Remove"
      
      removeBtn.addEventListener("click", () => {
        removeFromCart(index)
      })

      itemDiv.append(img, title, price, removeBtn)
      cartItemsContainer.appendChild(itemDiv)

      total += item.price
      count += 1
    })

    cartCount.textContent = count
    cartTotal.textContent = total.toFixed(2)

    checkoutButton.style.display = count > 0 ? "inline-block" : "none"

  } catch (error) {
    cartError.textContent = "Failed to load cart. Try again later."
    cartError.hidden = false
    cartItemsContainer.innerHTML = ""
    checkoutButton.style.display = "none"
  } finally {
    hideLoader()
  }
}

function removeFromCart(index) {
  const cart = getCart()
  cart.splice(index, 1)
  saveCart(cart)
  renderCart()
}

function showLoader() {
  loader.style.display = "block"
}

function hideLoader() {
  loader.style.display = "none"
}

checkoutButton.addEventListener("click", () => {
  window.location.href = "checkout.html"
})
renderCart()
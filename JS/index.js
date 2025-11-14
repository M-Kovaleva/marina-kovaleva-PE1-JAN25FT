const container = document.querySelector("#container")
const loader = document.querySelector("#loader")
const categoryMap = {
    fashion: ["fashion", "shoes", "glasses", "jewelry", "watches", "accessories", "bags", "watch"],
    beauty: ["beauty", "perfume", "skin care", "shampoo"],
    electronics: ["electronics", "audio", "peripherals", "gaming", "computers", "storage", "watch"],
    lifestyle: ["toy", "wearables", "watch", "watches"]
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
        content.className = 'card-content"'
        title.className = 'card-title'
        price.className = 'card-price'
        image.src = product.image.url
        image.alt = product.image.alt
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

searchBtn.addEventListener("click", searchByTag);
tagSearchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") searchByTag();
});

//Loader
function showLoader() {
    loader.style.display = "block"
    container.style.display = "none"
}
function hideLoader() {
    loader.style.display = "none"
    container.style.display = "grid"
}

//Scroll
/*const catalogBtn = document.querySelector(".cta-button")
const productsSection = document.querySelector("#products")

if (productsSection) {
    catalogBtn.addEventListener("click", () => {
    productsSection.scrollIntoView({ behavior: "smooth" })
  })
}*/

//Carusel
const image = [
    "./Images/3-headphones-beats.jpg",
    "./Images/16-smartwatch.jpg",
    "./Images/8-perfume-pink-candy.jpg",
]
const slider = document.querySelector("#slider")
const prevBtn = document.querySelector("#btn-prev")
const nextBtn = document.querySelector("#btn-next")
const setupSlider = () => {
    ImageTrackList.forEach((imageUrl, index) => {
        const img = document.createElement("img")
        img.src = imageUrl
        img.dataset.index = index
        img.alt = `slide ${index + 1}`
        slider.appendChild(img)
    })
}
fetchAndCreateProducts()
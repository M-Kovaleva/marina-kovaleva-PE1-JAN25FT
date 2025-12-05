//Login/Logout in the Header
export function initAuthLink(authLinkId = "auth-link") {
    const authLink = document.getElementById(authLinkId)
    if (!authLink) return
    /**
     * Logs out with removing all authentication info and cart data
     * @param {Event} e - The click event
    */
    function logout(e) {
        e.preventDefault()
        // Remove all auth data & cart
        localStorage.removeItem("accessToken")
        localStorage.removeItem("user")
        localStorage.removeItem("cart")
        // Reload page
        window.location.reload()
    }
    /**
     * Updates the authentication link in the header based on loged in/not logged in state
     * Shows logout icon if the user is logged in
    */
    function updateAuthLink() {
        const token = localStorage.getItem("accessToken")
        if (token) {
            authLink.innerHTML = `<i class="fa-solid fa-arrow-right-from-bracket" aria-hidden="true"></i>`
            authLink.href = "#"
            authLink.setAttribute("title", "Logout")
            authLink.addEventListener("click", logout)
        }
    }

    document.addEventListener("DOMContentLoaded", updateAuthLink)
}
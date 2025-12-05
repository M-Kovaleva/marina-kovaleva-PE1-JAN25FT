/**
 * Displays the success page with user data retrieved from localStorage
 * After displaying removes the data from cart
 */
document.addEventListener("DOMContentLoaded", () => {
    const userData = JSON.parse(localStorage.getItem("userData"))

    if (userData) {
        document.getElementById("success-email").textContent = userData.email
        document.getElementById("success-phone").textContent = `${userData.code} ${userData.phone}`
        document.getElementById("success-name").textContent = `${userData.firstName} ${userData.surname}`
        document.getElementById("success-address").textContent = `${userData.address}, ${userData.city} ${userData.post}, ${userData.country}`
        
        localStorage.removeItem("userData")
    }
})
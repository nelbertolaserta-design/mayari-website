
// Mayari SMP website JavaScript

console.log("Welcome to Mayari SMP!");

document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", function () {
        console.log("Navigating to:", this.getAttribute("href"));
    });
});
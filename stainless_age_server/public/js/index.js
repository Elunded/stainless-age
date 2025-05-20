
document.addEventListener("DOMContentLoaded", async () => {
    const reviewsContainer = document.getElementById("reviews-container");

    const response = await fetch('/reviews/9'); // Отримуємо відгуки з сервера
    const reviews = await response.json();

    reviews.forEach(review => {
        const reviewElement = document.createElement("div");
        reviewElement.classList.add("review-card");

        // 🔹 Генерація зірочок за рейтингом (від 1 до 5)
        let starsHTML = "";
        for (let i = 0; i < review.rating; i++) {
            starsHTML += "⭐";
        }

        reviewElement.innerHTML = `
            <h4 class="review-product">${review.product_name}</h4>
            <p class="review-rating">${starsHTML}</p>
            <p class="review-text">"${review.review_text}"</p>
            <p class="review-author">— ${review.user_name}</p>
        `;
        reviewsContainer.appendChild(reviewElement);
    });
});
document.addEventListener("DOMContentLoaded", () => {
    if (window.location.hash === "#reviews-section") {
        const reviewsSection = document.getElementById("reviews-section");
        if (reviewsSection) {
            setTimeout(() => { 
                reviewsSection.scrollIntoView({ behavior: "smooth" }); 
            }, 200); // Коротка затримка для коректного завантаження сторінки
        }
    }
});




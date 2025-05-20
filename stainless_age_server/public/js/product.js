document.addEventListener('DOMContentLoaded', () => {
    // Отримуємо productId з URL. Припускаємо, що URL має вигляд /product/123
    const productId = window.location.pathname.split('/').pop();
    
    // Отримуємо елемент кнопки "Додати до кошика"
    const cartButton = document.querySelector('.cart-button');

    // Отримуємо дані продукту у форматі JSON
    fetch(`/product/${productId}?format=json`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(product => {
            // Формуємо об'єкт з даними продукту для кошика
            const productData = {
                id: product.id,
                name: product.name,
                price: product.price,
                image_url: product.image_url // використовується, якщо потрібно відображати мініатюру у кошику
            };

            // Додаємо обробник кліку по кнопці "Додати до кошика"
            cartButton.addEventListener('click', () => {
                addToCart(productData);
            });
        })
        .catch(error => console.error("Не вдалося отримати дані про продукт:", error));

    // Функція додавання товару до кошика (збереженого в localStorage)
    function addToCart(product) {
        // Завантажуємо кошик з localStorage або створюємо порожній масив, якщо кошик не існує
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Якщо товар уже є в кошику – збільшуємо його кількість
        const existingItemIndex = cart.findIndex(item => item.id === product.id);
        if (existingItemIndex !== -1) {
            cart[existingItemIndex].quantity++;
        } else {
            // Якщо товару немає – додаємо його з початковою кількістю 1
            product.quantity = 1;
            cart.push(product);
        }
        
        // Оновлюємо кошик в localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Відображаємо спливаюче повідомлення
        showNotification("Товар додано до кошика");

        logCart();
    }

    function logCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    console.log("Масив кошика:", cart);
}

    // Завантаження відгуків для поточного товару
    fetch(`/reviews/product/${productId}`)
    .then(response => response.json())
    .then(reviews => {
        const reviewsContainer = document.getElementById('reviews-container');
        if (reviews && reviews.length > 0) {
            reviews.forEach(review => {
                const reviewElement = document.createElement('div');
                reviewElement.classList.add('review-card');
                
                let stars = '';
                for (let i = 0; i < review.rating; i++) {
                    stars += '⭐';
                }
                
                reviewElement.innerHTML = `
                    <p class="review-rating">${stars}</p>
                    <p class="review-text">${review.review_text}</p>
                    <p class="review-author">— ${review.user_name}</p>
                `;
                reviewsContainer.appendChild(reviewElement);
            });
        } else {
            reviewsContainer.innerHTML = '<p>Немає відгуків.</p>';
        }
    })
    .catch(error => {
        console.error('Помилка завантаження відгуків:', error);
        document.getElementById('reviews-container').innerHTML = '<p>Не вдалося завантажити відгуки.</p>';
    });
});




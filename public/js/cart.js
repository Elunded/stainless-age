document.addEventListener("DOMContentLoaded", () => {
  // Отримуємо елементи сторінки кошика
  const cartItemsContainer = document.getElementById("cart-items");
  const totalPriceElement = document.getElementById("total-price");
  const checkoutBtn = document.getElementById("checkout-btn");

  // Завантажуємо кошик з localStorage або створюємо порожній масив, якщо його ще немає
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  /**
   * Функція updateCart оновлює відображення товарів у кошику та обчислює загальну суму.
   */
  let total = 0;
  function updateCart() {
    // Очищуємо контейнер, в який вставляємо товари
    cartItemsContainer.innerHTML = "";

    // Якщо кошик порожній, відображаємо повідомлення та встановлюємо суму 0
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = "<p>Ваш кошик порожній.</p>";
      totalPriceElement.textContent = "0";
      return;
    }

    total = 0; // Накопичуємо загальну суму кошика

    // Проходимо по кожному продукту в кошику
    cart.forEach((product, index) => {
      // Переконуємося, що значення ціни є числом.
      // Якщо product.price – це рядок, Number(product.price) поверне число.
      const price = Number(product.price);

      // Обчислюємо загальну суму
      total += price * product.quantity;

      // Створюємо HTML-елемент для товару
      const cartItem = document.createElement("div");
      cartItem.classList.add("cart-item");

      // Використовуємо product.image_url або fallback (product_placeholder.jpg)
      const imageUrl = product.image_url || '/images/product_placeholder.jpg';
      
      // Формуємо HTML для відображення товару, використовуючи перетворену ціну
      cartItem.innerHTML = `
        <img src="/images/${imageUrl}" alt="${product.name}" onerror="this.src='/images/product_placeholder.jpg'">
        <div class="cart-item-details">
          <h3>${product.name}</h3>
          <p>${price.toFixed(2)} грн x ${product.quantity}</p>
        </div>
        <div class="cart-item-controls">
          <button data-index="${index}" class="increase-btn">+</button>
          <button data-index="${index}" class="decrease-btn">-</button>
          <button data-index="${index}" class="remove-btn">❌</button>
        </div>
      `;

      // Додаємо елемент товару у контейнер
      cartItemsContainer.appendChild(cartItem);
    });

    // Відображаємо загальну суму
    totalPriceElement.textContent = total.toFixed(2);

    // Встановлюємо обробники подій для кнопок управління
    setupEventListeners();
  }

  /**
   * Функція setupEventListeners встановлює обробники для кнопок:
   * - "increase-btn": збільшує кількість товару,
   * - "decrease-btn": зменшує кількість (або видаляє товар, якщо кількість = 1),
   * - "remove-btn": видаляє товар із кошика.
   */
  function setupEventListeners() {
    // Кожна кнопка "+" збільшує кількість відповідного товару
    document.querySelectorAll(".increase-btn").forEach(button => {
      button.addEventListener("click", () => {
        const index = button.dataset.index;
        cart[index].quantity++;
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCart();
      });
    });

    // Кожна кнопка "-" зменшує кількість або видаляє товар, якщо кількість = 1
    document.querySelectorAll(".decrease-btn").forEach(button => {
      button.addEventListener("click", () => {
        const index = button.dataset.index;
        if (cart[index].quantity > 1) {
          cart[index].quantity--;
        } else {
          cart.splice(index, 1);
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCart();
      });
    });

    // Кожна кнопка "❌" видаляє товар повністю із кошика
    document.querySelectorAll(".remove-btn").forEach(button => {
      button.addEventListener("click", () => {
        const index = button.dataset.index;
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCart();
      });
    });
  }

  // Обробник для кнопки "Оформити замовлення"
checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Кошик порожній!");
    return;
  }

 

  // Збереження суми в localStorage для передачі на сторінку оформлення
  localStorage.setItem("orderTotal", total.toFixed(2));

  // Перехід на сторінку оформлення
  window.location.href = "/checkout";
});

  // Початкове оновлення кошика після завантаження сторінки
  updateCart();
});
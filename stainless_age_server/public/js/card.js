/**
 * Функція createProductCard створює DOM-елемент картки товару.
 * Вона приймає об’єкт product, який містить дані:
 * id, name, description, price, image_url тощо.
 *
 * Реалізація включає:
 * - Рендеринг вмісту картки за допомогою шаблонної строки.
 * - Вставлення кнопки "Додати до кошика" (add-to-cart-btn).
 * - Інтеграцію логіки додавання до кошика: при натисканні 
 *   викликається функція addToCart(product), яка оновлює localStorage.
 * - Обробку події кліку по картці для переходу на детальну сторінку товару.
 *
 * @param {Object} product - Дані товару.
 * @returns {HTMLElement} - DOM-елемент картки товару.
 */
export function createProductCard(product) {
  // Створюємо шаблон картки з використанням плейсхолдерів
  const template = `
    <div class="product-card">
      <img src="/images/${product.image_url || 'product_placeholder.jpg'}" 
           alt="${product.name}" 
           class="product-image" 
           onerror="this.src='/images/product_placeholder.jpg'">
      <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        <p class="product-description">${product.description || ''}</p>
        <strong class="product-price">${Number(product.price).toFixed(2)} грн</strong>
        <!-- Кнопка додавання до кошика -->
        <button class="add-to-cart-btn">Додати до кошика</button>
      </div>
    </div>
  `;

  // Обгортаємо шаблон у тимчасовий контейнер для перетворення в DOM-елемент
  const wrapper = document.createElement('div');
  wrapper.innerHTML = template.trim();
  const cardElement = wrapper.firstElementChild;

  // Додаємо обробник кліку для кнопки "Додати до кошика"
  const addButton = cardElement.querySelector('.add-to-cart-btn');
  addButton.addEventListener('click', (event) => {
    // Зупиняємо спливаючу подію, щоб не спрацював обробник кліку по картці
    event.stopPropagation();
    // Викликаємо функцію додавання до кошика з даними товару
    addToCart(product);
  });

  // Якщо клік відбувається поза кнопкою (на всій картці), переходимо на сторінку товару
  cardElement.addEventListener('click', () => {
    window.location.href = `/product/${product.id}`;
  });

  return cardElement;
}

/**
 * Функція addToCart додає товар до кошика, збереженого в localStorage.
 * Якщо товар уже присутній, збільшує його кількість; інакше - додає з quantity = 1.
 * Після додавання показується спливаюче повідомлення та логування кошика.
 *
 * @param {Object} product - Дані товару для додавання.
 */
function addToCart(product) {
  // Завантажуємо кошик з localStorage або створюємо порожній масив, якщо його немає
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  // Шукаємо товар в кошику за id
  const existingItemIndex = cart.findIndex(item => item.id === product.id);
  if (existingItemIndex !== -1) {
    // Якщо товар вже є, збільшуємо його кількість
    cart[existingItemIndex].quantity++;
  } else {
    // Інакше додаємо його з початковою кількістю 1
    product.quantity = 1;
    cart.push(product);
  }

  // Оновлюємо кошик у localStorage
  localStorage.setItem('cart', JSON.stringify(cart));

  // Відображаємо спливаюче повідомлення
  showNotification("Товар додано до кошика");

  // Логування для розробника (перевірка вмісту кошика в консолі)
  logCart();
}

/**
 * Функція showNotification показує спливаюче повідомлення для користувача.
 * Тут реалізовано просте рішення через alert(), але можна використовувати бібліотеки для toast-pовідомлень.
 *
 * @param {string} message - Повідомлення для відображення.
 */

/**
 * Функція logCart виводить поточний вміст кошика в console.log.
 * Це допомагає відслідковувати, що відбувається з даними кошика.
 */
function logCart() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  console.log("Масив кошика:", cart);
}
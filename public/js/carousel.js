// catalog-carousel.js
// Переконайтеся, що цей файл підключено як модуль:
// <script type="module" src="/js/catalog-carousel.js"></script>

// Імпортуємо функцію createProductCard з файлу card.js
import { createProductCard } from '/js/card.js';

document.addEventListener("DOMContentLoaded", async () => {
  // Отримуємо дані продуктів із серверу
  const response = await fetch('/product');
  const products = await response.json();

  // Отримуємо контейнер каруселі
  const carouselContainer = document.getElementById("carousel-container");

  if (!carouselContainer) {
    console.error("Контейнер каруселі не знайдено!");
    return;
  }

  // Вибираємо, наприклад, перші 5 продуктів для відображення в каруселі
  const selectedProducts = products.slice(0, 5);

  // Для кожного продукту створюємо картку за допомогою createProductCard з card.js
  selectedProducts.forEach(product => {
    // Створюємо DOM-елемент картки (з інтегрованою логікою додавання до кошика)
    const cardElement = createProductCard(product);
    
    // Обгортаємо картку у контейнер елемента каруселі
    const carouselItem = document.createElement("div");
    carouselItem.classList.add("carousel-item");
    carouselItem.appendChild(cardElement);
    
    // Додаємо елемент у контейнер каруселі
    carouselContainer.appendChild(carouselItem);
  });

  // Функція для плавного переміщення каруселі
  function moveCarousel() {
    const firstItem = carouselContainer.firstElementChild;
    if (!firstItem) return;
    
    // Починаємо ефекти: плавне зменшення непрозорості першого елемента
    firstItem.style.transition = "opacity 0.5s ease-in-out";
    firstItem.style.opacity = "0";
    
    // Одночасно виконуємо зсув контейнера
    carouselContainer.style.transition = "transform 0.5s ease-in-out";
    carouselContainer.style.transform = "translateX(-350px)";
    
    // Слухаємо кінець переходу контейнера (ця подія спрацьовує для властивості transform)
    carouselContainer.addEventListener("transitionend", function handleTransition(e) {
      if (e.propertyName !== "transform") return; // переконуємось, що це саме reальне завершення трансформації
      carouselContainer.removeEventListener("transitionend", handleTransition);

      // Переміщаємо перший елемент в кінець
      carouselContainer.appendChild(firstItem);
      
      // Скидаємо трансформацію контейнера без анімації
      carouselContainer.style.transition = "none";
      carouselContainer.style.transform = "translateX(0)";
      
      // Примусово застосовуємо перерахунок стилів (reflow)
      void carouselContainer.offsetWidth;
      
      // Після переміщення плавно повертаємо елемент до нормальної не прозорості
      firstItem.style.transition = "opacity 0.5s ease-in-out";
      firstItem.style.opacity = "1";
    });
  }

  // Запускаємо функцію переміщення каруселі кожні 3000 мс
  setInterval(moveCarousel, 3000);
});
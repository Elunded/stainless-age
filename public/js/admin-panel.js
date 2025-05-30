// admin-panel.js
import { createProductCard } from '/js/card.js';

document.addEventListener('DOMContentLoaded', () => {
  // Стан для каталогу товарів
  let currentPage = 1;
  const limit = 20;
  let currentFilter = 'all';
  let currentSearch = '';

  // Читаємо параметри із URL (якщо вони присутні)
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('search')) {
    currentSearch = urlParams.get('search').trim();
  }
  if (urlParams.has('page')) {
    const p = parseInt(urlParams.get('page'), 10);
    if (!isNaN(p) && p > 0) currentPage = p;
  }
  if (urlParams.has('filter')) {
    currentFilter = urlParams.get('filter');
  }

  // DOM-елементи (переконайтесь, що ваш HTML містить їх)
  const ordersList = document.querySelector('.orders-list');
  const catalogGrid = document.querySelector('.products-grid');
  const prevPageBtn = document.getElementById('prev-page');
  const nextPageBtn = document.getElementById('next-page');
  const pageInfo = document.getElementById('page-info');
  const searchInput = document.getElementById('admin-search-input');
  const categoryFilter = document.getElementById('admin-category-filter');
  const searchBtn = document.getElementById('admin-search-button');

  // Якщо в полі пошуку є значення з URL – встановити його
  if (searchInput && currentSearch) {
    searchInput.value = currentSearch;
  }

  // Функція оновлення URL (без перезавантаження сторінки)
  function updateURL() {
    const params = new URLSearchParams();
    if (currentSearch) params.set('search', currentSearch);
    if (currentFilter && currentFilter !== 'all') params.set('filter', currentFilter);
    if (currentPage > 1) params.set('page', currentPage);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }

  // Завантаження активних замовлень
  function loadActiveOrders() {
  fetch('/orders/active')
    .then(res => {
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Очікувався JSON від /orders/active, але отримано:', contentType);
        return []; // Повертаємо порожній масив
      }
      return res.json();
    })
    .then(orders => {
      if (!ordersList) return;
      ordersList.innerHTML = '';
      orders.forEach(order => {
        const li = document.createElement('li');
        li.classList.add('order-item');
        li.dataset.orderId = order.id;
        // Форматуємо дату прийняття замовлення (припускаємо, що її повертає поле created_at)
        const acceptedDate = new Date(order.created_at).toLocaleString('uk-UA');
        li.textContent = `Замовлення #${order.id} – Статус: ${order.order_status} – Клієнт: ${order.clientName} – Дата прийняття: ${acceptedDate}`;

        li.addEventListener('click', () => {
          // Перехід до сторінки замовлення (наприклад, деталі замовлення)
          window.location.href = `/admin/order?id=${order.id}`;
        });
        ordersList.appendChild(li);
      });
    })
    .catch(err => {
      console.error('Помилка завантаження замовлень:', err);
      if (ordersList) {
        ordersList.innerHTML = '<p>Не вдалося завантажити замовлення.</p>';
      }
    });
}

  // Завантаження товарів для адмін-панелі з параметрами пошуку, фільтрації та пагінації
  function loadAdminProducts() {
    let url = `/api/catalog?limit=${limit}&page=${currentPage}`;
    if (currentFilter && currentFilter !== 'all') {
      url += `&filter=${encodeURIComponent(currentFilter)}`;
    }
    if (currentSearch) {
      url += `&search=${encodeURIComponent(currentSearch)}`;
    }
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (!catalogGrid) return;
        catalogGrid.innerHTML = ''; // Очищуємо контейнер товарів
        const products = data.products || [];
        const totalProducts = data.total || 0;
        products.forEach(product => {
          const card = createProductCard(product);
          // При кліку на плитку – переходимо до сторінки редагування товару
          card.addEventListener('click', () => {
            window.location.href = `/admin/edit-product?id=${product.id}`;
          });
          catalogGrid.appendChild(card);
        });
        // Налаштовуємо пагінацію (перевіряємо, чи існують елементи)
        const totalPages = Math.ceil(totalProducts / limit);
        if (prevPageBtn) {
          prevPageBtn.disabled = currentPage === 1;
        }
        if (nextPageBtn) {
          nextPageBtn.disabled = currentPage >= totalPages;
        }
        if (pageInfo) {
          pageInfo.textContent = `Сторінка ${currentPage} з ${totalPages}`;
        }
      })
      .catch(err => {
        console.error('Помилка завантаження товарів:', err);
        if (catalogGrid) {
          catalogGrid.innerHTML = '<p>Не вдалося завантажити товари.</p>';
        }
      });
  }

  // Завантаження категорій для селекту фільтрації
  function loadCategories() {
    fetch('/api/categories')
      .then(res => res.json())
      .then(categories => {
        if (!categoryFilter) return;
        categoryFilter.innerHTML = ''; // Очищуємо попередній вміст
        const defaultOption = document.createElement('option');
        defaultOption.value = 'all';
        defaultOption.textContent = 'Всі категорії';
        categoryFilter.appendChild(defaultOption);
        categories.forEach(cat => {
          const option = document.createElement('option');
          option.value = cat.category;
          option.textContent = cat.category;
          categoryFilter.appendChild(option);
        });
        // Встановлюємо обраний фільтр, якщо він не "all"
        categoryFilter.value = currentFilter;
      })
      .catch(err => console.error('Помилка завантаження категорій:', err));
  }

  // Обробники інтерфейсу: зміни в полі пошуку, селекті категорій, кнопці пошуку
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      currentSearch = searchInput.value.trim();
      currentPage = 1;
      updateURL();
      loadAdminProducts();
    });
  }
  if (categoryFilter) {
    categoryFilter.addEventListener('change', () => {
      currentFilter = categoryFilter.value;
      currentPage = 1;
      updateURL();
      loadAdminProducts();
    });
  }
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      currentSearch = searchInput.value.trim();
      currentPage = 1;
      updateURL();
      loadAdminProducts();
    });
  }
  // Обробники для кнопок пагінації
  if (prevPageBtn) {
    prevPageBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        updateURL();
        loadAdminProducts();
      }
    });
  }
  if (nextPageBtn) {
    nextPageBtn.addEventListener('click', () => {
      currentPage++;
      updateURL();
      loadAdminProducts();
    });
  }

  // Ініціалізація: завантаження категорій, активних замовлень та товарів
  loadCategories();
  loadActiveOrders();
  loadAdminProducts();
});
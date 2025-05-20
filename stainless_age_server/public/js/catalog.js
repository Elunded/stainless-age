// Імпортуємо функцію createProductCard з файлу card.js.
import { createProductCard } from '/js/card.js';

document.addEventListener('DOMContentLoaded', () => {
  let currentPage   = 1;
  const limit       = 20;
  let currentFilter = 'all';
  let currentSearch = '';

  // Розбираємо параметри з URL (search, page, filter)
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

  // DOM-елементи
  const catalogGrid    = document.getElementById('catalog-grid');
  const prevPageBtn    = document.getElementById('prev-page');
  const nextPageBtn    = document.getElementById('next-page');
  const pageInfo       = document.getElementById('page-info');
  const filtersContainer = document.querySelector('.filters');
  const searchInput    = document.getElementById('this-search-input');

  // Встановлюємо початкове значення пошуку в інпут, якщо є
  if (searchInput && currentSearch) {
    searchInput.value = currentSearch;
  }

  // Обробник для поля пошуку
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      currentSearch = searchInput.value.trim();
      currentPage = 1;
      updateURL();
      loadProducts();
    });
  }

  // Оновлюємо параметри URL без перезавантаження сторінки
  function updateURL() {
    const params = new URLSearchParams();
    if (currentSearch) params.set('search', currentSearch);
    if (currentFilter && currentFilter !== 'all') params.set('filter', currentFilter);
    if (currentPage > 1) params.set('page', currentPage);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }

  // Завантажуємо кнопки фільтрів
  function loadFilters() {
    filtersContainer.innerHTML = '';

    const createBtn = (label, filterValue) => {
      const btn = document.createElement('button');
      btn.classList.add('filter-btn');
      btn.dataset.filter = filterValue;
      btn.textContent = label;
      btn.addEventListener('click', () => {
        currentFilter = filterValue;
        currentPage = 1;
        updateURL();
        loadProducts();
      });
      return btn;
    };
    filtersContainer.appendChild(createBtn('Всі', 'all'));

    fetch('/api/categories')
      .then(res => res.json())
      .then(categories => {
        categories.forEach(item => {
          const btn = createBtn(item.category, item.category);
          filtersContainer.appendChild(btn);
        });
      })
      .catch(err => console.error('Помилка завантаження категорій:', err));
  }

  // Завантаження товарів з урахуванням пошуку, фільтру і пагінації
  function loadProducts() {
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
        const products     = data.products || [];
        const totalProducts = data.total || 0;
        catalogGrid.innerHTML = '';

        products.forEach(product => {
          const card = createProductCard(product);
          catalogGrid.appendChild(card);
        });

        prevPageBtn.disabled = currentPage === 1;
        const totalPages = Math.ceil(totalProducts / limit);
        nextPageBtn.disabled = currentPage >= totalPages;
        pageInfo.textContent = `Сторінка ${currentPage} з ${totalPages}`;
      })
      .catch(err => {
        console.error('Помилка завантаження товарів:', err);
        catalogGrid.innerHTML = '<p>Не вдалося завантажити товари.</p>';
      });
  }

  // Навігація пагінації
  prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      updateURL();
      loadProducts();
    }
  });
  nextPageBtn.addEventListener('click', () => {
    currentPage++;
    updateURL();
    loadProducts();
  });

  // Ініціалізація
  loadFilters();
  loadProducts();
});

document.addEventListener("DOMContentLoaded", function() {
    fetch("/components/clientHeader.html") // Шлях без "public/"
        .then(response => response.text())
        .then(data => {
            document.getElementById("header").innerHTML = data;
            // Повідомляємо, що хедер завантажено
            document.dispatchEvent(new Event("headerLoaded"));
        });

    fetch("/components/footer.html") // Шлях без "public/"
        .then(response => response.text())
        .then(data => document.getElementById("footer").innerHTML = data);
});

function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Повідомлення зникає через 2 секунди
        setTimeout(() => {
            notification.remove();
        }, 2000);
}


function initHeaderSearch() {

  // Отримуємо елементи, які вже мають бути в завантаженому хеді
  const searchInput = document.getElementById('search-input');
  const searchButton = document.getElementById('search-button');

  if (!searchInput || !searchButton) {
    console.error("Не знайдено елементи хедера для пошуку");
    return;
  }

  function performSearch() {
    const query = searchInput.value.trim();
    if (!query) {
      console.log("Поле пошуку порожнє");
      return;
    }
    // Перенаправляємо користувача на сторінку каталогу із параметром запиту
    window.location.href = `/catalog?search=${encodeURIComponent(query)}`;
  }

  searchButton.addEventListener('click', performSearch);
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      performSearch();
    }
  });
}

// Слухаємо кастомну подію "headerLoaded"
document.addEventListener('headerLoaded', initHeaderSearch);

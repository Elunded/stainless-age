document.addEventListener('DOMContentLoaded', () => {
  // Отримуємо ID товару з URL (наприклад: /admin/edit-product?id=101)
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  if (!productId) {
    alert("Не вказано id товару");
    window.location.href = '/admin';
    return;
  }

  // DOM-елементи форми
  const form = document.getElementById('edit-product-form');
  const productIdInput = document.getElementById('product-id');
  const nameInput = document.getElementById('product-name');
  const descriptionInput = document.getElementById('product-description');
  const imageUrlInput = document.getElementById('product-image_url');
  const priceInput = document.getElementById('product-price');
  const sizeInput = document.getElementById('product-size');
  const weightInput = document.getElementById('product-weight');
  const shippingSelect = document.getElementById('product-shipping_available');
  const backHomeBtn = document.getElementById('back-home');

  // Завантаження даних товару з серверу
  // Припускаємо, що endpoint GET /api/product?id={id}&format=json повертає JSON з даними товару.
  
  fetch(`/product/${productId}?format=json`)
    .then(res => res.json())
    .then(product => {
      productIdInput.value = product.id;
      nameInput.value = product.name;
      descriptionInput.value = product.description;
      imageUrlInput.value = product.image_url;
      priceInput.value = product.price;
      sizeInput.value = product.size;
      weightInput.value = product.weight;
      shippingSelect.value = product.shipping_available ? "1" : "0";
    })
    .catch(err => {
      console.error('Помилка завантаження даних товару:', err);
      alert("Не вдалося завантажити дані товару.");
    });

  // Обробка сабміту форми для збереження змін
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const updatedProduct = {
      name: nameInput.value.trim(),
      description: descriptionInput.value.trim(),
      image_url: imageUrlInput.value.trim(),
      price: parseFloat(priceInput.value),
      size: sizeInput.value.trim(),
      weight: weightInput.value.trim(),
      shipping_available: shippingSelect.value === "1"
    };

    // Відправляємо PUT-запит для оновлення інформації про товар
    fetch(`/api/product/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedProduct)
    })
      .then(res => {
        if (res.ok) {
          alert("Товар успішно оновлено!");
          window.location.href = '/admin'; // Перехід на головну адмінпанелі
        } else {
          throw new Error("Оновлення товару невдале");
        }
      })
      .catch(err => {
        console.error('Помилка оновлення товару:', err);
        alert("Помилка оновлення товару.");
      });
  });

  // Обробка кнопки "На головну"
  backHomeBtn.addEventListener('click', () => {
    window.location.href = '/admin';
  });
});




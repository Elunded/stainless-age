document.addEventListener('DOMContentLoaded', () => {
  // 1. Встановлення суми замовлення (якщо є) на сторінці
  const orderTotal = localStorage.getItem("orderTotal");
  if (orderTotal) {
    document.getElementById("order-sum").textContent = `Сума замовлення: ${orderTotal} грн`;
  }

  // 2. Отримуємо елементи форми та кнопок
  const orderForm = document.getElementById('order-form');
  const firstNameInput = document.getElementById('first-name');
  const lastNameInput = document.getElementById('last-name');
  const phoneInput = document.getElementById('phone');
  const additionalDataInput = document.getElementById('additional-data');
  const confirmOrderBtn = document.getElementById('confirm-order');
  const backHomeBtn = document.getElementById('back-to-home');

  // Функція валідації – активує кнопку підтвердження, якщо всі необхідні поля заповнені
  function validateForm() {
    const isValid = firstNameInput.value.trim() !== '' &&
                    lastNameInput.value.trim() !== '' &&
                    phoneInput.value.trim() !== '';
    confirmOrderBtn.disabled = !isValid;
  }

  // Слідкуємо за змінами в обов'язкових полях
  firstNameInput.addEventListener('input', validateForm);
  lastNameInput.addEventListener('input', validateForm);
  phoneInput.addEventListener('input', validateForm);

  // Первинна перевірка форми
  validateForm();

  // 3. Обробка події відправки форми
  orderForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Зчитування даних з форми
    const firstName = firstNameInput.value.trim();
    const lastName = lastNameInput.value.trim();
    const phone = phoneInput.value.trim();
    const additionalData = additionalDataInput.value.trim();

    // Отримуємо кошик із localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
      alert("Кошик порожній!");
      return;
    }

    // Формуємо об'єкт з даними замовлення
    const payload = { firstName, lastName, phone, additionalData, cart };

    try {
      // Відправляємо POST-запит на /api/orders для створення замовлення
      const response = await fetch('/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!data.orderId) {
        throw new Error("Не вдалося створити замовлення");
      }

      // Очищаємо кошик після успішного створення замовлення
      localStorage.removeItem('cart');
      // Перенаправляємо на сторінку оплати з orderId
      window.location.href = '/order-confirmation';
    } catch (error) {
      console.error("Помилка при оформленні замовлення:", error);
      alert("Сталася помилка при оформленні замовлення. Будь ласка, спробуйте ще раз.");
    }
  });

  // 4. Обробка події кліку для кнопки "На головну"
  backHomeBtn.addEventListener('click', () => {
    window.location.href = '/';
  });
});
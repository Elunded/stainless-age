document.addEventListener('DOMContentLoaded', () => {
  const ordersBody = document.getElementById('orders-body');
  const backHomeBtn = document.getElementById('back-home');

  fetch('/api/orders')
    .then(res => res.json())
    .then(orders => {
      ordersBody.innerHTML = '';

      orders.forEach(order => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
          <td>${order.id}</td>
          <td>${order.order_status}</td>
          <td>${order.clientName}</td>
          <td>${new Date(order.created_at).toLocaleString('uk-UA')}</td>
          <td>${order.total_price} грн</td>
          <td>
            <button class="view-order" data-order-id="${order.id}">
              Деталі
            </button>
          </td>
        `;

        ordersBody.appendChild(tr);
      });

      // Додаємо обробник для кнопок "Деталі"
      document.querySelectorAll('.view-order').forEach(button => {
        button.addEventListener('click', (e) => {
          const orderId = e.target.getAttribute('data-order-id');
          window.location.href = `/admin/order?id=${orderId}`;
        });
      });
    })
    .catch(err => {
      console.error('Помилка завантаження списку замовлень:', err);
      alert("Не вдалося завантажити дані.");
    });

  backHomeBtn.addEventListener('click', () => {
    window.location.href = '/admin';
  });
});
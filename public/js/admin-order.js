document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const orderId = urlParams.get('id');
  if (!orderId) {
    alert('Не вказано id замовлення');
    window.location.href = '/admin';
    return;
  }

  // DOM-елементи
  const orderIdElem = document.getElementById('order-id');
  const orderStatusSelect = document.getElementById('order-status-select');
  const clientNameInput = document.getElementById('client-name'); // тепер input
  const clientPhoneInput = document.getElementById('client-phone'); // тепер input
  const clientSuccessfulInput = document.getElementById('client-successful'); // тепер input
  const orderDateElem = document.getElementById('order-date');
  const totalPriceElem = document.getElementById('total-price');
  const orderItemsBody = document.getElementById('order-items-body');
  const backHomeBtn = document.getElementById('back-home');
  const orderEditForm = document.getElementById('order-edit-form');

  let originalItems = [];

  // Завантаження даних замовлення
  fetch(`/orders/${orderId}&format=json`)
    .then(res => res.json())
    .then(order => {
      orderIdElem.textContent = order.id;
      orderStatusSelect.value = order.order_status;
      // Заповнюємо редаговані поля клієнта
      clientNameInput.value = order.clientName;
      clientPhoneInput.value = order.phone;
      clientSuccessfulInput.textContent = order.successful_orders;
      const date = new Date(order.created_at);
      orderDateElem.textContent = date.toLocaleString('uk-UA');
      totalPriceElem.textContent = order.total_price + ' грн';

      // Обробка товарів в замовленні
      let items = [];
      if (typeof order.items === 'string') {
        try {
          items = JSON.parse(order.items);
        } catch (e) {
          console.error('Помилка розбору items:', e);
        }
      } else if (Array.isArray(order.items)) {
        items = order.items;
      }
      originalItems = items;

      orderItemsBody.innerHTML = '';
      items.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${item.id}</td>
          <td>${item.name}</td>
          <td>
            <input type="number" class="item-quantity" data-item-id="${item.id}" value="${item.quantity}" min="1">
          </td>
          <td>${item.price}</td>
          <td class="item-sum">${(item.quantity * item.price).toFixed(2)}</td>
        `;
        orderItemsBody.appendChild(tr);
      });

      // Обробка зміни кількості
      orderItemsBody.querySelectorAll('.item-quantity').forEach(input => {
        input.addEventListener('change', (e) => {
          const newQty = Number(e.target.value);
          const tr = e.target.closest('tr');
          const price = Number(tr.cells[3].textContent);
          tr.cells[4].textContent = (newQty * price).toFixed(2);
          updateTotalPrice();
        });
      });
    })
    .catch(err => {
      console.error('Помилка завантаження замовлення:', err);
      alert("Не вдалося завантажити дані замовлення.");
    });

  function updateTotalPrice() {
    let total = 0;
    orderItemsBody.querySelectorAll('.item-sum').forEach(td => {
      total += Number(td.textContent);
    });
    totalPriceElem.textContent = total.toFixed(2) + ' грн';
  }

  // Сабміт форми для оновлення замовлення і даних клієнта
  orderEditForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const updatedStatus = orderStatusSelect.value;
    const updatedItems = [];
    orderItemsBody.querySelectorAll('.item-quantity').forEach(input => {
      const itemId = input.getAttribute('data-item-id');
      const newQty = Number(input.value);
      const origItem = originalItems.find(item => item.id == itemId);
      if (origItem) {
        updatedItems.push({
          id: origItem.id,
          name: origItem.name,
          quantity: newQty,
          price: origItem.price
        });
      }
    });

    // Збираємо також оновлені дані клієнта
    const updatedClientName = clientNameInput.value.trim();
    const updatedClientPhone = clientPhoneInput.value.trim();
    const updatedClientSuccessful = Number(clientSuccessfulInput.value);

    const updatedOrder = {
      order_status: updatedStatus,
      items: updatedItems,
      client_name: updatedClientName,
      client_phone: updatedClientPhone,
      successful_orders: updatedClientSuccessful
    };

    fetch(`/orders/${orderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedOrder)
    })
      .then(res => {
        if (res.ok) {
            window.location.href = '/admin';
            alert("Замовлення успішно оновлено!");
          
        } else {
          throw new Error("Оновлення замовлення невдале");
        }
      })
      .catch(err => {
        console.error('Помилка оновлення замовлення:', err);
        alert("Помилка оновлення замовлення.");
      });
  });

  backHomeBtn.addEventListener('click', () => {
    window.location.href = '/admin';
  });
});
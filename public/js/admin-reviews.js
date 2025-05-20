document.addEventListener('DOMContentLoaded', () => {
  const reviewsBody = document.getElementById('reviews-body');
  const backHomeBtn = document.getElementById('back-home');

  // Запит для отримання списку відгуків
  fetch('/reviews')
    .then(res => res.json())
    .then(reviews => {
      reviewsBody.innerHTML = '';

      reviews.forEach(review => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
          <td>${review.id}</td>
          <td>${review.user_name}</td>
          <td>${review.review_text}</td>
          <td>${new Date(review.created_at).toLocaleString('uk-UA')}</td>
          <td>
            <button class="delete-review" data-review-id="${review.id}">
              Видалити
            </button>
          </td>
        `;

        reviewsBody.appendChild(tr);
      });

      // Обробка кнопки "Видалити"
      document.querySelectorAll('.delete-review').forEach(button => {
        button.addEventListener('click', (e) => {
          const reviewId = e.target.getAttribute('data-review-id');

          fetch(`/api/review/${reviewId}`, {
            method: 'DELETE'
          })
          .then(res => {
            if (res.ok) {
              e.target.closest('tr').remove();
            } else {
              throw new Error("Не вдалося видалити відгук");
            }
          })
          .catch(err => {
            console.error('Помилка видалення відгуку:', err);
            alert("Помилка видалення.");
          });
        });
      });
    })
    .catch(err => {
      console.error('Помилка завантаження відгуків:', err);
      alert("Не вдалося завантажити дані.");
    });

  backHomeBtn.addEventListener('click', () => {
    window.location.href = '/admin';
  });
});

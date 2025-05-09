let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartUI() {
  const cartModalBody = document.getElementById("cartModalBody");
  const checkoutBtn = document.getElementById("checkoutBtn");
  const cartCount = document.getElementById("cartCount");

  if (!cartModalBody || !checkoutBtn) {
    console.warn("Không tìm thấy cartModalBody hoặc checkoutBtn trong DOM.");
    return;
  }

  if (cartCount) {
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  } else {
    console.warn("Không tìm thấy phần tử cartCount trong DOM.");
  }

  if (cart.length === 0) {
    cartModalBody.innerHTML = `<p data-i18n="empty_cart">Giỏ hàng của bạn đang trống.</p>`;
    checkoutBtn.style.display = "none";
    applyTranslationToCart();
    return;
  }

  cartModalBody.innerHTML = `
    <table class="table">
      <thead>
        <tr class="fs-5">
          <th data-i18n='product'>Sản phẩm</th>
          <th data-i18n='price'>Giá</th>
          <th data-i18n='quantity'>Số lượng</th>
          <th data-i18n='total'>Tổng</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        ${cart.map(item => `
          <tr>
            <td>${item.title}</td>
            <td>₫${(item.price * 23000).toLocaleString()}</td>
            <td>
              <input type="number" min="0" value="${item.quantity}" onchange="updateQuantity(${item.id}, this.value)" style="width: 60px;">
            </td>
            <td>₫${(item.price * item.quantity * 23000).toLocaleString()}</td>
            <td>
              <button class="btn btn-danger btn-sm" onclick="removeFromCart(${item.id})" data-i18n="remove">Xóa</button>
            </td>
          </tr>
        `).join("")}
      </tbody>
    </table>
    <h5 data-i18n='total_amount'>Tổng cộng: ₫${cart.reduce((sum, item) => sum + item.price * item.quantity * 23000, 0).toLocaleString()}</h5>`;

  checkoutBtn.style.display = "inline-block";

  // Áp dụng dịch cho phần tử vừa render
  applyTranslationToCart();
}

window.openCartModal = function () {
  updateCartUI();
  const modal = new bootstrap.Modal(document.getElementById("cartModal"));
  if (modal) {
    modal.show();
  } else {
    console.warn("Không tìm thấy modal cart trong DOM.");
  }
};

window.addToCart = function (id, title, price) {
  const existingItem = cart.find(item => item.id === id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ id, title, price, quantity: 1 });
  }
  saveCart();
  updateCartUI();
  openCartModal();
};

window.updateQuantity = function (id, quantity) {
  const item = cart.find(item => item.id === id);
  if (item) {
    item.quantity = parseInt(quantity);
    if (item.quantity <= 0) {
      cart = cart.filter(i => i.id !== id);
    }
    saveCart();
    updateCartUI();
  }
};

window.removeFromCart = function (id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  updateCartUI();
};

window.addEventListener("DOMContentLoaded", () => {
  updateCartUI();
});

function applyTranslationToCart() {
  const lang = localStorage.getItem('language') || 'vi';
  fetch(`../lang/${lang}.json`)
    .then(res => res.json())
    .then(translations => {
      document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[key]) {
          element.textContent = translations[key];
        }
      });
      document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        if (translations[key]) {
          element.setAttribute('placeholder', translations[key]);
        }
      });
    })
    .catch(error => console.error("Lỗi khi dịch giỏ hàng:", error));
}

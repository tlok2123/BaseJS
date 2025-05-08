let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartUI() {
    const cartModalBody = document.getElementById("cartModalBody");
    const checkoutBtn = document.getElementById("checkoutBtn");
    const cartCount = document.getElementById("cartCount");

    // Cập nhật số lượng hiển thị trên navbar
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);

    if (cart.length === 0) {
        cartModalBody.innerHTML = "<p>Giỏ hàng của bạn đang trống.</p>";
        checkoutBtn.style.display = "none";
        return;
    }

    // Render bảng sản phẩm
    cartModalBody.innerHTML = `
    <table class="table">
      <thead>
        <tr>
          <th>Sản phẩm</th>
          <th>Giá</th>
          <th>Số lượng</th>
          <th>Tổng</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        ${cart.map(item => `
          <tr>
            <td>${item.title}</td>
            <td>₫${(item.price * 23000).toLocaleString()}</td>
            <td><input type="number" min="0" value="${item.quantity}" onchange="updateQuantity(${item.id}, this.value)" style="width: 60px;"></td>
            <td>₫${(item.price * item.quantity * 23000).toLocaleString()}</td>
            <td><button class="btn btn-danger btn-sm" onclick="removeFromCart(${item.id})">Xóa</button></td>
          </tr>
        `).join("")}
      </tbody>
    </table>
    <h5>Tổng cộng: ₫${cart.reduce((sum, item) => sum + item.price * item.quantity * 23000, 0).toLocaleString()}</h5>
  `;

    checkoutBtn.style.display = "inline-block";
}

window.openCartModal = function () {
    updateCartUI();
    const modal = new bootstrap.Modal(document.getElementById("cartModal"));
    modal.show();
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


// Khởi chạy khi load trang
window.addEventListener("DOMContentLoaded", () => {
    updateCartUI();
});

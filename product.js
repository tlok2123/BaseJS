function createProductCard(product) {
  const col = document.createElement("div");
  col.className = "col-6 col-md-4 col-lg-3 mt-5";
  col.style.minHeight = "450px";
  const priceVND = (product.price * 23000).toLocaleString();
  col.innerHTML = `
      <div class="card product-card h-100">
        <img src="${product.image}" height="200" class="" alt="Product image">
        <div class="card-body p-2 d-flex flex-column">
          <h6 class="card-title mb-1 text-truncate">${product.title}</h6>
          <h6 class="mb-1 text-decoration-underline">₫${priceVND}</h6>
          <p class="text-danger small mb-2">Freeship</p>
          <div>
            <span>${product.description || 'Mô tả sản phẩm sẽ hiển thị ở đây.'}</span>
          </div>
          <div class="d-flex gap-2 mt-auto">
            <button class="btn btn-outline-dark btn-sm w-100"
              onclick="addToCart(${product.id}, '${product.title.replace(/'/g, "\\'")}', ${product.price})">
              Thêm vào giỏ
            </button>
          </div>
        </div>
      </div>
    `;
  return col;
}


function renderProducts(products) {
  const productContainer = document.getElementById("productContainer");
  productContainer.innerHTML = "";
  products.forEach(product => {
    productContainer.appendChild(createProductCard(product));
  });
}

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}
async function fetchAndDisplayProducts() {
  const productContainer = document.getElementById("productContainer");
  productContainer.innerHTML = "<p>Đang tải...</p>";
  try {
    const res = await fetch("https://681a01da1ac11556350768d7.mockapi.io/api/Product");
    if (!res.ok) throw new Error("Lỗi khi lấy dữ liệu");
    const data = await res.json();
    renderProducts(data);
    const searchInput = document.querySelector(".find-product");
    const debouncedSearch = debounce(function () {
      const searchText = searchInput.value.toLowerCase();
      const filtered = data.filter(product =>
        product.title.toLowerCase().includes(searchText)
      );
      renderProducts(filtered);
    }, 0);
    searchInput.addEventListener("input", debouncedSearch);
  } catch (error) {
    console.error(error);
    productContainer.innerHTML = "<p>Có lỗi xảy ra khi tải sản phẩm.</p>";
  }
}
window.addEventListener("DOMContentLoaded", () => {
  fetchAndDisplayProducts();
});
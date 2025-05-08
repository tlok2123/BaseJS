function createProductCard(product) {
    const col = document.createElement("div");
    col.className = "col-md-4 mb-4";
    col.innerHTML = `
    <div class="card product-card shadow">
      <img src="${product.image}" class="card-img-top" alt="${product.title}">
      <div class="card-body">
        <h5 class="card-title">${product.title}</h5>
        <p class="card-text fw-bold text-danger">₫${(product.price * 23000).toLocaleString()}</p>
        <button class="btn btn-dark" onclick="addToCart(${product.id}, '${product.title.replace(/'/g, "\\'")}', ${product.price})">Thêm vào giỏ</button>
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

function fetchAndDisplayProducts() {
    fetch("https://681a01da1ac11556350768d7.mockapi.io/api/Product")
        .then(res => res.json())
        .then(data => {
            renderProducts(data);

            // Tìm kiếm sản phẩm
            document.querySelector(".find-product").addEventListener("input", function () {
                const searchText = this.value.toLowerCase();
                const filtered = data.filter(product =>
                    product.title.toLowerCase().includes(searchText)
                );
                renderProducts(filtered);
            });
        });
}
window.addEventListener("DOMContentLoaded", () => {
    fetchAndDisplayProducts();
});
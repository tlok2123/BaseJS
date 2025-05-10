async function register() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch('https://your-mockapi-url/users');
    const users = await response.json();
    if (users.some(u => u.email === email)) {
        alert('Email đã tồn tại!');
        return;
    }

    await fetch('https://your-mockapi-url/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, createdAt: new Date() })
    });
    alert('Đăng ký thành công!');
    window.location.href = 'login.html';
}

async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const response = await fetch('https://your-mockapi-url/users');
    const users = await response.json();
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        window.location.href = 'dashboard.html';
    } else {
        alert('Email hoặc mật khẩu không đúng!');
    }
}

async function addProduct() {
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const price = document.getElementById('price').value;
    const image = document.getElementById('image').value;

    await fetch('https://your-mockapi-url/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, price, image, createdAt: new Date() })
    });
    loadProducts();
}

async function editProduct(id) {
    const title = prompt('Nhập tiêu đề mới:');
    const description = prompt('Nhập mô tả mới:');
    const price = prompt('Nhập giá mới:');
    const image = prompt('Nhập URL ảnh mới:');

    await fetch(`https://your-mockapi-url/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, price, image })
    });
    loadProducts();
}

async function deleteProduct(id) {
    await fetch(`https://your-mockapi-url/products/${id}`, {
        method: 'DELETE'
    });
    loadProducts();
}
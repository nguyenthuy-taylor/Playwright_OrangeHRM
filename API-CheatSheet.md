# 📌 API Automation Cheat Sheet – Playwright + JavaScript

## 🔑 1. Các phương thức HTTP chính

### **GET – Lấy dữ liệu**
```js
const response = await request.get('/users/1');
console.log(await response.json());
expect(response.status()).toBe(200);
```

---

### **POST – Tạo mới dữ liệu**
```js
const payload = { name: 'John', email: 'john@example.com' };
const response = await request.post('/users', { data: payload });
console.log(await response.json());
expect(response.status()).toBe(201);
```

---

### **PUT – Update toàn bộ**
```js
const payload = { name: 'John Updated', email: 'john.updated@example.com' };
const response = await request.put('/users/1', { data: payload });
expect(response.status()).toBe(200);
```

---

### **PATCH – Update một phần**
```js
const payload = { email: 'new.email@example.com' };
const response = await request.patch('/users/1', { data: payload });
expect(response.status()).toBe(200);
```

---

### **DELETE – Xóa dữ liệu**
```js
const response = await request.delete('/users/1');
expect(response.status()).toBe(200);
```

---

## 🔑 2. Auth (Xác thực)

### **Basic Auth**
```js
const response = await request.get('/protected', {
  headers: { Authorization: 'Basic ' + Buffer.from('user:pass').toString('base64') }
});
```

### **Bearer Token (JWT)**
```js
const response = await request.get('/users', {
  headers: { Authorization: 'Bearer YOUR_TOKEN_HERE' }
});
```

### **API Key**
```js
const response = await request.get('/users?apikey=12345');
```

---

## 🔑 3. Headers & Params

### **Thêm headers**
```js
const response = await request.post('/users', {
  headers: { 'Content-Type': 'application/json' },
  data: { name: 'Jane' }
});
```

### **Query Params**
```js
const response = await request.get('/users?page=2&limit=10');
```

---

## 🔑 4. Xử lý Response

```js
const response = await request.get('/users/1');

// Status code
console.log(response.status()); 

// Body JSON
const body = await response.json();
console.log(body);

// Body text
const text = await response.text();
console.log(text);

// Assertions
expect(response.ok()).toBeTruthy();
expect(body.id).toBe(1);



// Intercept
await page.route('**/api/users', async route => {
  const response = await route.fetch(); // gọi request thật nếu cần
  const body = await response.json();

  // sửa đổi response
  body.name = 'Mocked User';

  await route.fulfill({
    response,
    body: JSON.stringify(body), // Khi dùng fulfill, request sẽ không đi tới server thật nữa, mà nhận response bạn cung cấp.
  });
});


// 🧠 1️⃣ Công thức của route.fulfill()
await page.route('**/your/api/pattern', async (route, request) => {
  await route.fulfill({
    status: 200,                   // ✅ Mã HTTP trả về (200, 401, 404, 500,...)
    contentType: 'application/json', // ✅ Kiểu nội dung trả về
    headers: {                     // (tuỳ chọn) thêm header nếu cần
      'access-control-allow-origin': '*'
    },
    body: JSON.stringify({         // ✅ Nội dung response trả về
      message: 'Mocked response!',
      data: { ... }
    })
  });
  // 👉 route.fulfill() dùng để mock hoàn toàn response → không gửi request thật tới server.


 // 🧠 2️⃣ Công thức của route.continue()
await page.route('**/your/api/pattern', async (route, request) => {
  // Chỉnh sửa URL hoặc headers trước khi tiếp tục
  await route.continue({
    url: 'https://new-api-endpoint.com/data', // (tuỳ chọn)
    headers: {
      ...request.headers(),
      Authorization: `Bearer ${token}`       // (tuỳ chọn)
    },
    method: 'GET',                          // (tuỳ chọn)
    postData: null                          // (tuỳ chọn)
  });
});


// 👉 route.continue() cho phép can thiệp & chỉnh sửa request rồi tiếp tục gửi đến server thật.

---
```



## 🔑 5. Các Status Code phổ biến
| Code | Ý nghĩa                |
|------|------------------------|
| 200  | OK                     |
| 201  | Created                |
| 204  | No Content             |
| 400  | Bad Request            |
| 401  | Unauthorized           |
| 403  | Forbidden              |
| 404  | Not Found              |
| 500  | Internal Server Error  |


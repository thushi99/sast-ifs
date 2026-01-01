# Vulnerability Map (E-Commerce Edition)

This application has been transformed into a vulnerable E-Commerce store.

## 1. Injection Vulnerabilities

### SQL Injection (Classic)
- **Location**: `POST /api/auth/login`
- **Exploit**: `' OR '1'='1`

### Command Injection
- **Location**: `POST /api/admin/ping`
- **Exploit**: `127.0.0.1; cat /etc/passwd`

### Reflected XSS
- **Location**: `GET /products?q=<script>alert(1)</script>`
- **Method**: The Search term is rendered unsanitized in `products/index.js`.
- **SAST**: Detects `dangerouslySetInnerHTML`.

### Stored XSS
- **Location**: `POST /api/products/:id/reviews`
- **Method**: Reviews are stored raw and rendered raw in `products/[id].js`.
- **Exploit**: Submit `<img src=x onerror=alert('Review XSS')>` as a review.

## 2. Business Logic Flaws

### Negative Quantity / Price Manipulation
- **Location**: `POST /api/orders`
- **Method**: The API accepts the `quantity` from the client without checking if it's positive.
- **Exploit**: 
    - Add item to cart.
    - Intercept checkout request.
    - Change quantity to `-10`.
    - Total price becomes negative (or reduces total).

### Coupon Reuse
- **Location**: `POST /api/orders`
- **Method**: Coupon code is checked for validity but not marked as used.
- **Exploit**: Use `SAVE10` on every order.

### Race Condition (Wallet)
- **Location**: `POST /api/wallet/transfer`
- **Method**: `sleep()` between read and write allows double spending.

## 3. Broken Access Control (IDOR)

### Order IDOR
- **Location**: `GET /api/orders/:id`
- **Method**: No check if the authenticated user owns the order.
- **Exploit**:
    - Login as User A.
    - Place order, get ID `1`.
    - Change URL to `/orders/2` to see User B's order.

## 4. Security Misconfiguration

### Unrestricted File Upload
- **Location**: `POST /api/files/upload`
- **Method**: No extension check.

### Path Traversal
- **Location**: `GET /api/files/view?name=../../.env`

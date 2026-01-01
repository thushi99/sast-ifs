const { pool } = require('../config/db');

const initDb = async () => {
  const client = await pool.connect();
  try {
    console.log("Initializing E-Commerce Database...");

    // users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'user',
        bio TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // wallets table
    await client.query(`
      CREATE TABLE IF NOT EXISTS wallets (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        balance DECIMAL(10, 2) DEFAULT 0.00
      );
    `);

    // products table
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        image_url VARCHAR(255)
      );
    `);

    // orders table
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        total DECIMAL(10, 2) NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        items JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // coupons table
    await client.query(`
        CREATE TABLE IF NOT EXISTS coupons (
            id SERIAL PRIMARY KEY,
            code VARCHAR(50) UNIQUE NOT NULL,
            discount DECIMAL(5, 2) NOT NULL,
            active BOOLEAN DEFAULT TRUE
        );
    `);

    // reviews table (New for Stored XSS)
    await client.query(`
        CREATE TABLE IF NOT EXISTS reviews (
            id SERIAL PRIMARY KEY,
            product_id INTEGER REFERENCES products(id),
            user_id INTEGER REFERENCES users(id),
            content TEXT,
            rating INTEGER DEFAULT 5,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);

    console.log("Tables created successfully.");

    // Seed Data
    const checkUsers = await client.query('SELECT * FROM users');
    if (checkUsers.rowCount === 0) {
      // Users
      await client.query(`
            INSERT INTO users (username, email, password, role, bio) VALUES
            ('admin', 'admin@example.com', '0192023a7bbd73250516f069df18b500', 'admin', 'Administrator account'),
            ('user1', 'user1@example.com', '5f4dcc3b5aa765d61d8327deb882cf99', 'user', 'Regular user'),
            ('hacker', 'hacker@example.com', '5f4dcc3b5aa765d61d8327deb882cf99', 'user', '<script>alert("XSS")</script>')
        `);

      const usersResult = await client.query('SELECT id FROM users');
      const user1 = usersResult.rows[1].id;

      // Wallets
      for (let user of usersResult.rows) {
        await client.query('INSERT INTO wallets (user_id, balance) VALUES ($1, 1000.00)', [user.id]);
      }

      // Products
      await client.query(`
            INSERT INTO products (name, description, price, image_url) VALUES
            ('Flag', 'The capture the flag target', 1337.00, 'https://placehold.co/400x300?text=Flag'),
            ('Vulnerable Widget', 'A widget with many security flaws', 10.00, 'https://placehold.co/400x300?text=Widget'),
            ('Super Secure Token', 'Does not actually exist', 9999.99, 'https://placehold.co/400x300?text=Token'),
            ('Discounted Item', 'Cheap stuff', 5.00, 'https://placehold.co/400x300?text=Cheap')
        `);

      // Coupons
      await client.query(`INSERT INTO coupons (code, discount) VALUES ('SAVE10', 10.00), ('FREE', 100.00)`);

      // Reviews
      const productsResult = await client.query('SELECT id FROM products');
      const prodId = productsResult.rows[1].id;
      await client.query(`
            INSERT INTO reviews (product_id, user_id, content, rating) VALUES 
            ($1, $2, 'Great product! Totally safe.', 5),
            ($1, $2, '<b>Bold</b> statement here.', 4)
        `, [prodId, user1]);

      console.log("Seed data inserted.");
    }

  } catch (err) {
    console.error("Error initializing DB:", err);
  } finally {
    client.release();
    process.exit();
  }
};

initDb();

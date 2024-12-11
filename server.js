const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();
const port = 3000;
const path = require('path'); // Thêm module path
const bodyParser = require('body-parser');

app.use(cors());
app.use(express.json()); // Middleware để parse JSON
app.use(bodyParser.json());

// Cấu hình kết nối MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'sapassword',
    database: 'myFoodApp'
});


// API xoá user
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM users WHERE id = ?';
    connection.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Lỗi khi xoá user:', err.message);
            return res.status(500).json({ error: 'Lỗi khi xoá user' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User không tồn tại' });
        }
        res.json({ message: 'Xoá user thành công' });
    });
});

// API lấy categories
app.get('/categories', (req, res) => {
    connection.query('SELECT * FROM categories', (err, results) => {
        if (err) {
            console.error('Lỗi khi truy vấn:', err.message);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

// API lấy danh sách các cửa hàng có rating > 4.5
app.get('/recommended', (req, res) => {
    const sql = `
        SELECT *
        FROM stores
        WHERE rating > 4.5
        ORDER BY rating DESC`;

    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Lỗi khi lấy danh sách cửa hàng:', err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json(results); // Trả về danh sách cửa hàng có rating > 4.5
    });
});

// API lấy danh sách sản phẩm giảm giá 50%
app.get('/promotions/discount-50', (req, res) => {
    const sql = `
    SELECT 
    pp.product_id, 
    f.name AS product_name, 
    s.id AS store_id, 
    p.discount_percentage,
    f.image AS product_image  
FROM promotion_products pp
JOIN promotions p ON pp.promotion_id = p.id
JOIN foods f ON pp.product_id = f.id
JOIN stores s ON f.store_id = s.id 
WHERE p.discount_percentage = 50.00;`;
    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Lỗi khi truy vấn danh sách sản phẩm giảm giá 50%:', err.message);
            return res.status(500).json({ error: 'Lỗi máy chủ' });
        }
        res.json(results); // Trả về danh sách sản phẩm giảm giá 50%
    });
});


// API lấy danh sách tất cả món ăn, kèm mức giảm giá nếu có
app.get('/foods', (req, res) => {
    const sql = `
        SELECT 
            f.id AS product_id, 
            f.name AS product_name, 
            f.description, 
            f.price, 
            f.image AS product_image,
            p.discount_percentage, -- Nếu có giảm giá, trường này sẽ chứa giá trị
            s.name AS store_name
        FROM foods f
        LEFT JOIN promotion_products pp ON pp.product_id = f.id 
        LEFT JOIN promotions p ON pp.promotion_id = p.id  
        LEFT JOIN stores s ON f.store_id = s.id`;

    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Lỗi khi lấy danh sách món ăn:', err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json(results);
    });
});

// API tìm kiếm món ăn theo tên (tìm kiếm tương đối)
app.get('/foods/search', (req, res) => {
    const searchQuery = req.query.search || '';

    const sql = `
        SELECT 
            f.id AS product_id, 
            f.name AS product_name, 
            f.description, 
            f.price, 
            f.image AS product_image,
            p.discount_percentage,
            s.name AS store_name,
            s.id AS store_id
        FROM foods f
        LEFT JOIN promotion_products pp ON pp.product_id = f.id 
        LEFT JOIN promotions p ON pp.promotion_id = p.id  
        LEFT JOIN stores s ON f.store_id = s.id
        WHERE LOWER(f.name) LIKE LOWER(?)`;  

    connection.query(sql, [`%${searchQuery}%`], (err, results) => {
        if (err) {
            console.error('Lỗi khi lấy danh sách món ăn:', err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json(results);
    });
});


// Thêm món ăn mới vào cơ sở dữ liệu
app.post('/api/recommended', (req, res) => {
    const { title, rating, image, time } = req.body;
    const sql = 'INSERT INTO stores (title, rating, image, time) VALUES (?, ?, ?, ?)';
    connection.query(sql, [title, rating, image, time], (err, result) => {
        if (err) {
            console.error('Lỗi khi thêm món ăn:', err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.status(201).json({ id: result.insertId, title, rating, image, time });
    });
});

app.get('/stores/category/:categoryName', (req, res) => {
    const { categoryName } = req.params;

    const sql = `
        SELECT DISTINCT 
            s.id AS store_id,
            s.name AS store_name,
            s.address,
            s.rating,
            s.image AS store_image
        FROM stores s
        JOIN foods f ON s.id = f.store_id
        JOIN categories c ON f.category_id = c.id
        WHERE LOWER(c.name) = LOWER(?);`; // Không phân biệt hoa thường

    connection.query(sql, [categoryName], (err, results) => {
        if (err) {
            console.error('Lỗi khi truy vấn:', err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy cửa hàng cho danh mục này' });
        }

        res.json(results);
    });
});


// API lấy danh sách món ăn theo cửa hàng
app.get('/store/:storeId/foods', (req, res) => {
    const { storeId } = req.params;  // Lấy storeId từ URL parameter

    // Truy vấn cơ sở dữ liệu để lấy danh sách món ăn theo cửa hàng
    const sql = `
        SELECT 
            f.id AS product_id, 
            f.name AS product_name, 
            f.description, 
            f.price, 
            f.image AS product_image,
            p.discount_percentage, 
            s.name AS store_name
        FROM foods f
        LEFT JOIN promotion_products pp ON pp.product_id = f.id 
        LEFT JOIN promotions p ON pp.promotion_id = p.id  
        LEFT JOIN stores s ON f.store_id = s.id
        WHERE f.store_id = ?`;  // Lọc theo store_id


    connection.query(sql, [storeId], (err, results) => {
        if (err) {
            console.error('Lỗi khi lấy danh sách món ăn theo cửa hàng:', err.message);
            return res.status(500).json({ error: 'Lỗi khi truy vấn' });
        }


        if (results.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy món ăn cho cửa hàng này' });
        }


        res.json(results);
    });
});


// API lấy thông tin cửa hàng theo id
app.get('/store/:id', (req, res) => {
    const { id } = req.params; // Lấy id cửa hàng từ URL parameter


    const sql = 'SELECT * FROM stores WHERE id = ?';

    connection.query(sql, [id], (err, results) => {
        if (err) {
            console.error('Lỗi khi truy vấn:', err.message);
            return res.status(500).json({ error: 'Lỗi khi truy vấn' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Cửa hàng không tồn tại' });
        }

        // Trả về thông tin cửa hàng
        res.json(results[0]);
    });
});
// API lấy thông tin món ăn theo id
app.get('/foods/:id', (req, res) => {
    const { id } = req.params; // Lấy id món ăn từ URL parameter

    const sql = `
        SELECT 
            f.id AS product_id, 
            f.name AS product_name, 
            f.description, 
            f.price, 
            f.image AS product_image,
            p.discount_percentage, -- Nếu có giảm giá, trường này sẽ chứa giá trị
            s.id AS store_id,       -- Thêm store_id vào kết quả
            s.name AS store_name, 
            s.address AS store_address
        FROM foods f
        LEFT JOIN promotion_products pp ON pp.product_id = f.id 
        LEFT JOIN promotions p ON pp.promotion_id = p.id  
        LEFT JOIN stores s ON f.store_id = s.id
        WHERE f.id = ?`; // Lọc theo id món ăn

    connection.query(sql, [id], (err, results) => {
        if (err) {
            console.error('Lỗi khi truy vấn thông tin món ăn:', err.message);
            return res.status(500).json({ error: 'Lỗi máy chủ' });
        }

        if (results.length === 0) {
            console.log(`Fetching food details for id: ${id}`);
            return res.status(404).json({ message: 'Không tìm thấy món ăn' });
        }

        // Trả về thông tin món ăn
        res.json(results[0]);
    });
});

// API tạo đơn hàng
app.post('/orders', (req, res) => {
    const { user_id, store_id, total_price, order_status, items } = req.body;

    // Kiểm tra nếu thiếu thông tin
    if (!user_id || !store_id || !total_price || !order_status || !items || items.length === 0) {
        return res.status(400).json({ error: 'Thiếu thông tin cần thiết' });
    }

    // Thêm đơn hàng vào bảng orders
    const insertOrderQuery = `
        INSERT INTO orders (user_id, store_id, total_price, order_status)
        VALUES (?, ?, ?, ?)
    `;

    connection.query(insertOrderQuery, [user_id, store_id, total_price, order_status], (err, result) => {
        if (err) {
            console.error('Lỗi khi thêm đơn hàng:', err);
            return res.status(500).json({ error: 'Lỗi khi thêm đơn hàng' });
        }

        const order_id = result.insertId; // Lấy ID của đơn hàng mới tạo

        // Thêm các món ăn vào bảng order_items
        const insertItemsQuery = `
            INSERT INTO order_items (order_id, food_id, quantity, price, topping)
            VALUES ?
        `;

        // Tạo dữ liệu để insert vào bảng order_items
        const orderItems = items.map(item => [
            order_id,
            item.food_id,
            item.quantity,
            item.price,
            item.topping || null
        ]);

        connection.query(insertItemsQuery, [orderItems], (err, result) => {
            if (err) {
                console.error('Lỗi khi thêm các món ăn vào đơn hàng:', err);
                return res.status(500).json({ error: 'Lỗi khi thêm các món ăn vào đơn hàng' });
            }

            // Trả về kết quả sau khi tạo đơn hàng thành công
            res.status(201).json({
                message: 'Đơn hàng được tạo thành công',
                order_id: order_id,
                user_id: user_id,
                store_id: store_id,
                total_price: total_price,
                order_status: order_status,
                items: items
            });
        });
    });
});

const bcrypt = require('bcryptjs');

app.post('/api/register', (req, res) => {
    const { userName, gmail, password, address } = req.body;

    // Kiểm tra xem username đã tồn tại trong cơ sở dữ liệu chưa
    const checkUsername = 'SELECT * FROM users WHERE username = ?';
    connection.query(checkUsername, [userName], (err, results) => {
        if (err) {
            console.error("Error checking userName:", err);
            return res.status(500).json({ error: err.message });
        }

        if (results.length > 0) {
            return res.status(400).json({ message: 'userName already exists.' });
        }

        // Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                console.error("Error hashing password:", err);
                return res.status(500).json({ error: err.message });
            }

            // Nếu username chưa tồn tại, thêm tài khoản mới vào cơ sở dữ liệu
            const insertQuery = 'INSERT INTO users (username, email, password, address) VALUES (?, ?, ?,?)';
            connection.query(insertQuery, [userName, gmail, hashedPassword, address], (err, results) => {
                if (err) {
                    console.error("Error inserting user:", err);
                    return res.status(500).json({ error: err.message });
                }

                res.status(201).json({ message: 'User registered successfully!' });
            });
        });
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Truy vấn để lấy thông tin người dùng từ cơ sở dữ liệu
    const query = 'SELECT * FROM users WHERE username = ?';
    connection.query(query, [username], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (results.length > 0) {
            const user = results[0]; // Lấy thông tin user từ cơ sở dữ liệu

            // So sánh mật khẩu người dùng nhập vào với mật khẩu đã mã hóa trong cơ sở dữ liệu
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }

                if (isMatch) {
                    // Nếu mật khẩu khớp, đăng nhập thành công
                    res.json({ success: true, message: 'Đăng nhập thành công!', user });
                } else {
                    // Nếu mật khẩu không khớp
                    res.status(401).json({ success: false, message: 'Username hoặc mật khẩu không đúng!' });
                }
            });
        } else {
            // Nếu không tìm thấy người dùng
            res.status(401).json({ success: false, message: 'Username hoặc mật khẩu không đúng!' });
        }
    });
});

app.post('/api/reset-password', express.json(), (req, res) => {
    const { username, newPassword } = req.body;
  
    // Kiểm tra tồn tại username trong cơ sở dữ liệu
    const checkQuery = 'SELECT * FROM users WHERE username = ?';
  
    connection.query(checkQuery, [username], (err, results) => {
      if (err) {
        console.error("Error checking username:", err);
        return res.status(500).json({ error: err.message });
      }
  
      if (results.length === 0) {
        return res.status(401).json({ success: false, message: 'username does not exist.' }); // Thay đổi thông báo lỗi
      }
  
      // Mã hóa mật khẩu mới trước khi cập nhật
      bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
        if (err) {
          console.error("Error hashing password:", err);
          return res.status(500).json({ error: err.message });
        }

        // Cập nhật mật khẩu đã mã hóa trong cơ sở dữ liệu
        const updateQuery = 'UPDATE users SET password = ? WHERE username = ?';
  
        connection.query(updateQuery, [hashedPassword, username], (err, results) => {
          if (err) {
            console.error("Error updating password:", err);
            return res.status(500).json({ error: err.message });
          }
  
          res.json({ success: true, message: 'Password reset successfully!' });
        });
      });
    });
});
  
// API lấy danh sách orders theo user_id
app.get('/api/orders', (req, res) => {
    const { user_id } = req.query; // Lấy user_id từ query parameter

    if (!user_id) {
        return res.status(400).json({ error: 'user_id is required' });
    }

    const sql = 'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC';

    connection.query(sql, [user_id], (err, results) => {
        if (err) {
            console.error('Lỗi khi truy vấn:', err.message);
            return res.status(500).json({ error: 'Lỗi khi truy vấn cơ sở dữ liệu' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng nào cho user_id này' });
        }

        res.status(200).json(results);
    });
});
// API lấy danh sách foods theo order_id
app.get('/api/orders/foods', (req, res) => {
    const { order_id } = req.query;

    if (!order_id) {
        return res.status(400).json({ error: 'order_id is required' });
    }

    const sql = `
        SELECT 
            oi.id AS order_item_id,
            oi.order_id,
            oi.food_id,
            f.name AS food_name,
            f.image AS food_image,
            oi.quantity,
            oi.price,
            oi.topping,
            oi.created_at
        FROM order_items oi
        JOIN foods f ON oi.food_id = f.id
        WHERE oi.order_id = ?
        ORDER BY oi.created_at DESC
    `;

    connection.query(sql, [order_id], (err, results) => {
        if (err) {
            console.error('Lỗi khi truy vấn:', err.message);
            return res.status(500).json({ error: 'Lỗi khi truy vấn cơ sở dữ liệu' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy món ăn nào cho order_id này' });
        }

        res.status(200).json(results);
    });
});


app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Lắng nghe trên cổng 3000
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

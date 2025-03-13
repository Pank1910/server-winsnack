const express = require('express');
const app = express();
const port = 5000;
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const { MongoClient, ObjectId } = require('mongodb');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

app.use(morgan("combined"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());


const uri = "mongodb+srv://thanhtylenguyen:WinSnack2025@webcluster.9rruw.mongodb.net/";
const client = new MongoClient(uri);


async function connectDB() {
    try {
        await client.connect();
        console.log("✅ Connected to MongoDB successfully!");
        const database = client.db("winsnack");
        const collections = await database.listCollections().toArray();
        console.log("📂 Collections in database:", collections.map(col => col.name));
    } catch (error) {
        console.error("❌ MongoDB connection error:", error);
    }
}


connectDB();


const database = client.db("winsnack");
const winsnackCollection = database.collection("Cart");
const productsCollection = database.collection("Product");
const orderCollection = database.collection("Order"); // ✅ Thêm collection Order


// Trang chủ test server
app.get("/", (req, res) => {
    res.send("This Web server is processed for MongoDB");
});


// Check DB và test collection
app.get("/check-db", async (req, res) => {
    try {
        const collections = await database.listCollections().toArray();
        const collectionNames = collections.map(col => col.name);
       
        if (!collectionNames.includes("Cart")) {
            return res.status(404).json({
                success: false,
                message: "❌ Collection 'Cart' does not exist!"
            });
        }


        const sampleDoc = await winsnackCollection.findOne({});
        res.json({
            success: true,
            message: "✅ MongoDB connected successfully!",
            sampleDocument: sampleDoc || "No documents found in CARTS collection",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "❌ MongoDB connection failed",
            error: error.toString(),
        });
    }
});


// ✅ Endpoint lấy tất cả sản phẩm
app.get("/products", async (req, res) => {
    try {
        const products = await productsCollection.find({}).toArray();
        res.json({
            success: true,
            data: products,
            count: products.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "❌ Failed to fetch products",
            error: error.toString()
        });
    }
});


// ✅ Endpoint lấy sản phẩm theo ID
app.get("/products/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productsCollection.findOne({ _id: id });
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "❌ Product not found"
            });
        }
       
        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "❌ Failed to fetch product",
            error: error.toString()
        });
    }
});

// ✅ Endpoint tìm kiếm sản phẩm
app.get("/products/search", async (req, res) => {
    try {
        const { term } = req.query;
        
        if (!term) {
            return res.json({
                success: true,
                data: [],
                count: 0
            });
        }

        // Tạo pattern tìm kiếm không phân biệt hoa thường
        const searchPattern = new RegExp(term, 'i');
        
        // Tìm kiếm sản phẩm theo tên
        const products = await productsCollection.find({
            $or: [
                { product_name: searchPattern },
                // { category: searchPattern }
            ]
        }).toArray();
        
        res.json({
            success: true,
            data: products,
            count: products.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "❌ Failed to search products",
            error: error.toString()
        });
    }
});

// Giả sử usersCollection đã được khai báo từ trước
const usersCollection = database.collection("User");


// API cập nhật địa chỉ người dùng
app.put('/addresses/update', async (req, res) => {
    try {
        const { userId, profileName, phone, address } = req.body;


        // Kiểm tra userId có tồn tại không
        const user = await usersCollection.findOne({ userId: userId });


       
        if (!user) {
            return res.status(404).json({
                message: "Người dùng không tồn tại"
            });
        }


        // Cập nhật thông tin địa chỉ
        const result = await usersCollection.findOneAndUpdate(
            { userId: userId },
            {
                $set: {
                    profileName: profileName,
                    phone: phone,
                    address: address
                }
            },
            { returnDocument: 'after' }
        );


        res.json({
            profileName: result.profileName,
            phone: result.phone,
            address: result.address
        });
    } catch (error) {
        res.status(500).json({
            message: "Lỗi cập nhật địa chỉ",
            error: error.toString()
        });
    }
});


// API lấy địa chỉ người dùng
app.get('/addresses/user', async (req, res) => {
    try {
        const userId = req.query.userId;


        const user = await usersCollection.findOne(
            { userId: userId },
            { projection: { profileName: 1, phone: 1, address: 1 } }
        );


        if (!user) {
            return res.status(404).json({
                message: "Người dùng không tồn tại"
            });
        }


        res.json({
            profileName: user.profileName || "",
            phone: user.phone || "",
            address: user.address || ""
        });
    } catch (error) {
        res.status(500).json({
            message: "Lỗi lấy địa chỉ",
            error: error.toString()
        });
    }
});


// Thêm cart vào file index.js
const cartCollection = database.collection("Cart");


app.post('/carts/add', async (req, res) => {
    try {
        const cartItem = req.body;
       
        // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
        const existingItem = await cartCollection.findOne({
            productId: cartItem.productId,
            userId: cartItem.userId
        });


        if (existingItem) {
            // Nếu đã tồn tại, cập nhật số lượng
            const result = await cartCollection.findOneAndUpdate(
                {
                    productId: cartItem.productId,
                    userId: cartItem.userId
                },
                { $inc: { quantity: cartItem.quantity } },
                { returnDocument: 'after' }
            );
            res.json(result);
        } else {
            // Nếu chưa tồn tại, thêm mới
            const result = await cartCollection.insertOne(cartItem);
            res.status(201).json({
                ...cartItem,
                _id: result.insertedId
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Lỗi thêm sản phẩm vào giỏ hàng",
            error: error.toString()
        });
    }
});


app.get('/cart/items', async (req, res) => {
    try {
        const userId = req.query.userId;
        console.log(`Đang tìm các mục giỏ hàng cho người dùng: ${userId}`);
        const cartItems = await cartCollection.find({ userId }).toArray();
        console.log(`Tìm thấy ${cartItems.length} mục giỏ hàng`);
        res.json(cartItems);
    } catch (error) {
        console.error("Lỗi khi lấy các mục giỏ hàng:", error);
        res.status(500).json({
            message: "Lỗi lấy danh sách sản phẩm trong giỏ hàng",
            error: error.toString()
        });
    }
});


app.patch('/cart/update/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;
        const userId = req.query.userId;
        const { quantity } = req.body;


        const result = await cartCollection.findOneAndUpdate(
            {
                productId: productId,
                userId: userId
            },
            { $set: { quantity: quantity } },
            { returnDocument: 'after' }
        );


        res.json(result);
    } catch (error) {
        res.status(500).json({
            message: "Lỗi cập nhật số lượng sản phẩm",
            error: error.toString()
        });
    }
});


app.delete('/cart/remove/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;
        const userId = req.query.userId;


        const result = await winsnackCollection.deleteOne({
            productId: productId,
            userId: userId
        });
       
        res.json({
            message: "Đã xóa sản phẩm khỏi giỏ hàng",
            deletedCount: result.deletedCount
        });
    } catch (error) {
        res.status(500).json({
            message: "Lỗi xóa sản phẩm khỏi giỏ hàng",
            error: error.toString()
        });
    }
});


app.delete('/cart/clear', async (req, res) => {
    try {
        const userId = req.query.userId;


        const result = await cartCollection.deleteMany({ userId });
       
        res.json({
            message: "Đã xóa toàn bộ giỏ hàng",
            deletedCount: result.deletedCount
        });
    } catch (error) {
        res.status(500).json({
            message: "Lỗi xóa giỏ hàng",
            error: error.toString()
        });
    }
});




// Note: Thêm endpoint để lấy giỏ hàng của người dùng
app.get("/cart", async (req, res) => {
    try {
        const userId = req.query.userId; // Note: Giả định userId được gửi qua query (có thể thay bằng header nếu dùng token)
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "❌ userId is required"
            });
        }
        const cartItems = await winsnackCollection.find({ userId }).toArray();
        res.json({
            success: true,
            data: cartItems
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "❌ Failed to fetch cart",
            error: error.toString()
        });
    }
});


// Note: Thêm endpoint để thêm sản phẩm vào giỏ hàng
app.post("/cart/add", async (req, res) => {     
    try {         
        const { userId, productId, quantity, unit_price } = req.body;         
        if (!userId || !productId || !quantity || !unit_price) {             
            return res.status(400).json({                 
                success: false,                 
                message: "❌ userId, productId, quantity, and unit_price are required"             
            });         
        }           

        // Note: Kiểm tra sản phẩm có tồn tại không         
        const product = await productsCollection.findOne({ _id: new ObjectId(productId) });         
        if (!product) {             
            return res.status(404).json({                 
                success: false,                 
                message: "❌ Product not found"             
            });         
        }           

        // Note: Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa         
        const existingItem = await winsnackCollection.findOne({ userId, productId });         
        if (existingItem) {             
            // Nếu đã có, tăng số lượng             
            await winsnackCollection.updateOne(
                { userId, productId },                 
                { $inc: { quantity } }             
            );         
        } else {             
            // Nếu chưa có, thêm mới             
            await winsnackCollection.insertOne({                 
                userId,                 
                productId,                 
                quantity,                 
                unit_price,                 
                product_name: product.title || "Unknown", // Note: Lấy từ product nếu có                 
                image_1: product.image_1 || "", // Note: Lấy từ product nếu có                 
                stocked_quantity: product.stocked_quantity || 0 // Note: Lấy từ product nếu có             
            });         
        }           

        res.json({ // Sửa lỗi dấu ngoặc
            success: true,             
            message: "✅ Product added to cart"         
        });     
    } catch (error) {         
        res.status(500).json({             
            success: false,             
            message: "❌ Failed to add to cart",             
            error: error.toString()         
        });     
    } 
});




// Note: Thêm endpoint để xóa sản phẩm khỏi giỏ hàng
app.delete("/cart/remove/:productId", async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.query.userId; // Note: Giả định userId qua query
        if (!userId || !productId) {
            return res.status(400).json({
                success: false,
                message: "❌ userId and productId are required"
            });
        }


        const result = await winsnackCollection.deleteOne({ userId, productId });
        if (result.deletedCount === 0) {
            return res.status(404).json({
                success: false,
                message: "❌ Item not found in cart"
            });
        }


        res.json({
            success: true,
            message: "✅ Product removed from cart"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "❌ Failed to remove from cart",
            error: error.toString()
        });
    }
});


// Note: Thêm endpoint để cập nhật số lượng sản phẩm trong giỏ hàng
app.patch("/cart/update", async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;
        if (!userId || !productId || !quantity) {
            return res.status(400).json({
                success: false,
                message: "❌ userId, productId, and quantity are required"
            });
        }


        const result = await winsnackCollection.updateOne(
            { userId, productId },
            { $set: { quantity } }
        );


        if (result.matchedCount === 0) {
            return res.status(404).json({
                success: false,
                message: "❌ Item not found in cart"
            });
        }


        res.json({
            success: true,
            message: "✅ Quantity updated"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "❌ Failed to update quantity",
            error: error.toString()
        });
    }
});


// Note: Thêm endpoint để cập nhật toàn bộ giỏ hàng
app.put("/cart/update-all", async (req, res) => {
    try {
        const { userId, items } = req.body;
        if (!userId || !items || !Array.isArray(items)) {
            return res.status(400).json({
                success: false,
                message: "❌ userId and items (array) are required"
            });
        }


        // Note: Xóa toàn bộ giỏ hàng hiện tại của user và thay bằng danh sách mới
        await winsnackCollection.deleteMany({ userId });
        if (items.length > 0) {
            await winsnackCollection.insertMany(
                items.map(item => ({
                    userId,
                    productId: item.productId,
                    quantity: item.quantity,
                    unit_price: item.unit_price
                }))
            );
        }


        res.json({
            success: true,
            message: "✅ Cart updated"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "❌ Failed to update cart",
            error: error.toString()
        });
    }
});


// Note: Thêm endpoint để lưu các sản phẩm đã chọn
app.post("/cart/saveSelectedItems", async (req, res) => {
    try {
        const { userId, selectedItems } = req.body;
        if (!userId || !selectedItems || !Array.isArray(selectedItems)) {
            return res.status(400).json({
                success: false,
                message: "❌ userId and selectedItems (array) are required"
            });
        }


        // Note: Đây là nơi bạn có thể lưu selectedItems vào một collection khác hoặc xử lý tùy ý
        // Ví dụ: Chỉ trả về thông báo thành công
        res.json({
            success: true,
            message: "✅ Selected items saved"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "❌ Failed to save selected items",
            error: error.toString()
        });
    }
});


// Note: Thêm endpoint để xóa toàn bộ giỏ hàng
app.delete("/cart/clear", async (req, res) => {
    try {
        const userId = req.query.userId; // Note: Giả định userId qua query
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "❌ userId is required"
            });
        }


        await winsnackCollection.deleteMany({ userId });
        res.json({
            success: true,
            message: "✅ Cart cleared"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "❌ Failed to clear cart",
            error: error.toString()
        });
    }
});






// Thêm vào file index.js
const ordersCollection = database.collection("Order");


app.post('/orders/create', async (req, res) => {
    try {
        const orderData = req.body;
        // Đảm bảo createdAt là một Date object nếu chưa phải
        if (typeof orderData.createdAt === 'string') {
            orderData.createdAt = new Date(orderData.createdAt);
        }
       
        // Thêm timestamp và trạng thái đơn hàng
        orderData.createdAt = new Date();
        orderData.status = 'Pending';


        const result = await ordersCollection.insertOne(orderData);
       
        res.status(201).json({
            orderId: result.insertedId,
            status: 'Pending',
            message: "Đơn hàng đã được tạo thành công"
        });
    } catch (error) {
        res.status(500).json({
            message: "Lỗi tạo đơn hàng",
            error: error.toString()
        });
    }
});


app.get('/orders/details/:orderId', async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const order = await ordersCollection.findOne({
            oderId: orderId
        });
       
        res.json(order);
    } catch (error) {
        res.status(500).json({
            message: "Lỗi lấy chi tiết đơn hàng",
            error: error.toString()
        });
    }
});


app.get('/orders/history', async (req, res) => {
    try {
        const userId = req.query.userId;
        const orders = await ordersCollection
            .find({ 'address.userId': userId })
            .sort({ createdAt: -1 })
            .toArray();
       
        res.json(orders);
    } catch (error) {
        res.status(500).json({
            message: "Lỗi lấy lịch sử đơn hàng",
            error: error.toString()
        });
    }
});


app.patch('/orders/cancel/:orderId', async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const result = await ordersCollection.findOneAndUpdate(
            { oderId: orderId },
            { $set: { status: 'Cancelled' } },
            { returnDocument: 'after' }
        );
       
        res.json({
            orderId: result.oderId,
            status: 'Cancelled',
            message: "Đơn hàng đã được hủy"
        });
    } catch (error) {
        res.status(500).json({
            message: "Lỗi hủy đơn hàng",
            error: error.toString()
        });
    }
});






// Endpoint lấy tất cả đơn hàng
app.get("/order", async (req, res) => {
    try {
        const orders = await orderCollection.find({}).toArray();
        res.json({
            success: true,
            data: orders,
            count: orders.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "❌ Failed to fetch orders",
            error: error.toString()
        });
    }
});


// Endpoint lấy đơn hàng theo userId - ĐẶT TRƯỚC endpoint lấy theo ID
app.get("/order/user/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const orders = await orderCollection.find({ userId: userId }).toArray();
       
        res.json({
            success: true,
            orders: orders,
            hasOrders: orders.length > 0
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "❌ Failed to fetch user orders",
            error: error.toString()
        });
    }
});


// Endpoint lấy chi tiết đơn hàng theo ID - ĐẶT SAU endpoint lấy theo userId
app.get("/order/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const order = await orderCollection.findOne({ _id: new ObjectId(id) });
       
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "❌ Order not found"
            });
        }
       
        res.json({
            success: true,
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "❌ Failed to fetch order",
            error: error.toString()
        });
    }
});


app.post("/login", async (req, res) => {
    const { profileName, password } = req.body;


    try {
        const user = await database.collection("User").findOne({ profileName, password });


        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Tên đăng nhập hoặc mật khẩu không đúng."
            });
        }


        res.json({
            success: true,
            message: "Đăng nhập thành công!",
            user: {
                profileName: user.profileName,
                role: user.role,
                userId: user.userId
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Lỗi máy chủ",
            error: error.toString()
        });
    }
});


app.post('/auth/login', async (req, res) => {
    const { profileName, password } = req.body;
    const user = await database.collection('User').findOne({ profileName });


    if (!user || user.password !== password) {
        return res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu" });
    }


    res.json({
        user: {
            userId: user.userId,
            profileName: user.profileName,
            role: user.role,
            email: user.email
        }
    });
});




app.get('/profile', async (req, res) => {
    try {
        const userId = req.query.userId; // Lấy userId từ query hoặc header


        if (!userId) {
            return res.status(400).json({ message: "Thiếu userId" });
        }


        const user = await database.collection('User').findOne({ userId });


        if (!user) {
            return res.status(404).json({ message: "Không tìm thấy người dùng" });
        }


        res.json({
            userId: user.userId,
            profileName: user.profileName,
            email: user.email,
            role: user.role,
            phone: user.phone,
            address: user.address,
            marketing: user.marketing
        });
       
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.toString() });
    }
});


// Thêm vào file index.js
app.post("/register", async (req, res) => {
    const { profileName, password } = req.body;


    try {
        // Kiểm tra profileName đã tồn tại chưa
        const existingUser = await database.collection("User").findOne({ profileName });
       
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Tên đăng nhập đã tồn tại."
            });
        }


        // Tạo userId mới
        const userId = new ObjectId().toString();
       
        // Tạo user mới
        const newUser = {
            userId,
            profileName,
            password,
            email: "",
            gender: "",
            birthDate: {
                day: "",
                month: "",
                year: ""
            },
            marketing: false,
            phone: "",
            address: "",
            role: "user",
            action: "just view"
        };


        // Lưu user vào database
        const result = await database.collection("User").insertOne(newUser);


        // Trả về thông tin user (không bao gồm password)
        const { password: _, ...userWithoutPassword } = newUser;
       
        res.status(201).json({
            success: true,
            message: "Đăng ký thành công!",
            user: userWithoutPassword
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Lỗi đăng ký tài khoản",
            error: error.toString()
        });
    }
});


// Thay đổi endpoint update-profile
app.put('/update-profile', async (req, res) => {
    try {
      const updatedData = req.body;
      const userId = updatedData.userId; // Lấy userId trực tiếp từ body request
     
      console.log('Received update request:', updatedData);
     
      // Kiểm tra xem userId có được cung cấp không
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'Thiếu userId trong yêu cầu'
        });
      }
     
      const result = await database.collection('User').findOneAndUpdate(
        { userId: userId },
        { $set: {
          profileName: updatedData.profileName,
          email: updatedData.email,
          phone: updatedData.phone,
          address: updatedData.address,
          marketing: updatedData.marketing
        }},
        { returnDocument: 'after' }
      );
     
      if (!result) {
        console.error('User not found for userId:', userId);
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy người dùng'
        });
      }
     
      console.log('Result before sending response:', result);
        return res.status(200).json({
        success: true,
        message: 'Cập nhật thông tin thành công',
        user: result.value
        });
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin người dùng:', error);
      return res.status(500).json({
        success: false,
        message: 'Đã xảy ra lỗi khi cập nhật thông tin người dùng'
      });
    }
  });


  // ✅ Endpoint lấy thông tin người dùng mới nhất theo userId
app.get('/user/:userId', async (req, res) => {
    const { userId } = req.params;


    try {
        const user = await database.collection("User").findOne({ userId });


        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng'
            });
        }


        res.json({
            success: true,
            user
        });
    } catch (error) {
        console.error('❌ Lỗi lấy thông tin người dùng:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: error.toString()
        });
    }
});


// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      const uploadDir = 'public/uploads/avatars';
      // Create directory if it doesn't exist
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: function(req, file, cb) {
      // Create unique filename: userId + timestamp + original extension
      const fileExt = path.extname(file.originalname);
      const fileName = `${req.body.userId}-${Date.now()}${fileExt}`;
      cb(null, fileName);
    }
  });
 
  // File filter to only allow image files
  const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ chấp nhận file hình ảnh!'), false);
    }
  };
 
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 2 * 1024 * 1024 // 2MB limit
    },
    fileFilter: fileFilter
  });
 
  // Avatar upload endpoint
  app.post('/upload-avatar', upload.single('avatar'), async (req, res) => {
    try {
      const userId = req.body.userId;
      if (!req.file || !userId) {
        return res.status(400).json({ success: false, message: 'Thiếu file hoặc userId' });
      }
 
      const avatarUrl = `/uploads/avatars/${req.file.filename}`;
 
      const result = await usersCollection.findOneAndUpdate(
        { userId: userId },
        { $set: { avatar: avatarUrl } },
        { returnDocument: 'after' }
      );
 
      if (!result.value) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy user' });
      }
 
      res.status(200).json({
        success: true,
        message: 'Cập nhật ảnh đại diện thành công',
        user: result.value
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      res.status(500).json({ success: false, message: 'Lỗi server: ' + error.message });
    }
  });  
 
  // Serve static files
  app.use('/uploads/avatars', express.static('public/uploads/avatars'));
 
  app.put('/update-password', async (req, res) => {
    try {
      const { userId, newPassword } = req.body;
      if (!userId || !newPassword) {
        return res.status(400).json({ success: false, message: "Thiếu userId hoặc newPassword" });
      }
  
      const result = await database.collection('User').findOneAndUpdate(
        { userId },
        { $set: { password: newPassword } },
        { returnDocument: 'after' }
      );
  
      if (!result.value) {
        return res.status(404).json({ success: false, message: "Không tìm thấy người dùng" });
      }
  
      res.json({ success: true, message: "Cập nhật mật khẩu thành công" });
    } catch (error) {
      console.error('Error in /update-password:', error);
      res.status(500).json({ success: false, message: "Lỗi server", error: error.toString() });
    }
  });

  app.get('/profile-admin', async (req, res) => {
    try {
        const userId = req.query.userId;
        console.log('Fetching profile for userId:', userId);
    
        if (!userId) {
          return res.status(400).json({ success: false, message: "Thiếu userId" });
        }
    
        const user = await database.collection('User').findOne({ userId });
        if (!user) {
          console.log('User not found for userId:', userId);
          return res.status(404).json({ success: false, message: "Không tìm thấy người dùng" });
        }
        res.json({
          success: true,
          user: {
            userId: user.userId,
            profileName: user.profileName,
            email: user.email,
            role: user.role,
            phone: user.phone || '',
            avatar: user.avatar || '',
            address: user.address || '',
            marketing: user.marketing || false
          }
        });
      } catch (error) {
        console.error('Error in /profile:', error);
        res.status(500).json({ success: false, message: "Lỗi server", error: error.toString() });
      }
    });

    // Endpoint upload avatar
app.post('/upload-avatar-admin', upload.single('avatar'), async (req, res) => {
    try {
        console.log('Received upload request - userId:', req.body.userId);
        console.log('Uploaded file:', req.file);

        const userId = req.body.userId;
        if (!req.file || !userId) {
            return res.status(400).json({ success: false, message: 'Thiếu file hoặc userId' });
        }

        const avatarUrl = `/uploads/avatars/${req.file.filename}`;
        console.log('Generated avatar URL:', avatarUrl);

        const result = await usersCollection.findOneAndUpdate(
            { userId: userId },
            { $set: { avatar: avatarUrl } },
            { returnDocument: 'after' }
        );

        if (!result.value) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy user' });
        }

        res.status(200).json({
            success: true,
            message: 'Cập nhật ảnh đại diện thành công',
            user: result.value
        });
    } catch (error) {
        console.error('Error uploading avatar:', error);
        res.status(500).json({ success: false, message: 'Lỗi server: ' + error.message });
    }
});

app.get('/get-avatar/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await usersCollection.findOne({ userId });
        if (!user || !user.avatar) {
            return res.status(404).json({ message: 'Avatar not found' });
        }

        const filePath = path.join(__dirname, 'public', user.avatar);
        res.sendFile(filePath);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.toString() });
    }
});


// API lấy danh sách khách hàng (users có role='user')
app.get("/api/customers", async (req, res) => {
    try {
      const users = await usersCollection.find({ role: 'user' }).toArray();
  
      const enhancedUsers = await Promise.all(users.map(async (user) => {
        const orderCount = await orderCollection.countDocuments({ userId: user.userId });
        return {
          _id: user._id,
          userId: user.userId,
          profileName: user.profileName,
          email: user.email,
          phone: user.phone || 'Chưa cung cấp',
          address: user.address || 'Chưa cung cấp',
          orderCount: orderCount // Tính từ Order
        };
      }));
  
      return res.status(200).json({
        success: true,
        data: enhancedUsers,
        message: 'Lấy danh sách khách hàng thành công'
      });
    } catch (error) {
      console.error('Error fetching customers:', error);
      return res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy danh sách khách hàng',
        error: error.message
      });
    }
  });

// API tìm kiếm khách hàng theo từ khóa và loại tìm kiếm
app.get("/api/search-user", async (req, res) => {
  try {
    const { searchTerm, searchType } = req.query;
    let query = { role: 'user' };
    
    // Xây dựng query dựa trên loại tìm kiếm
    if (searchTerm && searchType !== 'all') {
      switch (searchType) {
        case 'name':
          query.profileName = { $regex: searchTerm, $options: 'i' };
          break;
        case 'email':
          query.email = { $regex: searchTerm, $options: 'i' };
          break;
        case 'phone':
          query.phone = { $regex: searchTerm, $options: 'i' };
          break;
        case 'address':
          query.address = { $regex: searchTerm, $options: 'i' };
          break;
        case 'orderCount':
          // Trường hợp đặc biệt - xử lý riêng ở dưới
          break;
      }
    } else if (searchTerm) {
      // Tìm kiếm tất cả các trường
      query.$or = [
        { profileName: { $regex: searchTerm, $options: 'i' } },
        { email: { $regex: searchTerm, $options: 'i' } },
        { phone: { $regex: searchTerm, $options: 'i' } },
        { address: { $regex: searchTerm, $options: 'i' } }
      ];
    }
    
    // Tìm các user phù hợp với query
    const users = await usersCollection.find(query).toArray();
    
    // Lấy thông tin đơn hàng cho mỗi user
    let enhancedUsers = await Promise.all(users.map(async (user) => {
      const orderCount = await orderCollection.countDocuments({ userId: user.userId });
      
      return {
        _id: user._id,
        userId: user.userId,
        profileName: user.profileName,
        email: user.email,
        phone: user.phone || 'Chưa cung cấp',
        address: user.address || 'Chưa cung cấp',
        orderCount: orderCount
      };
    }));
    
    // Xử lý trường hợp tìm kiếm theo orderCount
    if (searchTerm && searchType === 'orderCount') {
      enhancedUsers = enhancedUsers.filter(user => 
        user.orderCount.toString().includes(searchTerm)
      );
    }
    
    return res.status(200).json({
      success: true,
      data: enhancedUsers,
      message: 'Tìm kiếm khách hàng thành công'
    });
  } catch (error) {
    console.error('Error searching customers:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server khi tìm kiếm khách hàng',
      error: error.message
    });
  }
});

// Endpoint lấy danh sách đơn hàng cho admin
app.get('/api/order-admin', async (req, res) => {
    try {
      const orders = await orderCollection.find({}).toArray();
      return res.status(200).json({
        success: true,
        data: orders,
        message: 'Lấy danh sách đơn hàng thành công'
      });
    } catch (error) {
      console.error('Error fetching orders:', error);
      return res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy danh sách đơn hàng',
        error: error.message
      });
    }
  });
  
  // Endpoint lấy chi tiết đơn hàng theo orderId
  app.get('/api/order-detail-admin/:orderId', async (req, res) => {
    try {
      const { orderId } = req.params;
      const order = await orderCollection.findOne({ orderId });
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy đơn hàng'
        });
      }
  
      // Lấy thông tin người dùng từ collection User (nếu cần)
      const user = await usersCollection.findOne({ userId: order.userId });
      if (user) {
        order.userName = user.profileName || 'Khách vãng lai';
        if (!order.contact) {
          order.contact = {
            name: user.profileName || 'Chưa cung cấp',
            address: user.address || 'Chưa cung cấp',
            phone: user.phone || 'Chưa cung cấp'
          };
        }
      }
  
      return res.status(200).json({
        success: true,
        data: order,
        message: 'Lấy chi tiết đơn hàng thành công'
      });
    } catch (error) {
      console.error('Error fetching order detail:', error);
      return res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy chi tiết đơn hàng',
        error: error.message
      });
    }
  });

// Khởi động server
app.listen(port, () => {
    console.log(`🚀 Server is running at http://localhost:${port}`);
});
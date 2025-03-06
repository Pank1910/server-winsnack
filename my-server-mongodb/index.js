const express = require('express');
const app = express();
const port = 5000;
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const { MongoClient, ObjectId } = require('mongodb');

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
const winsnackCollection = database.collection("CARTS");
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
        
        if (!collectionNames.includes("CARTS")) {
            return res.status(404).json({ 
                success: false, 
                message: "❌ Collection 'CARTS' does not exist!" 
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
        const product = await productsCollection.findOne({ _id: new ObjectId(id) });
        
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

// Giả sử usersCollection đã được khai báo từ trước
const usersCollection = database.collection("User");

// API cập nhật địa chỉ người dùng
app.put('/api/addresses/update', async (req, res) => {
    try {
        const { userId, profileName, phone, address } = req.body;

        // Kiểm tra userId có tồn tại không
        const user = await usersCollection.findOne({ _id: new MongoClient.ObjectId(userId) });
        
        if (!user) {
            return res.status(404).json({ 
                message: "Người dùng không tồn tại" 
            });
        }

        // Cập nhật thông tin địa chỉ
        const result = await usersCollection.findOneAndUpdate(
            { _id: new MongoClient.ObjectId(userId) },
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
app.get('/api/addresses/user', async (req, res) => {
    try {
        const userId = req.query.userId;

        const user = await usersCollection.findOne(
            { _id: new MongoClient.ObjectId(userId) },
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

app.post('/cart/add', async (req, res) => {
    try {
        const cartItem = req.body;
        
        // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
        const existingItem = await winsnackCollection.findOne({
            productId: cartItem.productId,
            userId: cartItem.userId
        });

        if (existingItem) {
            // Nếu đã tồn tại, cập nhật số lượng
            const result = await winsnackCollection.findOneAndUpdate(
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
            const result = await winsnackCollection.insertOne(cartItem);
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
        const userId = req.query.userId; // Lấy từ query param
        const cartItems = await winsnackCollection.find({ userId }).toArray();
        res.json(cartItems);
    } catch (error) {
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

        const result = await winsnackCollection.findOneAndUpdate(
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

        const result = await winsnackCollection.deleteMany({ userId });
        
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

// Thêm vào file index.js
const ordersCollection = database.collection("Order");

app.post('/api/orders/create', async (req, res) => {
    try {
        const orderData = req.body;
        
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

app.get('/api/orders/details/:orderId', async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const order = await ordersCollection.findOne({ 
            _id: new MongoClient.ObjectId(orderId) 
        });
        
        res.json(order);
    } catch (error) {
        res.status(500).json({ 
            message: "Lỗi lấy chi tiết đơn hàng", 
            error: error.toString() 
        });
    }
});

app.get('/api/orders/history', async (req, res) => {
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

app.patch('/api/orders/cancel/:orderId', async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const result = await ordersCollection.findOneAndUpdate(
            { _id: new MongoClient.ObjectId(orderId) },
            { $set: { status: 'Cancelled' } },
            { returnDocument: 'after' }
        );
        
        res.json({
            orderId: result._id,
            status: 'Cancelled',
            message: "Đơn hàng đã được hủy"
        });
    } catch (error) {
        res.status(500).json({ 
            message: "Lỗi hủy đơn hàng", 
            error: error.toString() 
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

// // Endpoint lấy đơn hàng theo userId - ĐẶT TRƯỚC endpoint lấy theo ID
// app.get("/order/user/:userId", async (req, res) => {
//     try {
//         const { userId } = req.params;
//         const orders = await orderCollection.find({ userId: userId }).toArray();
        
//         res.json({
//             success: true,
//             orders: orders,
//             hasOrders: orders.length > 0
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: "❌ Failed to fetch user orders",
//             error: error.toString()
//         });
//     }
// });

// LƯU Ý: Đặt endpoint này TRƯỚC endpoint "/order/:id"
app.get("/order/user/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        console.log(`🔍 Tìm đơn hàng cho người dùng: ${userId}`);
        
        const orders = await orderCollection.find({ userId: userId }).toArray();
        console.log(`✅ Tìm thấy ${orders.length} đơn hàng`);
        
        res.json({
            success: true,
            orders: orders,
            hasOrders: orders.length > 0
        });
    } catch (error) {
        console.error(`❌ Lỗi khi tìm đơn hàng: ${error}`);
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



// Khởi động server
app.listen(port, () => {
    console.log(`🚀 Server is running at http://localhost:${port}`);
});

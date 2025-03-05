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

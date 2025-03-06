const express = require('express');
const app = express();
const port = 5000;
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const { MongoClient, ObjectId } = require('mongodb'); // Note: Thêm ObjectId để xử lý ID hợp lệ

app.use(morgan("combined"));
app.use(express.json()); // Note: Thay body-parser bằng express.json()
app.use(express.urlencoded({ extended: true })); // Note: Thay body-parser bằng express.urlencoded()
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

app.get("/", (req, res) => {
    res.send("This Web server is processed for MongoDB");
});

// Lấy tất cả sản phẩm
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

// Lấy một sản phẩm theo ID
app.get("/products/:id", async (req, res) => {
    try {
        const { id } = req.params;
        // Note: Kiểm tra ID hợp lệ trước khi query
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "❌ Invalid product ID"
            });
        }
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

        res.json({
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

// Note: Thêm logic đóng kết nối MongoDB khi server dừng
process.on('SIGINT', async () => {
    await client.close();
    console.log("✅ MongoDB connection closed");
    process.exit(0);
});

app.listen(port, () => {
    console.log(`🚀 Server is running at http://localhost:${port}`);
});
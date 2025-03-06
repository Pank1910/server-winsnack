const express = require('express');
const app = express();
const port = 5001;  // hoặc 6000, 7000 đều được, miễn là không bị xung đột.
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const { MongoClient } = require('mongodb');

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

app.get("/", (req, res) => res.send("This Web server is processed for MongoDB"));

// Check DB
app.get("/check-db", async (req, res) => {
    try {
        const collections = await database.listCollections().toArray();
        const collectionNames = collections.map(col => col.name);
        if (!collectionNames.includes("CARTS")) {
            return res.status(404).json({ success: false, message: "❌ Collection 'CARTS' does not exist!" });
        }
        const sampleDoc = await winsnackCollection.findOne({});
        res.json({ success: true, message: "✅ MongoDB connected successfully!", sampleDocument: sampleDoc || "No documents found in CARTS collection" });
    } catch (error) {
        res.status(500).json({ success: false, message: "❌ MongoDB connection failed", error: error.toString() });
    }
});

// Get all products
app.get("/products", async (req, res) => {
    try {
        const products = await productsCollection.find({}).toArray();
        res.json({ success: true, data: products, count: products.length });
    } catch (error) {
        res.status(500).json({ success: false, message: "❌ Failed to fetch products", error: error.toString() });
    }
});

// Get product by ID
app.get("/products/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productsCollection.findOne({ _id: id });
        if (!product) {
            return res.status(404).json({ success: false, message: "❌ Product not found" });
        }
        res.json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: "❌ Failed to fetch product", error: error.toString() });
    }
});

app.listen(port, () => console.log(`🚀 Server running at http://localhost:${port}`));

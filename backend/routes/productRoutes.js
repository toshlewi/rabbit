const express = require("express");
const Product = require("../models/Product");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// @route   POST /api/products
// @desc    Create a new Product
// @access  Private/Admin
router.post("/", protect, admin, async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            discountPrice,
            countInStock,
            category,
            brand,
            sizes,
            colors,
            collections,
            material,
            gender,
            images,
            isFeatured,
            isPublished,
            tags,
            dimensions,
            weight,
            sku
        } = req.body;

        const product = new Product({
            name,
            description,
            price,
            discountPrice,
            countInStock,
            category,
            brand,
            sizes,
            colors,
            collections,
            material,
            gender,
            images,
            isFeatured,
            isPublished,
            tags,
            dimensions,
            weight,
            sku,
            user: req.user._id
        });

        const createdProduct = await product.save();

        res.status(201).json(createdProduct);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
});


// @route   PUT /api/products/:id
// @desc    Update existing product by ID
// @access  Private/Admin
router.put("/:id", protect, admin, async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            discountPrice,
            countInStock,
            category,
            brand,
            sizes,
            colors,
            collections,
            material,
            gender,
            images,
            isFeatured,
            isPublished,
            tags,
            dimensions,
            weight,
            sku
        } = req.body;

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.discountPrice = discountPrice || product.discountPrice;
        product.countInStock = countInStock ?? product.countInStock;
        product.category = category || product.category;
        product.brand = brand || product.brand;
        product.sizes = sizes || product.sizes;
        product.colors = colors || product.colors;
        product.collections = collections || product.collections;
        product.material = material || product.material;
        product.gender = gender || product.gender;
        product.images = images || product.images;
        product.isFeatured =
            isFeatured !== undefined
                ? isFeatured
                : product.isFeatured;
        product.isPublished =
            isPublished !== undefined
                ? isPublished
                : product.isPublished;
        product.tags = tags || product.tags;
        product.dimensions = dimensions || product.dimensions;
        product.weight = weight ?? product.weight;
        product.sku = sku || product.sku;

        const updatedProduct = await product.save();

        res.json(updatedProduct);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
});


// @route   DELETE /api/products/:id
// @desc    Delete a product by ID
// @access  Private/Admin
router.delete("/:id", protect, admin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        await product.deleteOne();

        return res.status(200).json({
            message: "Product removed successfully"
        });
    } catch (error) {
        console.error("Delete product error:", error);

        return res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
});


// @route   GET /api/products
// @desc    Get all products with optional query filters
// @access  Public
router.get("/", async (req, res) => {
    try {
        const {
            collection,
            size,
            color,
            gender,
            minPrice,
            maxPrice,
            sortBy,
            search,
            category,
            material,
            brand,
            limit
        } = req.query;

        let query = {};

        // Collection filter
        if (
            collection &&
            collection.toLowerCase() !== "all"
        ) {
            query.collections = collection;
        }

        // Category filter
        if (
            category &&
            category.toLowerCase() !== "all"
        ) {
            query.category = category;
        }

        // Material filter
        if (material) {
            const materialValues = material
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean);

            if (materialValues.length > 0) {
                query.material = {
                    $in: materialValues
                };
            }
        }

        // Brand filter
        if (brand) {
            const brandValues = brand
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean);

            if (brandValues.length > 0) {
                query.brand = {
                    $in: brandValues
                };
            }
        }

        // SIZE FILTER
        // Product schema uses "sizes", not "size"
        if (size) {
            const sizeValues = size
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean);

            if (sizeValues.length > 0) {
                query.sizes = {
                    $in: sizeValues
                };
            }
        }

        // Color filter
        if (color) {
            const colorValues = color
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean);

            if (colorValues.length > 0) {
                query.colors = {
                    $in: colorValues
                };
            }
        }

        // Gender filter
        if (gender) {
            query.gender = gender;
        }

        // Price filter
        if (minPrice || maxPrice) {
            query.price = {};

            if (minPrice) {
                query.price.$gte = Number(minPrice);
            }

            if (maxPrice) {
                query.price.$lte = Number(maxPrice);
            }
        }

        // Search filter
        if (search) {
            query.$or = [
                {
                    name: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    description: {
                        $regex: search,
                        $options: "i"
                    }
                }
            ];
        }

        // Sort logic
        let sort = {};

        if (sortBy) {
            switch (sortBy) {
                case "priceAsc":
                    sort = {
                        price: 1
                    };
                    break;

                case "priceDesc":
                    sort = {
                        price: -1
                    };
                    break;

                case "popularity":
                    sort = {
                        rating: -1
                    };
                    break;

                default:
                    sort = {};
                    break;
            }
        }

        // Fetch products
        const products = await Product.find(query)
            .sort(sort)
            .limit(Number(limit) || 0);

        res.json(products);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
});


// @route   GET /api/products/best-seller
// @desc    Retrieve product with highest rating
// @access  Public
router.get("/best-seller", async (req, res) => {
    try {
        const bestSeller = await Product.findOne()
            .sort({ rating: -1 });

        if (bestSeller) {
            res.json(bestSeller);
        } else {
            res.status(404).json({
                message: "No best seller found"
            });
        }
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });
    }
});


// @route   GET /api/products/new-arrivals
// @desc    Retrieve latest products
// @access  Public
router.get("/new-arrivals", async (req, res) => {
    try {
        const newArrivals = await Product.find()
            .sort({ createdAt: -1 })
            .limit(8);

        res.json(newArrivals);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });
    }
});


// @route   GET /api/products/similar/:id
// @desc    Retrieve similar products based on gender and category
// @access  Public
router.get("/similar/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        const similarProducts = await Product.find({
            _id: {
                $ne: id
            },
            gender: product.gender,
            category: product.category
        }).limit(4);

        res.json(similarProducts);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });
    }
});


// @route   GET /api/products/:id
// @desc    Get a single product by ID
// @access  Public
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({
                message: "Product not found"
            });
        }
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });
    }
});


module.exports = router;
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const Product = require("./models/Product");
const User = require("./models/User");
const products = require("./data/products");

dotenv.config({ path: path.join(__dirname, ".env") });

// connect to mongodb
mongoose.connect(process.env.MONGO_URI);

// FUNCTION TO SEED DATA
// NOTE: this version never wipes existing collections. Instead it:
//   1. Reuses the admin user if one already exists (instead of recreating it)
//   2. Upserts each product by its `sku` — matching products get updated
//      in place, new products get inserted, and anything already in the
//      database that isn't in products.js is left completely untouched.
const seedData = async () => {
  try {
    // Get (or create, only if missing) the default admin user
    let adminUser = await User.findOne({ email: "admin@example.com" });

    if (!adminUser) {
      adminUser = await User.create({
        name: "Admin User",
        email: "admin@example.com",
        password: "123456",
        role: "admin",
      });
      console.log("Admin user created");
    } else {
      console.log("Admin user already exists — reusing it");
    }

    const userID = adminUser._id;

    // Build one upsert operation per product, keyed on sku.
    // upsert: true => insert if it doesn't exist yet.
    // If it already exists (same sku), it's updated, not duplicated.
    const bulkOps = products.map((product) => ({
      updateOne: {
        filter: { sku: product.sku },
        update: { $set: { ...product, user: userID, isPublished: true } },
        upsert: true,
      },
    }));

    const result = await Product.bulkWrite(bulkOps);

    console.log(
      `Seed complete — inserted: ${result.upsertedCount}, updated: ${result.modifiedCount}, matched: ${result.matchedCount}`
    );
    console.log("Existing data was left untouched. Nothing was deleted.");

    process.exit();
  } catch (error) {
    console.error("Error seeding the data", error);
    process.exit(1);
  }
};

seedData();
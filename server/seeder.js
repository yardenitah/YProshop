// server/seeder.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from "colors";
import users from "./data/users.js";
import products from "./data/products.js";
import User from "./models/userModel.js";
import Product from "./models/productModel.js";
import Order from "./models/orderModel.js";
import connectDB from "./config/db.js";

//! I wrote this file to insert and delete temporary data to the database.
//! I add a script for teth in package.json.

dotenv.config();

connectDB();

const importDate = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    const createdUsers = await User.insertMany(users);

    const adminUser = createdUsers[0]._id;

    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser };
    });

    await Product.insertMany(sampleProducts);

    console.log(`Data Imported`.green.inverse);
    process.exit();
  } catch (error) {
    colors.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyDate = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log(`Data destroyed`.red.inverse);
    process.exit();
  } catch (error) {
    colors.error(`${error}`.red.inverse);
    process.exit(1);
  }
};


if (process.argv[2] === "-d") {
  destroyDate();
} else {
  importDate();
}

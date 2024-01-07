#! /usr/bin/env node

console.log(
    'This script populates some test items and categories to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
  );
  
  // Get arguments passed on command line
  const userArgs = process.argv.slice(2);
  
  const Item = require("./models/item")
  const Category = require("./models/category")

  const categories = [];
  const items = [];
  
  const mongoose = require("mongoose");
  mongoose.set("strictQuery", false);
  
  const mongoDB = userArgs[0];
  
  main().catch((err) => console.log(err));
  
  async function main() {
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    await createCategories();
    await createItems();
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
  }
  
  // We pass the index to the ...Create functions so that, for example,
  // genre[0] will always be the Fantasy genre, regardless of the order
  // in which the elements of promise.all's argument complete.
  async function categoryCreate(index, name, description) {
    const categorydetail = { 
        name: name,
        description: description,
    };

    const category = new Category(categorydetail);
    await category.save();
    categories[index] = category;
    console.log(`Added category: ${name}`);
  };

  async function itemCreate(index, name, description, category, price, in_stock, image) {
    const itemdetail = { 
        name: name,
        description: description,
        category: category,
        price: price,
        in_stock: in_stock,
        image: image 
    };

    const item = new Item(itemdetail);
    await item.save();
    items[index] = item;
    console.log(`Added item: ${name}`);
  };

  async function createCategories() {
    console.log("Adding genres");
    await Promise.all([
      categoryCreate(0, "Kits", "Iconic football shirts, the best of the best"),
      categoryCreate(1, "Balls", "Remarkable balls"),
      categoryCreate(2, "Shoes", "Football's best boots. Style and comfort")
    ]);
  };

  async function createItems() {
    console.log("Adding items");
    await Promise.all([
      itemCreate(0, 
        "98 Fiorentina Kit",
        "Iconic Fiorentina Nintendo Shirt",
        categories[0],
        30,
        18,
        ["https://drive.google.com/uc?export=view&id=1OvydYSSK8gXdEq7FDK6cEXB465sSbyKy"]
      ),
      itemCreate(1, 
        "2007 Milan Kit",
        "2007 UCL Winner Milan shirt",
        categories[0],
        40,
        11,
        ["https://drive.google.com/uc?export=view&id=1x1hxXvU5Fa5H_P57w3qMMbh_4QhgdjjT"]
      ),
      itemCreate(2, 
        "88 Netherlands Kit",
        "Euro 88 champions Holland shirt. Wore by Ruud Gullit, Van Basten.",
        categories[0],
        30,
        9,
        ["https://drive.google.com/uc?export=view&id=1GtscN4edyNVATBdlin_YNcdEsOJnoBYY"]
      ),
      itemCreate(3, 
        "Nike Strike Phantom Ball",
        "Nike Strike Phantom Scorpion silver Ball, used in Serie A, Brasileirao in 2003-2005",
        categories[1],
        20,
        9,
        ["https://drive.google.com/uc?export=view&id=1zRZIOXtP-acjDxqDBb-Z5WEfUFtVIKU4"]
      ),
      itemCreate(4, 
        "Nike Joga Bonito Ball",
        "World's recognized ball, appeared in famous Joga Bonito ads",
        categories[1],
        50,
        7,
        ["https://drive.google.com/uc?export=view&id=1PW9Lqq1qAvwUnRcGdsmGvaSJIzmXp9dk"]
      ),
      itemCreate(5, 
        "Nike Ordem 5",
        "2018 Premier league match ball",
        categories[1],
        20,
        13,
        ["https://drive.google.com/uc?export=view&id=1m8JH3t1x3klG4OdEp77B8tmVtgKcaS42"]
      ),
      itemCreate(6, 
        "Nike Tiempo Legend 7",
        "Golden Tiempo Legend 7, wore by Ronaldinho",
        categories[2],
        30,
        15,
        ["https://drive.google.com/uc?export=view&id=1ApfLKyZRfZ1SuNuJhRP7sdMF_9LBKoJI"]
      ),
    ]);
  };
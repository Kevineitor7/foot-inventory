const Category = require("../models/category")
const Item = require("../models/item")

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

const kitsId = "658c8394493aed162fb056eb"
const ballsId = "658c8394493aed162fb056ec"
const shoesId = "658c8394493aed162fb056ed"

const defaultCategories = ["Balls", "Shoes", "Kits", "All Items"]

exports.index = asyncHandler(async (req, res, next) => {
    const allCategories = await Category.find()
        .sort({name : 1})
        .exec();

    
    res.render("index", {
        title: "Inventory",
        categories: allCategories
    })
});

exports.categoryItems = asyncHandler(async (req, res, next) => {
    const [category, items] = await Promise.all([
        Category.findById(req.params.id).exec(),
        Item.find({category: req.params.id}).exec()
    ]) 

    res.render("category_items", {
        category: category,
        categoryName: category.name,
        categoryDescription: category.description,
        categoryItems: items,
        defaultCategories: defaultCategories
    })
})

exports.allKits = asyncHandler(async (req, res, next) => {
    const [category, items] = await Promise.all([
        Category.findById(kitsId).exec(),
        Item.find({category: kitsId}).exec()
    ]) 
    
    res.render("category_items", {
        category: category,
        categoryName: category.name,
        categoryDescription: category.description,
        categoryItems: items,
        defaultCategories: defaultCategories
    })
})

exports.allBalls = asyncHandler(async (req, res, next) => {
    const [category, items] = await Promise.all([
        Category.findById(ballsId).exec(),
        Item.find({category: ballsId}).exec()
    ]) 
    
    res.render("category_items", {
        category: category,
        categoryName: category.name,
        categoryDescription: category.description,
        categoryItems: items,
        defaultCategories: defaultCategories
    })
})

exports.allShoes = asyncHandler(async (req, res, next) => {
    const [category, items] = await Promise.all([
        Category.findById(shoesId).exec(),
        Item.find({category: shoesId}).exec()
    ]) 
    
    res.render("category_items", {
        category: category,
        categoryName: category.name,
        categoryDescription: category.description,
        categoryItems: items,
        defaultCategories: defaultCategories
    })
})

exports.allItems = asyncHandler(async (req, res, next) => {
    const items  = await Item.find().populate("category").exec()
    
    res.render("category_items", {
        category: "All Items",
        categoryName: 'All Items',
        categoryDescription: "All Items",
        categoryItems: items,
        defaultCategories: defaultCategories
    })
});

exports.categoryCreate_get = asyncHandler(async (req, res, next) => {
    res.render("category_form", {
        title: "Create Category",
        category: false
    })
});

exports.categoryCreate_post = [
    body("name", "name should not be empty")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("description", "description should not be empty")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    
    asyncHandler(async (req, res, next) => {
        
        const errors = validationResult(req);
        
        const category = new Category({ 
            name: req.body.name,
            description: req.body.description
        })

        if (!errors.isEmpty()) {
            res.render("category_form", {
                title: "Create Category",
                category: category,
                errors: errors.array()
            });
            return;
        } else {
            const categoryExists = await Category.findOne({ name: req.body.name })
            .collation({ locale: "en", strength: 2 })
            .exec()
            if (categoryExists) {
                res.redirect(categoryExists.url)
            } else {
                await category.save()
                res.redirect(category.url)
            }
        }
    })
];

exports.categoryDelete_get = asyncHandler(async (req, res, next) => {
    const [category, itemsInCategory] = await Promise.all([
        Category.findById(req.params.id).exec(),
        Item.find({ category: req.params.id }, "name image").exec()
    ])

    if (category == null) {
        res.redirect("/")
    }

    res.render("category_delete", {
        title: "Delete Category",
        category: category,
        categoryItems: itemsInCategory,
    })
});

exports.categoryDelete_post = asyncHandler(async (req, res, next) => {
    const [category, itemsInCategory] = await Promise.all([
        Category.findById(req.params.id).exec(),
        Item.find({ category: req.params.id }, "name image").exec()
    ])

    if (itemsInCategory.length > 0) {
        res.render("category_delete", {
            title: "Delete Category",
            category: category,
            categoryItems: itemsInCategory,
        });
        return;
    } else {
        await Category.findByIdAndDelete(req.body.categoryid)
        res.redirect("/")
    }
});

exports.categoryEdit_get = asyncHandler(async (req, res, next) => {
    const category = await Category.findById(req.params.id).exec()

    if (category === null) {
        const err = new Error("Category not found");
        err.status = 404;
        return next(err);
      }

    res.render("category_form", {
        title: "Edit Category",
        category: category
    })
});

exports.categoryEdit_post = [
    body("name", "name should not be empty")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("description", "description should not be empty")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    
    asyncHandler(async (req, res, next) => {
        
        const errors = validationResult(req);
        
        const category = new Category({ 
            name: req.body.name,
            description: req.body.description,
            _id: req.params.id
        })

        if (!errors.isEmpty()) {
            res.render("category_form", {
                title: "Edit Category",
                category: category,
                errors: errors.array()
            });
            return;
        } else {
            const categoryExists = await Category.findOne({ 
                name: req.body.name,
                description: req.body.description 
            })
            .collation({ locale: "en", strength: 2 })
            .exec()
            if (categoryExists) {
                res.redirect(categoryExists.url)
            } else {
                const updatedCategory = await Category.findByIdAndUpdate(req.params.id, category, {})
                res.redirect(updatedCategory.url)
            }
        }
    })
];
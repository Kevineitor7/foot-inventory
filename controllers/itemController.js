const Category = require("../models/category");
const Item = require("../models/item")

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.item = asyncHandler(async (req, res, next) => {
    const item = await Item.findById(req.params.id).populate("category").exec()

    res.render("item", {
        title: item.name,
        item: item
    })
});

exports.itemCreate_get = asyncHandler(async (req, res, next) => {
    const categories = await Category.find().sort({ name: 1 }).exec()

    res.render("item_form", {
        title: "Create Item",
        categories: categories,
        item: false,
    })
});

exports.itemCreate_post = [
    body("name", "name should not be empty please")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("description", "name should not be empty please")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("category", "name should not be empty please")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("price", "enter a price")
        .isNumeric(),
    body("in_stock", "enter units")
        .isNumeric(),
    body("image", "image should not be empty please")
        .trim(),

    asyncHandler(async (req, res, next) => {

        const errors = validationResult(req);

        const item = new Item({
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            price: req.body.price,
            in_stock: req.body.in_stock,
            image: req.body.image.length == 0 ? [] : req.body.image
        })
        
        if (!errors.isEmpty()) {
            const categories = await Category.find().sort({ name: 1 }).exec()

            res.render("item_form", {
                title: "Create Item",
                categories: categories,
                item: item,
                errors: errors.array(),
            });
            return
        } else {
            await item.save()
            res.redirect(item.url)
        }
    })
];

exports.itemDelete_get = asyncHandler(async (req, res, next) => {
    const item = await Item.findById(req.params.id).populate("category").exec()

    if (item == null) {
        res.redirect("/")
    }

    res.render("item_delete", {
        title: "delete item",
        item: item
    })
});

exports.itemDelete_post = asyncHandler(async (req, res, next) => {
    const item = await Item.findById(req.params.id).populate("category").exec()
    
    await Item.findByIdAndDelete(req.body.itemid)
    res.redirect(item.category.url)
});

exports.itemEdit_get = asyncHandler(async (req, res, next) => {
    const [item, categories] = await Promise.all([
        Item.findById(req.params.id).populate("category").exec(),
        Category.find().sort({ name: 1 }).exec()
    ])

    if (item === null) {
        // No results.
        const err = new Error("Item not found");
        err.status = 404;
        return next(err);
    }

    res.render("item_form", {
        title: "Edit Item",
        item: item,
        categories: categories
    })
});

exports.itemEdit_post = [
    body("name", "name should not be empty please")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("description", "name should not be empty please")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("category", "name should not be empty please")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("price", "enter a price")
        .isNumeric(),
    body("in_stock", "enter units")
        .isNumeric(),
    body("image", "image should not be empty please")
        .trim(),

    asyncHandler(async (req, res, next) => {

        const errors = validationResult(req);

        const item = new Item({
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            price: req.body.price,
            in_stock: req.body.in_stock,
            image: req.body.image.length == 0 ? [] : req.body.image,
            _id: req.params.id
        })
        
        if (!errors.isEmpty()) {
            const categories = await Category.find().sort({ name: 1 }).exec()

            res.render("item_form", {
                title: "Edit Item",
                categories: categories,
                item: item,
                errors: errors.array(),
            });
            return
        } else {
            const updatedItem = await Item.findByIdAndUpdate(req.params.id, item, {})
            res.redirect(updatedItem.url)
        }
    })
];

exports.uploadImage_get = asyncHandler(async (req, res, next) => {
    const item = await Item.findById(req.params.id).populate("category").exec()

    res.render("image_form", {
        title: "Upload Item Image",
        item: item,
    })
})

exports.uploadImage_post = [
    body("image", "image should not be empty please")
        .trim(),
    
    asyncHandler(async (req, res, next) => {

        const errors = validationResult(req);
        

        if (!errors.isEmpty()) {
            const item = await Item.findById(req.params.id).populate("category").exec()

            res.render("image_form", {
                title: "Upload Item Image",
                item: item,
                errors: errors.array(),
            });
            return
        } else {
            const updatedItem = await Item.findByIdAndUpdate(
                req.params.id, 
                { image: req.body.image.length == 0 ? [] : req.body.image }, 
                {}
            )
            res.redirect(updatedItem.url)
        }
    })
]
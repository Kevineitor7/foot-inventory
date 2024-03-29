const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
    name: { type: String , required: true},
    description: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    price: { type: Number, required: true },
    in_stock: { type: Number, required: true },
    image: [{ type: String }]
});

ItemSchema.virtual("url").get(function() {
    return `/Item/${this._id}`
});

module.exports = mongoose.model("Item", ItemSchema);
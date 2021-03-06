const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Product = new Schema({
    id: ObjectId,
    name: { type: String, default: '' },
    category: [{ type: String }],
    image: [{ type: String, default: '' }],
    description: { type: String, default: '' },
    size: {
        width: { type: Number, default: 0 },
        height: { type: Number, default: 0 },
        depth: { type: Number, default: 0 },
        unit: { type: String, default: 'm' },
    },
    color: { type: String, default: '' },
    material: { type: String, default: '' },
    weight: { type: String, default: '' },
    inStock: { type: Number, default: 0 },
    price: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    createAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Product', Product);

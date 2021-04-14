const mongoose = require("mongoose")
const menu = require("./menu.js")
const orderSchema = new mongoose.Schema({
    orderItems : [menu.itemSchema],
    when: {type: Date, default: Date.now}
},{ collection : 'orders' })

const Order = mongoose.model('orders', orderSchema)
module.exports = {Order, orderSchema}
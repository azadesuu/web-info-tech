const mongoose = require("mongoose")

//import models 
const Order = mongoose.model("orders")
const Vendor = mongoose.model("vendors")


// middleware to ensure vendor is open
async function checkIsOpen(req, res, next){
    const vendor = await Vendor.findOne( {van_ID: req.params.van_ID} );
    console.log(vendor)
    if (vendor.isOpen)
        return next();
    // if not open, redirect to location form
    res.render('vendor/setLocation');
}

// get details of a vendor
const getOneVendor = async(req,res)=>{
    try{
        console.log(req.params.van_ID);
        vendor = await Vendor.findOne( {van_ID: req.params.van_ID} )
        if (vendor== null) res.send("Queried vendor not found");
        else res.send(vendor);
    }catch(err){
        console.log(err)
    }
}

//get details of an order (of the van)
const getOneOrder = async(req,res)=>{
    try{
        order = await Order.findOne( {van_ID: req.params.van_ID, _id: req.params.order_id})
        res.render('vendor/orderDetail',{order})
    }catch(err){
        console.log(err)
    }
}

// update the status of the order
const updateOrderStatus = async(req,res)=>{
    try{
        await Order.findOneAndUpdate({_id: req.params.order_id}, {status: req.body.status}, {returnNewDocument: true}, function (err){    
        if (err) res.send('failed to update');
        else {res.render('vendor/orders');}
        })
    }catch(err){
        console.log(err)
    }
}

//marks an order as Fulfilled
const markAsFulfilled = async(req,res)=>{
    try{
        await Order.findOneAndUpdate({_id: req.params.order_id}, {status: "Fulfilled"}, {returnNewDocument: true}, function (err){    
        if (err) res.send('failed to update');
        else {res.render('vendor/orders');}
        })
    }catch(err){
        console.log(err)
    }
}

//marks an order as Complete
const markAsComplete = async(req,res)=>{
    try{
        await Order.findOneAndUpdate({_id: req.params.order_id}, {status: "Complete"}, {returnNewDocument: true}, function (err){    
        if (err) res.send('failed to update');
        else {res.render('vendor/orders');}        
        })
    }catch(err){
        console.log(err)
    }
}

// set the status of the van
const showSetVanStatus = async (req,res) => {
    try {
        const vendor = await Vendor.findOne( {van_ID: req.params.van_ID} )
        res.render("vendor/setLocation", {vendor});
    }
    catch(err){
        console.log(err)
    }
}


// set the status of the van
const SetVanStatus = async (req,res) => {
    try {
        console.log("setting location");
        const vendor = await Vendor.findOneAndUpdate({van_ID: req.params.van_ID}, 
            {latitude: req.body.latitude, longtitude: req.body.longtitude, 
                isReadyForOrder: req.body.isReadyForOrder, locDescription: req.body.locDescription}, function (err){
        if (err) res.send('failed to update');
        else {res.render("vendor/", {vendor});}
        })
    }
    catch(err){
        console.log(err)
    }
}

//get all outstanding orders of a vendor (unfulfilled/fulfilled)
const getAllOutstandingOrders = async(req, res)=>{
    try{
       const orders = await Order.find({van_ID: req.params.van_ID, status :{$in: ['Unfulfilled']}})
       orders.sort(function(a,b){
           return parseInt(a.when) - parseInt(b.when);
       })
       res.render('vendor/orders',{"orders": orders})
    //    res.send(await Order.find({van_ID: req.params.van_ID}));
    }catch(err){
        console.log(err)
    }
}

//get all orders of a vendor
const getAllOrders = async(req, res)=>{
    try{
       res.send(await Order.find({van_ID: req.params.van_ID}));
    }catch(err){
        console.log(err)
    }
}

module.exports = {
    getOneVendor,
    getOneOrder,
    showSetVanStatus,
    SetVanStatus,
    updateOrderStatus,
    markAsFulfilled,
    markAsComplete,
    getAllOutstandingOrders,
    getAllOrders,
    checkIsOpen
}
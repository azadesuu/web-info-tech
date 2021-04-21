const mongoose = require("mongoose")

//import models 
const Order = mongoose.model("orders")
const Vendor = mongoose.model("vendors")



const setVanStatus = async (req,res) => {
    console.log(req.params.id)
    const vendor = await Vendor.findOne( {_id: req.params.id} ).lean()
    res.render('setVanStatus',{"Vendor":vendor})
    var query = {}
    if(req.body.latitude && req.body.longtitude !==''){
        query["latitude"] = {$regex: new RegExp(req.body.latitude, 'i') }
        query["longtitude"] = {$regex: new RegExp(req.body.longtitude, 'i') }
    }
    if(req.body.isReadyForOrder){
        query["isReadyForOrder"] = true
    }
    try {
        //update this query to the current vendor
        vendor.updateMany(query,{$set: {latitude:query[latitude], longtitude:query[longtitude],isReadyForOrder:query[isReadyForOrder]}})
    }
    catch(err){
        console.log(err)
    }
}

const back = async(req,res)=>{
    const vender = await Vendor.findOne({_id:req.params.id}).lean()
    res.render('success',{"Vendor":vender})
}

const getAllOrders = async(req, res)=>{
    try{
        const orders = await Order.find({},{orderId:true, isFulfilled:true}).lean()
        res.render('allOutstandingOrders',{"orders":orders})
    }catch(err){
        console.log(err)
    }
}

const searchVendorID = async(req, res) =>{
    //console.log(req.body.van_ID)
    var query = {}
    if(req.body.van_ID !== ''){
        query["van_ID"] =  {$regex: new RegExp(req.body.van_ID)}
    }
    try{
        const vendors = await Vendor.find(query, {name:true, van_ID:true}).lean()
        res.render('index',{"vendors":vendors})
    }catch(err){
        console.log(err)
    }
}

const getOneVendor = async(req,res)=>{
    //console.log(req.params.id)
    try{
        const vendor = await Vendor.findOne( {_id: req.params.id} ).lean()
        res.render('showVendor',{"Vendor":vendor})
    }catch(err){
        console.log(err)
    }
}

const markOrderAsReady = async(req,res)=>{
    try{
        const order = await Order.findOne({OrderId:req.params.id}).lean()
        Order.updateOne(order.isFulfilled,req.body.isFulfilled)
        res.rendor('index')
    }catch(err){
        console.log(err)
    }
}


module.exports = {
    getAllOrders,
    searchVendorID,
    setVanStatus,
    getOneVendor,
    markOrderAsReady,
    back
}
const mongoose = require("mongoose")
const initData = require("./data")
const Listing = require("../models/listing")

async function main() {
    await mongoose.connect("mongodb://localhost:27017/wanderlust")

}
main().then(()=>{
    console.log("connected to DB")
}).catch((err)=>{
    console.log(err)
})

const initDB = async ()=>{
     await Listing.deleteMany({})
    initData.data = initData.data.map((obj)=>({...obj,owner: "685b7b5340ca3e42ab5f6b07"}))
     await Listing.insertMany(initData.data)
     console.log("data added")

}
initDB()
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

// Function to fix existing listings without geometry
const fixExistingListings = async () => {
    try {
        // Find all listings without geometry
        const listingsWithoutGeometry = await Listing.find({ 
            $or: [
                { geometry: { $exists: false } },
                { geometry: null },
                { "geometry.type": { $exists: false } }
            ]
        });
        
        console.log(`Found ${listingsWithoutGeometry.length} listings without geometry`);
        
        // Add default geometry for each listing without it
        for (let listing of listingsWithoutGeometry) {
            // Use a default location (you can customize this)
            const defaultGeometry = {
                type: "Point",
                coordinates: [-74.0060, 40.7128] // Default to New York coordinates
            };
            
            await Listing.findByIdAndUpdate(listing._id, {
                geometry: defaultGeometry
            });
        }
        
        console.log("Fixed existing listings without geometry");
    } catch (error) {
        console.error("Error fixing existing listings:", error);
    }
};

// Run both initialization and fix
const runAll = async () => {
    await initDB();
    await fixExistingListings();
    console.log("Database initialization and fix completed");
    process.exit(0);
};

runAll();
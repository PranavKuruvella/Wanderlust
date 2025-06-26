const mongoose = require("mongoose")
const Schema = mongoose.Schema
const Review = require("./review")
const User = require("./user")
const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        type: String,
        set: (v) => (!v || v === "") ? "https://images.unsplash.com/photo-1748367959778-12d026a20a99?q=80&w=2342&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v,
        default: "https://images.unsplash.com/photo-1748367959778-12d026a20a99?q=80&w=2342&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId, //review yokka id ni store chesthunam of that particular listing!
            ref: "Review"
        }
    ],
    owner:{
        type:Schema.Types.ObjectId, //Owner yokka id ni store chesthunam
        ref: "User"
    }
})

//findbyIdAndDelete call avthe findOneAndDelete as a middleware pass avthundhi...we wrote a middleware to findOneAndDelete this thing....kabbati edhi kuda call avthundhi in a indirect way

//to delete all the review when we delete a listing we use this Moongoose middleware
listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } }) //deletes all the id which are present in listing reviews _id is id of each review as we wrote Review.deleterMany
    }
})

const Listing = mongoose.model("Listing", listingSchema)

module.exports = Listing
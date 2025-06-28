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
        url: String,
        filename: String,
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
    },
    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
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
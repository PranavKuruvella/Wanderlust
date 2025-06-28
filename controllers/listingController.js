const Listing = require("../models/listing")

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({})
  res.render("listings/index", { allListings })
}

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new")
}

module.exports.showListing = async (req, res) => {
  let { id } = req.params
  const listing = await Listing.findById(id)
  .populate({path:"reviews",
          populate:{
              path:"author" //review populate tho patu naku a author of that review kuda populate avvali
          }
  })
  .populate("owner") //both review and owner rendu frontend lo chupinchadaniki

  if (!listing){ //lets say listing ni delete chesi malla adhe link ki osthe lisiting ledhu ani chepi all listing ki redirect chesthunam
      req.flash("error", "Listing Doesn't Exist!")
      return res.redirect("/listings") //if no written both .redirect and .render is called anduke return rayali
  }
  // console.log(listing)
  res.render("listings/show", { listing })
}

module.exports.createListing = async (req, res, next) => {

  let newListing = new Listing(req.body.listing)
  newListing.owner = req.user._id //saving the respective owner in Db
  await newListing.save()
  req.flash("success", "New Listing Created!") //flash message
  res.redirect("/listings")
}

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params
  let listing = await Listing.findById(id)
  if (!listing){ //lets say listing ni delete chesi malla adhe link ki osthe lisiting ledhu ani chepi all listing ki redirect chesthunam
      req.flash("error", "Listing Doesn't Exist!")
      return res.redirect("/listings") //if no written both .redirect and .render is called anduke return rayali
  }
  res.render("listings/edit", { listing })
}

module.exports.updateListing = async (req, res) => {
  let { id } = req.params
  await Listing.findByIdAndUpdate(id, { ...req.body.listing })
  req.flash("success", "Listing Updated!")
  res.redirect(`/listings/${id}`)
}

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params
  await Listing.findByIdAndDelete(id)
  req.flash("success", "Listing Deleted!")
  res.redirect("/listings")
}
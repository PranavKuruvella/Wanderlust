const Listing = require("../models/listing")
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding'); 
const mapToken = process.env.MAP_TOKEN
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

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
  
let response = await geocodingClient.forwardGeocode({ //name isthe coordinates isthundhi
    query:req.body.listing.location,
    limit: 1,
  })
    .send()
  
  let newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  //if req.file untene
  if (req.file) {
    let url = req.file.path;
    let filename = req.file.filename;
    newListing.image = { url, filename };
  }

  // Extract coordinates from the geocoding response
  if (response.body.features && response.body.features.length > 0) {
    const coordinates = response.body.features[0].geometry.coordinates;
    newListing.geometry = {
      type: "Point",
      coordinates: coordinates
    };
  }

  let savedlisting = await newListing.save();
  console.log(savedlisting)
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
}

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params
  let listing = await Listing.findById(id)
  if (!listing){ //lets say listing ni delete chesi malla adhe link ki osthe lisiting ledhu ani chepi all listing ki redirect chesthunam
      req.flash("error", "Listing Doesn't Exist!")
      return res.redirect("/listings") //if no written both .redirect and .render is called anduke return rayali
  }
  originalImagUrl = listing.image.url
  originalImagUrl = originalImagUrl.replace("/upload","/upload/w_250")
  res.render("listings/edit", { listing,originalImagUrl })
}

module.exports.updateListing = async (req, res) => {
  let { id } = req.params
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing })

    //if req.file lekapothe
    if (req.file) {
      let url = req.file.path;
      let filename = req.file.filename;
      listing.image = { url, filename };
      await listing.save() //image upload cheyadam kosam add chesi malla save cesthunam
    }
  req.flash("success", "Listing Updated!")
  res.redirect(`/listings/${id}`)
}

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params
  await Listing.findByIdAndDelete(id)
  req.flash("success", "Listing Deleted!")
  res.redirect("/listings")
}
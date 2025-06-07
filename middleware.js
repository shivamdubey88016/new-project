const Listings = require("./models/listing");
const review = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl; // Store the original URL
        req.flash("error", "You must be logged in to do that");
        return res.redirect("/login");
    }
    next();
}
module.exports.savedRedirectUrl = (req, res, next) => {
  res.locals.redirectUrl = req.session.returnTo || '/listings';
  next();
};
    module.exports.isOwner = (req, res,next) => {
        const { id } = req.params;
        if (req.user && req.user._id.equals(id)) {
            return next();
        }
        req.flash("error", "You do not have permission to do that");
        res.redirect(`/listings/${id}`);
    } 
    module.exports.isReviewOwner = async (req, res, next) => {
        const { id, reviewId } = req.params;
        let review1=await review.findById(reviewId);
        
        if (review1 && review1.author.equals(res.locals.currentUser._id)) {
            req.flash("success", "You can delete this review");
            return res.redirect(`/listings/${id}`);
        
        }
next();
    }
const joi=require('joi');
const listingSchema=joi.object({
    listing:joi.object({
        title:joi.string().required(),
        description:joi.string().required(),
        image:joi.string().allow("",null),
        price:joi.number().required().min(0),
        location:joi.string().required(),
        country:joi.string().required()
    }).required()
});

const reviewSchema=joi.object({
    review:joi.object({
        name:joi.string().required(),
        rating:joi.number().required().min(1).max(5),
        coment:joi.string().required(),
    }).required(),
});
module.exports={listingSchema, reviewSchema};
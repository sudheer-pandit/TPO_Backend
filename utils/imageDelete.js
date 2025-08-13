const cloudinary = require("cloudinary").v2

const getPublicIdFromUrl = (url) => {
    // Remove protocol and domain
    const path = url.replace(/^https?:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/[^/]+\//, '');
    // Remove file extension if present
    return path.replace(/\.[^/.]+$/, '');
  };
  

exports.imageDestroyer = async (secure_url) => {
    const public_id = getPublicIdFromUrl(secure_url); 

    return await cloudinary.uploader.destroy(public_id);
}

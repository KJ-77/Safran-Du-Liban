const fixImageUrl = (image) => {
  if (!image || typeof image !== "string") {
    // Return a placeholder image from the assets folder
    return require("../assests/Images/product.jpg");
  }
  return image.replace(/\\/g, "/");
};

export default fixImageUrl;

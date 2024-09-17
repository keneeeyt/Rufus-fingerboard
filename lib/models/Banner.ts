import mongoose from "mongoose";


const BannerSchema = new mongoose.Schema({
  banner_name: {
    type: String,
  },
  banner_image: {
    type: String,
  },
},{timestamps: true})

const Banner = mongoose.models.Banner || mongoose.model("Banner", BannerSchema);

export default Banner;
import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  category_title: {
    type: String,
  },
  category_name: {
    type: String,
    required: true,
  },
  category_image: {
    type: String,
  }
},{timestamps: true});

const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);

export default Category;
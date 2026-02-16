import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },
  brandId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Brand",
  },
  price: {
    type: Number,
    required: true
  },
  tags: [String],
  images: [String],
  offerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Discount",
  },
  variants: [ 
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Variant"
    }
  ],
  averageRating: {
    type: Number,
    default: 0
  }
}, { timestamps: true });


productSchema.index({ 
  name: 'text', 
  description: 'text', 
  tags: 'text' 
}, {
  weights: {
    name: 10,       
    tags: 5,        
    description: 1  
  },
  name: "ProductSearchIndex"
});

productSchema.index({ categoryId: 1, price: 1 });



const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
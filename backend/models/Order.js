import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product'
      },
      quantity: { // fixed typo
        type: Number,
        required: true
      },
      price: {  // fixed 'number' -> 'Number'
        type: Number,
        required: true
      }
    }
  ],
  address: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    addressLine: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true }
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    default: 'COD'
  },
  status: {
    type: String,
    default: 'Placed'
  }
}, { timestamps: true }); // ✅ timestamps as second argument

export default mongoose.model('Order', orderSchema);
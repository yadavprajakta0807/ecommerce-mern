import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  // Load Products
  const loadProducts = async () => {
    try {
      const res = await api.get(
        `/products?search=${search}&category=${category}`
      );
      setProducts(res.data);
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [search, category]);

  // Add To Cart
  const addToCart = async (productId) => {
    try {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        alert("Please log in to add to your cart");
        return;
      }

      const res = await api.post(`/cart/add`, { userId, productId });

      const total = res.data.cart.items.reduce(
        (sum, item) => sum + item.productId.price * item.quantity,
        0
      );

      localStorage.setItem("cartCount", total);
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  return (
    <div className="p-6">
      {/* Search & Category Filter */}
      <div className="mb-4 flex gap-3">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-1/2"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Categories</option>
          <option value="Laptops">Laptops</option>
          <option value="Mobile">Mobile</option>
          <option value="Tablets">Tablets</option>
          <option value ="Programming Books">Programming Books</option>
          <option value= "Smart Watches">Smart Watches</option>
        </select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {products.length === 0 ? (
          <p>No products found</p>
        ) : (
          products.map((product) => (
            <div
              key={product._id}
              className="border rounded p-3 flex flex-col items-center hover:shadow-lg transition"
            >
              <Link to={`/product/${product._id}`}>
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-40 object-contain bg-white rounded"
                />
                <h2 className="mt-2 font-semibold text-lg">
                  {product.title}
                </h2>
                <p className="text-gray-600">${product.price}</p>
              </Link>

              <button
                onClick={() => addToCart(product._id)}
                className="mt-2 w-full bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 transition duration-300"
              >
                Add to cart
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
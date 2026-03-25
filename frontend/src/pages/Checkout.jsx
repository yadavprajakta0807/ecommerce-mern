import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Checkout() {
  const userId = localStorage.getItem("userId");

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const cartRes = await api.get(`/cart/${userId}`);
        setCart(cartRes.data);

        const addressRes = await api.get(`/address/${userId}`);
        setAddresses(addressRes.data);

        if (addressRes.data.length > 0) {
          setSelectedAddress(addressRes.data[0]);
        }
      } catch (error) {
        console.error("Checkout Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, navigate]);

  if (loading) {
    return <div className="text-center mt-10 text-lg">Loading...</div>;
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="text-center mt-10 text-lg">
        Your cart is empty.
      </div>
    );
  }

  const total = cart.items.reduce(
    (sum, item) =>
      sum + item.quantity * (item.productId?.price || 0),
    0
  );

  const placeOrder = async () => {
    if (!selectedAddress) {
      alert("Please select an address");
      return;
    }

    try {
      setPlacingOrder(true);

      const res = await api.post("/order/place", {
        userId,
        address: selectedAddress,
      });

      // ✅ Navigate to order success page with ID
      navigate(`/order-success/${res.data.orderId}`);

    } catch (error) {
      console.error("Order error:", error);
      alert("Failed to place order");
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">

      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <h2 className="text-lg font-semibold mb-3">Select Address</h2>

      {addresses.length === 0 && (
        <p className="text-red-500 mb-4">
          No address found. Please add an address first.
        </p>
      )}

      {addresses.map((addr) => (
        <label
          key={addr._id}
          className="block border p-3 rounded cursor-pointer mb-3"
        >
          <input
            type="radio"
            name="address"
            checked={selectedAddress?._id === addr._id}
            onChange={() => setSelectedAddress(addr)}
            className="mr-2"
          />

          <strong>{addr.fullName}</strong>
          <p className="text-sm">
            {addr.addressLine}, {addr.city}, {addr.state} - {addr.pincode}
          </p>
          <p className="text-sm">{addr.phone}</p>
        </label>
      ))}

      <h2 className="font-semibold mt-6 mb-2">Order Summary</h2>

      <div className="border p-4 rounded">
        {cart.items.map((item) => (
          <div
            key={item.productId?._id}
            className="flex justify-between mb-2"
          >
            <span>
              {item.productId?.name} × {item.quantity}
            </span>
            <span>
              ₹ {item.quantity * (item.productId?.price || 0)}
            </span>
          </div>
        ))}

        <hr className="my-2" />

        <div className="flex justify-between font-bold text-lg">
          <span>Total:</span>
          <span>₹ {total}</span>
        </div>
      </div>

      <button
        onClick={placeOrder}
        disabled={placingOrder}
        className={`mt-6 w-full p-3 rounded text-white ${
          placingOrder ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
        }`}
      >
        {placingOrder ? "Placing Order..." : "Place Order (COD)"}
      </button>
    </div>
  );
}
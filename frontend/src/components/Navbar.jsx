import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaShoppingCart } from "react-icons/fa";
import api from "../api/axios";

export default function Navbar() {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const loadCart = async () => {
      try {
        if (!userId) {
          setCartCount(0);
          return;
        }

        const res = await api.get(`/cart/${userId}`);

        const total = res.data?.items?.reduce(
          (sum, item) => sum + item.quantity,
          0
        ) || 0;

        setCartCount(total);
      } catch (error) {
        console.error("Cart Load Error:", error);
      }
    };

    loadCart();

    window.addEventListener("cartUpdated", loadCart);

    return () => {
      window.removeEventListener("cartUpdated", loadCart);
    };
  }, [userId]);

  const logout = () => {
    localStorage.clear();
    setCartCount(0);
    navigate("/login");
  };

  return (
<nav className="flex justify-between items-center px-6 py-4 bg-black text-white">    
      <Link
  to="/"
  className="font-bold text-xl"
>
  Prajakta Store
</Link>

      <div className="flex gap-6 items-center">

        {/* Cart Icon */}
        <Link to="/cart" className="relative">
          <FaShoppingCart size={24} className="text-gray-700" />

          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Link>

        {!userId ? (
          <>
            <Link to="/login" className="text-lg hover:text-blue-500">
              Login
            </Link>
            <Link to="/signup" className="text-lg hover:text-blue-500">
              Signup
            </Link>
          </>
        ) : (
          <button
            onClick={logout}
            className="text-lg hover:text-red-500"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
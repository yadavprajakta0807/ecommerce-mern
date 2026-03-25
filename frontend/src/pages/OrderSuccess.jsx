import { useParams, useNavigate } from "react-router-dom";

export default function OrderSuccess() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gray-100">
      
      <div className="bg-white p-10 rounded-lg shadow-md text-center w-full max-w-xl">
        
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          Order Placed Successfully
        </h1>

        <p className="text-gray-700 mb-6">
          Your Order ID:{" "}
          <span className="font-semibold text-black">
            {id}
          </span>
        </p>

        <button
          onClick={() => navigate("/")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition duration-200"
        >
          Continue Shopping
        </button>

      </div>

    </div>
  );
}
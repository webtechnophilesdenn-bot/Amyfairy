import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteItemFromCartAsync,
  selectCartLoaded,
  selectItems,
  updateCartAsync,
} from "./cartSlice";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { selectStatus } from "./cartSlice";
import { RotatingLines } from "react-loader-spinner";
import { resetStockError } from "../order/orderSlice";
import Modal from "../common/components/Modal";
import { 
  ShoppingBag, 
  Trash2, 
  ArrowRight, 
  ShoppingCart,
  Sparkles,
  Package
} from "lucide-react";

export default function Cart() {
  const dispatch = useDispatch();
  const status = useSelector(selectStatus);
  const [openModal, setOpenModal] = useState(null);
  const items = useSelector(selectItems);
  const cartLoaded = useSelector(selectCartLoaded);
  const totalAmount = items.reduce(
    (amount, item) => item.product.discountedPrice * item.quantity + amount,
    0
  );
  const totalItems = items.reduce((total, item) => item.quantity + total, 0);

  const handleQuantity = (e, item) => {
    dispatch(updateCartAsync({ id: item.id, quantity: +e.target.value }));
  };

  const handleRemove = (e, id) => {
    dispatch(deleteItemFromCartAsync(id));
    toast.error("Product removed from cart");
  };

  useEffect(() => {
    dispatch(resetStockError());
  }, [dispatch]);

  return (
    <>
      {!items.length && cartLoaded ? (
        <NoItem />
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 py-6 sm:py-8 md:py-12">
          <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8">
            {/* Header Section */}
            <div className="mb-6 sm:mb-8 md:mb-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur opacity-50 animate-pulse"></div>
                  <ShoppingBag className="relative h-8 w-8 sm:h-10 sm:w-10 text-purple-600" />
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                  Shopping Cart
                </h1>
              </div>
              <p className="text-sm sm:text-base text-purple-600 ml-11 sm:ml-13">
                {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Cart Items Section */}
              <div className="lg:col-span-2">
                <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border-2 border-purple-200 overflow-hidden">
                  {status === "loading" ? (
                    <div className="flex justify-center items-center py-20">
                      <RotatingLines
                        visible={true}
                        height="80"
                        width="80"
                        strokeColor="#a855f7"
                        strokeWidth="5"
                        animationDuration="0.75"
                        ariaLabel="rotating-lines-loading"
                      />
                    </div>
                  ) : (
                    <div className="divide-y divide-purple-200">
                      {items.map((item, index) => (
                        <div
                          key={item.id}
                          className="p-4 sm:p-6 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300 animate-fadeIn"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                            {/* Product Image */}
                            <Link
                              to={`/product-detail/${item.product.id}`}
                              className="group relative"
                            >
                              <div className="h-28 w-28 sm:h-32 sm:w-32 flex-shrink-0 overflow-hidden rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-100 to-pink-100 group-hover:border-purple-400 transition-all duration-300">
                                <img
                                  src={item.product.thumbnail}
                                  alt={item.product.title}
                                  className="h-full w-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                                />
                              </div>
                            </Link>

                            {/* Product Details */}
                            <div className="flex-1 flex flex-col justify-between">
                              <div>
                                <div className="flex justify-between items-start gap-2 mb-2">
                                  <Link
                                    to={`/product-detail/${item.product.id}`}
                                    className="group"
                                  >
                                    <h3 className="text-base sm:text-lg font-bold text-purple-900 group-hover:text-pink-600 transition-colors duration-200 line-clamp-2">
                                      {item.product.title}
                                    </h3>
                                  </Link>
                                  <button
                                    onClick={() => setOpenModal(item.id)}
                                    className="flex-shrink-0 p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600 hover:scale-110 transition-all duration-200"
                                  >
                                    <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                                  </button>
                                </div>

                                <p className="text-xs sm:text-sm text-gray-600 mb-3">
                                  Brand: {item.product.brand}
                                </p>

                                {/* Color and Size */}
                                <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-3">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs sm:text-sm font-semibold text-gray-700">
                                      Color:
                                    </span>
                                    <div
                                      className="h-6 w-6 sm:h-7 sm:w-7 rounded-full border-2 border-purple-300 shadow-sm hover:scale-110 transition-transform duration-200"
                                      style={{ backgroundColor: item.color }}
                                    ></div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs sm:text-sm font-semibold text-gray-700">
                                      Size:
                                    </span>
                                    <div className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg border border-purple-300 text-xs sm:text-sm font-bold text-purple-900">
                                      {item.size}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Quantity and Price */}
                              <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                  <label
                                    htmlFor={item.id}
                                    className="text-xs sm:text-sm font-semibold text-gray-700"
                                  >
                                    Qty:
                                  </label>
                                  <select
                                    className="bg-white border-2 border-purple-300 text-purple-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 px-3 py-1.5 hover:border-purple-400 transition-colors cursor-pointer"
                                    onChange={(e) => handleQuantity(e, item)}
                                    value={item.quantity}
                                    id={item.id}
                                  >
                                    {item.product.stock > 0 ? (
                                      [...Array(item.product.stock).keys()].map(
                                        (x) => (
                                          <option value={x + 1} key={x}>
                                            {x + 1}
                                          </option>
                                        )
                                      )
                                    ) : (
                                      <option value="0">Out of Stock</option>
                                    )}
                                  </select>
                                </div>

                                <div className="text-right">
                                  <p className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                    ₹{item.product.discountedPrice}
                                  </p>
                                  <p className="text-xs sm:text-sm text-gray-500">
                                    Total: ₹
                                    {item.product.discountedPrice *
                                      item.quantity}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Modal */}
                          <Modal
                            title={`Remove ${item.product.title}`}
                            message="Are you sure you want to remove this item from your cart?"
                            dangerOption="Remove"
                            cancelOption="Cancel"
                            input={false}
                            dangerAction={(e) => handleRemove(e, item.id)}
                            cancelAction={() => setOpenModal(null)}
                            showModal={openModal === item.id}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Order Summary Section */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border-2 border-purple-200 p-5 sm:p-6 md:p-8 space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="h-6 w-6 text-purple-600" />
                    <h2 className="text-xl sm:text-2xl font-bold text-purple-900">
                      Order Summary
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-purple-200">
                      <span className="text-sm sm:text-base text-gray-700">
                        Subtotal
                      </span>
                      <span className="text-base sm:text-lg font-bold text-purple-900">
                        ₹{totalAmount}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-3 border-b border-purple-200">
                      <span className="text-sm sm:text-base text-gray-700">
                        Total Items
                      </span>
                      <span className="text-base sm:text-lg font-bold text-purple-900">
                        {totalItems}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-3">
                      <span className="text-sm sm:text-base font-semibold text-gray-700">
                        Shipping
                      </span>
                      <span className="text-sm sm:text-base font-semibold text-green-600">
                        Calculated at checkout
                      </span>
                    </div>

                    <div className="pt-4 border-t-2 border-purple-300">
                      <div className="flex justify-between items-center mb-6">
                        <span className="text-lg sm:text-xl font-bold text-purple-900">
                          Total
                        </span>
                        <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                          ₹{totalAmount}
                        </span>
                      </div>

                      <Link to="/checkout">
                        <button className="w-full group relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 sm:py-4 px-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
                          <span className="relative z-10 flex items-center justify-center gap-2">
                            Proceed to Checkout
                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                          </span>
                        </button>
                      </Link>

                      <Link to="/">
                        <button className="w-full mt-4 group bg-white hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 text-purple-700 font-semibold py-2.5 sm:py-3 px-6 rounded-xl border-2 border-purple-300 hover:border-purple-400 transition-all duration-300">
                          <span className="flex items-center justify-center gap-2">
                            Continue Shopping
                            <ShoppingCart className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                          </span>
                        </button>
                      </Link>
                    </div>
                  </div>

                  {/* Trust Badges */}
                  <div className="pt-6 border-t border-purple-200">
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                      <Package className="h-5 w-5 text-purple-600" />
                      <span>Secure checkout & fast delivery</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const NoItem = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border-2 border-purple-200 p-8 sm:p-12 text-center">
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-purple-100 to-pink-100 rounded-full p-8">
                <ShoppingCart className="h-20 w-20 sm:h-24 sm:w-24 text-purple-600" />
              </div>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Your Cart is Empty
          </h1>
          <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-md mx-auto">
            Looks like you haven't added anything to your cart yet. Start
            shopping and discover amazing products!
          </p>

          <Link to="/">
            <button className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 sm:py-4 px-8 sm:px-12 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <span className="relative z-10 flex items-center justify-center gap-2 text-base sm:text-lg">
                Start Shopping
                <Sparkles className="h-5 w-5 group-hover:rotate-12 transition-transform duration-200" />
              </span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

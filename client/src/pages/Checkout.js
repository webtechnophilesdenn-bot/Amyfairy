import { Link, Navigate, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteItemFromCartAsync,
  selectItems,
  updateCartAsync,
} from "../features/cart/cartSlice";
import { useForm } from "react-hook-form";
import { updateUserAsync, selectUserInfo } from "../features/user/userSlice";
import { useEffect, useState } from "react";
import {
  createOrderAsync,
  selectCurrentOrder,
  selectStockError,
} from "../features/order/orderSlice";
import { toast } from "react-toastify";
import NavBar from "../features/navbar/Navbar";
import { selectUserChecked } from "../features/auth/authSlice";
import {
  initiatePaymentAsync,
  resetPayment,
} from "../features/payment/paymentSlice";
import { PATH } from "../app/constants";
import Modal from "../features/common/components/Modal";
import "react-toastify/dist/ReactToastify.css";
import {
  CreditCard,
  Trash2,
  Plus,
  MapPin,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  Check,
  Banknote,
} from "lucide-react";

function Checkout() {
  const dispatch = useDispatch();
  const user = useSelector(selectUserInfo);
  const navigate = useNavigate();
  const error = useSelector(selectStockError);
  const items = useSelector(selectItems);
  const currentOrder = useSelector(selectCurrentOrder);
  const userChecked = useSelector(selectUserChecked);
  const [openModal, setOpenModal] = useState(null);
  const [paymentError, setPaymentError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const totalAmount = items.reduce(
    (amount, item) => item.product.discountedPrice * item.quantity + amount,
    0
  );
  const totalItems = items.reduce((total, item) => item.quantity + total, 0);

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);

  useEffect(() => {
    if (currentOrder) {
      navigate(`/order-success/${currentOrder.id}`, { replace: true });
    }
  }, [navigate, currentOrder]);

  const handleQuantity = (e, item) => {
    dispatch(updateCartAsync({ id: item.id, quantity: +e.target.value }));
  };

  const handleRemove = (e, id) => {
    dispatch(deleteItemFromCartAsync(id));
    toast.success("Item removed from cart");
  };

  const handleAddress = (e) => {
    setSelectedAddress(user?.addresses[e.target.value]);
  };

  const handlePayment = (e) => {
    setPaymentMethod(e.target.value);
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve, reject) => {
      if (typeof window.Razorpay !== "undefined") {
        resolve(window.Razorpay);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(window.Razorpay);
      script.onerror = () =>
        reject(new Error("Razorpay script failed to load."));
      document.body.appendChild(script);
    });
  };

  const payUsingCard = async (data) => {
    try {
      let razorpayID;
      let paymentId;

      await dispatch(initiatePaymentAsync(data))
        .unwrap()
        .then((result) => {
          razorpayID = result.razorpayID;
          paymentId = result.paymentId;
        })
        .catch((err) => {
          setPaymentError(err.message);
        });

      if (!razorpayID || !paymentId) {
        throw new Error("Invalid payment details received from the server.");
      }

      const options = {
        key: razorpayID,
        amount: data.totalAmount,
        currency: "INR",
        name: "AmyFairy",
        description: "Thanks for shopping with us",
        image: "../../logo.png",
        order_id: paymentId,
        callback_url: `${PATH}/payment/verify`,
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phoneNumber,
        },
        notes: {
          address: selectedAddress,
        },
        theme: {
          color: "#a855f7",
        },
      };

      await loadRazorpayScript();

      if (typeof window.Razorpay === "undefined") {
        throw new Error("Razorpay script not loaded.");
      }

      const rzp1 = new window.Razorpay(options);
      await rzp1.open();
    } catch (error) {
      toast.error(`${paymentError || "Product"} is out of stock`);
    } finally {
      dispatch(resetPayment());
    }
  };

  const handleOrder = () => {
    const order = {
      items,
      totalAmount,
      totalItems,
      user: user.id,
      paymentMethod,
      selectedAddress,
      status: "pending",
    };

    if (selectedAddress && paymentMethod === "card") {
      payUsingCard(order);
    } else if (selectedAddress && paymentMethod) {
      dispatch(createOrderAsync(order));
    } else {
      toast.error("Please select address and payment method");
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error?.message);
    }
  }, [error]);

  return (
    <>
      <script src="https://checkout.razorpay.com/v1/checkout.js"></script>

      <NavBar>
        {!items.length && !userChecked && (
          <Navigate to="/" replace={true}></Navigate>
        )}

        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 py-6 sm:py-8">
          {/* Header */}
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur opacity-50 animate-pulse"></div>
                <ShoppingBag className="relative h-8 w-8 sm:h-10 sm:w-10 text-purple-600" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                  Checkout
                </h1>
                <p className="text-sm sm:text-base text-purple-600 mt-1">
                  Complete your order
                </p>
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-6 lg:gap-8 lg:grid-cols-5">
              {/* Left Column - Address & Payment */}
              <div className="lg:col-span-3 space-y-6">
                {/* Address Form */}
                <form
                  className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border-2 border-purple-200 p-6 sm:p-8 animate-fadeIn"
                  noValidate
                  onSubmit={handleSubmit((data) => {
                    dispatch(
                      updateUserAsync({
                        ...user,
                        addresses: [...user?.addresses, data],
                      })
                    );
                    toast.success("Address added successfully!");
                    reset();
                  })}
                >
                  <div className="flex items-center gap-2 mb-6">
                    <MapPin className="h-6 w-6 text-purple-600" />
                    <h2 className="text-xl sm:text-2xl font-bold text-purple-900">
                      Add New Address
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-6">
                    {/* Full Name */}
                    <div className="sm:col-span-6">
                      <label className="block text-sm font-bold text-purple-900 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        {...register("name", { required: "Name is required" })}
                        className="w-full px-4 py-3 bg-white border-2 border-purple-200 rounded-xl text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                        placeholder="Enter your full name"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="sm:col-span-4">
                      <label className="block text-sm font-bold text-purple-900 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        {...register("email", { required: "Email is required" })}
                        className="w-full px-4 py-3 bg-white border-2 border-purple-200 rounded-xl text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                        placeholder="your@email.com"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-bold text-purple-900 mb-2">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        {...register("phone", { required: "Phone is required" })}
                        className="w-full px-4 py-3 bg-white border-2 border-purple-200 rounded-xl text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                        placeholder="1234567890"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                      )}
                    </div>

                    {/* Street */}
                    <div className="sm:col-span-6">
                      <label className="block text-sm font-bold text-purple-900 mb-2">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        {...register("street", { required: "Street is required" })}
                        className="w-full px-4 py-3 bg-white border-2 border-purple-200 rounded-xl text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                        placeholder="123 Main Street"
                      />
                      {errors.street && (
                        <p className="text-red-500 text-sm mt-1">{errors.street.message}</p>
                      )}
                    </div>

                    {/* City */}
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-bold text-purple-900 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        {...register("city", { required: "City is required" })}
                        className="w-full px-4 py-3 bg-white border-2 border-purple-200 rounded-xl text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                        placeholder="Mumbai"
                      />
                      {errors.city && (
                        <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                      )}
                    </div>

                    {/* State */}
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-bold text-purple-900 mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        {...register("state", { required: "State is required" })}
                        className="w-full px-4 py-3 bg-white border-2 border-purple-200 rounded-xl text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                        placeholder="Maharashtra"
                      />
                      {errors.state && (
                        <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
                      )}
                    </div>

                    {/* Pin Code */}
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-bold text-purple-900 mb-2">
                        PIN Code *
                      </label>
                      <input
                        type="text"
                        {...register("pinCode", { required: "PIN Code is required" })}
                        className="w-full px-4 py-3 bg-white border-2 border-purple-200 rounded-xl text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                        placeholder="400001"
                      />
                      {errors.pinCode && (
                        <p className="text-red-500 text-sm mt-1">{errors.pinCode.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Form Buttons */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mt-6">
                    <button
                      onClick={() => reset()}
                      type="button"
                      className="w-full sm:w-auto px-6 py-3 bg-white border-2 border-purple-300 text-purple-700 font-bold rounded-xl hover:bg-purple-50 transition-all duration-200"
                    >
                      Reset
                    </button>
                    <button
                      type="submit"
                      className="w-full sm:w-auto group px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                    >
                      <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-200" />
                      Add Address
                    </button>
                  </div>
                </form>

                {/* Saved Addresses */}
                <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border-2 border-purple-200 p-6 sm:p-8 animate-fadeIn" style={{ animationDelay: "100ms" }}>
                  <h2 className="text-xl sm:text-2xl font-bold text-purple-900 mb-4">
                    Saved Addresses
                  </h2>
                  <p className="text-sm text-gray-600 mb-6">
                    Choose from your existing addresses
                  </p>

                  <div className="space-y-4">
                    {user?.addresses.map((address, index) => (
                      <label
                        key={index}
                        htmlFor={`address-${index}`}
                        className={`block cursor-pointer group`}
                      >
                        <div
                          className={`flex items-start gap-4 p-4 sm:p-5 rounded-xl border-2 transition-all duration-200 ${
                            selectedAddress === address
                              ? "bg-gradient-to-r from-purple-50 to-pink-50 border-purple-400 shadow-md"
                              : "bg-white border-purple-200 hover:border-purple-300 hover:shadow-md"
                          }`}
                        >
                          <input
                            id={`address-${index}`}
                            name="address"
                            type="radio"
                            value={index}
                            onChange={handleAddress}
                            className="mt-1 h-5 w-5 text-purple-600 border-purple-300 focus:ring-purple-500"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-base font-bold text-purple-900 mb-1">
                              {address.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {address.street}, {address.city}
                            </p>
                            <p className="text-sm text-gray-600">
                              {address.state} - {address.pinCode}
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                              Phone: {address.phone}
                            </p>
                          </div>
                          {selectedAddress === address && (
                            <div className="flex-shrink-0">
                              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-1">
                                <Check className="h-5 w-5 text-white" />
                              </div>
                            </div>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border-2 border-purple-200 p-6 sm:p-8 animate-fadeIn" style={{ animationDelay: "200ms" }}>
                  <h2 className="text-xl sm:text-2xl font-bold text-purple-900 mb-4">
                    Payment Method
                  </h2>
                  <p className="text-sm text-gray-600 mb-6">
                    Choose your preferred payment option
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label
                      htmlFor="cash"
                      className="cursor-pointer group"
                    >
                      <div
                        className={`flex items-center gap-4 p-5 rounded-xl border-2 transition-all duration-200 ${
                          paymentMethod === "cash"
                            ? "bg-gradient-to-r from-purple-50 to-pink-50 border-purple-400 shadow-md"
                            : "bg-white border-purple-200 hover:border-purple-300 hover:shadow-md"
                        }`}
                      >
                        <input
                          id="cash"
                          name="payments"
                          onChange={handlePayment}
                          value="cash"
                          type="radio"
                          checked={paymentMethod === "cash"}
                          className="h-5 w-5 text-purple-600 border-purple-300 focus:ring-purple-500"
                        />
                        <Banknote className={`h-6 w-6 ${paymentMethod === "cash" ? "text-purple-600" : "text-gray-400"}`} />
                        <span className="font-bold text-purple-900">Cash on Delivery</span>
                      </div>
                    </label>

                    <label
                      htmlFor="card"
                      className="cursor-pointer group"
                    >
                      <div
                        className={`flex items-center gap-4 p-5 rounded-xl border-2 transition-all duration-200 ${
                          paymentMethod === "card"
                            ? "bg-gradient-to-r from-purple-50 to-pink-50 border-purple-400 shadow-md"
                            : "bg-white border-purple-200 hover:border-purple-300 hover:shadow-md"
                        }`}
                      >
                        <input
                          id="card"
                          onChange={handlePayment}
                          name="payments"
                          checked={paymentMethod === "card"}
                          value="card"
                          type="radio"
                          className="h-5 w-5 text-purple-600 border-purple-300 focus:ring-purple-500"
                        />
                        <CreditCard className={`h-6 w-6 ${paymentMethod === "card" ? "text-purple-600" : "text-gray-400"}`} />
                        <span className="font-bold text-purple-900">Card / UPI</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Right Column - Order Summary */}
              <div className="lg:col-span-2">
                <div className="sticky top-24 bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border-2 border-purple-200 p-6 sm:p-8 animate-fadeIn" style={{ animationDelay: "300ms" }}>
                  <div className="flex items-center gap-2 mb-6">
                    <Sparkles className="h-6 w-6 text-purple-600" />
                    <h2 className="text-xl sm:text-2xl font-bold text-purple-900">
                      Order Summary
                    </h2>
                  </div>

                  {/* Cart Items */}
                  <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                    {items.map((item, index) => (
                      <div
                        key={item.id}
                        className="flex gap-4 p-4 bg-white rounded-xl border border-purple-200"
                      >
                        <Link
                          to={`/product-detail/${item.product.id}`}
                          className="group"
                        >
                          <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 border-purple-200 group-hover:border-purple-400 transition-all">
                            <img
                              src={item.product.thumbnail}
                              alt={item.product.title}
                              className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                        </Link>

                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/product-detail/${item.product.id}`}
                            className="block"
                          >
                            <h3 className="text-sm font-bold text-purple-900 hover:text-pink-600 transition-colors line-clamp-2">
                              {item.product.title}
                            </h3>
                          </Link>
                          <p className="text-xs text-gray-600 mt-1">
                            Qty: {item.quantity}
                          </p>
                          <p className="text-sm font-bold text-purple-900 mt-1">
                            ₹{item.product.discountedPrice}
                          </p>
                        </div>

                        <button
                          onClick={() => setOpenModal(item.id)}
                          className="flex-shrink-0 p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600 hover:scale-110 transition-all duration-200"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>

                        <Modal
                          title={`Remove ${item.product.title}`}
                          message="Are you sure you want to remove this item?"
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

                  {/* Price Summary */}
                  <div className="space-y-4 border-t-2 border-purple-200 pt-6">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Subtotal</span>
                      <span className="font-bold text-purple-900">₹{totalAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Total Items</span>
                      <span className="font-bold text-purple-900">{totalItems}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className="text-green-600 font-semibold">Included</span>
                    </div>
                    <div className="flex justify-between pt-4 border-t-2 border-purple-300">
                      <span className="text-lg font-bold text-purple-900">Total</span>
                      <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        ₹{totalAmount}
                      </span>
                    </div>
                  </div>

                  {/* Order Button */}
                  <button
                    onClick={handleOrder}
                    className="w-full mt-6 group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  >
                    <span className="flex items-center justify-center gap-2">
                      Place Order
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                    </span>
                  </button>

                  <Link to="/">
                    <button className="w-full mt-4 bg-white hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 text-purple-700 font-semibold py-3 px-6 rounded-xl border-2 border-purple-300 hover:border-purple-400 transition-all duration-300">
                      Continue Shopping
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </NavBar>
    </>
  );
}

export default Checkout;

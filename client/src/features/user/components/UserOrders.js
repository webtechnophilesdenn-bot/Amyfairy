import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectUserInfoStatus,
  selectUserOrders,
  fetchLoggedInUserOrderAsync,
  selectTotalUserOrders,
} from "../userSlice";
import { Link } from "react-router-dom";
import { RotatingLines } from "react-loader-spinner";
import { ITEMS_PER_PAGE } from "../../../app/constants";
import Pagination from "../../common/components/Pagination";
import {
  Package,
  Calendar,
  CreditCard,
  MapPin,
  ShoppingBag,
  Sparkles,
  Clock,
} from "lucide-react";

export default function UserOrders() {
  const dispatch = useDispatch();
  const orders = useSelector(selectUserOrders);
  const [page, setPage] = useState(1);
  const totalUserOrders = useSelector(selectTotalUserOrders);
  const [sort, setSort] = useState({});
  const status = useSelector(selectUserInfoStatus);

  const chooseColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-300";
      case "dispatched":
        return "bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 border-yellow-300";
      case "delivered":
        return "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-300";
      case "cancelled":
        return "bg-gradient-to-r from-red-100 to-pink-100 text-red-700 border-red-300";
      default:
        return "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-300";
    }
  };

  const capitalizeFirstLetter = (string) => {
    return string?.charAt(0)?.toUpperCase() + string?.slice(1);
  };

  const handlePage = (page) => {
    setPage(page);
  };

  useEffect(() => {
    const pagination = { _page: page, _per_page: ITEMS_PER_PAGE };
    dispatch(fetchLoggedInUserOrderAsync({ sort: sort, pagination }));
  }, [dispatch, page, sort]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 py-6 sm:py-8">
      {status === "loading" ? (
        <div className="flex justify-center items-center min-h-screen">
          <RotatingLines
            visible={true}
            height="96"
            width="96"
            strokeColor="#a855f7"
            strokeWidth="5"
            animationDuration="0.75"
            ariaLabel="rotating-lines-loading"
          />
        </div>
      ) : null}

      {!orders.length ? (
        <NoItem />
      ) : (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur opacity-50 animate-pulse"></div>
                <ShoppingBag className="relative h-8 w-8 sm:h-10 sm:w-10 text-purple-600" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                  My Orders
                </h1>
                <p className="text-sm sm:text-base text-purple-600 mt-1">
                  Track and manage your orders
                </p>
              </div>
            </div>
          </div>

          {/* Orders List */}
          <div className="space-y-6">
            {orders.map((order, index) => (
              <div
                key={order?.id}
                className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border-2 border-purple-200 overflow-hidden animate-fadeIn"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Order Header */}
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 px-4 sm:px-6 py-4 border-b-2 border-purple-200">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Package className="h-6 w-6 text-purple-600" />
                      <div>
                        <h2 className="text-lg sm:text-xl font-bold text-purple-900">
                          Order #{order?.id}
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-600">
                          Placed on {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border-2 ${chooseColor(
                          order?.status
                        )}`}
                      >
                        {capitalizeFirstLetter(order.status)}
                      </span>
                      <span
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border-2 ${
                          order.payment.paymentMethod === "cash"
                            ? "bg-gradient-to-r from-red-100 to-pink-100 text-red-700 border-red-300"
                            : "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-300"
                        }`}
                      >
                        <CreditCard className="h-3 w-3 mr-1" />
                        {capitalizeFirstLetter(order.payment.paymentMethod)}
                      </span>
                    </div>
                  </div>

                  {/* Order Dates */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                    <div className="flex items-center gap-2 bg-white/50 rounded-lg px-3 py-2">
                      <Calendar className="h-4 w-4 text-purple-600" />
                      <div>
                        <p className="text-xs text-gray-600">Order Date</p>
                        <p className="text-sm font-bold text-purple-900">
                          {new Date(order.createdAt).toLocaleDateString()} at{" "}
                          {new Date(order.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-white/50 rounded-lg px-3 py-2">
                      <Clock className="h-4 w-4 text-purple-600" />
                      <div>
                        <p className="text-xs text-gray-600">Last Updated</p>
                        <p className="text-sm font-bold text-purple-900">
                          {new Date(order.updatedAt).toLocaleDateString()} at{" "}
                          {new Date(order.updatedAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="px-4 sm:px-6 py-4">
                  <div className="space-y-4">
                    {order.items?.map((item) => (
                      <div
                        key={item?.id}
                        className="flex gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200 hover:shadow-md transition-all"
                      >
                        <Link
                          to={`/product-detail/${item?.product.id}`}
                          className="group flex-shrink-0"
                        >
                          <div className="h-20 w-20 sm:h-24 sm:w-24 overflow-hidden rounded-lg border-2 border-purple-200 group-hover:border-purple-400 transition-all">
                            <img
                              src={item?.product.thumbnail}
                              alt={item?.product.title}
                              className="h-full w-full object-cover object-center group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                        </Link>

                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/product-detail/${item?.product.id}`}
                            className="block"
                          >
                            <h3 className="text-sm sm:text-base font-bold text-purple-900 hover:text-pink-600 transition-colors line-clamp-2">
                              {item?.product.title}
                            </h3>
                          </Link>
                          <p className="text-xs sm:text-sm text-gray-600 mt-1">
                            {item?.product.brand}
                          </p>

                          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-2">
                            <div className="text-xs sm:text-sm font-semibold text-gray-700">
                              Qty: {item?.quantity}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs sm:text-sm font-semibold text-gray-700">
                                Color:
                              </span>
                              <div
                                className="h-5 w-5 sm:h-6 sm:w-6 rounded-full border-2 border-purple-300"
                                style={{ backgroundColor: item.color }}
                              ></div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs sm:text-sm font-semibold text-gray-700">
                                Size:
                              </span>
                              <div className="px-2 py-1 bg-white rounded-lg border border-purple-300 text-xs sm:text-sm font-bold text-purple-900">
                                {item.size}
                              </div>
                            </div>
                          </div>

                          <p className="text-base sm:text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mt-2">
                            ₹{item?.product.discountedPrice}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Footer */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-4 sm:px-6 py-4 border-t-2 border-purple-200">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Shipping Address */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <MapPin className="h-5 w-5 text-purple-600" />
                        <h3 className="text-sm font-bold text-purple-900">
                          Shipping Address
                        </h3>
                      </div>
                      <div className="bg-white rounded-xl p-4 border border-purple-200">
                        <p className="font-bold text-purple-900 mb-1">
                          {order?.selectedAddress?.name}
                        </p>
                        <p className="text-sm text-gray-700">
                          {order?.selectedAddress?.street}
                        </p>
                        <p className="text-sm text-gray-700">
                          {order?.selectedAddress?.city}, {order?.selectedAddress?.state}
                        </p>
                        <p className="text-sm text-gray-700">
                          PIN: {order?.selectedAddress?.pinCode}
                        </p>
                        <p className="text-sm font-semibold text-purple-900 mt-2">
                          📞 {order?.selectedAddress?.phone}
                        </p>
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="h-5 w-5 text-purple-600" />
                        <h3 className="text-sm font-bold text-purple-900">
                          Order Summary
                        </h3>
                      </div>
                      <div className="bg-white rounded-xl p-4 border border-purple-200 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-700">Subtotal</span>
                          <span className="text-sm font-bold text-purple-900">
                            ₹{order?.totalAmount}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-700">Total Items</span>
                          <span className="text-sm font-bold text-purple-900">
                            {order?.totalItems}
                          </span>
                        </div>
                        <div className="pt-2 border-t border-purple-200">
                          <div className="flex justify-between items-center">
                            <span className="text-base font-bold text-purple-900">
                              Total
                            </span>
                            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                              ₹{order?.totalAmount}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-8">
            <Pagination
              page={page}
              setPage={setPage}
              handlePage={handlePage}
              totalItems={totalUserOrders}
            />
          </div>
        </div>
      )}
    </div>
  );
}

const NoItem = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 py-12 flex items-center justify-center">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border-2 border-purple-200 p-8 sm:p-12 text-center">
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-purple-100 to-pink-100 rounded-full p-8">
                <Package className="h-20 w-20 sm:h-24 sm:w-24 text-purple-600" />
              </div>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
            No Orders Yet
          </h1>
          <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-md mx-auto">
            You haven't placed any orders yet. Start shopping and discover amazing
            products!
          </p>

          <Link to="/">
            <button className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 sm:py-4 px-8 sm:px-12 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <span className="relative z-10 flex items-center justify-center gap-2 text-base sm:text-lg">
                <ShoppingBag className="h-5 w-5 group-hover:scale-110 transition-transform" />
                Start Shopping
              </span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

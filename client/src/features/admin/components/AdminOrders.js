import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchAllOrderAsync,
  selectOrders,
  selectTotalOrders,
  updateOrderAsync,
  setViewOrder,
  resetViewOrder,
} from "../../order/orderSlice";
import {
  PencilIcon,
  EyeIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@heroicons/react/24/outline";
import { ITEMS_PER_PAGE } from "../../../app/constants";
import Pagination from "../../common/components/Pagination";
import {
  Package,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
} from "lucide-react";

function AdminOrders() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const orders = useSelector(selectOrders);
  const totalOrders = useSelector(selectTotalOrders);
  const [editableOrderId, setEditableOrderId] = useState(-1);
  const [sort, setSort] = useState({});
  const [visibleItemsCount, setVisibleItemsCount] = useState({});

  const handleEdit = (order) => {
    setEditableOrderId(order.id);
  };

  const handleShow = (order) => {
    dispatch(setViewOrder(order));
    navigate(`/admin/order-detail`, { replace: true });
  };

  const handleUpdate = (e, order) => {
    const updatedOrder = { ...order, status: e.target.value };
    dispatch(updateOrderAsync(updatedOrder));
    setEditableOrderId(-1);
  };

  const handlePage = (page) => {
    setPage(page);
  };

  const handleSort = (sortOption) => {
    setSort((prevSort) => {
      const isSameColumn = prevSort._sort === sortOption.sort;
      const newOrder =
        isSameColumn && prevSort._order === "asc" ? "desc" : "asc";
      return { _sort: sortOption.sort, _order: newOrder };
    });
  };

  const handleShowMore = (orderId, length) => {
    setVisibleItemsCount((prev) => ({
      ...prev,
      [orderId]: prev[orderId] === 2 ? length : 2,
    }));
  };

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

  useEffect(() => {
    const pagination = { _page: page, _per_page: ITEMS_PER_PAGE };
    dispatch(fetchAllOrderAsync({ sort: sort, pagination }));
  }, [dispatch, page, sort]);

  useEffect(() => {
    dispatch(resetViewOrder());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 py-6 sm:py-8">
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
                All Orders
              </h1>
              <p className="text-sm sm:text-base text-purple-600 mt-1">
                Manage and track all customer orders
              </p>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-2xl border-2 border-purple-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-purple-200">
              <thead className="bg-gradient-to-r from-purple-100 to-pink-100">
                <tr>
                  <th className="px-4 py-4 text-center text-xs sm:text-sm font-bold text-purple-900 uppercase tracking-wider">
                    <div className="flex items-center justify-center gap-2">
                      <Package className="h-4 w-4" />
                      Items
                    </div>
                  </th>
                  <th
                    className="px-4 py-4 text-center text-xs sm:text-sm font-bold text-purple-900 uppercase tracking-wider cursor-pointer hover:bg-purple-200 transition-colors"
                    onClick={() =>
                      handleSort({
                        sort: "totalAmount",
                        order: sort?._order === "asc" ? "desc" : "asc",
                      })
                    }
                  >
                    <div className="flex justify-center items-center gap-2">
                      <div>
                        <p>Total</p>
                        <p>Amount</p>
                      </div>
                      {sort._sort === "totalAmount" &&
                        (sort._order === "asc" ? (
                          <ArrowUpIcon className="w-4 h-4" />
                        ) : (
                          <ArrowDownIcon className="w-4 h-4" />
                        ))}
                    </div>
                  </th>
                  <th className="px-4 py-4 text-center text-xs sm:text-sm font-bold text-purple-900 uppercase tracking-wider">
                    <div>
                      <p>Shipping</p>
                      <p>Address</p>
                    </div>
                  </th>
                  <th
                    className="px-4 py-4 text-center text-xs sm:text-sm font-bold text-purple-900 uppercase tracking-wider cursor-pointer hover:bg-purple-200 transition-colors"
                    onClick={() =>
                      handleSort({
                        sort: "paymentMethod",
                        order: sort?._order === "asc" ? "desc" : "asc",
                      })
                    }
                  >
                    <div className="flex justify-center items-center gap-2">
                      <div>
                        <p>Payment</p>
                        <p>Method</p>
                      </div>
                      {sort._sort === "paymentMethod" &&
                        (sort._order === "asc" ? (
                          <ArrowUpIcon className="w-4 h-4" />
                        ) : (
                          <ArrowDownIcon className="w-4 h-4" />
                        ))}
                    </div>
                  </th>
                  <th
                    className="px-4 py-4 text-center text-xs sm:text-sm font-bold text-purple-900 uppercase tracking-wider cursor-pointer hover:bg-purple-200 transition-colors"
                    onClick={() =>
                      handleSort({
                        sort: "createdAt",
                        order: sort?._order === "asc" ? "desc" : "asc",
                      })
                    }
                  >
                    <div className="flex justify-center items-center gap-2">
                      <div>
                        <p>Order</p>
                        <p>Time</p>
                      </div>
                      {sort._sort === "createdAt" &&
                        (sort._order === "asc" ? (
                          <ArrowUpIcon className="w-4 h-4" />
                        ) : (
                          <ArrowDownIcon className="w-4 h-4" />
                        ))}
                    </div>
                  </th>
                  <th
                    className="px-4 py-4 text-center text-xs sm:text-sm font-bold text-purple-900 uppercase tracking-wider cursor-pointer hover:bg-purple-200 transition-colors"
                    onClick={() =>
                      handleSort({
                        sort: "updatedAt",
                        order: sort?._order === "asc" ? "desc" : "asc",
                      })
                    }
                  >
                    <div className="flex justify-center items-center gap-2">
                      <div>
                        <p>Last</p>
                        <p>Updated</p>
                      </div>
                      {sort._sort === "updatedAt" &&
                        (sort._order === "asc" ? (
                          <ArrowUpIcon className="w-4 h-4" />
                        ) : (
                          <ArrowDownIcon className="w-4 h-4" />
                        ))}
                    </div>
                  </th>
                  <th className="px-4 py-4 text-center text-xs sm:text-sm font-bold text-purple-900 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-4 text-center text-xs sm:text-sm font-bold text-purple-900 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-purple-100">
                {orders?.map((order, index) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-200 animate-fadeIn"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="px-4 py-4">
                      <div className="flex flex-col items-center justify-center gap-3">
                        {order.items
                          ?.slice(0, visibleItemsCount[order.id] || 2)
                          .map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center gap-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-2 w-full"
                            >
                              <img
                                className="w-12 h-12 rounded-lg object-cover border-2 border-purple-200"
                                src={item.product.thumbnail}
                                alt="thumbnail"
                              />
                              <div className="text-left">
                                <div className="font-bold text-purple-900 text-sm line-clamp-1">
                                  {item.product.title}
                                </div>
                                <div className="text-xs text-gray-600">
                                  Qty: {item.quantity} × ₹
                                  {item.product.discountedPrice}
                                </div>
                              </div>
                            </div>
                          ))}
                        {order.items?.length > 2 && (
                          <button
                            className="flex items-center gap-1 text-purple-600 hover:text-pink-600 font-semibold text-sm transition-colors"
                            onClick={() =>
                              handleShowMore(order.id, order.items.length)
                            }
                          >
                            {visibleItemsCount[order.id] === 2 ? (
                              <>
                                Show More <ChevronDown className="h-4 w-4" />
                              </>
                            ) : (
                              <>
                                Show Less <ChevronUp className="h-4 w-4" />
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-4 text-center">
                      <div className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        ₹{order.totalAmount}
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-700 text-center">
                        <div className="font-bold text-purple-900">
                          {order.selectedAddress?.name}
                        </div>
                        <div className="mt-1">{order.selectedAddress?.street}</div>
                        <div>
                          {order.selectedAddress?.city},{" "}
                          {order.selectedAddress?.state}
                        </div>
                        <div>{order.selectedAddress?.pinCode}</div>
                        <div className="font-semibold mt-1">
                          📞 {order.selectedAddress?.phone}
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-center">
                      <span
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border-2 ${
                          order.payment.paymentMethod === "cash"
                            ? "bg-gradient-to-r from-red-100 to-pink-100 text-red-700 border-red-300"
                            : "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-300"
                        }`}
                      >
                        {capitalizeFirstLetter(order.payment.paymentMethod)}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <div className="text-center text-sm">
                        <div className="font-semibold text-purple-900">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-600">
                          {new Date(order.createdAt).toLocaleTimeString()}
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="text-center text-sm">
                        <div className="font-semibold text-purple-900">
                          {new Date(order.updatedAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-600">
                          {new Date(order.updatedAt).toLocaleTimeString()}
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-center">
                      {order.id === editableOrderId ? (
                        <select
                          className="bg-white border-2 border-purple-300 text-purple-900 text-sm rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 px-3 py-2 font-semibold cursor-pointer"
                          onChange={(e) => handleUpdate(e, order)}
                          defaultValue={order.status}
                        >
                          <option value="pending">Pending</option>
                          <option value="dispatched">Dispatched</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      ) : (
                        <span
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border-2 ${chooseColor(
                            order.status
                          )}`}
                        >
                          {capitalizeFirstLetter(order.status)}
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => handleShow(order)}
                          className="p-2 bg-gradient-to-r from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 rounded-lg transition-all duration-200 hover:scale-110"
                        >
                          <EyeIcon className="w-5 h-5 text-purple-600" />
                        </button>
                        <button
                          onClick={() => handleEdit(order)}
                          className="p-2 bg-gradient-to-r from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 rounded-lg transition-all duration-200 hover:scale-110"
                        >
                          <PencilIcon className="w-5 h-5 text-purple-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-6">
          <Pagination
            page={page}
            setPage={setPage}
            handlePage={handlePage}
            totalItems={totalOrders}
          />
        </div>
      </div>
    </div>
  );
}

export default AdminOrders;

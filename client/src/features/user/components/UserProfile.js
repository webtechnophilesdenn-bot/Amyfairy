import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUserInfo, updateUserAsync } from "../userSlice";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Modal from "../../common/components/Modal";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Plus,
  Edit,
  Trash2,
  X,
  Shield,
  Sparkles,
} from "lucide-react";

export default function UserProfile() {
  const dispatch = useDispatch();
  const user = useSelector(selectUserInfo);
  const [selectedEditIndex, setSelectedEditIndex] = useState(-1);
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [popUp, setPopUp] = useState({
    name: "Name",
    city: "City",
    state: "State",
    pinCode: "Pin Code",
    street: "Street",
    index: -1,
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const handleEdit = (addressUpdate, index) => {
    const newUser = { ...user, addresses: [...user.addresses] };
    newUser.addresses.splice(index, 1, addressUpdate);
    dispatch(updateUserAsync(newUser));
    setSelectedEditIndex(-1);
    toast.success("Address updated successfully!");
  };

  const handleRemove = (index) => {
    const newUser = { ...user, addresses: [...user.addresses] };
    newUser.addresses.splice(index, 1);
    dispatch(updateUserAsync(newUser));
    toast.success("Address deleted successfully!");
    setPopUp({
      name: "Name",
      city: "City",
      state: "State",
      pinCode: "Pin Code",
      street: "Street",
      index: -1,
    });
    setOpenModal(false);
  };

  const handleEditForm = (index) => {
    setSelectedEditIndex(index);
    const address = user.addresses[index];
    setValue("name", address.name);
    setValue("email", address.email);
    setValue("city", address.city);
    setValue("state", address.state);
    setValue("pinCode", address.pinCode);
    setValue("phone", address.phone);
    setValue("street", address.street);
  };

  const handleAdd = (address) => {
    const newUser = { ...user, addresses: [...user.addresses, address] };
    dispatch(updateUserAsync(newUser));
    setShowAddAddressForm(false);
    reset();
    toast.success("Address added successfully!");
  };

  const AddressForm = ({ onSubmit, onCancel, submitText, isEdit = false }) => (
    <form
      className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border-2 border-purple-200 p-6 sm:p-8 mb-6 animate-fadeIn"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <MapPin className="h-6 w-6 text-purple-600" />
          <h2 className="text-xl sm:text-2xl font-bold text-purple-900">
            {isEdit ? "Edit Address" : "Add New Address"}
          </h2>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="p-2 rounded-full hover:bg-red-100 text-gray-600 hover:text-red-600 transition-all"
        >
          <X className="h-5 w-5" />
        </button>
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
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
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
          type="button"
          onClick={onCancel}
          className="w-full sm:w-auto px-6 py-3 bg-white border-2 border-purple-300 text-purple-700 font-bold rounded-xl hover:bg-purple-50 transition-all duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="w-full sm:w-auto group px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          {submitText}
        </button>
      </div>
    </form>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 py-6 sm:py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl border-2 border-purple-200 p-6 sm:p-8 mb-6 sm:mb-8 animate-fadeIn">
          <div className="flex items-start gap-4 sm:gap-6">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur opacity-50 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-purple-100 to-pink-100 rounded-full p-4 sm:p-6">
                <User className="h-12 w-12 sm:h-16 sm:w-16 text-purple-600" />
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
                {user.name}
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div className="flex items-center gap-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-3 sm:p-4">
                  <Mail className="h-5 w-5 text-purple-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-gray-600 mb-1">Email</p>
                    <p className="text-sm font-bold text-purple-900 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-3 sm:p-4">
                  <Phone className="h-5 w-5 text-purple-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-gray-600 mb-1">Phone</p>
                    <p className="text-sm font-bold text-purple-900">
                      {user.phoneNumber}
                    </p>
                  </div>
                </div>
              </div>

              {user?.role === "admin" && (
                <div className="flex items-center gap-2 mt-4 inline-flex bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-4 py-2 rounded-full border-2 border-green-300">
                  <Shield className="h-4 w-4" />
                  <span className="text-sm font-bold">Admin Account</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Addresses Section */}
        <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl border-2 border-purple-200 p-6 sm:p-8 animate-fadeIn" style={{ animationDelay: "100ms" }}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <MapPin className="h-6 w-6 text-purple-600" />
              <h2 className="text-xl sm:text-2xl font-bold text-purple-900">
                Saved Addresses
              </h2>
            </div>
            {!showAddAddressForm && selectedEditIndex === -1 && (
              <button
                onClick={() => setShowAddAddressForm(true)}
                className="group flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Plus className="h-4 w-4 sm:h-5 sm:w-5 group-hover:rotate-90 transition-transform duration-200" />
                <span className="hidden sm:inline">Add Address</span>
              </button>
            )}
          </div>

          {/* Add Address Form */}
          {showAddAddressForm && (
            <AddressForm
              onSubmit={(data) => {
                handleAdd(data);
              }}
              onCancel={() => {
                setShowAddAddressForm(false);
                reset();
              }}
              submitText="Add Address"
            />
          )}

          {/* Address List */}
          <div className="space-y-4">
            {user.addresses?.map((address, index) => (
              <div key={index}>
                {selectedEditIndex === index ? (
                  <AddressForm
                    onSubmit={(data) => handleEdit(data, index)}
                    onCancel={() => {
                      setSelectedEditIndex(-1);
                      reset();
                    }}
                    submitText="Save Changes"
                    isEdit={true}
                  />
                ) : (
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200 p-4 sm:p-6 hover:shadow-lg transition-all duration-300 animate-fadeIn" style={{ animationDelay: `${(index + 2) * 100}ms` }}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-purple-900 mb-2">
                          {address.name}
                        </h3>
                        <div className="space-y-1 text-sm text-gray-700">
                          <p>{address.street}</p>
                          <p>
                            {address.city}, {address.state} - {address.pinCode}
                          </p>
                          <p className="flex items-center gap-2 font-semibold text-purple-900 mt-2">
                            <Phone className="h-4 w-4" />
                            {address.phone}
                          </p>
                        </div>
                      </div>

                      <div className="flex sm:flex-col gap-3">
                        <button
                          onClick={() => handleEditForm(index)}
                          className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-purple-100 text-purple-700 font-semibold rounded-lg border-2 border-purple-300 transition-all duration-200 hover:scale-105"
                        >
                          <Edit className="h-4 w-4" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => {
                            setPopUp({
                              name: address.name,
                              city: address.city,
                              state: address.state,
                              pinCode: address.pinCode,
                              street: address.street,
                              index: index,
                            });
                            setOpenModal(true);
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-red-100 text-red-600 font-semibold rounded-lg border-2 border-red-300 transition-all duration-200 hover:scale-105"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {user.addresses?.length === 0 && !showAddAddressForm && (
              <div className="text-center py-12">
                <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No addresses added yet</p>
                <button
                  onClick={() => setShowAddAddressForm(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Plus className="h-5 w-5" />
                  Add Your First Address
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        title={`Delete Address`}
        message={`Are you sure you want to delete the address for ${popUp.name}?`}
        dangerOption="Delete"
        cancelOption="Cancel"
        input={false}
        dangerAction={() => handleRemove(popUp.index)}
        cancelAction={() => setOpenModal(false)}
        showModal={openModal}
      />
    </div>
  );
}

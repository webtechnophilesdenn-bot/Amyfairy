import { useDispatch, useSelector } from "react-redux";
import {
  clearSelectedProduct,
  createProductAsync,
  fetchProductByIdAsync,
  selectProductById,
  updateProductAsync,
} from "../../product/productSlice";
import { createBrandAsync, selectBrands } from "../../brands/brandSlice";
import {
  createCategoryAsync,
  selectCategories,
} from "../../category/categorySlice";
import { TrashIcon, PhotoIcon, XMarkIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { useForm, useFieldArray } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Modal from "../../common/components/Modal";
import { ToastContainer, toast } from "react-toastify";

// Cloudinary Configuration - YOUR CREDENTIALS
const CLOUDINARY_UPLOAD_PRESET = "abcdefg"; // You may need to create an unsigned upload preset
const CLOUDINARY_CLOUD_NAME = "djgt3sn5w";

function ProductForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const brands = useSelector(selectBrands);
  const categories = useSelector(selectCategories);
  const params = useParams();
  const selectedProduct = useSelector(selectProductById);
  const [item, setItem] = useState({});
  const [openModal, setOpenModal] = useState("");
  const [newColor, setNewColor] = useState("#9333ea");
  const [newSize, setNewSize] = useState(1);
  
  // Image upload states
  const [uploadingImage, setUploadingImage] = useState({
    thumbnail: false,
    image1: false,
    image2: false,
    image3: false,
  });
  const [imagePreviews, setImagePreviews] = useState({
    thumbnail: "",
    image1: "",
    image2: "",
    image3: "",
  });

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    setError,
    clearErrors,
    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      colors: [],
      sizes: [],
    },
  });

  const { append: appendColors, remove: removeColors } = useFieldArray({
    control,
    name: "colors",
  });

  const { append: appendSizes, remove: removeSizes } = useFieldArray({
    control,
    name: "sizes",
  });

  useEffect(() => {
    if (params.id) {
      dispatch(fetchProductByIdAsync(params.id));
    } else {
      dispatch(clearSelectedProduct());
    }
  }, [params.id, dispatch]);

  useEffect(() => {
    if (selectedProduct && params.id) {
      setValue("title", selectedProduct.title);
      setValue("description", selectedProduct.description);
      setValue("price", selectedProduct.price);
      setValue("discountPercentage", selectedProduct.discountPercentage);
      setValue("thumbnail", selectedProduct.thumbnail);
      setValue("stock", selectedProduct.stock);
      setValue("image1", selectedProduct.images[0]);
      setValue("image2", selectedProduct.images[1]);
      setValue("image3", selectedProduct.images[2]);
      setValue("brand", selectedProduct.brand);
      setValue("category", selectedProduct.category);
      setValue("colors", selectedProduct.colors);
      setValue("sizes", selectedProduct.sizes);
      setValue("highlight1", selectedProduct.highlights[0]);
      setValue("highlight2", selectedProduct.highlights[1]);
      setValue("highlight3", selectedProduct.highlights[2]);
      setValue("highlight4", selectedProduct.highlights[3]);

      setImagePreviews({
        thumbnail: selectedProduct.thumbnail,
        image1: selectedProduct.images[0],
        image2: selectedProduct.images[1],
        image3: selectedProduct.images[2],
      });
    }
  }, [selectedProduct, params.id, setValue]);

  const uploadToCloudinary = async (file, fieldName) => {
    setUploadingImage((prev) => ({ ...prev, [fieldName]: true }));
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      
      if (data.secure_url) {
        setValue(fieldName, data.secure_url);
        setImagePreviews((prev) => ({ ...prev, [fieldName]: data.secure_url }));
        toast.success("Image uploaded successfully! ✨");
      }
    } catch (error) {
      toast.error("Failed to upload image. Please try again.");
      console.error("Upload error:", error);
    } finally {
      setUploadingImage((prev) => ({ ...prev, [fieldName]: false }));
    }
  };

  const handleImageUpload = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image size should be less than 10MB");
        return;
      }
      uploadToCloudinary(file, fieldName);
    }
  };

  const removeImage = (fieldName) => {
    setValue(fieldName, "");
    setImagePreviews((prev) => ({ ...prev, [fieldName]: "" }));
    toast.info("Image removed");
  };

  const handleDelete = () => {
    const product = { ...selectedProduct, deleted: true };
    dispatch(updateProductAsync(product));
    toast.success("Product Deleted Successfully");
    navigate("/admin", { replace: true });
  };

  const handleAddBrand = () => {
    dispatch(createBrandAsync());
  };

  const handleAddCategory = () => {
    dispatch(createCategoryAsync());
  };

  const handleUpdate = () => {
    dispatch(updateProductAsync(item));
    toast.success("Product Updated Successfully ✨");
    reset();
    navigate("/admin", { replace: true });
  };

  const handleSave = () => {
    dispatch(createProductAsync(item));
    toast.success("Product Created Successfully ✨");
    reset();
    navigate("/admin", { replace: true });
  };

  const handleAddColor = () => {
    const colors = getValues("colors");

    if (!colors.includes(newColor)) {
      appendColors(newColor);
      toast.success("Color added");
    } else {
      toast.error("Color already added");
    }

    setOpenModal("color");
  };

  const handleRemoveColor = (index) => {
    removeColors(index);
    toast.success("Color removed");
  };

  const handleAddSize = () => {
    const sizes = getValues("sizes");

    if (newSize < 1) {
      toast.error("Size must be greater than 0");
      return;
    }

    if (!sizes.includes(String(newSize)) && !sizes.includes(newSize)) {
      appendSizes(newSize);
      toast.success("Size added");
    } else {
      toast.error("Size already added");
    }

    setOpenModal("size");
  };

  const handleRemoveSize = (index) => {
    removeSizes(index);
    toast.success("Size removed");
  };

  useEffect(() => {
    if (
      getValues("colors").length === 0 &&
      getValues("sizes").length === 0 &&
      Object.keys(errors).length !== 0
    ) {
      setError("colors", {
        type: "manual",
        message: "Add at least one color",
      });
      setError("sizes", {
        type: "manual",
        message: "Add at least one size",
      });
    } else if (
      getValues("colors").length === 0 &&
      Object.keys(errors).length !== 0
    ) {
      setError("colors", {
        type: "manual",
        message: "Add at least one color",
      });
    } else if (
      getValues("sizes").length === 0 &&
      Object.keys(errors).length !== 0
    ) {
      setError("sizes", {
        type: "manual",
        message: "Add at least one size",
      });
    }
  }, [
    getValues,
    setError,
    errors,
    getValues("colors").length,
    getValues("sizes").length,
  ]);

  useEffect(() => {
    if (Object.keys(errors).length !== 0) {
      if (getValues("colors").length === 0 && getValues("sizes").length === 0) {
        setError("colors", {
          type: "manual",
          message: "Add at least one color",
        });
        setError("sizes", {
          type: "manual",
          message: "Add at least one size",
        });
      } else if (getValues("colors").length === 0) {
        setError("colors", {
          type: "manual",
          message: "Add at least one color",
        });
      } else if (getValues("sizes").length === 0) {
        setError("sizes", {
          type: "manual",
          message: "Add at least one size",
        });
      }
    }
  }, [getValues, setError, errors]);

  useEffect(() => {
    if (getValues("colors").length > 0 && getValues("sizes").length > 0) {
      clearErrors("colors");
      clearErrors("sizes");
    } else if (getValues("colors").length > 0) {
      clearErrors("colors");
    } else if (getValues("sizes").length > 0) {
      clearErrors("sizes");
    }
  }, [
    clearErrors,
    getValues("colors").length,
    getValues("sizes").length,
    getValues,
  ]);

  useEffect(() => {
    setOpenModal("");
  }, [Object.keys(errors).length]);

 
// Replace your ImageUploadSection component with this fixed version:

const ImageUploadSection = ({ fieldName, label }) => (
  <div className="space-y-3">
    <label className="block text-sm font-bold text-purple-900">
      {label}
    </label>
    
    {imagePreviews[fieldName] ? (
      <div className="relative group">
        <img
          src={imagePreviews[fieldName]}
          alt={label}
          className="w-full h-40 object-cover rounded-2xl border-2 border-purple-300 shadow-lg hover:shadow-xl transition-all duration-300"
        />
        <button
          type="button"
          onClick={() => removeImage(fieldName)}
          className="absolute top-2 right-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:scale-110"
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      </div>
    ) : (
      <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-purple-300 rounded-2xl cursor-pointer bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50 hover:border-purple-400 hover:shadow-lg transition-all duration-300">
        <div className="flex flex-col items-center justify-center pt-4 pb-5">
          {uploadingImage[fieldName] ? (
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
          ) : (
            <>
              <PhotoIcon className="h-10 w-10 text-purple-400 mb-2" />
              <p className="text-xs text-purple-600 font-semibold">
                Click to upload
              </p>
              <p className="text-xs text-purple-400">MAX 10MB</p>
            </>
          )}
        </div>
        <input
          type="file"
          className="hidden"
          accept="image/*"
          onChange={(e) => handleImageUpload(e, fieldName)}
          disabled={uploadingImage[fieldName]}
        />
      </label>
    )}
    
    {/* FIX: Add value prop with empty string fallback */}
    <input
      type="text"
      {...register(fieldName, {
        required: `${label} is required`,
      })}
      value={getValues(fieldName) || ""} // ✅ This fixes the warning
      onChange={(e) => setValue(fieldName, e.target.value)} // ✅ Handle onChange properly
      placeholder="Or paste image URL"
      className="w-full px-3 py-2 text-sm border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-purple-300"
    />
    
    {errors[fieldName] && (
      <p className="text-xs text-pink-600 font-semibold">
        {errors[fieldName].message}
      </p>
    )}
  </div>
);
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-pink-200 py-8 px-4 sm:px-6 lg:px-8">
        <form
          noValidate
          onSubmit={handleSubmit((data) => {
            let product = { ...data };
            product.images = [
              product.image1,
              product.image2,
              product.image3,
              product.thumbnail,
            ];
            product.highlights = [
              product.highlight1,
              product.highlight2,
              product.highlight3,
              product.highlight4,
            ];
            product.rating = 0;
            product.colors = product.colors || [];
            product.sizes = product.sizes || [];

            delete product["image1"];
            delete product["image2"];
            delete product["image3"];

            delete product["highlight1"];
            delete product["highlight2"];
            delete product["highlight3"];
            delete product["highlight4"];

            product.price = +product.price;
            product.stock = +product.stock;
            product.discountPercentage = +product.discountPercentage;

            if (product.colors.length === 0 && product.sizes.length === 0) {
              toast.error("Add at least one color and size");
              return;
            } else if (product.colors.length === 0) {
              toast.error("Add at least one color");
              return;
            } else if (product.sizes.length === 0) {
              toast.error("Add at least one size");
              return;
            } else if (params.id && openModal === "") {
              product.id = params.id;
              product.rating = selectedProduct.rating || 0;
              setItem(product);
              setOpenModal("update");
            } else if (!params.id && openModal === "") {
              setItem(product);
              setOpenModal("save");
            }
          })}
          className="max-w-7xl mx-auto"
        >
          {/* Modals */}
          {openModal === "delete" && (
            <Modal
              title={`Delete ${selectedProduct?.title}`}
              message="Are you sure you want to delete this Product?"
              dangerOption="Delete"
              input={false}
              cancelOption="Cancel"
              dangerAction={() => handleDelete()}
              cancelAction={() => setOpenModal("")}
              showModal={openModal}
            ></Modal>
          )}
          {openModal === "addBrand" && (
            <Modal
              title={`Add Brand`}
              message="Enter the name of the brand"
              input={true}
              dangerOption="Add Brand"
              cancelOption="Cancel"
              dangerAction={() => handleAddBrand()}
              cancelAction={() => setOpenModal("")}
              showModal={openModal}
            ></Modal>
          )}
          {openModal === "addCategory" && (
            <Modal
              title={`Add Category`}
              message="Enter the name of the category"
              dangerOption="Add Category"
              input={true}
              cancelOption="Cancel"
              dangerAction={() => handleAddCategory()}
              cancelAction={() => setOpenModal("")}
              showModal={openModal}
            ></Modal>
          )}
          {openModal === "save" && (
            <Modal
              title={`Save ${item?.title}`}
              message="Are you sure you want to add this Product?"
              dangerOption="Save"
              input={false}
              cancelOption="Cancel"
              dangerAction={() => handleSave()}
              cancelAction={() => setOpenModal("")}
              showModal={openModal}
            ></Modal>
          )}
          {openModal === "update" && (
            <Modal
              title={`Updated ${selectedProduct?.title}`}
              message="Are you sure you want to update this Product?"
              dangerOption="Update"
              input={false}
              cancelOption="Cancel"
              dangerAction={() => handleUpdate()}
              cancelAction={() => setOpenModal("")}
              showModal={openModal}
            ></Modal>
          )}

          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-purple-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-pink-600 px-8 py-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-white opacity-10"></div>
              <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-24 w-24 rounded-full bg-white opacity-10"></div>
              <div className="relative flex items-center gap-3">
                <SparklesIcon className="h-8 w-8 text-white" />
                <div>
                  <h2 className="text-3xl font-bold text-white">
                    {params.id ? "Edit Product" : "Add New Product"}
                  </h2>
                  <p className="text-pink-100 mt-1">Fill in the details below</p>
                </div>
              </div>
            </div>

            {/* TWO COLUMN LAYOUT */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
              
              {/* LEFT COLUMN */}
              <div className="space-y-6">
                {selectedProduct?.deleted && (
                  <div className="bg-pink-100 border-l-4 border-pink-500 p-4 rounded-xl">
                    <p className="text-pink-700 font-bold">
                      ⚠️ This product is deleted
                    </p>
                  </div>
                )}

                {/* Basic Information */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl shadow-md">
                  <h3 className="text-lg font-bold text-purple-900 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    Basic Information
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-purple-900 mb-2">
                        Product Name
                      </label>
                      <input
                        type="text"
                        {...register("title", {
                          required: "Name is required",
                        })}
                        className="w-full px-4 py-2.5 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
                        placeholder="Enter product name"
                      />
                      {errors.title && (
                        <p className="mt-1 text-sm text-pink-600 font-semibold">
                          {errors.title.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-purple-900 mb-2">
                        Description
                      </label>
                      <textarea
                        {...register("description", {
                          required: "Description is required",
                        })}
                        rows={3}
                        className="w-full px-4 py-2.5 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
                        placeholder="Write a detailed description..."
                      />
                      {errors.description && (
                        <p className="mt-1 text-sm text-pink-600 font-semibold">
                          {errors.description.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Brand & Category */}
                <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-6 rounded-2xl shadow-md">
                  <h3 className="text-lg font-bold text-purple-900 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                    Brand & Category
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-purple-900 mb-2">
                        Brand
                      </label>
                      <div className="flex gap-2">
                        <select
                          className="flex-1 px-4 py-2.5 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 bg-white"
                          {...register("brand", {
                            required: "Brand is required",
                          })}
                        >
                          <option value="">Choose brand</option>
                          {brands.map((brand) => (
                            <option value={brand.value} key={brand.id}>
                              {brand.label}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          className="px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-md hover:shadow-lg"
                          onClick={() => setOpenModal("addBrand")}
                        >
                          Add
                        </button>
                      </div>
                      {errors.brand && (
                        <p className="mt-1 text-sm text-pink-600 font-semibold">
                          {errors.brand.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-purple-900 mb-2">
                        Category
                      </label>
                      <div className="flex gap-2">
                        <select
                          className="flex-1 px-4 py-2.5 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 bg-white"
                          {...register("category", {
                            required: "Category is required",
                          })}
                        >
                          <option value="">Choose category</option>
                          {categories.map((category) => (
                            <option value={category.value} key={category.id}>
                              {category.label}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          className="px-4 py-2.5 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-bold hover:from-pink-600 hover:to-purple-600 transition-all duration-200 shadow-md hover:shadow-lg"
                          onClick={() => setOpenModal("addCategory")}
                        >
                          Add
                        </button>
                      </div>
                      {errors.category && (
                        <p className="mt-1 text-sm text-pink-600 font-semibold">
                          {errors.category.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Pricing & Stock */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl shadow-md">
                  <h3 className="text-lg font-bold text-purple-900 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    Pricing & Stock
                  </h3>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-purple-900 mb-2">
                        Price ($)
                      </label>
                      <input
                        type="number"
                        {...register("price", {
                          required: "Price is required",
                          min: 1,
                        })}
                        className="w-full px-4 py-2.5 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
                        placeholder="0.00"
                      />
                      {errors.price && (
                        <p className="mt-1 text-xs text-pink-600 font-semibold">
                          {errors.price.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-purple-900 mb-2">
                        Discount (%)
                      </label>
                      <input
                        type="number"
                        {...register("discountPercentage", {
                          required: "Discount is required",
                          min: 0,
                          max: 100,
                        })}
                        className="w-full px-4 py-2.5 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
                        placeholder="0"
                      />
                      {errors.discountPercentage && (
                        <p className="mt-1 text-xs text-pink-600 font-semibold">
                          {errors.discountPercentage.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-purple-900 mb-2">
                        Stock
                      </label>
                      <input
                        type="number"
                        {...register("stock", {
                          required: "Stock is required",
                          min: 1,
                        })}
                        className="w-full px-4 py-2.5 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
                        placeholder="0"
                      />
                      {errors.stock && (
                        <p className="mt-1 text-xs text-pink-600 font-semibold">
                          {errors.stock.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Product Highlights */}
                <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-6 rounded-2xl shadow-md">
                  <h3 className="text-lg font-bold text-purple-900 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                    Product Highlights
                  </h3>

                  <div className="space-y-3">
                    {[1, 2, 3, 4].map((num) => (
                      <div key={num}>
                        <input
                          type="text"
                          {...register(`highlight${num}`, {
                            required: "Highlight is required",
                          })}
                          className="w-full px-4 py-2.5 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
                          placeholder={`Highlight ${num}`}
                        />
                        {errors[`highlight${num}`] && (
                          <p className="mt-1 text-xs text-pink-600 font-semibold">
                            {errors[`highlight${num}`].message}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-6">
                
                {/* Colors & Sizes */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl shadow-md">
                  <h3 className="text-lg font-bold text-purple-900 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    Colors & Sizes
                  </h3>

                  {/* Colors */}
                  <div className="mb-6">
                    <label className="block text-sm font-bold text-purple-900 mb-3">
                      Add Color
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={newColor}
                        onChange={(e) => setNewColor(e.target.value)}
                        className="w-14 h-14 rounded-xl cursor-pointer border-4 border-white shadow-lg"
                      />
                      <button
                        type="button"
                        onClick={handleAddColor}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-md hover:shadow-lg"
                      >
                        Add Color
                      </button>
                    </div>

                    {getValues("colors").length > 0 && (
                      <div className="mt-4">
                        <div className="flex flex-wrap gap-3">
                          {getValues("colors").map((color, index) => (
                            <div
                              key={index}
                              className="flex flex-col items-center gap-2"
                            >
                              <div
                                className="w-12 h-12 rounded-full border-4 border-white shadow-lg"
                                style={{ backgroundColor: color }}
                              ></div>
                              <button
                                type="button"
                                onClick={() => handleRemoveColor(index)}
                                className="p-1 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
                              >
                                <TrashIcon className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {errors.colors && (
                      <p className="mt-2 text-sm text-pink-600 font-semibold">
                        {errors.colors.message}
                      </p>
                    )}
                  </div>

                  {/* Sizes */}
                  <div>
                    <label className="block text-sm font-bold text-purple-900 mb-3">
                      Add Size (inches)
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        value={newSize}
                        onChange={(e) => setNewSize(e.target.value)}
                        className="w-24 px-4 py-3 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
                        placeholder="Size"
                      />
                      <button
                        type="button"
                        onClick={handleAddSize}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-bold hover:from-pink-600 hover:to-purple-600 transition-all duration-200 shadow-md hover:shadow-lg"
                      >
                        Add Size
                      </button>
                    </div>

                    {getValues("sizes").length > 0 && (
                      <div className="mt-4">
                        <div className="flex flex-wrap gap-3">
                          {getValues("sizes").map((size, index) => (
                            <div
                              key={index}
                              className="flex flex-col items-center gap-2"
                            >
                              <div className="px-5 py-2 bg-white border-2 border-purple-300 rounded-xl font-bold text-purple-700 shadow-md">
                                {size}"
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveSize(index)}
                                className="p-1 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors"
                              >
                                <TrashIcon className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {errors.sizes && (
                      <p className="mt-2 text-sm text-pink-600 font-semibold">
                        {errors.sizes.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Product Images */}
                <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-6 rounded-2xl shadow-md">
                  <h3 className="text-lg font-bold text-purple-900 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                    Product Images
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <ImageUploadSection fieldName="thumbnail" label="Thumbnail" />
                    <ImageUploadSection fieldName="image1" label="Image 1" />
                    <ImageUploadSection fieldName="image2" label="Image 2" />
                    <ImageUploadSection fieldName="image3" label="Image 3" />
                  </div>
                </div>

              </div>
            </div>

            {/* Footer Actions */}
            <div className="bg-gradient-to-r from-purple-100 via-pink-100 to-purple-100 px-8 py-6 flex items-center justify-between gap-4 border-t-2 border-purple-200">
              <Link
                to="/admin"
                className="px-6 py-3 text-purple-600 font-bold hover:text-purple-800 transition-colors"
              >
                ← Cancel
              </Link>

              <div className="flex gap-3">
                {selectedProduct && !selectedProduct.deleted && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setOpenModal("delete");
                      }}
                      className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-bold hover:from-red-600 hover:to-pink-600 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      🗑️ Delete
                    </button>

                    <button
                      type="submit"
                      className="px-8 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 text-white rounded-xl font-bold hover:from-purple-600 hover:via-pink-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      ✨ Update Product
                    </button>
                  </>
                )}
                {!selectedProduct && (
                  <button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 text-white rounded-xl font-bold hover:from-purple-600 hover:via-pink-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    ✨ Save Product
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default ProductForm;
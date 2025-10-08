import { useState, useEffect } from "react";
import { StarIcon } from "@heroicons/react/20/solid";
import { RadioGroup } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductByIdAsync,
  selectProductById,
  selectStatus,
  selectError,
  resetProductError,
} from "../productSlice";
import { useParams } from "react-router-dom";
import { addToCartAsync, selectItems } from "../../cart/cartSlice";
import { ToastContainer, toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { RotatingLines } from "react-loader-spinner";
import "react-toastify/dist/ReactToastify.css";
import {
  ShoppingCart,
  Check,
  Sparkles,
  Package,
  Shield,
  Truck,
} from "lucide-react";

<ToastContainer
  position="top-right"
  autoClose={5000}
  hideProgressBar={false}
  newestOnTop={false}
  closeOnClick
  rtl={false}
  pauseOnFocusLoss
  draggable
  pauseOnHover
  theme="colored"
/>;

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ProductDetail() {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const product = useSelector(selectProductById);
  const items = useSelector(selectItems);
  const error = useSelector(selectError);
  const status = useSelector(selectStatus);
  const [selectedColor, setSelectedColor] = useState(-1);
  const [selectedSize, setSelectedSize] = useState(-1);
  const [selectedImage, setSelectedImage] = useState(0);

  const handleCart = (e) => {
    e.preventDefault();

    if (product.stock < 1) {
      toast.error(`${product.title} is out of stock`);
      return;
    }

    if (selectedColor < 0) {
      toast.error("Please select a color");
      return;
    }

    if (selectedSize < 0) {
      toast.error("Please select a size");
      return;
    }

    let productExistsInCart = false;

    items.forEach((item, i) => {
      if (
        item.product.id === product.id &&
        !(
          item.color !== product.colors[selectedColor] ||
          item.size !== product.sizes[selectedSize]
        )
      ) {
        productExistsInCart = true;
      }
    });

    if (!productExistsInCart) {
      const newItem = {
        product: product.id,
        quantity: 1,
        color: product.colors[selectedColor],
        size: parseInt(product.sizes[selectedSize]),
      };

      dispatch(addToCartAsync(newItem));
      toast.success(`${product.title} added to cart`);
    } else {
      toast.error("Product already in cart");
    }
  };

  useEffect(() => {
    dispatch(fetchProductByIdAsync(params.id));
  }, [dispatch, params.id]);

  useEffect(() => {
    if (error) {
      navigate("/404", { replace: true });
    }
    return () => {
      dispatch(resetProductError());
    };
  }, [error, navigate, dispatch]);

  const allImages = product
    ? [product.thumbnail, ...product.images.slice(0, 3)]
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100">
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

      {product && (
        <div className="py-6 sm:py-8">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-6"
          >
            <ol className="flex items-center space-x-2 text-sm">
              {product.breadcrumbs &&
                product.breadcrumbs.map((breadcrumb, index) => (
                  <li
                    key={breadcrumb.id}
                    className="flex items-center animate-fadeIn"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <Link
                      to={breadcrumb.href}
                      className="font-semibold text-purple-700 hover:text-pink-600 transition-colors duration-200"
                    >
                      {breadcrumb.name}
                    </Link>
                    <svg
                      width={16}
                      height={20}
                      viewBox="0 0 16 20"
                      fill="currentColor"
                      aria-hidden="true"
                      className="ml-2 h-5 w-4 text-purple-300"
                    >
                      <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                    </svg>
                  </li>
                ))}
            </ol>
          </nav>

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Image Gallery Section */}
              <div className="animate-fadeIn">
                {/* Main Image */}
                <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl border-2 border-purple-200 p-4 sm:p-6 mb-4 sm:mb-6 overflow-hidden group">
                  <div className="aspect-square relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100">
                    <img
                      src={allImages[selectedImage]}
                      alt={product.title}
                      className="h-full w-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                    />
                    {product.discountPercentage > 0 && (
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
                        {Math.round(product.discountPercentage)}% OFF
                      </div>
                    )}
                  </div>
                </div>

                {/* Thumbnail Gallery */}
                <div className="grid grid-cols-4 gap-3 sm:gap-4">
                  {allImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`group relative aspect-square overflow-hidden rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                        selectedImage === index
                          ? "border-purple-500 shadow-lg shadow-purple-300/50"
                          : "border-purple-200 hover:border-purple-400"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.title} ${index + 1}`}
                        className="h-full w-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                      />
                      {selectedImage === index && (
                        <div className="absolute inset-0 bg-purple-500/20 flex items-center justify-center">
                          <div className="bg-white rounded-full p-1">
                            <Check className="h-4 w-4 text-purple-600" />
                          </div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Info Section */}
              <div className="animate-fadeIn" style={{ animationDelay: "200ms" }}>
                <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl border-2 border-purple-200 p-6 sm:p-8 sticky top-24">
                  {/* Title */}
                  <div className="mb-6">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
                      {product.title}
                    </h1>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center bg-gradient-to-r from-yellow-400 to-orange-400 px-3 py-1.5 rounded-lg">
                        {[0, 1, 2, 3, 4].map((rating) => (
                          <StarIcon
                            key={rating}
                            className={classNames(
                              product.rating > rating
                                ? "text-white"
                                : "text-white/30",
                              "h-4 w-4"
                            )}
                          />
                        ))}
                        <span className="text-sm font-bold text-white ml-2">
                          {product.rating}
                        </span>
                      </div>
                      <span className="text-sm text-gray-600">
                        ({product.stock} in stock)
                      </span>
                    </div>

                    {/* Price */}
                  {/* Price - Fixed Responsive Layout */}
<div className="flex flex-wrap items-baseline gap-2 sm:gap-3 mb-6">
  <span className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
    ₹{product.discountedPrice}
  </span>
  <span className="text-lg sm:text-xl md:text-2xl line-through text-gray-400">
    ₹{product.price}
  </span>
  <span className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap">
    Save ₹{product.price - product.discountedPrice}
  </span>
</div>

                  </div>

                  <form onSubmit={handleCart}>
                    {/* Colors */}
                    <div className="mb-6">
                      <h3 className="text-lg font-bold text-purple-900 mb-3">
                        Select Color
                      </h3>
                      <RadioGroup
                        value={selectedColor}
                        onChange={setSelectedColor}
                      >
                        <div className="flex items-center gap-3">
                          {product.colors.map((color, index) => (
                            <RadioGroup.Option
                              key={color}
                              value={index}
                              onClick={() => setSelectedColor(index)}
                              className={`relative cursor-pointer`}
                            >
                              {({ checked }) => (
                                <div
                                  className={`h-10 w-10 sm:h-12 sm:w-12 rounded-full border-2 transition-all duration-300 hover:scale-110 ${
                                    checked
                                      ? "border-purple-600 ring-2 ring-purple-400 ring-offset-2"
                                      : "border-gray-300 hover:border-purple-400"
                                  }`}
                                  style={{ backgroundColor: color }}
                                >
                                  {checked && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <Check className="h-5 w-5 text-white drop-shadow-lg" />
                                    </div>
                                  )}
                                </div>
                              )}
                            </RadioGroup.Option>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Sizes */}
                    <div className="mb-8">
                      <h3 className="text-lg font-bold text-purple-900 mb-3">
                        Select Size (in inches)
                      </h3>
                      <RadioGroup
                        value={selectedSize}
                        onChange={setSelectedSize}
                      >
                        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                          {product.sizes.map((size, index) => (
                            <RadioGroup.Option
                              key={size}
                              value={index}
                              onClick={() => setSelectedSize(index)}
                              className={`cursor-pointer`}
                            >
                              {({ checked }) => (
                                <div
                                  className={`flex items-center justify-center py-3 px-4 rounded-xl border-2 font-bold text-sm uppercase transition-all duration-300 hover:scale-105 ${
                                    checked
                                      ? "bg-gradient-to-r from-purple-600 to-pink-600 border-transparent text-white shadow-lg"
                                      : "bg-white border-purple-300 text-purple-900 hover:border-purple-500"
                                  }`}
                                >
                                  {size}
                                </div>
                              )}
                            </RadioGroup.Option>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      type="submit"
                      className="w-full group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 mb-6"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <ShoppingCart className="h-5 w-5 group-hover:scale-110 transition-transform" />
                        Add to Cart
                      </span>
                    </button>

                    {/* Trust Badges */}
                    <div className="grid grid-cols-3 gap-3 pt-6 border-t-2 border-purple-200">
                      <div className="text-center">
                        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-full p-3 w-14 h-14 flex items-center justify-center mx-auto mb-2">
                          <Truck className="h-6 w-6 text-purple-600" />
                        </div>
                        <p className="text-xs font-semibold text-gray-700">
                          Free Shipping
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-full p-3 w-14 h-14 flex items-center justify-center mx-auto mb-2">
                          <Shield className="h-6 w-6 text-purple-600" />
                        </div>
                        <p className="text-xs font-semibold text-gray-700">
                          Secure Payment
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-full p-3 w-14 h-14 flex items-center justify-center mx-auto mb-2">
                          <Package className="h-6 w-6 text-purple-600" />
                        </div>
                        <p className="text-xs font-semibold text-gray-700">
                          Easy Returns
                        </p>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Description */}
              <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl border-2 border-purple-200 p-6 sm:p-8 animate-fadeIn" style={{ animationDelay: "400ms" }}>
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="h-6 w-6 text-purple-600" />
                  <h2 className="text-2xl font-bold text-purple-900">
                    Description
                  </h2>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Highlights */}
              <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl border-2 border-purple-200 p-6 sm:p-8 animate-fadeIn" style={{ animationDelay: "500ms" }}>
                <h2 className="text-2xl font-bold text-purple-900 mb-6">
                  Key Highlights
                </h2>
                <ul className="space-y-3">
                  {product.highlights.map((highlight, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 animate-fadeIn"
                      style={{ animationDelay: `${(index + 6) * 100}ms` }}
                    >
                      <div className="flex-shrink-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-1 mt-0.5">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-gray-700 leading-relaxed">
                        {highlight}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

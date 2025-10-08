import { Fragment, useState, useEffect } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import {
  Menu as MenuIcon,
  ShoppingCart,
  X,
  Sparkles,
  Search,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectItems } from "../cart/cartSlice";
import { selectUserInfo } from "../user/userSlice";
import { fetchProductsByFiltersAsync, selectAllProducts } from "../product/productSlice";

const navigation = [
  { name: "Products", link: "/", role: "user" },
  { name: "Products", link: "/admin", role: "admin" },
  { name: "Orders", link: "/admin/orders", role: "admin" },
];
const userNavigation = [
  { name: "My Profile", link: "/profile" },
  { name: "My Orders", link: "/orders" },
  { name: "Sign out", link: "/logout" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function NavBar({ children }) {
  const items = useSelector(selectItems);
  const userInfo = useSelector(selectUserInfo);
  const products = useSelector(selectAllProducts);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  // Fetch all products on mount for search
  useEffect(() => {
    dispatch(fetchProductsByFiltersAsync({ 
      filter: {}, 
      sort: {}, 
      pagination: { _page: 1, _per_page: 1000 }, 
      role: "user" 
    }));
  }, [dispatch]);

  // Update local products list when products change
  useEffect(() => {
    if (products.data) {
      setAllProducts(products.data);
    }
  }, [products]);

  // Handle search
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = allProducts.filter((product) =>
      product.title.toLowerCase().includes(query) ||
      product.brand?.toLowerCase().includes(query) ||
      product.category?.toLowerCase().includes(query)
    );

    setSearchResults(filtered.slice(0, 5)); // Show top 5 results
    setShowResults(true);
  }, [searchQuery, allProducts]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowResults(false);
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleProductClick = (productId) => {
    setSearchQuery("");
    setShowResults(false);
    navigate(`/product-detail/${productId}`);
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.search-container')) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {userInfo && (
        <>
          {/* Transparent Black Background */}
          <div className="bg-transparent sticky top-0 z-50 pt-2 sm:pt-4 pb-2 sm:pb-4  sm:px-4 py-0">
            <Disclosure
              as="nav"
              className={classNames(
                "mx-auto transition-all duration-500 ease-out",
                scrolled
                  ? "max-w-full sm:max-w-6xl rounded-2xl sm:rounded-full shadow-2xl"
                  : "max-w-full sm:max-w-7xl rounded-2xl sm:rounded-full shadow-xl"
              )}
            >
              {({ open }) => (
                <>
                  {/* Pill-shaped navbar container */}
                  <div
                    className={classNames(
                      "rounded-2xl sm:rounded-full backdrop-blur-xl border-2 transition-all duration-500",
                      scrolled
                        ? "bg-black/90 border-white/20"
                        : "bg-black/70 border-white/10"
                    )}
                  >
                    <div className="px-3 sm:px-6 lg:px-8">
                      <div
                        className={classNames(
                          "flex items-center justify-between gap-2 sm:gap-4 transition-all duration-500",
                          scrolled ? "h-12 sm:h-14" : "h-14 sm:h-16"
                        )}
                      >
                        {/* Left Side - Logo & Navigation */}
                        <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
                          {/* Logo */}
                          <Link
                            to="/"
                            className="flex-shrink-0 group flex items-center gap-1.5 sm:gap-2 transform hover:scale-105 transition-transform duration-300"
                          >
                            <div className="relative">
                              <div className="absolute inset-0 bg-white/20 rounded-lg blur opacity-60 group-hover:opacity-100 transition-opacity"></div>
                              <img
                                className={classNames(
                                  "relative transition-all duration-500 rounded-lg",
                                  scrolled ? " sm:h-7 sm:w-11" : "h-7 w-11 sm:h-9 sm:w-14"
                                )}
                                src="../../../logo.png"
                                alt="AmiFairy"
                              />
                            </div>
                            <span
                              className={classNames(
                                "font-bold text-white transition-all duration-500 hidden lg:block",
                                scrolled ? "text-sm sm:text-base" : "text-base sm:text-lg"
                              )}
                            >
                              AmiFairy
                            </span>
                          </Link>

                          {/* Desktop Navigation */}
                          <div className="hidden lg:flex items-center space-x-1">
                            {navigation.map(
                              (item, index) =>
                                item?.role === userInfo?.role && (
                                  <Link
                                    key={index}
                                    to={item.link}
                                    className="relative group px-3 py-2 rounded-full text-xs font-semibold text-white/80 hover:text-white transition-all duration-300"
                                  >
                                    <span className="relative z-10">
                                      {item.name}
                                    </span>
                                    <div className="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                  </Link>
                                )
                            )}
                          </div>
                        </div>

                        {/* Center - Search Bar */}
                        <div className="hidden md:block flex-1 max-w-md lg:max-w-lg search-container relative">
                          <form onSubmit={handleSearchSubmit} className="relative">
                            <input
                              type="text"
                              placeholder="Search products..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className={classNames(
                                "w-full rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/15",
                                scrolled ? "px-4 py-1.5 text-sm" : "px-4 py-2 text-sm"
                              )}
                            />
                            <button
                              type="submit"
                              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/20 transition-colors"
                            >
                              <Search className="h-4 w-4 text-white/70" />
                            </button>
                          </form>

                          {/* Search Results Dropdown */}
                          {showResults && searchResults.length > 0 && (
                            <div className="absolute top-full mt-2 w-full bg-black/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
                              {searchResults.map((product) => (
                                <div
                                  key={product.id}
                                  onClick={() => handleProductClick(product.id)}
                                  className="flex items-center gap-3 p-3 hover:bg-white/10 cursor-pointer transition-colors border-b border-white/10 last:border-b-0"
                                >
                                  <img
                                    src={product.thumbnail}
                                    alt={product.title}
                                    className="h-12 w-12 object-cover rounded-lg"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-white truncate">
                                      {product.title}
                                    </p>
                                    <p className="text-xs text-white/60">
                                      ₹{product.discountedPrice}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {showResults && searchResults.length === 0 && searchQuery.trim() && (
                            <div className="absolute top-full mt-2 w-full bg-black/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-4">
                              <p className="text-sm text-white/60 text-center">
                                No products found
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Right Side - Cart & Profile */}
                        <div className="hidden md:flex items-center space-x-2 lg:space-x-3 flex-shrink-0">
                          {/* Shopping Cart */}
                          <Link to="/cart" className="relative group">
                            <button
                              type="button"
                              className={classNames(
                                "relative rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all duration-300 hover:scale-110 border border-white/20",
                                scrolled ? "p-1.5 lg:p-2" : "p-2 lg:p-2.5"
                              )}
                            >
                              <ShoppingCart
                                className={classNames(
                                  "transition-all duration-500",
                                  scrolled ? "h-4 w-4 lg:h-5 lg:w-5" : "h-5 w-5 lg:h-6 lg:w-6"
                                )}
                                aria-hidden="true"
                              />
                            </button>
                            {items.length > 0 && (
                              <span className="absolute -top-1 -right-1 lg:-top-2 lg:-right-2 flex items-center justify-center h-4 w-4 lg:h-5 lg:w-5 rounded-full bg-white text-black text-[9px] lg:text-[10px] font-bold ring-2 ring-black shadow-lg animate-pulse">
                                {items.length}
                              </span>
                            )}
                          </Link>

                          {/* Profile Dropdown */}
                          <Menu as="div" className="relative">
                            <Menu.Button
                              className={classNames(
                                "flex items-center rounded-full bg-white/10 p-0.5 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black hover:bg-white/20 transition-all duration-300 hover:scale-110 shadow-lg border border-white/20"
                              )}
                            >
                              <img
                                className={classNames(
                                  "rounded-full ring-2 ring-white/30 transition-all duration-500",
                                  scrolled ? "h-7 w-7 lg:h-8 lg:w-8" : "h-8 w-8 lg:h-9 lg:w-9"
                                )}
                                src={userInfo.imageUrl || "../../../user.png"}
                                alt="Profile"
                              />
                            </Menu.Button>
                            <Transition
                              as={Fragment}
                              enter="transition ease-out duration-200"
                              enterFrom="transform opacity-0 scale-95 translate-y-2"
                              enterTo="transform opacity-100 scale-100 translate-y-0"
                              leave="transition ease-in duration-150"
                              leaveFrom="transform opacity-100 scale-100"
                              leaveTo="transform opacity-0 scale-95"
                            >
                              <Menu.Items className="absolute right-0 z-10 mt-4 w-56 lg:w-64 origin-top-right rounded-2xl bg-black/95 backdrop-blur-xl shadow-2xl ring-1 ring-white/20 focus:outline-none overflow-hidden border border-white/10">
                                <div className="bg-black/90 backdrop-blur-sm px-4 lg:px-5 py-3 lg:py-4 border-b border-white/10">
                                  <p className="text-xs lg:text-sm font-bold text-white">
                                    {userInfo?.addresses?.[0]?.name || "User"}
                                  </p>
                                  <p className="text-[10px] lg:text-xs text-white/60 mt-1 truncate">
                                    {userInfo.email}
                                  </p>
                                </div>
                                <div className="py-2 bg-black/95 backdrop-blur-xl">
                                  {userNavigation.map((item) => (
                                    <Menu.Item key={item.name}>
                                      {({ active }) => (
                                        <Link
                                          to={item.link}
                                          className={classNames(
                                            active
                                              ? "bg-white/20 text-white"
                                              : "text-white/70",
                                            "block px-4 lg:px-5 py-2.5 lg:py-3 text-xs lg:text-sm font-medium transition-all duration-200"
                                          )}
                                        >
                                          {item.name}
                                        </Link>
                                      )}
                                    </Menu.Item>
                                  ))}
                                </div>
                              </Menu.Items>
                            </Transition>
                          </Menu>
                        </div>

                        {/* Mobile menu button */}
                        <div className="flex md:hidden">
                          <Disclosure.Button className="inline-flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm p-2 text-white hover:bg-white/20 transition-all duration-300 border border-white/20">
                            {open ? (
                              <X className="block h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
                            ) : (
                              <MenuIcon
                                className="block h-5 w-5 sm:h-6 sm:w-6"
                                aria-hidden="true"
                              />
                            )}
                          </Disclosure.Button>
                        </div>
                      </div>
                    </div>

                    {/* Mobile Menu */}
                    <Disclosure.Panel className="md:hidden border-t border-white/10 mt-2">
                      {/* Mobile Search Bar */}
                      <div className="px-3 sm:px-6 pt-3 pb-2 search-container">
                        <form onSubmit={handleSearchSubmit} className="relative">
                          <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 text-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/15"
                          />
                          <button
                            type="submit"
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/20 transition-colors"
                          >
                            <Search className="h-4 w-4 text-white/70" />
                          </button>
                        </form>

                        {/* Mobile Search Results */}
                        {showResults && searchResults.length > 0 && (
                          <div className="mt-2 bg-black/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
                            {searchResults.map((product) => (
                              <div
                                key={product.id}
                                onClick={() => handleProductClick(product.id)}
                                className="flex items-center gap-3 p-3 hover:bg-white/10 cursor-pointer transition-colors border-b border-white/10 last:border-b-0"
                              >
                                <img
                                  src={product.thumbnail}
                                  alt={product.title}
                                  className="h-12 w-12 object-cover rounded-lg"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-white truncate">
                                    {product.title}
                                  </p>
                                  <p className="text-xs text-white/60">
                                    ₹{product.discountedPrice}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="space-y-1 px-3 sm:px-6 pb-3 pt-2">
                        {navigation.map(
                          (item, index) =>
                            item?.role === userInfo?.role && (
                              <Link
                                key={index}
                                to={item.link}
                                className="block rounded-full px-4 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-base font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
                              >
                                {item.name}
                              </Link>
                            )
                        )}
                      </div>
                      <div className="border-t border-white/10 pb-3 pt-4">
                        <div className="flex items-center px-3 sm:px-6">
                          <img
                            className="h-10 w-10 sm:h-11 sm:w-11 rounded-full ring-2 ring-white/30"
                            src={userInfo.imageUrl || "../../../user.png"}
                            alt="Profile"
                          />
                          <div className="ml-3 flex-1 min-w-0">
                            <div className="text-sm sm:text-base font-bold text-white truncate">
                              {userInfo?.addresses?.[0]?.name || "User"}
                            </div>
                            <div className="text-xs text-white/60 truncate">
                              {userInfo.email}
                            </div>
                          </div>
                          <Link to="/cart" className="relative flex-shrink-0">
                            <button
                              type="button"
                              className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-all border border-white/20"
                            >
                              <ShoppingCart
                                className="h-5 w-5 sm:h-6 sm:w-6"
                                aria-hidden="true"
                              />
                            </button>
                            {items.length > 0 && (
                              <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 flex items-center justify-center h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-white text-black text-[9px] sm:text-[10px] font-bold ring-2 ring-black animate-pulse">
                                {items.length}
                              </span>
                            )}
                          </Link>
                        </div>
                        <div className="mt-3 space-y-1 px-3 sm:px-6">
                          {userNavigation.map((item) => (
                            <Link
                              key={item.name}
                              to={item.link}
                              className="block rounded-full px-4 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-base font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </Disclosure.Panel>
                  </div>
                </>
              )}
            </Disclosure>
          </div>

          {/* Header */}
          <header className="bg-gradient-to-r from-pink-50 via-purple-50 to-pink-50 shadow-lg border-b-2 border-purple-200">
            <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-purple-500" />
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                  AmiFairy
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-purple-600 mt-1">
                Your magical shopping experience ✨
              </p>
            </div>
          </header>

          {/* Main Content */}
          <main className="bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 min-h-screen">
            <div className="mx-auto max-w-7xl py-4 sm:py-6 px-3 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </>
      )}
    </>
  );
}

export default NavBar;
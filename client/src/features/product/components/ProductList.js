//components/productList.js

import React, { useState, Fragment, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RotatingLines } from "react-loader-spinner";
import {
  fetchProductsByFiltersAsync,
  selectAllProducts,
  selectStatus,
  selectTotalItems,
  resetProductError,
} from "../productSlice";
import { fetchBrandsAsync, selectBrands } from "../../brands/brandSlice";
import {
  fetchCategoriesAsync,
  selectCategories,
} from "../../category/categorySlice";
import { Dialog, Disclosure, Menu, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/20/solid";
import { Link } from "react-router-dom";
import {
  ChevronDownIcon,
  FunnelIcon,
  MinusIcon,
  PlusIcon,
  SparklesIcon,
} from "@heroicons/react/20/solid";
import { ITEMS_PER_PAGE } from "../../../app/constants";
import Pagination from "../../common/components/Pagination";
const sortOptions = [
  { name: "Best Rating", sort: "rating", order: "desc", current: false },
  { name: "Price: Low to High", sort: "price", order: "asc", current: false },
  { name: "Price: High to Low", sort: "price", order: "desc", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ProductList() {
  const dispatch = useDispatch();
  const products = useSelector(selectAllProducts);
  const brands = useSelector(selectBrands);
  const categories = useSelector(selectCategories);
  const totalItems = useSelector(selectTotalItems);
  const filters = [
    {
      id: "category",
      name: "Category",
      options: categories,
    },
    {
      id: "brand",
      name: "Brands",
      options: brands,
    },
  ];
  const [filter, setFilter] = useState({});
  const [sort, setSort] = useState({});
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);
  const status = useSelector(selectStatus);

  useEffect(() => {
    dispatch(resetProductError());
  }, [dispatch]);

  const handleFilter = (e, section, option) => {
    const newFilter = { ...filter };
    if (e.target.checked) {
      if (newFilter[section.id]) {
        newFilter[section.id].push(option.value);
      } else {
        newFilter[section.id] = [option.value];
      }
    } else {
      let index = newFilter[section.id].findIndex((el) => el === option.value);
      newFilter[section.id].splice(index, 1);
    }

    setFilter(newFilter);
  };

  const handleSort = (option) => {
    const sort = { _sort: option.sort, _order: option.order };
    setSort(sort);
  };

  const handlePage = (page) => {
    setPage(page);
  };

  useEffect(() => {
    const pagination = { _page: page, _per_page: ITEMS_PER_PAGE };
    dispatch(
      fetchProductsByFiltersAsync({ filter, sort, pagination, role: "user" })
    );
  }, [dispatch, filter, sort, page]);

  useEffect(() => {
    setPage(1);
  }, [totalItems, sort]);

  useEffect(() => {
    dispatch(fetchBrandsAsync());
    dispatch(fetchCategoriesAsync());
  }, [dispatch]);

  return (
    <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 min-h-screen ">

      <div>
        <MobileFilter
          handleFilter={handleFilter}
          mobileFiltersOpen={mobileFiltersOpen}
          setMobileFiltersOpen={setMobileFiltersOpen}
          filters={filters}
        ></MobileFilter>

        <main className="mx-auto max-w-full px-3 sm:px-4 md:px-6 lg:px-8">
          {/* Header Section - Fully Responsive */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-2 border-purple-200 pb-4 sm:pb-6 pt-4 sm:pt-6 md:pt-8 gap-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <SparklesIcon className="h-6 w-6 sm:h-8 md:h-10 text-purple-500 flex-shrink-0 animate-pulse" />
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                  All Products
                </h1>
                <p className="text-xs sm:text-sm text-purple-600 mt-0.5 sm:mt-1">
                  Discover our amazing collection
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 w-full sm:w-auto">
              {/* Sort Menu */}
              <Menu as="div" className="relative inline-block text-left flex-1 sm:flex-initial">
                <div>
                  <Menu.Button className="group inline-flex items-center justify-center w-full sm:w-auto rounded-lg sm:rounded-xl bg-white px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm font-bold text-purple-700 shadow-md hover:shadow-xl border-2 border-purple-200 hover:border-purple-400 transition-all duration-300 hover:scale-105">
                    Sort
                    <ChevronDownIcon
                      className="-mr-1 ml-1 sm:ml-2 h-4 w-4 sm:h-5 sm:w-5 text-purple-500 group-hover:text-purple-700 transition-colors"
                      aria-hidden="true"
                    />
                  </Menu.Button>
                </div>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-48 sm:w-56 origin-top-right rounded-xl sm:rounded-2xl bg-white shadow-2xl ring-1 ring-purple-200 focus:outline-none overflow-hidden border-2 border-purple-100">
                    <div className="py-1 sm:py-2">
                      {sortOptions.map((option) => (
                        <Menu.Item key={option.name}>
                          {({ active }) => (
                            <p
                              onClick={() => handleSort(option)}
                              className={classNames(
                                active
                                  ? "bg-gradient-to-r from-purple-50 to-pink-50 text-purple-900"
                                  : "text-gray-700",
                                "block px-4 sm:px-5 py-2 sm:py-3 text-xs sm:text-sm font-semibold cursor-pointer transition-all duration-200 hover:pl-6"
                              )}
                            >
                              {option.name}
                            </p>
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>

              {/* Mobile Filter Button */}
              <button
                type="button"
                className=" lg:hidden rounded-lg sm:rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 p-2 sm:p-2.5 md:p-3 text-white shadow-md hover:shadow-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-110 flex-shrink-0"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <FunnelIcon className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pb-8 sm:pb-10 md:pb-12 pt-4 sm:pt-5 md:pt-6">
            <h2 id="products-heading" className="sr-only">
              Products
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:gap-5 md:gap-6 lg:grid-cols-5">
              {/* Desktop Filter */}
              <div className="lg:col-span-1">
                <DesktopFilter
                  handleFilter={handleFilter}
                  filters={filters}
                ></DesktopFilter>
              </div>

              {/* Product grid */}
              <div className="lg:col-span-4">
                <ProductGrid products={products} status={status}></ProductGrid>
              </div>
            </div>
          </section>

          {/* Pagination */}
          <div className="pb-6 sm:pb-8">
            <Pagination
              page={page}
              setPage={setPage}
              handlePage={handlePage}
              totalItems={totalItems}
            ></Pagination>
          </div>
        </main>
      </div>
    </div>
  );
}

function MobileFilter({
  mobileFiltersOpen,
  setMobileFiltersOpen,
  handleFilter,
  filters,
}) {
  return (
    <Transition.Root show={mobileFiltersOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-40 lg:hidden"
        onClose={setMobileFiltersOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 z-40 flex">
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs sm:max-w-sm flex-col overflow-y-auto bg-gradient-to-br from-purple-50 to-pink-50 py-4 pb-12 shadow-2xl pt-[5rem] ">
              <div className="flex items-center justify-between px-4 sm:px-5 mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Filters
                </h2>
                <button
                  type="button"
                  className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-2 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-110 hover:rotate-90"
                  onClick={() => setMobileFiltersOpen(false)}
                >
                  <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              {/* Filters */}
              <form className="mt-2 sm:mt-4">
                {filters.map((section) => (
                  <Disclosure
                    as="div"
                    key={section.id}
                    className="border-t-2 border-purple-200 px-4 sm:px-5 py-4 sm:py-6"
                  >
                    {({ open }) => (
                      <>
                        <h3 className="-mx-2 -my-3 flow-root">
                          <Disclosure.Button className="flex w-full items-center justify-between bg-white/60 backdrop-blur-sm rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-white/80 transition-all duration-300 hover:shadow-md">
                            <span className="font-bold text-purple-900 text-sm sm:text-base">
                              {section.name}
                            </span>
                            <span className="ml-6 flex items-center">
                              {open ? (
                                <MinusIcon
                                  className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 transition-transform duration-200"
                                  aria-hidden="true"
                                />
                              ) : (
                                <PlusIcon
                                  className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 transition-transform duration-200"
                                  aria-hidden="true"
                                />
                              )}
                            </span>
                          </Disclosure.Button>
                        </h3>
                        <Disclosure.Panel className="pt-4 sm:pt-6">
                          <div className="space-y-3 sm:space-y-4">
                            {section.options.map((option, optionIdx) => (
                              <div
                                key={option.value}
                                className="flex items-center bg-white/40 backdrop-blur-sm rounded-lg p-2.5 sm:p-3 hover:bg-white/60 transition-all duration-200 hover:scale-102"
                              >
                                <input
                                  id={`filter-mobile-${section.id}-${optionIdx}`}
                                  name={`${section.id}[]`}
                                  defaultValue={option.value}
                                  type="checkbox"
                                  defaultChecked={option.checked}
                                  onChange={(e) =>
                                    handleFilter(e, section, option)
                                  }
                                  className="h-4 w-4 rounded border-purple-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                                />
                                <label
                                  htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                                  className="ml-3 text-xs sm:text-sm font-semibold text-purple-900 cursor-pointer"
                                >
                                  {option.label}
                                </label>
                              </div>
                            ))}
                          </div>
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                ))}
              </form>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

function DesktopFilter({ handleFilter, filters }) {
  return (
    <form className="hidden lg:block sticky top-24 h-fit">
      <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border-2 border-purple-200 p-5 xl:p-6 hover:shadow-2xl transition-shadow duration-300">
        <h3 className="text-base xl:text-lg font-bold text-purple-900 mb-4 xl:mb-5 flex items-center gap-2">
          <FunnelIcon className="h-5 w-5 text-purple-600 animate-pulse" />
          Filters
        </h3>
        {filters.map((section) => (
          <Disclosure
            as="div"
            key={section.id}
            className="border-b-2 border-purple-200 py-4 xl:py-6 last:border-b-0"
          >
            {({ open }) => (
              <>
                <h3 className="-my-3 flow-root">
                  <Disclosure.Button className="flex w-full items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl py-2.5 xl:py-3 px-3 xl:px-4 text-sm hover:from-purple-100 hover:to-pink-100 transition-all duration-300 hover:shadow-md">
                    <span className="font-bold text-purple-900 text-sm xl:text-base">
                      {section.name}
                    </span>
                    <span className="ml-6 flex items-center">
                      {open ? (
                        <MinusIcon
                          className="h-4 w-4 xl:h-5 xl:w-5 text-purple-600 transition-transform duration-200"
                          aria-hidden="true"
                        />
                      ) : (
                        <PlusIcon
                          className="h-4 w-4 xl:h-5 xl:w-5 text-purple-600 transition-transform duration-200"
                          aria-hidden="true"
                        />
                      )}
                    </span>
                  </Disclosure.Button>
                </h3>
                <Disclosure.Panel className="pt-4 xl:pt-6">
                  <div className="space-y-2.5 xl:space-y-3">
                    {section.options.map((option, optionIdx) => (
                      <div
                        key={option.value}
                        className="flex items-center bg-purple-50/50 rounded-lg p-2 xl:p-2.5 hover:bg-purple-100/70 transition-all duration-200 hover:scale-102 hover:shadow-sm"
                      >
                        <input
                          id={`filter-${section.id}-${optionIdx}`}
                          name={`${section.id}[]`}
                          defaultValue={option.value}
                          type="checkbox"
                          defaultChecked={option.checked}
                          onChange={(e) => handleFilter(e, section, option)}
                          className="h-4 w-4 rounded border-purple-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                        />
                        <label
                          htmlFor={`filter-${section.id}-${optionIdx}`}
                          className="ml-2.5 xl:ml-3 text-xs xl:text-sm font-semibold text-purple-900 cursor-pointer"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        ))}
      </div>
    </form>
  );
}

function ProductGrid({ products, status }) {
  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:gap-5 md:gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {status === "loading" ? (
          <div className="col-span-full flex justify-center items-center py-16 sm:py-20">
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
        ) : null}
        {products.data?.map((product) => (
          <Link to={`/product-detail/${product.id}`} key={product.id}>
            <div className="group relative bg-white/70 backdrop-blur-sm border-2 border-purple-200 rounded-xl sm:rounded-2xl overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 hover:border-purple-400 h-full flex flex-col hover:-translate-y-1">
              {/* Image Container - Responsive Height */}
              <div className="relative h-48 sm:h-56 md:h-64 w-full overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100 flex-shrink-0">
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="h-full w-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                />
                {product.discountPercentage > 0 && (
                  <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold shadow-lg animate-pulse">
                    {Math.round(product.discountPercentage)}% OFF
                  </div>
                )}
              </div>

              {/* Product Info - Responsive Spacing */}
              <div className="p-3 sm:p-4 flex flex-col flex-grow">
                {/* Title - Responsive Font */}
                <h3 className="text-xs sm:text-sm font-bold text-purple-900 mb-2 sm:mb-3 h-8 sm:h-10 overflow-hidden text-ellipsis line-clamp-2 leading-tight">
                  {product.title}
                </h3>

                {/* Rating - Responsive Size */}
                <div className="flex items-center gap-2 mb-2 sm:mb-3">
                  <div className="flex items-center bg-gradient-to-r from-yellow-400 to-orange-400 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg shadow-sm">
                    <StarIcon className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    <span className="text-[10px] sm:text-xs font-bold text-white ml-0.5 sm:ml-1">
                      {product.rating}
                    </span>
                  </div>
                </div>

                {/* Price - Responsive Font */}
                <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                  <p className="text-base sm:text-lg md:text-xl font-bold text-purple-900">
                    ₹{product.discountedPrice}
                  </p>
                  <p className="text-xs sm:text-sm line-through text-gray-400">
                    ₹{product.price}
                  </p>
                </div>

                {/* Status Messages - Responsive */}
                <div className="mt-auto min-h-[24px] sm:min-h-[28px]">
                  {product.deleted && (
                    <div className="bg-red-100 border border-red-300 rounded-lg px-2 sm:px-3 py-0.5 sm:py-1">
                      <p className="text-[10px] sm:text-xs font-bold text-red-600">
                        Product deleted
                      </p>
                    </div>
                  )}
                  {product.stock <= 0 && !product.deleted && (
                    <div className="bg-red-100 border border-red-300 rounded-lg px-2 sm:px-3 py-0.5 sm:py-1">
                      <p className="text-[10px] sm:text-xs font-bold text-red-600">
                        Out of stock
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

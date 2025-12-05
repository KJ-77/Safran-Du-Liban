import React, { useState, useEffect } from "react";
import useFetch from "../../Hooks/useFetch";
import Container from "../../Components/Container/Container";
import { IMAGE_URL } from "../../Utilities/BASE_URL";
import AddToCartButton from "../../Components/AddToCartButton/AddToCartButton";

const Products = () => {
  // States
  const [activeCategory, setActiveCategory] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // For pagination (client-side)
  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 10;

  // Use the hook correctly - it doesn't take URL as parameter
  const { fetchData } = useFetch();

  // State for promoted product
  const [promotedProduct, setPromotedProduct] = useState(null);

  // Fetch all products and categories once on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      // Fetch all products and categories in one call
      const result = await fetchData(`/products`);
      if (result && result.success) {
        const products = result.data.products || [];
        setAllProducts(products);
        setCategories(result.data.categories || []);

        // Find the promoted product if any
        const promoted = products.find((product) => product.promoted === true);
        setPromotedProduct(promoted || null);
      } else {
        setError("Failed to load products. Please try again later.");
      }
      setIsLoading(false);
    };
    loadData();
  }, []);

  // Filter products by active category
  const filteredProducts = activeCategory
    ? allProducts.filter(
        (product) =>
          product.category &&
          (product.category.slug === activeCategory ||
            product.category === activeCategory)
      )
    : allProducts;

  // Pagination logic (client-side)
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  // Handle category change
  const handleCategoryChange = (categorySlug) => {
    setActiveCategory(categorySlug);
    setCurrentPage(1); // Reset to first page when category changes
  };

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  return (
    <div className="py-6 md:py-8 lg:py-primary bg-background pb-24">
      <Container>
        {/* Promoted Product Banner */}
        {!isLoading && promotedProduct && (
          <div className="my-24 bg-[#faf7ef] p-10 rounded-[16px] overflow-hidden  text-white lg:w-[80%] lg:mx-auto">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2  italic text-black">
              Our Offers
            </h2>
            <div className="flex flex-col-reverse gap-10 lg:flex-row items-center ">
              <div className="lg:w-1/2 mb-4 md:mb-0 md:pr-8">
                <h2 className="text-3xl font-bold mb-3 md:mb-5 text-black">
                  {promotedProduct.name}
                </h2>
                <p className="text-base md:text-lg mb-6 text-black">
                  {promotedProduct.description}
                </p>
                <div className="flex items-center gap-20">
                  <p className="text-primary font-bold text-4xl mt-8">
                    {promotedProduct.price}$
                  </p>
                  <div className="flex w-max">
                    <AddToCartButton
                      color="primary"
                      product={promotedProduct}
                      className="bg-black hover:bg-[#c9984a] text-white px-8 py-3 rounded-full"
                    />
                  </div>
                </div>
              </div>
              <div className="lg:w-1/2 flex justify-center">
                <div className="w-64 md:w-96">
                  <img
                    src={`${IMAGE_URL}/${promotedProduct.image}`}
                    alt={promotedProduct.name}
                    className="w-full object-contain rounded-[16px]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Page Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-8 text-center text-black italic">
          Our Products
        </h1>

        {/* Categories Tabs */}
        <div className="mb-6 md:mb-20 overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex space-x-8 md:space-x-16 min-w-max px-1 justify-center">
            <button
              onClick={() => handleCategoryChange(null)}
              className={`transition-colors text-lg md:text-xl capitalize whitespace-nowrap ${
                activeCategory === null
                  ? "text-primary font-medium"
                  : "text-secondary"
              }`}
            >
              All
            </button>

            {categories.map((category) => (
              <button
                key={category.slug}
                onClick={() => handleCategoryChange(category.slug)}
                className={`transition-colors text-lg md:text-xl capitalize whitespace-nowrap ${
                  activeCategory === category.slug
                    ? "text-primary font-medium"
                    : "text-secondary"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-8 md:py-12">
            <div className="inline-block animate-spin w-6 h-6 md:w-8 md:h-8 border-4 border-primary border-t-transparent rounded-full"></div>
            <p className="mt-2">Loading products...</p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="text-center py-8 md:py-12">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && paginatedProducts.length === 0 && (
          <div className="text-center py-8 md:py-12">
            <p className="text-gray-500">No products found in this category.</p>
            <button
              onClick={() => handleCategoryChange(null)}
              className="mt-4 px-5 py-2 bg-primary text-white rounded-full hover:bg-primary/80 transition-colors"
            >
              View All Products
            </button>
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && !error && paginatedProducts.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xxl:grid-cols-4 2xl:grid-cols-4 gap-x-2 sm:gap-x-4 md:gap-x-8 gap-y-8 md:gap-y-16">
            {paginatedProducts.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <div className="flex flex-wrap justify-center gap-2">
              {/* Previous Page */}
              <button
                onClick={() =>
                  currentPage > 1 && handlePageChange(currentPage - 1)
                }
                disabled={currentPage === 1}
                className={`w-9 h-9 flex items-center justify-center rounded ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
                aria-label="Previous page"
              >
                &lt;
              </button>

              {/* Page Numbers */}
              {[...Array(totalPages)].map((_, i) => {
                // Show limited page numbers on mobile
                if (
                  totalPages > 5 &&
                  (i < currentPage - 2 || i > currentPage + 0) &&
                  i !== 0 &&
                  i !== totalPages - 1 &&
                  Math.abs(i + 1 - currentPage) > 1
                ) {
                  // Show dots only once
                  if (i === currentPage - 3 || i === currentPage + 1) {
                    return (
                      <span
                        key={i}
                        className="w-9 h-9 flex items-center justify-center"
                      >
                        ...
                      </span>
                    );
                  }
                  return null;
                }

                return (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`w-9 h-9 flex items-center justify-center rounded ${
                      currentPage === i + 1
                        ? "bg-primary text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    {i + 1}
                  </button>
                );
              })}

              {/* Next Page */}
              <button
                onClick={() =>
                  currentPage < totalPages && handlePageChange(currentPage + 1)
                }
                disabled={currentPage === totalPages}
                className={`w-9 h-9 flex items-center justify-center rounded ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
                aria-label="Next page"
              >
                &gt;
              </button>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};

// Product Card Component
const ProductCard = ({ product }) => {
  return (
    <div className="flex flex-col h-full">
      {/* Product Image */}
      <div className="rounded-[20px] md:rounded-[32px]">
        <img
          src={`${IMAGE_URL}/${product.image}`}
          alt={product.name}
          className="w-full object-cover aspect-square rounded-[16px]"
          loading="lazy"
        />
      </div>

      {/* Product Details */}
      <div className="mt-4 md:mt-6 flex flex-col flex-grow">
        <h3 className="font-semibold text-xl md:text-2xl text-black italic text-center truncate">
          {product.name}
        </h3>
        <p className="font-semibold text-xl md:text-2xl text-primary italic text-center mb-1 md:mb-4 truncate">
          {product.price}$
        </p>
        <p className="text-gray-600 text-xs md:text-sm text-center mb-3 md:mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Add to Cart Button */}
        <div className="flex justify-center mt-auto">
          <AddToCartButton product={product} className="w-full max-w-xs" />
        </div>
      </div>
    </div>
  );
};

export default Products;

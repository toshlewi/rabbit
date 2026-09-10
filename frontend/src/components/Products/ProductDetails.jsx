import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";

import ProductGrid from "./ProductGrid";

import {
    fetchProductDetails,
    fetchSimilarProducts,
} from "../../redux/slices/productsSlice";

import { addToCart } from "../../redux/slices/cartSlice";

const ProductDetails = ({ productId }) => {
    const { id } = useParams();
    const dispatch = useDispatch();

    // Redux state
    const {
        selectedProduct,
        detailsLoading,
        error,
        similarProducts,
    } = useSelector((state) => state.products);

    const { userId, guestId } = useSelector(
        (state) => state.auth
    );

    // Local state
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    // Determine product ID
    const productFetchId = productId || id;

    // Fetch product
    useEffect(() => {
        if (!productFetchId) return;

        setSelectedImage(null);
        setSelectedSize("");
        setSelectedColor("");
        setQuantity(1);

        dispatch(fetchProductDetails(productFetchId));

        dispatch(
            fetchSimilarProducts({
                id: productFetchId,
            })
        );
    }, [dispatch, productFetchId]);

    // Safely get images
    const productImages = Array.isArray(selectedProduct?.images)
        ? selectedProduct.images
        : [];

    const productColors = Array.isArray(selectedProduct?.colors)
        ? selectedProduct.colors
        : [];

    const productSizes = Array.isArray(selectedProduct?.sizes)
        ? selectedProduct.sizes
        : [];

    // Get the image URL from either an object or string
    const getImageUrl = (image) => {
        if (typeof image === "string") {
            return image;
        }

        return image?.url || "";
    };

    // Main image:
    // If user selected an image, use it.
    // Otherwise use the first product image.
    const mainImage =
        selectedImage ||
        getImageUrl(productImages[0]);

    // Change quantity
    const handleQuantityChange = (action) => {
        if (action === "plus") {
            setQuantity((prev) => prev + 1);
        }

        if (action === "minus" && quantity > 1) {
            setQuantity((prev) => prev - 1);
        }
    };

    // Add to cart
    const handleAddToCart = async () => {
        if (!selectedSize) {
            toast.error("Please select a size", {
                duration: 1500,
            });
            return;
        }

        if (!selectedColor) {
            toast.error("Please select a color", {
                duration: 1500,
            });
            return;
        }

        if (!productFetchId) {
            toast.error("Product ID is missing", {
                duration: 1500,
            });
            return;
        }

        setIsButtonDisabled(true);

        try {
            await dispatch(
                addToCart({
                    productId: productFetchId,
                    quantity,
                    size: selectedSize,
                    color: selectedColor,
                    userId,
                    guestId,
                })
            ).unwrap();

            toast.success("Product added to cart!", {
                duration: 1500,
            });
        } catch (error) {
            console.error(
                "Error adding product to cart:",
                error
            );

            toast.error(
                error?.message ||
                    "Failed to add product to cart",
                {
                    duration: 1500,
                }
            );
        } finally {
            setIsButtonDisabled(false);
        }
    };

    // Loading
    if (detailsLoading && !selectedProduct) {
        return (
            <div className="flex justify-center items-center py-20">
                <p className="text-lg text-gray-600">
                    Loading product...
                </p>
            </div>
        );
    }

    // Error
    if (error && !selectedProduct) {
        return (
            <div className="flex justify-center items-center py-20">
                <p className="text-red-500">
                    Error: {error}
                </p>
            </div>
        );
    }

    // Product not found
    if (!selectedProduct) {
        return (
            <div className="flex justify-center items-center py-20">
                <p className="text-gray-500">
                    Product not found.
                </p>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg">

                {/* PRODUCT SECTION */}
                <div className="flex flex-col md:flex-row">

                    {/* DESKTOP THUMBNAILS */}
                    <div className="hidden md:flex flex-col space-y-4 mr-6">

                        {productImages.map((image, index) => {
                            const imageUrl = getImageUrl(image);

                            if (!imageUrl) return null;

                            return (
                                <img
                                    key={index}
                                    src={imageUrl}
                                    alt={
                                        typeof image === "object"
                                            ? image?.altText ||
                                              `Thumbnail ${index + 1}`
                                            : `Thumbnail ${index + 1}`
                                    }
                                    className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${
                                        mainImage === imageUrl
                                            ? "border-black"
                                            : "border-gray-300"
                                    }`}
                                    onClick={() =>
                                        setSelectedImage(imageUrl)
                                    }
                                />
                            );
                        })}

                    </div>

                    {/* MAIN IMAGE */}
                    <div className="md:w-1/2">

                        <div className="mb-4">

                            {mainImage ? (
                                <img
                                    src={mainImage}
                                    alt={selectedProduct.name}
                                    className="w-full h-auto max-h-[600px] object-cover rounded-lg"
                                />
                            ) : (
                                <div className="w-full h-[500px] bg-gray-100 rounded-lg flex items-center justify-center">
                                    <p className="text-gray-500">
                                        No image available
                                    </p>
                                </div>
                            )}

                        </div>

                        {/* MOBILE THUMBNAILS */}
                        <div className="md:hidden flex overflow-x-auto space-x-4 mb-4 pb-2">

                            {productImages.map((image, index) => {
                                const imageUrl =
                                    getImageUrl(image);

                                if (!imageUrl) return null;

                                return (
                                    <img
                                        key={index}
                                        src={imageUrl}
                                        alt={
                                            typeof image === "object"
                                                ? image?.altText ||
                                                  `Thumbnail ${index + 1}`
                                                : `Thumbnail ${index + 1}`
                                        }
                                        className={`w-20 h-20 flex-shrink-0 object-cover rounded-lg cursor-pointer border ${
                                            mainImage === imageUrl
                                                ? "border-black"
                                                : "border-gray-300"
                                        }`}
                                        onClick={() =>
                                            setSelectedImage(imageUrl)
                                        }
                                    />
                                );
                            })}

                        </div>

                    </div>

                    {/* PRODUCT INFORMATION */}
                    <div className="md:w-1/2 md:ml-10">

                        {/* PRODUCT NAME */}
                        <h1 className="text-2xl font-semibold mb-2">
                            {selectedProduct.name}
                        </h1>

                        {/* PRICE */}
                        {selectedProduct.discountPrice ? (
                            <div className="mb-4">

                                <p className="text-gray-500 text-lg line-through">
                                    Ksh {selectedProduct.price}
                                </p>

                                <p className="text-xl font-semibold text-black">
                                    Ksh{" "}
                                    {selectedProduct.discountPrice}
                                </p>

                            </div>
                        ) : (
                            <p className="text-xl text-gray-700 mb-4">
                                Ksh {selectedProduct.price}
                            </p>
                        )}

                        {/* DESCRIPTION */}
                        <p className="text-gray-600 mb-6">
                            {selectedProduct.description}
                        </p>

                        {/* COLOR */}
                        <div className="mb-6">

                            <p className="text-gray-700 font-medium">
                                Color
                            </p>

                            <div className="flex gap-2 mt-2 flex-wrap">

                                {productColors.map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        aria-label={`Select ${color}`}
                                        title={color}
                                        className={`w-8 h-8 rounded-full border ${
                                            selectedColor === color
                                                ? "border-4 border-black"
                                                : "border-gray-300"
                                        }`}
                                        style={{
                                            backgroundColor:
                                                color.toLowerCase(),
                                        }}
                                        onClick={() =>
                                            setSelectedColor(color)
                                        }
                                        disabled={
                                            isButtonDisabled
                                        }
                                    />
                                ))}

                            </div>

                        </div>

                        {/* SIZE */}
                        <div className="mb-6">

                            <p className="text-gray-700 font-medium">
                                Size
                            </p>

                            <div className="flex gap-2 mt-2 flex-wrap">

                                {productSizes.map((size) => (
                                    <button
                                        key={size}
                                        type="button"
                                        className={`px-4 py-2 rounded border ${
                                            selectedSize === size
                                                ? "bg-black text-white border-black"
                                                : "border-gray-300"
                                        }`}
                                        onClick={() =>
                                            setSelectedSize(size)
                                        }
                                        disabled={
                                            isButtonDisabled
                                        }
                                    >
                                        {size}
                                    </button>
                                ))}

                            </div>

                        </div>

                        {/* QUANTITY */}
                        <div className="mb-6">

                            <p className="text-gray-700 font-medium">
                                Quantity:
                            </p>

                            <div className="flex items-center space-x-4 mt-2">

                                <button
                                    type="button"
                                    className="px-3 py-1 bg-gray-200 text-lg rounded hover:bg-gray-300"
                                    onClick={() =>
                                        handleQuantityChange(
                                            "minus"
                                        )
                                    }
                                    disabled={
                                        isButtonDisabled ||
                                        quantity === 1
                                    }
                                >
                                    -
                                </button>

                                <span className="text-lg">
                                    {quantity}
                                </span>

                                <button
                                    type="button"
                                    className="px-3 py-1 bg-gray-200 text-lg rounded hover:bg-gray-300"
                                    onClick={() =>
                                        handleQuantityChange(
                                            "plus"
                                        )
                                    }
                                    disabled={
                                        isButtonDisabled
                                    }
                                >
                                    +
                                </button>

                            </div>

                        </div>

                        {/* ADD TO CART */}
                        <button
                            type="button"
                            onClick={handleAddToCart}
                            disabled={isButtonDisabled}
                            className={`bg-black text-white py-3 px-6 w-full mb-4 rounded ${
                                isButtonDisabled
                                    ? "opacity-50 cursor-not-allowed"
                                    : "hover:bg-gray-900"
                            }`}
                        >
                            {isButtonDisabled
                                ? "Adding..."
                                : "ADD TO CART"}
                        </button>

                        {/* CHARACTERISTICS */}
                        <div className="mt-10 text-gray-700">

                            <h3 className="text-xl font-bold mb-4">
                                Characteristics
                            </h3>

                            <table className="w-full text-left text-sm text-gray-600">

                                <tbody>

                                    <tr>
                                        <td className="py-2 font-medium">
                                            Brand
                                        </td>
                                        <td className="py-2">
                                            {selectedProduct.brand ||
                                                "N/A"}
                                        </td>
                                    </tr>

                                    <tr>
                                        <td className="py-2 font-medium">
                                            Material
                                        </td>
                                        <td className="py-2">
                                            {selectedProduct.material ||
                                                "N/A"}
                                        </td>
                                    </tr>

                                    <tr>
                                        <td className="py-2 font-medium">
                                            Category
                                        </td>
                                        <td className="py-2">
                                            {selectedProduct.category ||
                                                "N/A"}
                                        </td>
                                    </tr>

                                    <tr>
                                        <td className="py-2 font-medium">
                                            Gender
                                        </td>
                                        <td className="py-2">
                                            {selectedProduct.gender ||
                                                "N/A"}
                                        </td>
                                    </tr>

                                </tbody>

                            </table>

                        </div>

                    </div>
                </div>

                {/* SIMILAR PRODUCTS */}
                <div className="mt-20">

                    <h2 className="text-2xl text-center font-medium mb-4">
                        You May Also Like
                    </h2>

                    <ProductGrid
                        products={similarProducts || []}
                    />

                </div>

            </div>
        </div>
    );
};

export default ProductDetails;
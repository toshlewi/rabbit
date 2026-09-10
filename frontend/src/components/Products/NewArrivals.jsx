import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import axios from "axios";

const NewArrivals = () => {
    const scrollRef = useRef(null);

    // Dragging states
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    // Scroll button states
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    // Products
    const [newArrivals, setNewArrivals] = useState([]);

    // Fetch new arrivals
    useEffect(() => {
        const fetchNewArrivals = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals`
                );

                setNewArrivals(response.data);
            } catch (error) {
                console.error("Error fetching new arrivals:", error);
            }
        };

        fetchNewArrivals();
    }, []);

    // Mouse down - start dragging
    const handleMouseDown = (e) => {
        if (!scrollRef.current) return;

        setIsDragging(true);

        setStartX(
            e.pageX - scrollRef.current.offsetLeft
        );

        setScrollLeft(
            scrollRef.current.scrollLeft
        );
    };

    // Mouse move - drag products
    const handleMouseMove = (e) => {
        if (!isDragging || !scrollRef.current) return;

        const x =
            e.pageX - scrollRef.current.offsetLeft;

        const walk = x - startX;

        scrollRef.current.scrollLeft =
            scrollLeft - walk;
    };

    // Mouse up / leave - stop dragging
    const handleMouseUpOrLeave = () => {
        setIsDragging(false);
    };

    // Scroll using buttons
    const scroll = (direction) => {
        if (!scrollRef.current) return;

        const scrollAmount =
            direction === "left" ? -300 : 300;

        scrollRef.current.scrollBy({
            left: scrollAmount,
            behavior: "smooth",
        });
    };

    // Update scroll buttons
    const updateScrollButtons = () => {
        const container = scrollRef.current;

        if (!container) return;

        const leftScroll = container.scrollLeft;

        const rightScroll =
            container.scrollWidth -
            container.clientWidth -
            leftScroll;

        setCanScrollLeft(leftScroll > 0);

        setCanScrollRight(rightScroll > 1);
    };

    // Listen for scrolling
    useEffect(() => {
        const container = scrollRef.current;

        if (!container) return;

        container.addEventListener(
            "scroll",
            updateScrollButtons
        );

        updateScrollButtons();

        return () => {
            container.removeEventListener(
                "scroll",
                updateScrollButtons
            );
        };
    }, [newArrivals]);

    return (
        <section className="py-16 px-4 lg:px-0">

            {/* Section Header */}
            <div className="container mx-auto text-center mb-10 relative">

                <h2 className="text-3xl font-bold mb-4">
                    Explore New Arrivals
                </h2>

                <p className="text-lg text-gray-600 mb-8">
                    Discover the latest styles straight off
                    the runway, freshly added to keep your
                    wardrobe on the cutting edge of fashion.
                </p>

                {/* Scroll Buttons */}
                <div className="absolute right-0 bottom-[-38px] flex space-x-2">

                    <button
                        onClick={() => scroll("left")}
                        disabled={!canScrollLeft}
                        className={`p-2 rounded border ${
                            canScrollLeft
                                ? "bg-white text-black hover:bg-gray-100"
                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                    >
                        <FiChevronLeft className="text-2xl" />
                    </button>

                    <button
                        onClick={() => scroll("right")}
                        disabled={!canScrollRight}
                        className={`p-2 rounded border ${
                            canScrollRight
                                ? "bg-white text-black hover:bg-gray-100"
                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                    >
                        <FiChevronRight className="text-2xl" />
                    </button>

                </div>
            </div>

            {/* Scrollable Products */}
            <div
                ref={scrollRef}
                className={`${
                    isDragging
                        ? "cursor-grabbing"
                        : "cursor-grab"
                } container mx-auto overflow-x-scroll flex space-x-6 relative`}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUpOrLeave}
                onMouseLeave={handleMouseUpOrLeave}
            >

                {/* Products */}
                {newArrivals.map((product) => (
                    <div
                        key={product._id}
                        className="min-w-[100%] sm:min-w-[50%] lg:min-w-[30%] relative"
                    >

                        {/* Product Image */}
                        <img
                            src={product.images?.[0]?.url}
                            alt={
                                product.images?.[0]?.altText ||
                                product.name
                            }
                            className="w-full h-[500px] object-cover rounded-lg"
                            draggable="false"
                        />

                        {/* Product Information */}
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-md text-white p-4 rounded-b-lg">

                            <Link
                                to={`/product/${product._id}`}
                                className="block"
                            >
                                <h4 className="font-medium">
                                    {product.name}
                                </h4>

                                <p className="mt-1">
                                    Ksh {product.price}
                                </p>
                            </Link>

                        </div>
                    </div>
                ))}

            </div>
        </section>
    );
};

export default NewArrivals;
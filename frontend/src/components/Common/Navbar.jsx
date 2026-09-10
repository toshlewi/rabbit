import { Link, useNavigate } from "react-router-dom";
import {
    HiOutlineUser,
    HiOutlineShoppingBag,
} from "react-icons/hi";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoMdClose } from "react-icons/io";
import { useState } from "react";
import { useSelector } from "react-redux";

import SearchBar from "./SearchBar";
import CartDrawer from "../Layout/CartDrawer";

const Navbar = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [navDrawerOpen, setNavDrawerOpen] = useState(false);

    const navigate = useNavigate();

    // Get cart from Redux
    const { cart } = useSelector((state) => state.cart);

    // Get logged-in user from Redux
    const { user } = useSelector((state) => state.auth);

    // Calculate total number of items in cart
    const cartItemCount =
        cart?.products?.reduce(
            (total, product) => total + product.quantity,
            0
        ) || 0;

    const toggleNavDrawer = () => {
        setNavDrawerOpen(!navDrawerOpen);
    };

    const toggleCartDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    const handleProfileClick = () => {
        if (user) {
            navigate("/profile");
        } else {
            navigate("/login");
        }
    };

    return (
        <>
            {/* ========================= NAVBAR ========================= */}
            <nav className="container mx-auto flex items-center justify-between py-3 px-6">

                {/* LEFT - LOGO */}
                <div>
                    <Link
                        to="/"
                        className="text-2xl font-medium text-black"
                    >
                        T Hub
                    </Link>
                </div>

                {/* DESKTOP NAVIGATION */}
                <div className="hidden md:flex">

                    <Link
                        to="/collections/all?gender=Men"
                        style={{
                            color: "#374151",
                            textDecoration: "none",
                            fontSize: "14px",
                            fontWeight: "500",
                            textTransform: "uppercase",
                            marginRight: "24px",
                        }}
                    >
                        Men
                    </Link>

                    <Link
                        to="/collections/all?gender=Women"
                        style={{
                            color: "#374151",
                            textDecoration: "none",
                            fontSize: "14px",
                            fontWeight: "500",
                            textTransform: "uppercase",
                            marginRight: "24px",
                        }}
                    >
                        Women
                    </Link>

                    <Link
                        to="/collections/all?category=Top%20Wear"
                        style={{
                            color: "#374151",
                            textDecoration: "none",
                            fontSize: "14px",
                            fontWeight: "500",
                            textTransform: "uppercase",
                            marginRight: "24px",
                        }}
                    >
                        Top Wear
                    </Link>

                    <Link
                        to="/collections/all?category=Bottom%20Wear"
                        style={{
                            color: "#374151",
                            textDecoration: "none",
                            fontSize: "14px",
                            fontWeight: "500",
                            textTransform: "uppercase",
                        }}
                    >
                        Bottom Wear
                    </Link>
                </div>

                {/* RIGHT - ICONS / SEARCH / HAMBURGER */}
                <div className="flex items-center space-x-4">

                    {user?.role === "admin" && (
                        <Link
                            to="/admin"
                            className="block bg-black px-2 rounded text-sm text-white"
                        >
                            Admin
                        </Link>
                    )}

                    {/* PROFILE ICON */}
                    <button
                        type="button"
                        onClick={handleProfileClick}
                        aria-label={
                            user
                                ? "View profile"
                                : "Login"
                        }
                        className="text-gray-700 hover:text-black transition"
                    >
                        <HiOutlineUser className="h-6 w-6" />
                    </button>

                    {/* CART */}
                    <button
                        type="button"
                        onClick={toggleCartDrawer}
                        className="relative hover:text-black"
                        aria-label="Open shopping cart"
                    >
                        <HiOutlineShoppingBag className="h-6 w-6 text-gray-700" />

                        {cartItemCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
                                {cartItemCount}
                            </span>
                        )}
                    </button>

                    {/* SEARCH BAR */}
                    <div className="overflow-hidden">
                        <SearchBar />
                    </div>

                    {/* MOBILE MENU BUTTON */}
                    <button
                        type="button"
                        onClick={toggleNavDrawer}
                        className="md:hidden"
                        aria-label="Open navigation menu"
                    >
                        <RxHamburgerMenu className="h-6 w-6 text-gray-700" />
                    </button>
                </div>
            </nav>

            {/* ========================= CART DRAWER ========================= */}
            <CartDrawer
                drawerOpen={drawerOpen}
                toggleCartDrawer={toggleCartDrawer}
            />

            {/* ========================= MOBILE NAVIGATION ========================= */}
            <div
                className={`fixed top-0 left-0 w-3/4 sm:w-1/3 h-full bg-white shadow-lg transform transition-transform duration-300 z-50 ${
                    navDrawerOpen
                        ? "translate-x-0"
                        : "-translate-x-full"
                }`}
            >
                {/* CLOSE BUTTON */}
                <div className="flex justify-end p-4">
                    <button
                        type="button"
                        onClick={toggleNavDrawer}
                        aria-label="Close navigation menu"
                    >
                        <IoMdClose className="h-6 w-6 text-gray-600" />
                    </button>
                </div>

                {/* MOBILE MENU */}
                <div className="p-4">
                    <h2 className="text-xl font-semibold mb-4">
                        Menu
                    </h2>

                    <nav className="space-y-4">

                        <Link
                            to="/collections/all?gender=Men"
                            onClick={toggleNavDrawer}
                            className="block text-gray-600 hover:text-black"
                        >
                            Men
                        </Link>

                        <Link
                            to="/collections/all?gender=Women"
                            onClick={toggleNavDrawer}
                            className="block text-gray-600 hover:text-black"
                        >
                            Women
                        </Link>

                        <Link
                            to="/collections/all?category=Top%20Wear"
                            onClick={toggleNavDrawer}
                            className="block text-gray-600 hover:text-black"
                        >
                            Top Wear
                        </Link>

                        <Link
                            to="/collections/all?category=Bottom%20Wear"
                            onClick={toggleNavDrawer}
                            className="block text-gray-600 hover:text-black"
                        >
                            Bottom Wear
                        </Link>

                        {/* MOBILE PROFILE */}
                        <button
                            type="button"
                            onClick={() => {
                                toggleNavDrawer();

                                if (user) {
                                    navigate("/profile");
                                } else {
                                    navigate("/login");
                                }
                            }}
                            className="block text-gray-600 hover:text-black"
                        >
                            {user ? "Profile" : "Login"}
                        </button>

                    </nav>
                </div>
            </div>
        </>
    );
};

export default Navbar;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import PayPalButton from "./PayPalButton";
import { createCheckout } from "../../redux/slices/checkoutSlice";
import { toast } from "sonner";

const Checkout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // ==============================
    // REDUX STATE
    // ==============================

    const { cart, loading, error } = useSelector(
        (state) => state.cart
    );

    const { user } = useSelector(
        (state) => state.auth
    );

    // ==============================
    // LOCAL STATE
    // ==============================

    const [checkoutId, setCheckoutId] = useState(null);

    const [shippingAddress, setShippingAddress] = useState({
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        postalCode: "",
        country: "",
        phone: "",
    });

    // ==============================
    // CHECK CART
    // ==============================

    useEffect(() => {
        if (!user) {
            navigate("/login?redirect=checkout");
            return;
        }

        if (
            !loading &&
            (
                !cart ||
                !cart.products ||
                cart.products.length === 0
            )
        ) {
            navigate("/");
        }
    }, [cart, navigate, user, loading]);

    // ==============================
    // SHIPPING INPUT HANDLER
    // ==============================

    const handleShippingChange = (e) => {
        const { name, value } = e.target;

        setShippingAddress((previousAddress) => ({
            ...previousAddress,
            [name]: value,
        }));
    };

    // ==============================
    // CREATE CHECKOUT
    // ==============================

    const handleCreateCheckout = async (e) => {
        e.preventDefault();

        if (
            !cart ||
            !cart.products ||
            cart.products.length === 0
        ) {
            return;
        }

        try {
            const result = await dispatch(
                createCheckout({
                    checkoutItems: cart.products,
                    shippingAddress,
                    paymentMethod: "Paypal",
                    totalPrice: cart.totalPrice,
                })
            );

            if (createCheckout.fulfilled.match(result)) {
                if (result.payload?._id) {
                    setCheckoutId(result.payload._id);
                } else {
                    toast.error("Checkout created but no checkout ID was returned");
                }
            } else {
                toast.error(
                    result.payload?.message ||
                    "Checkout creation failed"
                );
            }
        } catch (error) {
            toast.error(
                error.message || "Create checkout error"
            );
        }
    };

    // ==============================
    // PAYPAL PAYMENT SUCCESS
    // ==============================

    const handlePaymentSuccess = async (details) => {
        if (!checkoutId) {
            console.error(
                "No checkout ID available."
            );
            return;
        }

        try {
            const token =
                localStorage.getItem("userToken");

            if (!token) {
                console.error(
                    "No user token found."
                );

                navigate("/login");
                return;
            }

            await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`,
                {
                    paymentStatus: "paid",
                    paymentDetails: details,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            
                await handleFinalizedCheckout(
                    checkoutId
                );
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    error.message ||
                    "Payment failed"
            );
        }
    };

    // ==============================
    // FINALIZE CHECKOUT
    // ==============================

    const handleFinalizedCheckout = async (
        checkoutId
    ) => {
        try {
            const token =
                localStorage.getItem("userToken");

            if (!token) {
                console.error(
                    "No user token found."
                );

                navigate("/login");
                return;
            }

            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/finalize`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

           
                navigate("/order-confirmation");
        } catch (error) {
            console.error(
                "Finalize checkout error:",
                error.response?.data ||
                    error.message
            );
        }
    };

    // ==============================
    // LOADING
    // ==============================

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-lg">
                    Loading cart...
                </p>
            </div>
        );
    }

    // ==============================
    // ERROR
    // ==============================

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-red-500">
                    Error: {error}
                </p>
            </div>
        );
    }

    // ==============================
    // EMPTY CART
    // ==============================

    if (
        !cart ||
        !cart.products ||
        cart.products.length === 0
    ) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen">
                <p className="text-lg mb-4">
                    Your Cart is Empty
                </p>

                <button
                    onClick={() => navigate("/")}
                    className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
                >
                    Continue Shopping
                </button>
            </div>
        );
    }

    // ==============================
    // CHECKOUT PAGE
    // ==============================

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter">

            {/* ==============================
                CHECKOUT FORM
            ============================== */}

            <div className="bg-white rounded-lg p-6">

                <h2 className="text-2xl uppercase mb-6">
                    Checkout
                </h2>

                <form onSubmit={handleCreateCheckout}>

                    {/* CONTACT DETAILS */}

                    <h3 className="text-lg mb-4">
                        Contact Details
                    </h3>

                    <div className="mb-6">

                        <label className="block text-gray-700 mb-1">
                            Email
                        </label>

                        <input
                            type="email"
                            value={user?.email || ""}
                            className="w-full border rounded-lg p-2 bg-gray-100"
                            disabled
                        />

                    </div>

                    {/* DELIVERY */}

                    <h3 className="text-lg mb-4">
                        Delivery
                    </h3>

                    {/* FIRST + LAST NAME */}

                    <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">

                        <div>

                            <label className="block text-gray-700 mb-1">
                                First Name
                            </label>

                            <input
                                type="text"
                                name="firstName"
                                value={
                                    shippingAddress.firstName
                                }
                                onChange={
                                    handleShippingChange
                                }
                                className="w-full border rounded-lg p-2"
                                required
                            />

                        </div>

                        <div>

                            <label className="block text-gray-700 mb-1">
                                Last Name
                            </label>

                            <input
                                type="text"
                                name="lastName"
                                value={
                                    shippingAddress.lastName
                                }
                                onChange={
                                    handleShippingChange
                                }
                                className="w-full border rounded-lg p-2"
                                required
                            />

                        </div>

                    </div>

                    {/* ADDRESS */}

                    <div className="mb-4">

                        <label className="block text-gray-700 mb-1">
                            Address
                        </label>

                        <input
                            type="text"
                            name="address"
                            value={
                                shippingAddress.address
                            }
                            onChange={
                                handleShippingChange
                            }
                            className="w-full border rounded-lg p-2"
                            required
                        />

                    </div>

                    {/* CITY + POSTAL CODE */}

                    <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">

                        <div>

                            <label className="block text-gray-700 mb-1">
                                City
                            </label>

                            <input
                                type="text"
                                name="city"
                                value={
                                    shippingAddress.city
                                }
                                onChange={
                                    handleShippingChange
                                }
                                className="w-full border rounded-lg p-2"
                                required
                            />

                        </div>

                        <div>

                            <label className="block text-gray-700 mb-1">
                                Postal Code
                            </label>

                            <input
                                type="text"
                                name="postalCode"
                                value={
                                    shippingAddress.postalCode
                                }
                                onChange={
                                    handleShippingChange
                                }
                                className="w-full border rounded-lg p-2"
                                required
                            />

                        </div>

                    </div>

                    {/* COUNTRY */}

                    <div className="mb-4">

                        <label className="block text-gray-700 mb-1">
                            Country
                        </label>

                        <input
                            type="text"
                            name="country"
                            value={
                                shippingAddress.country
                            }
                            onChange={
                                handleShippingChange
                            }
                            className="w-full border rounded-lg p-2"
                            required
                        />

                    </div>

                    {/* PHONE */}

                    <div className="mb-6">

                        <label className="block text-gray-700 mb-1">
                            Phone
                        </label>

                        <input
                            type="tel"
                            name="phone"
                            value={
                                shippingAddress.phone
                            }
                            onChange={
                                handleShippingChange
                            }
                            className="w-full border rounded-lg p-2"
                            required
                        />

                    </div>

                    {/* PAYMENT */}

                    {!checkoutId ? (

                        <button
                            type="submit"
                            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
                        >
                            Continue to Payment
                        </button>

                    ) : (

                        <div className="mt-6">

                            <h3 className="text-lg mb-4">
                                Pay with PayPal
                            </h3>

                            <PayPalButton
                                amount={cart.totalPrice}
                                onSuccess={
                                    handlePaymentSuccess
                                }
                                onError={(err) => {
                                    console.error(
                                        "PayPal error:",
                                        err
                                    );

                                    alert(
                                        "Payment failed. Please try again."
                                    );
                                }}
                            />

                        </div>

                    )}

                </form>

            </div>

            {/* ==============================
                ORDER SUMMARY
            ============================== */}

            <div className="bg-gray-50 p-6 rounded-lg">

                <h3 className="text-lg mb-4">
                    Order Summary
                </h3>

                <div className="border-t py-4 mb-4">

                    {cart.products.map(
                        (product, index) => (

                            <div
                                key={`${product.productId}-${product.size}-${product.color}-${index}`}
                                className="flex items-start justify-between py-4 border-b"
                            >

                                {/* PRODUCT */}

                                <div className="flex items-center gap-4">

                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-20 h-24 object-cover rounded"
                                    />

                                    <div>

                                        <h3 className="text-md font-medium">
                                            {product.name}
                                        </h3>

                                        <p className="text-gray-500 text-sm mt-1">
                                            Size:{" "}
                                            {product.size}
                                            {" | "}
                                            Color:{" "}
                                            {product.color}
                                        </p>

                                        <p className="text-sm text-gray-500 mt-1">
                                            Quantity:{" "}
                                            {product.quantity}
                                        </p>

                                    </div>

                                </div>

                                {/* PRICE */}

                                <div className="text-lg font-medium ml-4">
                                    Ksh{" "}
                                    {(
                                        product.price *
                                        product.quantity
                                    ).toFixed(2)}
                                </div>

                            </div>

                        )
                    )}

                </div>

                {/* SUBTOTAL */}

                <div className="flex justify-between items-center text-lg mb-4">

                    <p>Subtotal</p>

                    <p>
                        Ksh{" "}
                        {cart.totalPrice.toLocaleString(
                            undefined,
                            {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            }
                        )}
                    </p>

                </div>

                {/* SHIPPING */}

                <div className="flex justify-between items-center text-lg">

                    <p>Shipping</p>

                    <p>Free</p>

                </div>

                {/* TOTAL */}

                <div className="flex justify-between items-center text-lg mt-4 border-t pt-4 font-semibold">

                    <p>Total</p>

                    <p>
                        Ksh{" "}
                        {cart.totalPrice.toLocaleString(
                            undefined,
                            {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            }
                        )}
                    </p>

                </div>

            </div>
        </div>
    );
};

export default Checkout;
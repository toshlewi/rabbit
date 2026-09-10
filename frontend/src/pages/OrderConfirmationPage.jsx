import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCartFromServer } from "../redux/slices/cartSlice";

const OrderConfirmationPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { checkout } = useSelector(
        (state) => state.checkout
    );

    const { user, guestId } = useSelector(
        (state) => state.auth
    );

    const userId = user ? user._id : null;

    // ========================================================
    // CLEAR CART AFTER SUCCESSFUL ORDER
    // ========================================================

    useEffect(() => {
        if (checkout && checkout._id) {
            dispatch(
                clearCartFromServer({
                    userId,
                    guestId: userId ? null : guestId,
                })
            );
        } else {
            // Correct route is /my-orders
            navigate("/my-orders");
        }
    }, [
        checkout,
        dispatch,
        navigate,
        userId,
        guestId,
    ]);

    // ========================================================
    // ESTIMATED DELIVERY
    // ========================================================

    const calculateEstimatedDelivery = (
        createdAt
    ) => {
        const orderDate = new Date(
            createdAt
        );

        orderDate.setDate(
            orderDate.getDate() + 7
        );

        return orderDate.toLocaleDateString();
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white">
            {/* =================================================
                PAGE TITLE
            ================================================= */}

            <h1 className="text-4xl font-bold text-center text-emerald-700 mb-8">
                Thank You for Your Order!
            </h1>

            {checkout && (
                <div className="p-6 rounded-lg border">

                    {/* =========================================
                        ORDER INFORMATION
                    ========================================= */}

                    <div className="flex justify-between mb-20">
                        {/* Order ID and Date */}

                        <div>
                            <h2 className="text-xl font-semibold">
                                Order ID:{" "}
                                {checkout._id}
                            </h2>

                            <p className="text-gray-600">
                                Order Date:{" "}
                                {new Date(
                                    checkout.createdAt
                                ).toLocaleDateString()}
                            </p>
                        </div>

                        {/* Estimated Delivery */}

                        <div>
                            <p className="text-emerald-700">
                                Estimated Delivery
                                Date:{" "}
                                {calculateEstimatedDelivery(
                                    checkout.createdAt
                                )}
                            </p>
                        </div>
                    </div>

                    {/* =========================================
                        ORDERED ITEMS
                    ========================================= */}

                    <div className="mb-20">
                        {checkout.checkoutItems &&
                            checkout.checkoutItems.map(
                                (
                                    item,
                                    index
                                ) => (
                                    <div
                                        key={`${item.productId}-${item.size}-${item.color}-${index}`}
                                        className="flex items-center mb-4"
                                    >
                                        {/* Product Image */}

                                        <img
                                            src={
                                                item.image
                                            }
                                            alt={
                                                item.name
                                            }
                                            className="w-16 h-16 object-cover rounded mr-4"
                                        />

                                        {/* Product Information */}

                                        <div>
                                            <h4 className="text-md font-semibold">
                                                {
                                                    item.name
                                                }
                                            </h4>

                                            <p className="text-sm text-gray-600">
                                                Color:{" "}
                                                {
                                                    item.color
                                                }{" "}
                                                | Size:{" "}
                                                {
                                                    item.size
                                                }
                                            </p>
                                        </div>

                                        {/* Price and Quantity */}

                                        <div className="ml-auto text-right">
                                            <p className="text-md">
                                                Ksh{" "}
                                                {Number(
                                                    item.price
                                                ).toLocaleString()}
                                            </p>

                                            <p className="text-sm text-gray-500">
                                                Qty:{" "}
                                                {
                                                    item.quantity
                                                }
                                            </p>
                                        </div>
                                    </div>
                                )
                            )}
                    </div>

                    {/* =========================================
                        PAYMENT AND DELIVERY INFORMATION
                    ========================================= */}

                    <div className="grid grid-cols-2 gap-8">

                        {/* Payment */}

                        <div>
                            <h4 className="text-lg font-semibold mb-2">
                                Payment
                            </h4>

                            <p className="text-gray-600">
                                Paypal
                            </p>
                        </div>

                        {/* Delivery */}

                        <div>
                            <h4 className="text-lg font-semibold mb-2">
                                Delivery
                            </h4>

                            {checkout.shippingAddress && (
                                <>
                                    <p className="text-gray-600">
                                        {
                                            checkout
                                                .shippingAddress
                                                .address
                                        }
                                    </p>

                                    <p className="text-gray-600">
                                        {
                                            checkout
                                                .shippingAddress
                                                .city
                                        }
                                        ,{" "}
                                        {
                                            checkout
                                                .shippingAddress
                                                .country
                                        }
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderConfirmationPage;
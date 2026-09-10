import { RiDeleteBin3Line } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
    removeFromCart,
    updateCartItemQuantity,
} from "../../redux/slices/cartSlice";

const CartContents = () => {
    const dispatch = useDispatch();
    const { cart } = useSelector((state) => state.cart);
    const { userId, guestId } = useSelector((state) => state.auth);

    const cartProducts = cart?.products || [];

    const getCartIdentity = () => ({
        userId: userId || null,
        guestId: userId ? null : guestId,
    });

    const handleQuantityChange = async (product, newQuantity) => {
        if (newQuantity < 1) {
            return;
        }

        try {
            await dispatch(
                updateCartItemQuantity({
                    productId: product.productId,
                    quantity: newQuantity,
                    size: product.size,
                    color: product.color,
                    ...getCartIdentity(),
                })
            ).unwrap();
        } catch (error) {
            toast.error(
                error?.message || "Failed to update item quantity"
            );
        }
    };

    const handleRemoveFromCart = async (product) => {
        try {
            await dispatch(
                removeFromCart({
                    productId: product.productId,
                    size: product.size,
                    color: product.color,
                    ...getCartIdentity(),
                })
            ).unwrap();

            toast.success("Item removed from cart");
        } catch (error) {
            toast.error(
                error?.message || "Failed to remove item"
            );
        }
    };

    if (cartProducts.length === 0) {
        return (
            <p className="text-gray-500 text-center mt-6">
                Your cart is empty.
            </p>
        );
    }

    return (
        <div>
            {cartProducts.map((product, index) => (
                <div
                    key={`${product.productId}-${product.size}-${product.color}-${index}`}
                    className="flex items-start justify-between py-4 border-b"
                >
                    <div className="flex items-start">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-20 h-24 object-cover mr-4 rounded"
                        />
                    </div>
                    <div>
                        <h3 className="font-medium">{product.name}</h3>
                        <p className="text-sm text-gray-500">
                            size: {product.size} | color: {product.color}
                        </p>
                    </div>
                    <div className="flex items-center border border-gray-300 rounded-md overflow-hidden w-fit mt-10">
                        <button
                            type="button"
                            onClick={() =>
                                handleQuantityChange(
                                    product,
                                    product.quantity - 1
                                )
                            }
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100"
                        >
                            -
                        </button>

                        <span className="w-10 text-center text-sm">
                            {product.quantity}
                        </span>

                        <button
                            type="button"
                            onClick={() =>
                                handleQuantityChange(
                                    product,
                                    product.quantity + 1
                                )
                            }
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100"
                        >
                            +
                        </button>
                    </div>
                    <div className="flex flex-col items-end">
                        <p className="font-medium">
                            Ksh
                            {Number(product.price).toLocaleString()}
                        </p>
                        <button
                            type="button"
                            onClick={() => handleRemoveFromCart(product)}
                            className="h-6 w-6 mt-2 text-red-600"
                        >
                            <RiDeleteBin3Line />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CartContents;

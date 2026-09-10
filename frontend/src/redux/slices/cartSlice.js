import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

/*
|--------------------------------------------------------------------------
| EMPTY CART
|--------------------------------------------------------------------------
*/

const emptyCart = {
    products: [],
    totalPrice: 0,
};

/*
|--------------------------------------------------------------------------
| LOCAL STORAGE KEYS
|--------------------------------------------------------------------------
*/

const getCartStorageKey = (userId, guestId) => {
    if (userId) {
        return `cart_user_${userId}`;
    }

    if (guestId) {
        return `cart_guest_${guestId}`;
    }

    return null;
};

const saveCartToStorage = (
    cart,
    userId,
    guestId
) => {
    const key = getCartStorageKey(
        userId,
        guestId
    );

    if (!key) {
        return;
    }

    localStorage.setItem(
        key,
        JSON.stringify(cart)
    );
};

const removeCartFromStorage = (
    userId,
    guestId
) => {
    const key = getCartStorageKey(
        userId,
        guestId
    );

    if (!key) {
        return;
    }

    localStorage.removeItem(key);
};

/*
|--------------------------------------------------------------------------
| FETCH CART
|--------------------------------------------------------------------------
*/

export const fetchCart = createAsyncThunk(
    "cart/fetchCart",
    async (
        {
            userId = null,
            guestId = null,
        },
        { rejectWithValue }
    ) => {
        try {
            /*
            |------------------------------------------------------------------
            | IMPORTANT:
            | A logged-in user MUST use userId.
            | A guest MUST use guestId.
            |
            | Never send both.
            |------------------------------------------------------------------
            */

            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
                {
                    params: {
                        userId: userId || undefined,
                        guestId: userId
                            ? undefined
                            : guestId || undefined,
                    },
                }
            );

            return {
                cart: response.data,
                userId,
                guestId,
            };
        } catch (error) {
            console.error(
                "Fetch cart error:",
                error
            );

            return rejectWithValue({
                message:
                    error.response?.data
                        ?.message ||
                    error.message ||
                    "Failed to fetch cart",
                userId,
                guestId,
            });
        }
    }
);

/*
|--------------------------------------------------------------------------
| ADD TO CART
|--------------------------------------------------------------------------
*/

export const addToCart = createAsyncThunk(
    "cart/addToCart",
    async (
        {
            productId,
            quantity,
            size,
            color,
            userId = null,
            guestId = null,
        },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
                {
                    productId,
                    quantity,
                    size,
                    color,

                    /*
                    |----------------------------------------------------------
                    | Logged-in user -> userId only
                    | Guest -> guestId only
                    |----------------------------------------------------------
                    */

                    userId:
                        userId || undefined,

                    guestId: userId
                        ? undefined
                        : guestId || undefined,
                }
            );

            return {
                cart: response.data,
                userId,
                guestId,
            };
        } catch (error) {
            console.error(
                "Add to cart error:",
                error
            );

            return rejectWithValue({
                message:
                    error.response?.data
                        ?.message ||
                    error.message ||
                    "Failed to add to cart",
                userId,
                guestId,
            });
        }
    }
);

/*
|--------------------------------------------------------------------------
| UPDATE CART ITEM QUANTITY
|--------------------------------------------------------------------------
*/

export const updateCartItemQuantity =
    createAsyncThunk(
        "cart/updateCartItemQuantity",
        async (
            {
                productId,
                quantity,
                size,
                color,
                userId = null,
                guestId = null,
            },
            { rejectWithValue }
        ) => {
            try {
                const response =
                    await axios.put(
                        `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
                        {
                            productId,
                            quantity,
                            size,
                            color,

                            userId:
                                userId ||
                                undefined,

                            guestId: userId
                                ? undefined
                                : guestId ||
                                  undefined,
                        }
                    );

                return {
                    cart: response.data,
                    userId,
                    guestId,
                };
            } catch (error) {
                console.error(
                    "Update cart error:",
                    error
                );

                return rejectWithValue({
                    message:
                        error.response?.data
                            ?.message ||
                        error.message ||
                        "Failed to update cart item quantity",
                    userId,
                    guestId,
                });
            }
        }
    );

/*
|--------------------------------------------------------------------------
| REMOVE FROM CART
|--------------------------------------------------------------------------
*/

export const removeFromCart =
    createAsyncThunk(
        "cart/removeFromCart",
        async (
            {
                productId,
                size,
                color,
                userId = null,
                guestId = null,
            },
            { rejectWithValue }
        ) => {
            try {
                const response =
                    await axios.delete(
                        `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
                        {
                            data: {
                                productId,
                                size,
                                color,

                                userId:
                                    userId ||
                                    undefined,

                                guestId: userId
                                    ? undefined
                                    : guestId ||
                                      undefined,
                            },
                        }
                    );

                return {
                    cart: response.data,
                    userId,
                    guestId,
                };
            } catch (error) {
                console.error(
                    "Remove from cart error:",
                    error
                );

                return rejectWithValue({
                    message:
                        error.response?.data
                            ?.message ||
                        error.message ||
                        "Failed to remove item",
                    userId,
                    guestId,
                });
            }
        }
    );

/*
|--------------------------------------------------------------------------
| CLEAR CART FROM SERVER
|--------------------------------------------------------------------------
*/

export const clearCartFromServer =
    createAsyncThunk(
        "cart/clearCartFromServer",
        async (
            {
                userId = null,
                guestId = null,
            },
            { rejectWithValue }
        ) => {
            try {
                const response =
                    await axios.delete(
                        `${import.meta.env.VITE_BACKEND_URL}/api/cart/clear`,
                        {
                            data: {
                                userId:
                                    userId ||
                                    undefined,

                                guestId: userId
                                    ? undefined
                                    : guestId ||
                                      undefined,
                            },
                        }
                    );

                return {
                    cart: response.data,
                    userId,
                    guestId,
                };
            } catch (error) {
                console.error(
                    "Clear cart error:",
                    error
                );

                return rejectWithValue({
                    message:
                        error.response?.data
                            ?.message ||
                        error.message ||
                        "Failed to clear cart",
                    userId,
                    guestId,
                });
            }
        }
    );

/*
|--------------------------------------------------------------------------
| MERGE CART
|--------------------------------------------------------------------------
|
| KEEPING YOUR ORIGINAL MERGE FUNCTIONALITY
|--------------------------------------------------------------------------
*/

export const mergeCart = createAsyncThunk(
    "cart/mergeCart",
    async (
        { guestId, user },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/cart/merge`,
                {
                    guestId,
                    user,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "userToken"
                        )}`,
                    },
                }
            );

            return {
                cart: response.data,
                userId: user?._id,
                guestId,
            };
        } catch (error) {
            console.error(
                "Merge cart error:",
                error
            );

            return rejectWithValue({
                message:
                    error.response?.data
                        ?.message ||
                    error.message ||
                    "Failed to merge cart",
                userId: user?._id,
                guestId,
            });
        }
    }
);

/*
|--------------------------------------------------------------------------
| INITIAL STATE
|--------------------------------------------------------------------------
*/

const loadCartFromStorage = () => {
    try {
        const savedUserInfo = localStorage.getItem("userInfo");
        let userId = null;

        if (savedUserInfo) {
            const parsedUserInfo = JSON.parse(savedUserInfo);
            const user = parsedUserInfo.user || parsedUserInfo;
            userId = user?._id || null;
        }

        const guestId = localStorage.getItem("guestId");
        const key = getCartStorageKey(userId, userId ? null : guestId);

        if (!key) {
            return { ...emptyCart };
        }

        const storedCart = localStorage.getItem(key);

        if (!storedCart) {
            return { ...emptyCart };
        }

        const parsedCart = JSON.parse(storedCart);

        if (parsedCart && Array.isArray(parsedCart.products)) {
            return {
                products: parsedCart.products,
                totalPrice: parsedCart.totalPrice || 0,
            };
        }
    } catch (error) {
        console.error("Error reading cart from localStorage:", error);
    }

    return { ...emptyCart };
};

const initialState = {
    cart: loadCartFromStorage(),
    loading: false,
    error: null,
};

/*
|--------------------------------------------------------------------------
| CART SLICE
|--------------------------------------------------------------------------
*/

const cartSlice = createSlice({
    name: "cart",

    initialState,

    reducers: {
        clearCart: (state) => {
            state.cart = {
                ...emptyCart,
            };

            state.error = null;

            localStorage.removeItem(
                "cart"
            );

            Object.keys(localStorage).forEach((key) => {
                if (key.startsWith("cart_")) {
                    localStorage.removeItem(key);
                }
            });
        },
    },

    extraReducers: (builder) => {

        /*
        |--------------------------------------------------------------------------
        | FETCH CART
        |--------------------------------------------------------------------------
        */

        builder
            .addCase(
                fetchCart.pending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )

            .addCase(
                fetchCart.fulfilled,
                (state, action) => {
                    state.loading = false;

                    const {
                        cart,
                        userId,
                        guestId,
                    } = action.payload;

                    if (
                        cart &&
                        Array.isArray(
                            cart.products
                        )
                    ) {
                        state.cart = {
                            products:
                                cart.products,
                            totalPrice:
                                cart.totalPrice ||
                                0,
                        };

                        saveCartToStorage(
                            state.cart,
                            userId,
                            guestId
                        );
                    } else {
                        state.cart = {
                            ...emptyCart,
                        };

                        removeCartFromStorage(
                            userId,
                            guestId
                        );
                    }

                    state.error = null;
                }
            )

            .addCase(
                fetchCart.rejected,
                (state, action) => {
                    state.loading = false;

                    const {
                        message,
                        userId,
                        guestId,
                    } =
                        action.payload || {};

                    if (
                        message ===
                        "Cart not found"
                    ) {
                        state.cart = {
                            ...emptyCart,
                        };

                        removeCartFromStorage(
                            userId,
                            guestId
                        );

                        state.error = null;

                        return;
                    }

                    state.error =
                        message ||
                        action.error
                            ?.message ||
                        "Failed to fetch cart";
                }
            );

        /*
        |--------------------------------------------------------------------------
        | ADD TO CART
        |--------------------------------------------------------------------------
        */

        builder
            .addCase(
                addToCart.pending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )

            .addCase(
                addToCart.fulfilled,
                (state, action) => {
                    state.loading = false;

                    const {
                        cart,
                        userId,
                        guestId,
                    } = action.payload;

                    if (
                        cart &&
                        Array.isArray(
                            cart.products
                        )
                    ) {
                        state.cart = {
                            products:
                                cart.products,
                            totalPrice:
                                cart.totalPrice ||
                                0,
                        };

                        saveCartToStorage(
                            state.cart,
                            userId,
                            guestId
                        );
                    }

                    state.error = null;
                }
            )

            .addCase(
                addToCart.rejected,
                (state, action) => {
                    state.loading = false;

                    state.error =
                        action.payload
                            ?.message ||
                        action.error
                            ?.message ||
                        "Failed to add to cart";
                }
            );

        /*
        |--------------------------------------------------------------------------
        | UPDATE QUANTITY
        |--------------------------------------------------------------------------
        */

        builder
            .addCase(
                updateCartItemQuantity.pending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )

            .addCase(
                updateCartItemQuantity.fulfilled,
                (
                    state,
                    action
                ) => {
                    state.loading = false;

                    const {
                        cart,
                        userId,
                        guestId,
                    } = action.payload;

                    if (
                        cart &&
                        Array.isArray(
                            cart.products
                        )
                    ) {
                        state.cart = {
                            products:
                                cart.products,
                            totalPrice:
                                cart.totalPrice ||
                                0,
                        };

                        if (
                            state.cart
                                .products
                                .length >
                            0
                        ) {
                            saveCartToStorage(
                                state.cart,
                                userId,
                                guestId
                            );
                        } else {
                            removeCartFromStorage(
                                userId,
                                guestId
                            );
                        }
                    }

                    state.error = null;
                }
            )

            .addCase(
                updateCartItemQuantity.rejected,
                (
                    state,
                    action
                ) => {
                    state.loading = false;

                    state.error =
                        action.payload
                            ?.message ||
                        action.error
                            ?.message ||
                        "Failed to update item quantity";
                }
            );

        /*
        |--------------------------------------------------------------------------
        | REMOVE FROM CART
        |--------------------------------------------------------------------------
        */

        builder
            .addCase(
                removeFromCart.pending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )

            .addCase(
                removeFromCart.fulfilled,
                (
                    state,
                    action
                ) => {
                    state.loading = false;

                    const {
                        cart,
                        userId,
                        guestId,
                    } = action.payload;

                    if (
                        cart &&
                        Array.isArray(
                            cart.products
                        )
                    ) {
                        state.cart = {
                            products:
                                cart.products,
                            totalPrice:
                                cart.totalPrice ||
                                0,
                        };

                        if (
                            state.cart
                                .products
                                .length >
                            0
                        ) {
                            saveCartToStorage(
                                state.cart,
                                userId,
                                guestId
                            );
                        } else {
                            removeCartFromStorage(
                                userId,
                                guestId
                            );
                        }
                    }

                    state.error = null;
                }
            )

            .addCase(
                removeFromCart.rejected,
                (
                    state,
                    action
                ) => {
                    state.loading = false;

                    state.error =
                        action.payload
                            ?.message ||
                        action.error
                            ?.message ||
                        "Failed to remove item";
                }
            );

        /*
        |--------------------------------------------------------------------------
        | CLEAR CART
        |--------------------------------------------------------------------------
        */

        builder
            .addCase(
                clearCartFromServer.pending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )

            .addCase(
                clearCartFromServer.fulfilled,
                (
                    state,
                    action
                ) => {
                    state.loading = false;

                    state.cart = {
                        ...emptyCart,
                    };

                    const {
                        userId,
                        guestId,
                    } = action.payload;

                    removeCartFromStorage(
                        userId,
                        guestId
                    );

                    localStorage.removeItem(
                        "cart"
                    );

                    state.error = null;
                }
            )

            .addCase(
                clearCartFromServer.rejected,
                (
                    state,
                    action
                ) => {
                    state.loading = false;

                    state.error =
                        action.payload
                            ?.message ||
                        action.error
                            ?.message ||
                        "Failed to clear cart";
                }
            );

        /*
        |--------------------------------------------------------------------------
        | MERGE CART
        |--------------------------------------------------------------------------
        */

        builder
            .addCase(
                mergeCart.pending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )

            .addCase(
                mergeCart.fulfilled,
                (
                    state,
                    action
                ) => {
                    state.loading = false;

                    const {
                        cart,
                        userId,
                        guestId,
                    } = action.payload;

                    if (
                        cart &&
                        Array.isArray(
                            cart.products
                        )
                    ) {
                        state.cart = {
                            products:
                                cart.products,
                            totalPrice:
                                cart.totalPrice ||
                                0,
                        };

                        /*
                        |------------------------------------------------------
                        | Merged cart belongs to USER
                        |------------------------------------------------------
                        */

                        saveCartToStorage(
                            state.cart,
                            userId,
                            null
                        );

                        /*
                        |------------------------------------------------------
                        | Guest local cache is no longer active
                        |------------------------------------------------------
                        */

                        removeCartFromStorage(
                            null,
                            guestId
                        );
                    }

                    localStorage.removeItem(
                        "cart"
                    );

                    state.error = null;
                }
            )

            .addCase(
                mergeCart.rejected,
                (
                    state,
                    action
                ) => {
                    state.loading = false;

                    state.error =
                        action.payload
                            ?.message ||
                        action.error
                            ?.message ||
                        "Failed to merge cart";
                }
            );
    },
});

export const {
    clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
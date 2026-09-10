import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ======================================================
// FETCH PRODUCTS BY FILTERS
// ======================================================

export const fetchProductsByFilters = createAsyncThunk(
    "products/fetchByFilters",
    async ({
        collection,
        size,
        color,
        gender,
        minPrice,
        maxPrice,
        sortBy,
        search,
        category,
        material,
        brand,
        limit,
    }) => {
        const query = new URLSearchParams();

        if (collection) query.append("collection", collection);
        if (size) query.append("size", size);
        if (color) query.append("color", color);
        if (gender) query.append("gender", gender);
        if (minPrice) query.append("minPrice", minPrice);
        if (maxPrice) query.append("maxPrice", maxPrice);
        if (sortBy) query.append("sortBy", sortBy);
        if (search) query.append("search", search);
        if (category) query.append("category", category);
        if (material) query.append("material", material);
        if (brand) query.append("brand", brand);
        if (limit) query.append("limit", limit);

        const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/products?${query.toString()}`
        );

        return response.data;
    }
);


// ======================================================
// FETCH SINGLE PRODUCT
// ======================================================

export const fetchProductDetails = createAsyncThunk(
    "products/fetchProductDetails",
    async (id) => {
        const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`
        );

        return response.data;
    }
);


// ======================================================
// UPDATE PRODUCT
// ======================================================

export const updateProduct = createAsyncThunk(
    "products/updateProduct",
    async ({ id, productData }) => {
        const response = await axios.put(
            `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`,
            productData,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(
                        "userToken"
                    )}`,
                },
            }
        );

        return response.data;
    }
);


// ======================================================
// FETCH SIMILAR PRODUCTS
// ======================================================

export const fetchSimilarProducts = createAsyncThunk(
    "products/fetchSimilarProducts",
    async ({ id }) => {
        const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/products/similar/${id}`
        );

        return response.data;
    }
);


// ======================================================
// INITIAL STATE
// ======================================================

const initialState = {
    products: [],

    // Single selected product
    selectedProduct: null,

    // Products similar to selected product
    similarProducts: [],

    loading: false,
    detailsLoading: false,
    error: null,

    filters: {
        category: "",
        size: "",
        color: "",
        gender: "",
        brand: "",
        minPrice: "",
        maxPrice: "",
        sortBy: "",
        search: "",
        material: "",
        collection: "",
    },
};


// ======================================================
// PRODUCTS SLICE
// ======================================================

const productsSlice = createSlice({
    name: "products",

    initialState,

    reducers: {

        // Set filters
        setFilters: (state, action) => {
            state.filters = {
                ...state.filters,
                ...action.payload,
            };
        },

        // Clear filters
        clearFilters: (state) => {
            state.filters = {
                category: "",
                size: "",
                color: "",
                gender: "",
                brand: "",
                minPrice: "",
                maxPrice: "",
                sortBy: "",
                search: "",
                material: "",
                collection: "",
            };
        },
    },

    extraReducers: (builder) => {

        // ==================================================
        // FETCH PRODUCTS BY FILTERS
        // ==================================================

        builder
            .addCase(
                fetchProductsByFilters.pending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )

            .addCase(
                fetchProductsByFilters.fulfilled,
                (state, action) => {
                    state.loading = false;

                    /*
                     * Make sure products is ALWAYS an array.
                     */
                    state.products = Array.isArray(action.payload)
                        ? action.payload
                        : [];
                }
            )

            .addCase(
                fetchProductsByFilters.rejected,
                (state, action) => {
                    state.loading = false;
                    state.error =
                        action.error.message ||
                        "Failed to fetch products";
                }
            );


        // ==================================================
        // FETCH SINGLE PRODUCT DETAILS
        // ==================================================

        builder
            .addCase(
                fetchProductDetails.pending,
                (state) => {
                    state.detailsLoading = true;
                    state.error = null;
                }
            )

            .addCase(
                fetchProductDetails.fulfilled,
                (state, action) => {
                    state.detailsLoading = false;

                    /*
                     * IMPORTANT:
                     *
                     * Do NOT put the single product
                     * inside state.products.
                     *
                     * state.products must remain an ARRAY.
                     */
                    state.selectedProduct = action.payload;
                }
            )

            .addCase(
                fetchProductDetails.rejected,
                (state, action) => {
                    state.detailsLoading = false;
                    state.error =
                        action.error.message ||
                        "Failed to fetch product";
                }
            );


        // ==================================================
        // UPDATE PRODUCT
        // ==================================================

        builder
            .addCase(
                updateProduct.pending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )

            .addCase(
                updateProduct.fulfilled,
                (state, action) => {
                    state.loading = false;

                    const updatedProduct =
                        action.payload;

                    /*
                     * Find the updated product
                     * inside the products ARRAY.
                     */
                    const index = state.products.findIndex(
                        (product) =>
                            product._id ===
                            updatedProduct._id
                    );

                    if (index !== -1) {
                        state.products[index] =
                            updatedProduct;
                    }

                    /*
                     * If this is currently the selected
                     * product, update that too.
                     */
                    if (
                        state.selectedProduct?._id ===
                        updatedProduct._id
                    ) {
                        state.selectedProduct =
                            updatedProduct;
                    }
                }
            )

            .addCase(
                updateProduct.rejected,
                (state, action) => {
                    state.loading = false;
                    state.error =
                        action.error.message ||
                        "Failed to update product";
                }
            );


        // ==================================================
        // FETCH SIMILAR PRODUCTS
        // ==================================================

        builder
            .addCase(
                fetchSimilarProducts.pending,
                () => {}
            )

            .addCase(
                fetchSimilarProducts.fulfilled,
                (state, action) => {
                    state.loading = false;

                    /*
                     * IMPORTANT:
                     *
                     * Similar products go into
                     * similarProducts, NOT products.
                     */
                    state.similarProducts =
                        Array.isArray(action.payload)
                            ? action.payload
                            : [];
                }
            )

            .addCase(
                fetchSimilarProducts.rejected,
                (state, action) => {
                    state.loading = false;
                    state.error =
                        action.error.message ||
                        "Failed to fetch similar products";
                }
            );
    },
});


// ======================================================
// ACTIONS
// ======================================================

export const {
    setFilters,
    clearFilters,
} = productsSlice.actions;


// ======================================================
// REDUCER
// ======================================================

export default productsSlice.reducer;
import { createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}`;

const getAuthHeader = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
    },
});

//async Thunk to fetch admin products
export const fetchAdminProducts = createAsyncThunk ("adminProducts/fetchProducts", async () => {
    const response = await axios.get (`${API_URL}/api/admin/products`, getAuthHeader());
    return response.data;
});

//async function to create new product
export const createProduct = createAsyncThunk("adminProducts/createProduct", async (productData, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_URL}/api/products`, productData,
            getAuthHeader()
        );
        return response.data
    } catch (error) {
        return rejectWithValue(error.response?.data || { message: "Failed to create product" });
    }
});

// async Thunk to update an existing product
export const updateProduct = createAsyncThunk("adminProducts/updateProduct", async ({id, productData}) => {
    const response = await axios.put(`${API_URL}/api/products/${id}`, productData,
        getAuthHeader()
    )
    return response.data
});

//async thunk to delete a product
export const deleteProduct = createAsyncThunk(
    "adminProducts/deleteProduct",
    async (id) => {
        await axios.delete(
            `${API_URL}/api/products/${id}`,
            getAuthHeader()
        );

        return id;
    }
);

const adminProductSlice = createSlice({
    name: "adminProducts",
    initialState: {
        products:[],
        loading: false,
        error: null,
    },
    reducers: {},

    extraReducers: (builder) => {
        builder

            .addCase(fetchAdminProducts.pending, (state) => {
                state.loading = true;
            })

            .addCase(fetchAdminProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })

            .addCase(fetchAdminProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            .addCase(createProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.products.push(action.payload);
                state.error = null;
            })

            .addCase(createProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to create product";
            })

            .addCase(updateProduct.fulfilled, (state, action) => {
                const index = state.products.findIndex(
                    (product) => product._id === action.payload._id
                );
                if (index !== -1) {
                    state.products[index] = action.payload;
                }
            })

            .addCase(deleteProduct.fulfilled, (state, action) => {
                  state.products = state.products.filter(
                    (product) => product._id !== action.payload
                );
            })
    },
});

export default adminProductSlice.reducer;

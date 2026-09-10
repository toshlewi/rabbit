import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//fetch all orders(admin only)
export const fetchAllOrders = createAsyncThunk("adminOrders/fetchAllOrders", async (_, {rejectWithValue}) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/orders`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("userToken")}`
                },
            }
        );
        return response.data
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
})

//Update order delivery status
export const updateOrderStatus = createAsyncThunk("adminOrders/updateOrderStatus", async ({id, status, isDelivered}, {rejectWithValue}) => {
    try {
        const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/${id}`,
            {status, isDelivered},
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("userToken")}`
                },
            }
        );
        return response.data
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
})

//Delete order
export const deleteOrder = createAsyncThunk("adminOrders/deleteOrder", async (id, {rejectWithValue}) => {
    try {
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("userToken")}`
                },
            }
        );
        return id;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

const adminOrderSlice = createSlice ({
    name: "adminOrders",
    initialState: {
        orders: [],
        totalOrders: 0,
        totalSales: 0,
        loading: false,
        error: null,
    },

    reducers: {},

    extraReducers: (builder) => {
        builder
            // FETCH ALL ORDERS
            .addCase(fetchAllOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchAllOrders.fulfilled, (state, action) => {
                state.loading = false;
                const orders = Array.isArray(action.payload)
                    ? action.payload
                    : [];
                state.orders = orders;
                state.totalOrders = orders.length;
               
                //calculate total sales
                const totalSales = orders.reduce((acc, order ) => {
                    return acc + (order.totalPrice || 0);
                }, 0);
                state.totalSales = totalSales;
            })

            .addCase(fetchAllOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || action.error.message
            })
            // UPDATE ORDER STATUS
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                const updatedOrder = action.payload;
                const orderIndex = state.orders.findIndex(
                    (order) => order._id === updatedOrder._id
                );

                if (orderIndex !== -1) {
                    state.orders[orderIndex] = updatedOrder;
                }
            })
            // DELETE ORDER
            .addCase(deleteOrder.fulfilled, (state, action) => {
                state.orders = state.orders.filter(
                    (order) => order._id !== action.payload
                );
            })

    },
});

export default adminOrderSlice.reducer;
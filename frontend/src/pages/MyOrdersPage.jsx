import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserOrders } from "../redux/slices/orderSlice";
import { optimizeImageUrl } from "../utils/optimizeImageUrl";

const MyOrdersPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const {orders, loading, error} = useSelector((state)=> state.orders);

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    dispatch(fetchUserOrders())
  }, [dispatch, user, navigate]);
 
  const handleRowClick = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  if(loading) return <p>Loading ...</p>
  if(error) return <p>Error: {error}</p>

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 ">
      <h2 className="text-xl sm:text-2xl font-bold mb-6">My Orders</h2>
      <div className="relative shadow-md sm:rounded-lg overflow-hidden">
        <table className="min-w-full text-left text-gray-500">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th className="px-4 py-2 sm:py-3">Image</th>
              <th className="px-4 py-2 sm:py-3">Order ID</th>
              <th className="px-4 py-2 sm:py-3">Created</th>
              <th className="px-4 py-2 sm:py-3">Shipping Address</th>
              <th className="px-4 py-2 sm:py-3">Items</th>
              <th className="px-4 py-2 sm:py-3">Price</th>
              <th className="px-4 py-2 sm:py-3">Status</th>
              
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ?(
              orders.map((order) => (
                <tr key={order._id} className="border-b hover:border-gray-50 cursor-pointer"
                onClick={() => handleRowClick(order._id)}
                >
                  <td className="py-2 px-2">
                    <img src={optimizeImageUrl(order.orderItems?.[0]?.image, 120)} alt={order.orderItems?.[0]?.name} className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg" loading="lazy" decoding="async" />
                  </td>
                  <td className="py-2 px-2 sm:py-2 sm:px-4 font-medium text-gray-900 whitespace-nowrap">{order._id}</td>
                  <td className="py-2 px-2 sm:py-2">
                    {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString()}
                  </td> 
                  <td className="py-2 px-2 sm:py-2">
                    {order.shippingAddress ? `${order.shippingAddress.city}, ${order.shippingAddress.country}` : 'N/A'}
                  </td>
                  <td className="py-2 px-2 sm:py-2"> {order.orderItems.length} items</td>
                  <td className="py-2 px-2 sm:py-2">Ksh {order.totalPrice}</td>
                  <td className="py-2 px-2 sm:py-2">
                    <span className={`${order.isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} px-2 py-1 rounded-full text-xs sm:text-sm font-medium`}>
                      {order.isPaid ? 'Paid' : 'Not Paid'}
                    </span>
                  </td>
                </tr>
              ))
            ):(
              <tr>
                <td colSpan={7} className="px-4 py-4 text-gray-500 text-center">No orders found</td>
              </tr>
            )}
            
          </tbody>
        </table>
      </div>
      
      
    </div>
  )
}

export default MyOrdersPage


const OrderManagement = () => {

    const orders = [
        {
            _id:123,
            user: {
                name:"John Doe",
            },
            totalPrice: 1000,
            status: "processing",

        }
    ]

    const handleStatusChange = (orderId, status) => {
        console.log(`Order ID: ${orderId}, New Status: ${status}`);
        // Here you would typically make an API call to update the order status in the backend.
    }
  return (
    <div className="max-w-7xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Order Management</h2>
        <div className="overflow-x-auto shadow-md sm:rounded-lg">
            <table className="min-w-full text-left text-gray-500">
                <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                    <tr>
                        <th className="py-3 px-4 border-b">Order ID</th>
                        <th className="py-3 px-4 border-b">Customer</th>
                        <th className="py-3 px-4 border-b">Total Price</th>
                        <th className="py-3 px-4 border-b">Status</th>
                        <th className="py-3 px-4 border-b">Actions</th>

                    </tr>
                </thead>
                <tbody>
                    {orders.length > 0 ? (
                        orders.map((order) => (
                            <tr key={order._id} className="border-b hover:bg-gray-50 cursor-pointer">
                                <td className="py-4 px-4 text-gray-900 whitespace-nowrap">#{order._id}</td>
                                <td className="py-3 px-4 border-b">{order.user.name}</td>
                                <td className="py-3 px-4 border-b">Ksh {order.totalPrice}</td>
                                <td className="py-3 px-4 border-b">
                                    <select
                                    value={order.status}
                                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                    className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus-border-blue-500 block p-2.5"
                                    >
                                    <option value="processing">Processing</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                </select></td>
                                <td className="p-4">
                                    <button 
                                    onClick={()=> handleStatusChange(order._id, "Delivered")}
                                    className="bg-green-500 text-white py-1 px-4 rounded hover:bg-green-600">
                                        Mark as Delivered
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5} className="p-4 text-center text-gray-500">
                                No orders found.
                            </td>
                        </tr>
                    )}
            
                </tbody>
            </table>
        </div>
      
    </div>
  )
}

export default OrderManagement

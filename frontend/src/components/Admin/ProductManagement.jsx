import { Link } from "react-router-dom";

const ProductManagement = () => {
    const products = [
        {
            _id: 123,
            name: "Shirt",
            price: 100,
            sku: 123123123,
        },
    ];

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            console.log(`Product ID: ${id} deleted`);
            // Here you would typically make an API call to delete the product in the backend.
        }
    };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 ">Product Management</h2>
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="min-w-full">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th className="px-6 py-3 ">Name</th>
              <th className="px-6 py-3 ">Price</th>
              <th className="px-6 py-3 ">SKU</th>
              <th className="px-6 py-3 ">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product._id}
                className="border-b hover:bg-gray-50 cursor-pointer">
                  <td className="p-4 font-medium text-gray-900 whitespace-nowrap">{product.name}</td>
                  <td className="p-4">Ksh{product.price}</td>
                  <td className="p-4">{product.sku}</td>
                  <td className="p-4">
                    <Link 
                    to={`/admin/products/${product._id}/edit`} 
                    className="bg-yellow-500 text-white py-1 px-2 rounded mr-2 hover:bg-yellow-600">
                      Edit
                    </Link>
                    <button 
                    onClick={() => handleDelete(product._id)}
                    className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ProductManagement

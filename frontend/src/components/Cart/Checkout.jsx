import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PayPalButton from './PayPalButton';

const cart = {
  products: [
    {
      id: 1,
      name: 'Stylish Jacket',
      size: 'M',
      color: 'Black',
      price: 2900,
      image:"https://picsum.photos/150?random=1"
    },
    {
      id: 2,
      name: 'Casual Sneakers',
      size: '42',
      color: 'Red',
      price: 2300,
      image:"https://picsum.photos/150?random=2"
    },
  ],
  totalPrice: 2900 + 2300,
};

const Checkout = () => {
  const navigate = useNavigate();
  const [checkoutId, setCheckoutId] = useState(null);
  const [shippingAddress, setShippingAddress] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    phone: '',
  });
  const handleCreateCheckout = (e) => {
    e.preventDefault();
    setCheckoutId(12345);
  };

  const handlePaymentSuccess = (details) => {
   console.log('Payment successful:', details);
   navigate('/order-confirmation');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter ">
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-2xl uppercase mb-6">Checkout</h2>
        <form  onSubmit={handleCreateCheckout}>
          <h3 className="text-lg mb-4">Contact Details</h3>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input type="email" value="user@example.com" className="w-full border rounded-lg p-2" disabled />
          </div>
          <h3 className="text-lg mb-4">Delivery</h3>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">First Name</label>
              <input 
              type="text" 
              value={shippingAddress.firstName} 
              onChange={(e) => setShippingAddress({...shippingAddress, firstName: e.target.value})} 
              className="w-full border rounded-lg p-2"
              required
             />
            </div>
            <div>
              <label className="block text-gray-700">Last Name</label>
              <input 
              type="text" 
              value={shippingAddress.lastName} 
              onChange={(e) => setShippingAddress({...shippingAddress, lastName: e.target.value})} 
              className="w-full border rounded-lg p-2" 
              required  
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Address</label>
            <input 
              type="text" 
              value={shippingAddress.address} 
              onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})} 
              className="w-full border rounded-lg p-2" 
              required  
            />
          </div>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">City</label>
              <input 
                type="text" 
                value={shippingAddress.city} 
                onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})} 
              className="w-full border rounded-lg p-2" 
              required  
            />
            </div>
            <div>
              <label className="block text-gray-700">Postal Code</label>
              <input 
                type="text" 
                value={shippingAddress.postalCode} 
                onChange={(e) => setShippingAddress({...shippingAddress, postalCode: e.target.value})} 
              className="w-full border rounded-lg p-2" 
              required  
            />
            </div>

          </div>
          <div>
              <label className="block text-gray-700">Country</label>
              <input 
                type="text" 
                value={shippingAddress.country} 
                onChange={(e) => setShippingAddress({...shippingAddress, country: e.target.value})} 
              className="w-full border rounded-lg p-2" 
              required  
            />
            </div>
            <div>
              <label className="block text-gray-700">Phone</label>
              <input 
                type="text" 
                value={shippingAddress.phone} 
                onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})} 
              className="w-full border rounded-lg p-2" 
              required  
            />
            </div>
            <div className="mt-6 ">
              {!checkoutId ? (
                <button type="submit" className="w-full bg-black text-white py-3 rounded-lg">
                  Continue to Payment
                </button>
              ) : (
                <div>
                  <h3 className="text-lg mb-4">Pay with Paypal</h3>
                  <PayPalButton amount={100000} onSuccess={handlePaymentSuccess} onError={(err) => alert("Payment failed. Try Again!")} />
                </div>
              )}
            </div>
        </form>

      </div >
     <div className="bg-gray-50 p-6 rounded-lg">
      <h3 className="text-lg mb-4">Order Summary</h3>
      <div className="border-t py-4 mb-4">
        {cart.products.map((product, index) => (
          <div key={index} className="flex items-start justify-between py-2 border-b">
            <div className="flex items-center gap-4">
              <img src={product.image} alt={product.name} className="w-20 h-24 object-cover mr-4" />
              <div>
                <h3 className="text-md">{product.name}</h3>
                <p className=" text-gray-500">Size: {product.size} | Color: {product.color}</p>
              </div>
            </div>
            <div className="text-xl font-medium">Ksh{(product.price).toFixed(2)}</div>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center text-lg mb-4">
        <p>subtotal</p>
        <p>Ksh{cart.totalPrice.toLocaleString()}</p>
      </div>
      <div className="flex justify-between items-center text-lg">
        <p>Shipping</p>
        <p>Free</p>
      </div>
      <div className="flex justify-between items-center text-lg mt-4 border-t pt-4">
        <p>Total</p>
        <p>Ksh{cart.totalPrice.toLocaleString()}</p>
      </div>

     </div>
    </div>
  )
}

export default Checkout

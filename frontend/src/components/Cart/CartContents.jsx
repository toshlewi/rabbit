import { RiDeleteBin3Line } from "react-icons/ri";

const CartContents = () => {
    const cartProducts = [
        {
            productId:1,
            name: "T-shirt",
            size: "M",
            color: "Black",
            quantity:1,
            price:1500,
            image:"https://picsum.photos/200?random=1"
        },
        {
            productId:2,
            name: "Jeans",
            size: "L",
            color: "Blue",
            quantity:1,
            price:2500,
            image:"https://picsum.photos/200?random=2"
        }
    ]
  return (
    <div>
      {cartProducts.map((product, index) => (
        <div key={index} className="flex items-start justify-between py-4 border-b">

            <div className="flex items-start">
                <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-20 h-24 object-cover mr-4 rounded" />
            </div>
            <div>
                <h3 className="font-medium">{product.name}</h3>
                <p className="text-sm text-gray-500">size: {product.size} | color: {product.color}</p> 
            </div>
            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden w-fit mt-10">
                <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100">
                -
                </button>

                <span className="w-10 text-center text-sm">
                    {product.quantity}
                </span>

                <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100">
                    +
                </button>
            </div>
          <div className="flex flex-col items-end">
            <p className="font-medium">Ksh{product.price.toLocaleString()}</p>
            <button className="h-6 w-6 mt-2 text-red-600">
                <RiDeleteBin3Line />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default CartContents
import { HiShoppingBag, HiArrowPathRoundedSquare, HiOutlineCreditCard } from 'react-icons/hi2'

const FeaturesSection = () => {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        {/*feature 1*/}
        <div className="flex flex-col items-center">
            <div className="p-4 rounded-full mb-4">
                <HiShoppingBag className="text-xl" />
            </div>
            <h4 className="tracking-tighter mb-2">FREE INTERNATIONAL SHIPPING</h4>
            <p className="text-sm text-gray-600 tracking-tighter">On all orders over ksh 10,000</p>
        </div>
        {/*feature 2*/}
        <div className="flex flex-col items-center">
            <div className="p-4 rounded-full mb-4">
                <HiArrowPathRoundedSquare className="text-xl" />
            </div>
            <h4 className="tracking-tighter mb-2">45 DAYS RETURN</h4>
            <p className="text-sm text-gray-600 tracking-tighter">Money back guaranteed</p>
        </div>
        {/*feature 3*/}
        <div className="flex flex-col items-center">
            <div className="p-4 rounded-full mb-4">
                <HiOutlineCreditCard className="text-xl" />
            </div>
            <h4 className="tracking-tighter mb-2">SECURE CHECKOUT</h4>
            <p className="text-sm text-gray-600 tracking-tighter">100% Secure Checkout Process</p>
        </div>
        
      </div>
    </section>
  )
}

export default FeaturesSection
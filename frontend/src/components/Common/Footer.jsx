import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t py-12"> 
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 lg:px-0 gap-8 px-4">
        <div>
            <h3 className="text-lg mb-4 text-gray-800">Newsletter</h3>
            <p className="text-sm text-gray-600 mb-4"> Be the first to know about new products, exclisive events and online offers.</p>
            <p className="font-medium text-sm mb-6 text-gray-600">Sign up and get 10% off on your first order.</p>

            {/* Newslwtter form */}
            <form className="flex">
                <input type="email" placeholder="Enter your email" className="p-3 w-full text-sm border-t border-l border-b border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all " required />
                <button type="submit" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-all">Subscribe</button>
            </form>
        </div>

        {/* Shop Links */}
        <div >
            <h3 className="text-lg mb-4 text-gray-800">Shop</h3>
            <ul className="space-y-2 text-gray-600">
                <li>
                    <Link to="#" className="hover:text-gray-500 transition-colors">
                        Men's Top Wear
                    </Link>
                </li>
                <li>
                    <Link to="#" className="hover:text-gray-500 transition-colors">
                        Women's Top Wear
                    </Link>
                </li>
                <li>
                    <Link to="#" className="hover:text-gray-500 transition-colors">
                        Men's Bottom Wear
                    </Link>
                </li>
                <li>
                    <Link to="#" className="hover:text-gray-500 transition-colors">
                        Women's Bottom Wear
                    </Link>
                </li>
            </ul>
        </div>
      </div>
    </footer>
  )
}

export default Footer
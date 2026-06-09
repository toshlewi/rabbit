import { Link } from 'react-router-dom'
import { HiOutlineUser , HiOutlineShoppingBag} from 'react-icons/hi'
import { RxHamburgerMenu } from "react-icons/rx";
import SearchBar from './SearchBar';
import CartDrawer from '../Layout/CartDrawer';
import { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);

  const toggleNavDrawer = () => {
    setNavDrawerOpen(!navDrawerOpen);
  };

  const toggleCartDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };
  return (
    <>
    <nav className="container mx-auto flex items-center justify-between py-3 px-6">
      {/*Left -Logo*/}
      <div>
        <Link to="/" className="text-2xl font-medium text-black">
          T Hub 
        </Link>
      </div>
      <div className="hidden md:flex">
        <Link to="#" style={{color: '#374151', textDecoration: 'none', fontSize: '14px', fontWeight: '500', textTransform: 'uppercase', marginRight: '24px'}}>
        Men
        </Link>
        <Link to="#" style={{color: '#374151', textDecoration: 'none', fontSize: '14px', fontWeight: '500', textTransform: 'uppercase', marginRight: '24px'}}>
        Women
        </Link>
        <Link to="#" style={{color: '#374151', textDecoration: 'none', fontSize: '14px', fontWeight: '500', textTransform: 'uppercase', marginRight: '24px'}}>
        Top Wear
        </Link>
        <Link to="#" style={{color: '#374151', textDecoration: 'none', fontSize: '14px', fontWeight: '500', textTransform: 'uppercase'}}>
        Bottom Wear
        </Link>
      </div>
      {/*Right-Icons & Search & Hamburger */}
      <div className="flex items-center space-x-4">
        <Link to="/login" style={{color: '#374151', textDecoration: 'none', marginRight: '16px'}}>
          <HiOutlineUser className="h-6 w-6 text-gray-700"/>
        </Link>
        <button 
          onClick={toggleCartDrawer}
          className="relative hover:text-black"
        >
          <HiOutlineShoppingBag className="h-6 w-6 text-gray-700"/>
          <span className="absolute -top-1 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
            4
          </span>
        </button>
        {/*search bar*/}
        <div className="overflow-hidden">
          <SearchBar />
        </div>

        <button onClick={toggleNavDrawer} className="md:hidden">
          <RxHamburgerMenu className="h-6 w-6 text-gray-700" />
        </button>
      </div>   
    </nav>
    <CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer}/>

    {/* Mobile Navigation */}
    <div className={`fixed top-0 left-0 w-3/4 sm:w-1/3 h-full bg-white shadow-lg transform transition-transform duration-300 z-50 ${navDrawerOpen ? 'translate-x-0' : '-translate-x-full'}`}
    >
      <div className="flex justify-end p-4">
        <button onClick={toggleNavDrawer}>
          <IoMdClose className="h-6 w-6 text-gray-600" />
        </button>
      </div>
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Menu</h2>
        <nav className="space-y-4">
          <Link to="#" onClick={toggleNavDrawer} className="block text-gray-600 hover:text-black">Men</Link>
          <Link to="#" onClick={toggleNavDrawer} className="block text-gray-600 hover:text-black">Women</Link>
          <Link to="#" onClick={toggleNavDrawer} className="block text-gray-600 hover:text-black">Top Wear</Link>
          <Link to="#" onClick={toggleNavDrawer} className="block text-gray-600 hover:text-black">Bottom Wear</Link>
        </nav>
      </div>
      
    </div>
    </>
  )
}

export default Navbar
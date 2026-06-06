import { Link } from 'react-router-dom'
import { HiOutlineUser , HiOutlineShoppingBag} from 'react-icons/hi'
import { RxHamburgerMenu } from "react-icons/rx";
import SearchBar from './SearchBar';

const Navbar = () => {
  return (
    <nav style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', maxWidth: '1200px', margin: '0 auto'}}>
      {/*Left -Logo*/}
      <div>
        <Link to="/" style={{fontSize: '24px', fontWeight: '500', textDecoration: 'none', color: 'black'}}>
          T Hub 
        </Link>
      </div>
      <div style={{display: 'none'}}>
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
        <Link to="/profile" style={{color: '#374151', textDecoration: 'none', marginRight: '16px'}}>
          <HiOutlineUser className="h-6 w-6 text-gray-700"/>
        </Link>
        <button className="relative hover:text-black">
          <HiOutlineShoppingBag className="h-6 w-6 text-gray-700"/>
          <span className="absolute -top-1 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
            4
          </span>
        </button>
        {/*search bar*/}
        <div className="overflow-hidden">
          <SearchBar />
        </div>

        <button className="md:hidden">
          <RxHamburgerMenu className="h-6 w-6 text-gray-700" />
        </button>
      </div>   
    </nav>
  )
}

export default Navbar
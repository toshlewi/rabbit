import { TbBrandMeta } from 'react-icons/tb'
import { IoLogoInstagram } from 'react-icons/io'
import { RiTwitterXLine } from 'react-icons/ri'

const TopBar = () => {
  return (
    <div className="bg-[#ea2e0e] text-white">
      <div className="flex justify-between items-center px-6 py-3 max-w-[1200px] mx-auto">
        <div className="hidden md:flex justify-center">
            <a href="#" style={{color: 'white'}}>
                <TbBrandMeta style={{height: '20px', width: '20px'}}/>
            </a> 
            <a href="#" style={{color: 'white', marginLeft: '16px'}}>
                <IoLogoInstagram style={{height: '20px', width: '20px'}}/>
            </a> 
            <a href="#" style={{color: 'white', marginLeft: '16px'}}>
                <RiTwitterXLine style={{height: '16px', width: '16px'}}/>
            </a> 
        </div>
        <div className="text-center flex-1 text-sm">
            <span>We ship Worldwide - Fast and Reliable Shipping!</span>
        </div>
        <div className="hidden md:block text-sm">
            <a href="tel:+254711527211" style={{color: 'white'}}>
                +254711527211
            </a>
        </div>
      </div>
    </div>
  )
}

export default TopBar
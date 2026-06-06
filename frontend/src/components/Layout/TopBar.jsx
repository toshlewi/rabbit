import React from 'react'
import { TbBrandMeta } from 'react-icons/tb'
import { IoLogoInstagram } from 'react-icons/io'
import { RiTwitterXLine } from 'react-icons/ri'

const TopBar = () => {
  return (
    <div style={{backgroundColor: '#ea2e0e', color: 'white'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 24px', maxWidth: '1200px', margin: '0 auto'}}>
        <div style={{display: 'flex', alignItems: 'center'}}>
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
        <div style={{fontSize: '14px', textAlign: 'center'}}>
            <span>We ship Worldwide - Fast and Reliable Shipping!</span>
        </div>
        <div style={{fontSize: '14px'}}>
            <a href="tel:+254711527211" style={{color: 'white'}}>
                +254711527211
            </a>
        </div>
      </div>
    </div>
  )
}

export default TopBar
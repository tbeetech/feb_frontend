import React from 'react'
import { Link } from 'react-router-dom'
import bannerImg from '../../assets/header.png'
const Banner = () => {
  return (
    <div className="section__container header__container">
        <div className="header__content z-30">
        <h4 className='uppercase'>UP TO 30% Discount on</h4>
        <h1>Ladies Fashion</h1>
        <p>Discover the latest trends and express your unique style @febluxury. Explore a curated collection of clothing accessories that
caters to every taste and occasion.</p>
        <button className="btn"><Link to="/shop">EXPLORE NOW</Link></button>
        </div>
        <div className="header__images">
            <img src={bannerImg} alt="banner img" />
        </div>
    </div>
  )
}

export default Banner
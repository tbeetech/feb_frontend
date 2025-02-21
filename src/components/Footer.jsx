import React from 'react'
import instaImg1 from '../assets/instagram-1.jpg'
import instaImg2 from '../assets/instagram-2.jpg'
import instaImg3 from '../assets/instagram-3.jpg'
import instaImg4 from '../assets/instagram-4.jpg'
import instaImg5 from '../assets/instagram-5.jpg'
import instaImg6 from '../assets/instagram-6.jpg'
import { FaTelegram, FaWhatsapp, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  const linkStyle = {
    color: 'inherit',
    textDecoration: 'none',
    transition: 'color 0.3s ease',
    cursor: 'pointer'
  };

  const contactLinkStyle = {
    ...linkStyle,
    display: 'inline-block',
    marginLeft: '8px'
  };

  const socialLinkStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#333',
    textDecoration: 'none',
    transition: 'color 0.3s ease',
    marginBottom: '0.5rem'
  };

  return (
    <>
    <footer className='section__container footer__container'>
        <div className='footer__col'>
            <h4>Contact INFO</h4>
            <p>
                <span> <i className='ri-map-pin-2-fill'></i></span>
                <a 
                  href="https://maps.google.com/?q=House 4, 7th Avenue, Ocean Palm Estate. Sangotedo Ajah Lagos" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={contactLinkStyle}
                >
                    House 4, 7th Avenue, Ocean Palm Estate. Sangotedo Ajah Lagos.
                </a>
            </p>
            <p>
                <span><i className='ri-mail-fill'></i></span>
                <a 
                  href="mailto:ajibikeobembe6@gmail.com"
                  style={contactLinkStyle}
                >
                    ajibikeobembe6@gmail.com
                </a>
            </p>
            <p>
                <span><i className='ri-phone-fill'></i></span>
                <a 
                  href="tel:+2348033825144"
                  style={contactLinkStyle}
                >
                    +2348033825144
                </a>
            </p>
        </div>
        <div className='footer__col'>
            <h4>COMPANY</h4>
            <a href="/">Home</a>
            <a href="/">About us</a>
            <a href="/">Terms & Conditions</a>

        </div>
        <div className='footer__col'>
            <h4>USEFUL LINK</h4>
            <a href="/">Help</a>
            <a href="/">Track your order</a>
            <a href="/">Dresses</a>
        </div>
        <div className='footer__col'>
            <h4>INSTAGRAM</h4>
            <div className='instagram__grid'>
                <img src={instaImg1} alt="" />
                <img src={instaImg2} alt="" />
                <img src={instaImg3} alt="" />
                <img src={instaImg4} alt="" />
                <img src={instaImg5} alt="" />
                <img src={instaImg6} alt="" />
            </div>

        </div>
        <div className='footer__col'>
            <h4>CONNECT WITH US</h4>
            <div className='flex flex-col gap-3'>
              <a 
                href="https://t.me/febluxury" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-blue-500 transition-colors"
              >
                <FaTelegram className="text-xl" />
                <span>Telegram</span>
              </a>
              
              <a 
                href="https://wa.me/message/NP6XO5SXNXG5G1" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-green-500 transition-colors"
              >
                <FaWhatsapp className="text-xl" />
                <span>WhatsApp</span>
              </a>
              
              <a 
                href="https://www.instagram.com/f.e.b_luxurycloset?utm_source=qr&igsh=MWVrYjNoM3Zxcmp5cA==" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-pink-500 transition-colors"
              >
                <FaInstagram className="text-xl" />
                <span>F.E.B Luxury Closet</span>
              </a>
              
              <a 
                href="https://www.instagram.com/jumiescent?igsh=MTh1ODZrc3h0ZXhrcg==" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-pink-500 transition-colors"
              >
                <FaInstagram className="text-xl" />
                <span>Jumiescent</span>
              </a>
            </div>
        </div>

    </footer>
    <div className='footer__bar'>
        Copyright &copy; 2025 febluxury. All rights reserved.
    </div>
    </>
  )
}

export default Footer
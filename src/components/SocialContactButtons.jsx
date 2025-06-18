import React from 'react';
import PropTypes from 'prop-types';

const SocialContactButtons = ({ productName }) => {
    const encodedMessage = encodeURIComponent(`Hi, I'm interested in ${productName}`);
    
    const socialLinks = {
        whatsapp1: `https://wa.me/message/NP6XO5SXNXG5G1?text=${encodedMessage}`,
        whatsapp2: `https://wa.me/2348088690856?text=${encodedMessage}`,
        telegram: `https://t.me/febluxury`,
        instagram1: `https://www.instagram.com/f.e.b_luxuryclosetbackup1`,
        instagram2: `https://www.instagram.com/jumiescent_backup`
    };

    return (
        <div className="flex gap-4 justify-center mt-4">
            <a
                href={socialLinks.whatsapp1}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-700"
                title="Primary WhatsApp"
            >
                <i className="ri-whatsapp-line text-2xl"></i>
            </a>
            <a
                href={socialLinks.whatsapp2}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-700"
                title="Secondary WhatsApp"
            >
                <i className="ri-whatsapp-line text-2xl"></i>
            </a>
            <a
                href={socialLinks.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600"
            >
                <i className="ri-telegram-line text-2xl"></i>
            </a>
            <a
                href={socialLinks.instagram1}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-600 hover:text-pink-700"
                title="Primary Instagram"
            >
                <i className="ri-instagram-line text-2xl"></i>
            </a>
            <a
                href={socialLinks.instagram2}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-600 hover:text-pink-700"
                title="Secondary Instagram"
            >
                <i className="ri-instagram-line text-2xl"></i>
            </a>
        </div>
    );
};

SocialContactButtons.propTypes = {
    productName: PropTypes.string.isRequired
};

export default SocialContactButtons;

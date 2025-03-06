import React from 'react';

const SocialContactButtons = ({ productName }) => {
    const encodedMessage = encodeURIComponent(`Hi, I'm interested in ${productName}`);
    
    const socialLinks = {
        whatsapp: `https://wa.me/+2348142396594?text=${encodedMessage}`,
        telegram: `https://t.me/febluxury`,
        instagram: `https://www.instagram.com/feb_luxury`
    };

    return (
        <div className="flex gap-4 justify-center mt-4">
            <a
                href={socialLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-700"
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
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-600 hover:text-pink-700"
            >
                <i className="ri-instagram-line text-2xl"></i>
            </a>
        </div>
    );
};

export default SocialContactButtons;

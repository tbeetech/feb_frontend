import React, { useState, useEffect } from 'react';

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <>
            {isVisible && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-20 right-4 p-2 bg-primary hover:bg-primary-dark text-white rounded-full shadow-lg transition-all duration-300 z-50"
                    aria-label="Scroll to top"
                >
                    <span className="material-icons text-xl">arrow_upward</span>
                </button>
            )}
        </>
    );
};

export default ScrollToTop;

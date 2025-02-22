import React from 'react';

const PromoBanner = () => {
  return (
    <section className="section__container banner__container grid grid-cols-1 md:grid-cols-3 gap-6 py-12">
      <div className="banner__card bg-white p-6 rounded-lg shadow-lg text-center">
        <span className="text-primary text-4xl"><i className="ri-truck-line"></i></span>
        <h4 className="text-2xl font-bold mt-4">Free Delivery</h4>
        <p className="text-gray-600 mt-2">Offers convenience and the ability to shop from anywhere, anytime.</p>
      </div>
      <div className="banner__card bg-white p-6 rounded-lg shadow-lg text-center">
        <span className="text-primary text-4xl"><i className="ri-money-dollar-circle-line"></i></span>
        <h4 className="text-2xl font-bold mt-4">100% Money Back Guarantee</h4>
        <p className="text-gray-600 mt-2">Need to cancel an order for certain reasons? We've got you covered!</p>
      </div>
      <div className="banner__card bg-white p-6 rounded-lg shadow-lg text-center">
        <span className="text-primary text-4xl"><i className="ri-user-voice-fill"></i></span>
        <h4 className="text-2xl font-bold mt-4">Strong Support</h4>
        <p className="text-gray-600 mt-2">Offers customer support services to assist customers with queries and issues.</p>
      </div>
    </section>
  );
};

export default PromoBanner;
import React from 'react';
import { FaTruck, FaHeadset, FaLock } from 'react-icons/fa';

const PromoBanner = () => {
  return (
    <section className="section__container banner__container grid grid-cols-1 md:grid-cols-3 gap-6 py-12">
      <div className="banner__card bg-white p-6 rounded-lg shadow-lg text-center">
        <span className="text-black text-4xl"><FaTruck className="mx-auto" /></span>
        <h4 className="text-2xl font-bold mt-4">Affordable Delivery</h4>
        <p className="text-gray-600 mt-2">Offers convenience and the ability to shop from anywhere, anytime.</p>
      </div>
     
      <div className="banner__card bg-white p-6 rounded-lg shadow-lg text-center">
        <span className="text-black text-4xl"><FaHeadset className="mx-auto" /></span>
        <h4 className="text-2xl font-bold mt-4">Strong Support</h4>
        <p className="text-gray-600 mt-2">Offers customer support services to assist customers with queries and issues.</p>
      </div>

      <div className="banner__card bg-white p-6 rounded-lg shadow-lg text-center">
        <span className="text-black text-4xl"><FaLock className="mx-auto" /></span>
        <h4 className="text-2xl font-bold mt-4">Secure Transactions</h4>
        <p className="text-gray-600 mt-2">Ensuring your payment and personal information are protected at all times.</p>
      </div>
    </section>
  );
};

export default PromoBanner;
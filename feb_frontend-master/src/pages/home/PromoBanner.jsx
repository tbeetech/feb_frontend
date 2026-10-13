import React from 'react';
import { 
  TbNeedleThread,
  TbRulerMeasure,
  TbCertificate
} from 'react-icons/tb';

const PromoBanner = () => {
  return (
    <section className="container mx-auto px-4 py-14">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-2xl border border-stone-200/80 shadow-sm text-center hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-[#FAF8F5] text-[#0F223D] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#E8C5A5]">
            <TbNeedleThread className="w-7 h-7 text-[#0F223D]" />
          </div>
          <h4 className="text-xl font-serif font-bold text-[#0F223D] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            100% Handcrafted Wears
          </h4>
          <p className="text-stone-600 text-sm leading-relaxed">
            Patiently stitched stitch-by-stitch with premium Egyptian cotton, silk blends, and natural raffia fibers.
          </p>
        </div>
       
        <div className="bg-white p-8 rounded-2xl border border-stone-200/80 shadow-sm text-center hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-[#FAF8F5] text-[#0F223D] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#E8C5A5]">
            <TbRulerMeasure className="w-7 h-7 text-[#0F223D]" />
          </div>
          <h4 className="text-xl font-serif font-bold text-[#0F223D] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            Custom Sizing Concierge
          </h4>
          <p className="text-stone-600 text-sm leading-relaxed">
            Every body is unique. We offer bespoke adjustments and personalized colorway matching via WhatsApp.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-stone-200/80 shadow-sm text-center hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-[#FAF8F5] text-[#0F223D] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#E8C5A5]">
            <TbCertificate className="w-7 h-7 text-[#0F223D]" />
          </div>
          <h4 className="text-xl font-serif font-bold text-[#0F223D] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            Beginner-Friendly Classes
          </h4>
          <p className="text-stone-600 text-sm leading-relaxed">
            Hands-on mentorship and complete DIY starter kits to guide you from first loop to finished wearable heirloom.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
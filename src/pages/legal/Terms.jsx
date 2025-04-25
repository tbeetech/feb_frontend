import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const Terms = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Terms & Conditions</h1>
        <div className="w-24 h-1 bg-black mx-auto mb-12"></div>

        <div className="prose prose-lg max-w-none">
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Welcome to FEB Luxury</h2>
            <p>
              These Terms and Conditions govern your relationship with FEB Luxury ("we," "our," or "us") 
              when you access our website at www.febluxury.com (the "Website"), purchase our products, 
              or engage with our services. By using our Website or purchasing our products, you agree to 
              these Terms and Conditions in their entirety.
            </p>
            <p>
              FEB Luxury offers meticulously curated luxury fashion and lifestyle products that 
              celebrate elegance, quality, and exceptional craftsmanship. Our mission is to provide 
              you with an unparalleled shopping experience, offering exclusive pieces that embody 
              sophistication and timeless style.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">1. Account Creation & Use</h2>
            <p>
              1.1. <strong>Account Registration:</strong> To make purchases or access certain features of our Website, 
              you may need to create an account. You agree to provide accurate, current, and complete 
              information during the registration process and to update such information to keep it 
              accurate, current, and complete.
            </p>
            <p>
              1.2. <strong>Account Security:</strong> You are responsible for maintaining the confidentiality of your 
              account credentials and for all activities that occur under your account. You agree to notify 
              us immediately of any unauthorized use of your account or any other breach of security.
            </p>
            <p>
              1.3. <strong>Account Termination:</strong> We reserve the right to suspend or terminate your account and 
              refuse any and all current or future use of the Website for any reason at our sole discretion, 
              including if we believe that you have violated these Terms and Conditions.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">2. Product Information & Orders</h2>
            <p>
              2.1. <strong>Product Descriptions:</strong> We strive to provide accurate descriptions of our products. 
              However, we do not warrant that product descriptions or other content on the Website are 
              accurate, complete, reliable, current, or error-free. Colors of products may vary slightly 
              from their appearance on the Website due to monitor settings and screen resolutions.
            </p>
            <p>
              2.2. <strong>Order Acceptance:</strong> Your receipt of an order confirmation does not constitute our 
              acceptance of your order. We reserve the right to limit or cancel quantities purchased per 
              person, per household, or per order, or to refuse or cancel any order at any time at our 
              sole discretion.
            </p>
            <p>
              2.3. <strong>Pre-Order Items:</strong> For pre-order items, delivery times are estimated and subject to 
              change. Payment for pre-order items will be processed at the time of order placement, and items 
              will be shipped as soon as they become available, typically within the timeframe specified on 
              the product page.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">3. Payment & Pricing</h2>
            <p>
              3.1. <strong>Pricing:</strong> All prices are shown in the currency selected through our currency 
              switcher and are inclusive of applicable taxes. Shipping costs are calculated and displayed 
              at checkout before you complete your purchase.
            </p>
            <p>
              3.2. <strong>Payment Methods:</strong> We accept various payment methods as indicated at checkout. 
              All credit/debit card information is processed securely through our payment service providers. 
              By providing your payment information, you represent and warrant that you have the legal right 
              to use the payment method utilized.
            </p>
            <p>
              3.3. <strong>Bank Transfers:</strong> For orders paid via bank transfer, your order will be processed 
              once payment confirmation is received. Please include your order number in the transfer 
              reference to expedite this process.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">4. Shipping & Delivery</h2>
            <p>
              4.1. <strong>Delivery Times:</strong> Regular orders are typically delivered within 3 business days, 
              while pre-order items require approximately 14 working days from the order date. These times 
              are estimates and not guaranteed.
            </p>
            <p>
              4.2. <strong>Shipping Fees:</strong> Shipping fees are calculated based on destination, weight, and 
              delivery method. All applicable fees will be clearly displayed during the checkout process.
            </p>
            <p>
              4.3. <strong>International Shipping:</strong> For international orders, you are responsible for all 
              customs duties, taxes, and import fees imposed by your country's authorities. These charges 
              are not included in the purchase price or shipping fees.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">5. Returns & Refunds</h2>
            <p>
              5.1. <strong>Return Eligibility:</strong> Products may be returned within 14 days of delivery if they 
              are in their original, unworn condition with all tags attached. Certain items, including 
              intimate apparel, swimwear, and personalized items, are not eligible for return for hygiene 
              and customization reasons.
            </p>
            <p>
              5.2. <strong>Return Process:</strong> To initiate a return, please contact our customer service team 
              through the Contact page on our Website. You will receive instructions on how to return the 
              item(s), including the shipping address and any return authorization codes required.
            </p>
            <p>
              5.3. <strong>Refunds:</strong> Once your return is received and inspected, we will notify you of the 
              approval or rejection of your refund. If approved, your refund will be processed to the 
              original method of payment within 14 business days.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">6. Intellectual Property</h2>
            <p>
              6.1. <strong>Ownership:</strong> All content on our Website, including text, graphics, logos, images, 
              product designs, and software, is the property of FEB Luxury or its content suppliers and is 
              protected by international copyright, trademark, and other intellectual property laws.
            </p>
            <p>
              6.2. <strong>Limited License:</strong> We grant you a limited, non-exclusive, non-transferable, and 
              revocable license to access and use our Website for personal, non-commercial purposes. This 
              license does not include the right to: modify or copy the materials; use the materials for any 
              commercial purpose; attempt to decompile or reverse engineer any software contained on the Website; 
              remove any copyright or other proprietary notations from the materials; or transfer the materials 
              to another person or "mirror" the materials on any other server.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">7. Privacy & Data Protection</h2>
            <p>
              7.1. <strong>Privacy Policy:</strong> Our Privacy Policy, available at <a href="/privacy" className="text-primary hover:underline">www.febluxury.com/privacy</a>, 
              explains how we collect, use, and protect your personal information. By using our Website or 
              purchasing our products, you consent to the collection and use of your information as described 
              in our Privacy Policy.
            </p>
            <p>
              7.2. <strong>Marketing Communications:</strong> By creating an account or making a purchase, you may 
              opt to receive marketing communications from us. You can opt out of receiving such communications 
              at any time by clicking the unsubscribe link in our emails or contacting our customer service team.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">8. Limitation of Liability</h2>
            <p>
              8.1. <strong>Disclaimer:</strong> The Website and all products are provided on an "as is" and "as available" 
              basis without any warranties of any kind, either express or implied, including but not limited to the 
              implied warranties of merchantability, fitness for a particular purpose, or non-infringement.
            </p>
            <p>
              8.2. <strong>Limitation of Liability:</strong> In no event shall FEB Luxury, its directors, officers, 
              employees, affiliates, agents, contractors, interns, suppliers, service providers, or licensors 
              be liable for any injury, loss, claim, or any direct, indirect, incidental, punitive, special, 
              or consequential damages of any kind, including, without limitation, lost profits, lost revenue, 
              lost savings, loss of data, replacement costs, or any similar damages, whether based in contract, 
              tort (including negligence), strict liability, or otherwise, arising from your use of the Website 
              or any products purchased, or for any other claim related in any way to your use of the Website 
              or any product.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">9. Governing Law & Dispute Resolution</h2>
            <p>
              9.1. <strong>Governing Law:</strong> These Terms and Conditions shall be governed by and construed in 
              accordance with the laws of Nigeria, without regard to its conflict of law provisions.
            </p>
            <p>
              9.2. <strong>Dispute Resolution:</strong> Any dispute arising out of or in connection with these Terms and 
              Conditions, including any question regarding its existence, validity, or termination, shall be 
              referred to and finally resolved by arbitration in accordance with the laws of Nigeria. The seat 
              of arbitration shall be Lagos, Nigeria. The language of the arbitration shall be English.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">10. Changes to Terms & Conditions</h2>
            <p>
              10.1. <strong>Modifications:</strong> We reserve the right to modify these Terms and Conditions at any time, 
              with or without notice. Changes will be effective immediately upon posting on the Website. Your 
              continued use of the Website following the posting of revised Terms and Conditions means that you 
              accept and agree to the changes.
            </p>
            <p>
              10.2. <strong>Notification:</strong> For material changes to these Terms and Conditions, we will make 
              reasonable efforts to notify you by posting a notice on our Website or sending an email to the 
              address associated with your account.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">11. Contact Information</h2>
            <p>
              For questions about these Terms and Conditions, please contact us at:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg my-4">
              <p className="mb-1"><strong>Email:</strong> <a href="mailto:febluxurycloset@gmail.com" className="text-primary hover:underline">febluxurycloset@gmail.com</a></p>
              <p className="mb-1"><strong>WhatsApp:</strong> 
                <a href="https://wa.me/message/NP6XO5SXNXG5G1" className="text-primary hover:underline">Primary WhatsApp</a> | 
                <a href="https://wa.me/2348088690856" className="text-primary hover:underline">Secondary WhatsApp</a>
              </p>
              <p><strong>Instagram:</strong> 
                <a href="https://www.instagram.com/f.e.b_luxuryclosetbackup1" className="text-primary hover:underline">@f.e.b_luxuryclosetbackup1</a> | 
                <a href="https://www.instagram.com/jumiescent_backup" className="text-primary hover:underline">@jumiescent_backup</a>
              </p>
            </div>
          </section>

          <div className="text-center text-gray-500 my-10">
            <p>Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Terms;
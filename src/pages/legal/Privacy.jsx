import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const Privacy = () => {
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
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Privacy Policy</h1>
        <div className="w-24 h-1 bg-black mx-auto mb-12"></div>

        <div className="prose prose-lg max-w-none">
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Our Commitment to Privacy</h2>
            <p>
              At FEB Luxury, we value your privacy and are committed to protecting your personal information. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when 
              you visit our website www.febluxury.com or make purchases from us.
            </p>
            <p>
              We understand the importance of maintaining the confidentiality of your personal information and 
              appreciate your trust in us. This policy applies to all information collected through our website, 
              email, text messages, or other electronic communications sent through or in connection with our services.
            </p>
            <p>
              Please read this Privacy Policy carefully. By accessing our website or making purchases, you 
              agree to the collection and use of information in accordance with this policy.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
            <p>
              We collect various types of information to provide and improve our services to you.
            </p>
            <h3 className="text-xl font-semibold mt-6 mb-3">1.1 Personal Information</h3>
            <p>
              When you create an account, place an order, subscribe to our newsletter, or engage with our 
              customer service, we may collect:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Contact information (name, email address, phone number, shipping and billing address)</li>
              <li>Account information (username, password)</li>
              <li>Payment information (credit card details, bank information)</li>
              <li>Transaction information (products purchased, order value, purchase date)</li>
              <li>Communication preferences</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">1.2 Usage Information</h3>
            <p>
              When you browse our website, we may automatically collect:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Device information (device type, operating system, browser type)</li>
              <li>IP address</li>
              <li>Browsing behavior (pages viewed, time spent on pages, clicks)</li>
              <li>Referral sources</li>
              <li>Geographic location</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">1.3 Cookies and Similar Technologies</h3>
            <p>
              We use cookies and similar tracking technologies to track activity on our website and store 
              certain information. Cookies are files with a small amount of data which may include an 
              anonymous unique identifier. You can instruct your browser to refuse all cookies or to 
              indicate when a cookie is being sent.
            </p>
            <p>
              These technologies help us improve your shopping experience by:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Remembering your preferences and settings</li>
              <li>Keeping track of items in your shopping cart</li>
              <li>Understanding how you use our website</li>
              <li>Tailoring our marketing to your interests</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
            <p>
              We use the information we collect for various purposes, including:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>
                <strong>Providing Services:</strong> Processing orders, delivering products, managing your account, 
                and providing customer support.
              </li>
              <li>
                <strong>Personalization:</strong> Tailoring our website and product offerings to your preferences 
                and providing personalized recommendations.
              </li>
              <li>
                <strong>Communication:</strong> Sending order confirmations, shipping updates, newsletters, 
                promotional materials, and responding to your inquiries.
              </li>
              <li>
                <strong>Improvement:</strong> Analyzing website usage to enhance user experience, develop new 
                products, and improve our services.
              </li>
              <li>
                <strong>Security:</strong> Protecting against fraud, unauthorized transactions, and ensuring the 
                security of our website and your information.
              </li>
              <li>
                <strong>Legal Compliance:</strong> Complying with applicable laws, regulations, and legal processes.
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">3. Sharing Your Information</h2>
            <p>
              We may share your information with third parties in the following circumstances:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>
                <strong>Service Providers:</strong> We engage trusted third parties to perform services on our 
                behalf, such as payment processing, shipping, marketing, analytics, and customer service. These 
                providers have access to your information only to perform these tasks and are obligated to 
                protect your information.
              </li>
              <li>
                <strong>Business Transfers:</strong> If FEB Luxury is involved in a merger, acquisition, or sale 
                of all or a portion of its assets, your information may be transferred as part of that transaction.
              </li>
              <li>
                <strong>Legal Requirements:</strong> We may disclose your information if required to do so by law 
                or in response to valid requests by public authorities.
              </li>
              <li>
                <strong>Protection:</strong> We may share information to protect the rights, property, or safety 
                of FEB Luxury, our customers, or others.
              </li>
            </ul>
            <p>
              We do not sell, rent, or lease your personal information to third parties for their marketing purposes.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">4. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect the security of your 
              personal information. However, please note that no method of transmission over the Internet or 
              electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
            <p>
              Our security measures include:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Encrypted data transmission using SSL technology</li>
              <li>Secure payment processing</li>
              <li>Regular security assessments</li>
              <li>Limited access to personal information by authorized personnel</li>
              <li>Physical, electronic, and procedural safeguards</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">5. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to fulfill the purposes described 
              in this Privacy Policy, unless a longer retention period is required or permitted by law. When 
              determining how long to retain information, we consider:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>The nature of the information</li>
              <li>Our legal and contractual obligations</li>
              <li>Accounting, tax, and regulatory requirements</li>
              <li>Whether retention is advisable in light of our legal position</li>
            </ul>
            <p>
              When we no longer need your personal information, we will dispose of it securely.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">6. Your Privacy Rights</h2>
            <p>
              Depending on your location, you may have certain rights regarding your personal information, which may include:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>
                <strong>Access:</strong> You have the right to request copies of your personal information that we hold.
              </li>
              <li>
                <strong>Correction:</strong> You have the right to request that we correct any information you believe is inaccurate or complete information you believe is incomplete.
              </li>
              <li>
                <strong>Deletion:</strong> You have the right to request that we erase your personal information in certain circumstances.
              </li>
              <li>
                <strong>Restriction:</strong> You have the right to request that we restrict the processing of your personal information in certain circumstances.
              </li>
              <li>
                <strong>Portability:</strong> You have the right to request that we transfer the data we have collected to another organization or directly to you in certain circumstances.
              </li>
              <li>
                <strong>Objection:</strong> You have the right to object to our processing of your personal information in certain circumstances.
              </li>
            </ul>
            <p>
              To exercise any of these rights, please contact us using the information provided in the "Contact Us" section below.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">7. Marketing Communications</h2>
            <p>
              You may opt out of receiving marketing communications from us by:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Clicking the "unsubscribe" link in our emails</li>
              <li>Updating your communication preferences in your account settings</li>
              <li>Contacting our customer service team</li>
            </ul>
            <p>
              Please note that even if you opt out of marketing communications, we may still send you transactional 
              or administrative messages, such as order confirmations, shipping updates, and account notifications.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">8. Children's Privacy</h2>
            <p>
              Our website is not intended for children under the age of 18. We do not knowingly collect personal 
              information from children. If you are a parent or guardian and believe your child has provided us 
              with personal information, please contact us, and we will delete such information from our records.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">9. International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries other than the country in which 
              you reside. These countries may have data protection laws different from those in your country.
            </p>
            <p>
              If we transfer your personal information across international borders, we will take steps to ensure 
              that your information is protected and that the transfer is conducted in accordance with applicable 
              data protection laws.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">10. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting 
              the new Privacy Policy on this page and updating the "Last Updated" date.
            </p>
            <p>
              We encourage you to review this Privacy Policy periodically for any changes. Changes to this 
              Privacy Policy are effective when they are posted on this page.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">11. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg my-4">
              <p className="mb-1"><strong>Email:</strong> <a href="mailto:febluxurycloset@gmail.com" className="text-primary hover:underline">febluxurycloset@gmail.com</a></p>
              <p className="mb-1"><strong>WhatsApp:</strong> <a href="https://wa.me/message/NP6XO5SXNXG5G1" className="text-primary hover:underline">Click here to message us</a></p>
              <p><strong>Instagram:</strong> <a href="https://www.instagram.com/f.e.b_luxuryclosetbackup1" className="text-primary hover:underline">@f.e.b_luxuryclosetbackup1</a></p>
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

export default Privacy; 
// src/components/checkout/Checkout.jsx

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { FaExternalLinkAlt, FaArrowLeft, FaEnvelope, FaWhatsapp } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import { formatReceiptNumber } from '../../utils/formatters';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { clearCart } from '../../redux/features/cart/cartSlice';
import { motion } from 'framer-motion';

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const { deliveryFee, grandTotal } = useSelector((state) => state.cart);

  //
  // ── GOOGLE ADS GLOBAL SITE TAG + EVENT SNIPPET ───────────────────────────────────────
  //
  useEffect(() => {
    // 1) Load gtag.js
    const scriptTag = document.createElement('script');
    scriptTag.async = true;
    scriptTag.src = 'https://www.googletagmanager.com/gtag/js?id=AW-392022807';
    document.head.appendChild(scriptTag);

    // 2) Initialize dataLayer & gtag()
    window.dataLayer = window.dataLayer || [];
    function gtag(){ window.dataLayer.push(arguments); }
    window.gtag = window.gtag || gtag;
    window.gtag('js', new Date());
    window.gtag('config', 'AW-392022807');

    // 3) Conversion event function
    window.gtag_report_conversion = function(url) {
      var callback = function() {
        if (typeof url !== 'undefined') {
          window.location = url;
        }
      };
      window.gtag('event', 'conversion', {
        send_to: 'AW-392022807/qiRNCJ-iksIaEJeW97oB',
        transaction_id: '',
        event_callback: callback,
      });
      return false;
    };
  }, []);

  // ── ORDER DETAILS FROM NAVIGATION STATE ────────────────────────────────────────────
  const billingDetails = location.state?.billingDetails;
  const cartItems     = location.state?.cartItems || [];
  const cartTotal     = location.state?.total;
  const subtotal      = location.state?.subtotal;
  const isPreOrder    = location.state?.isPreOrder;
  const deliveryDate  = location.state?.deliveryDate;

  // ── REDIRECT IF NO BILLING/ITEMS ──────────────────────────────────────────────────
  useEffect(() => {
    if (!billingDetails || cartItems.length === 0) {
      toast.error("Please complete your billing information first");
      navigate('/billing-details');
    }
  }, [billingDetails, cartItems, navigate]);

  // ── LOCAL COMPONENT STATE ─────────────────────────────────────────────────────────
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage,   setShowErrorMessage]   = useState(false);
  const [errorDetails,       setErrorDetails]       = useState('');
  const [isGenerating,       setIsGenerating]       = useState(false);
  const [pdfUrl,             setPdfUrl]             = useState('');
  const receiptRef = useRef(null);

  // ── CALCULATE SUBTOTAL & TOTAL ────────────────────────────────────────────────────
  const calculateCartTotal = (items) =>
    items.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

  const cartItemsTotal     = useMemo(() => calculateCartTotal(cartItems), [cartItems]);
  const calculatedSubtotal = subtotal || cartItemsTotal;
  const calculatedCartTotal =
    cartTotal ?? grandTotal ?? (calculatedSubtotal + deliveryFee);

  // ── CLEAN UP PDF URL ON UNMOUNT ────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  // ── ENSURE CART IS NOT EMPTY ──────────────────────────────────────────────────────
  useEffect(() => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty. Please add items before checkout.");
      navigate('/shop');
    }
  }, [cartItems, navigate]);

  const showErrorMessageWithTimeout = (details = '') => {
    setErrorDetails(details);
    setShowErrorMessage(true);
    setTimeout(() => setShowErrorMessage(false), 5000);
  };

  // ── PDF GENERATION ────────────────────────────────────────────────────────────────
  const generateAndDownloadPDF = async (event, details, totalAmount, receiptNumber) => {
    if (event) event.preventDefault();
    setIsGenerating(true);

    try {
      // Calculate subtotal for PDF
      const subtotalCalc = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      // Create new jsPDF doc
      const doc = new jsPDF();
      const pageWidth  = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin     = 15;

      // Metadata & Header
      doc.setProperties({
        title:   `Feb Luxury - Receipt ${receiptNumber}`,
        subject: 'Order Receipt',
        author:  'FEB Luxury',
        creator: 'FEB Luxury E-commerce',
      });
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text("FEB LUXURY", pageWidth / 2, 20, { align: 'center' });
      doc.setFontSize(12);
      doc.text("ORDER RECEIPT", pageWidth / 2, 30, { align: 'center' });

      // Receipt & Date
      doc.setFont('helvetica', 'normal').setFontSize(9);
      doc.text(`Receipt No.: FEB-${receiptNumber}`, margin, 40);
      const today = new Date();
      doc.text(`Order Date: ${today.toLocaleDateString()}`, margin, 45);

      // Bill To
      if (details) {
        doc.text("BILL TO:", pageWidth - margin - 50, 40);
        doc.text(`${details.firstName} ${details.lastName}`,   pageWidth - margin - 50, 45);
        doc.text(details.email,                               pageWidth - margin - 50, 50);
        doc.text(details.phone,                               pageWidth - margin - 50, 55);
        doc.text(`${details.address}, ${details.city}`,       pageWidth - margin - 50, 60);
        doc.text(`${details.state}, Nigeria`,                 pageWidth - margin - 50, 65);
      }

      // Expected Delivery
      const deliveryDays           = isPreOrder ? 14 : 3;
      const expectedDeliveryDate   = new Date(today.getTime() + deliveryDays * 24 * 60 * 60 * 1000);
      doc.text(
        `Expected Delivery: ${expectedDeliveryDate.toLocaleDateString()} (${isPreOrder ? '14 working days' : '3 business days'})`,
        margin,
        50
      );

      // Line & Table Headers
      doc.line(margin, 70, pageWidth - margin, 70);
      doc.setFont('helvetica','bold');
      doc.text("Item Detail", margin, 80);
      doc.text("Qty",        110,    80);
      doc.text("Price",      130,    80);
      doc.text("Total",      160,    80);
      doc.line(margin, 85, pageWidth - margin, 85);

      // Table Rows
      doc.setFont('helvetica','normal');
      let yPos = 95;
      cartItems.forEach(item => {
        const detailsArr = [item.name];
        if (item.selectedSize)  detailsArr.push(`Size: ${item.selectedSize}`);
        if (item.selectedColor) detailsArr.push(`Color: ${item.selectedColor}`);

        doc.text(detailsArr.join(', '), margin, yPos);
        doc.text(item.quantity.toString(), 110, yPos);
        doc.text(`₦${item.price.toLocaleString()}`, 130, yPos);
        doc.text(`₦${(item.price * item.quantity).toLocaleString()}`, 160, yPos);
        yPos += 10;

        // New page if overflow
        if (yPos > pageHeight - 50) {
          doc.addPage();
          yPos = 20;
        }
      });

      // Totals
      doc.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 10;
      doc.text("Subtotal:",     130, yPos);
      doc.text(`₦${subtotalCalc.toLocaleString()}`, 160, yPos);
      yPos += 8;
      doc.text("Shipping:",     130, yPos);
      doc.text(`₦${deliveryFee.toLocaleString()}`, 160, yPos);
      yPos += 8;
      doc.setFont('helvetica','bold');
      doc.text("Total Amount:", 130, yPos);
      doc.text(`₦${totalAmount.toLocaleString()}`, 160, yPos);

      // Payment Details
      yPos += 20;
      doc.text("Payment Details:", margin, yPos);
      yPos += 10;
      doc.text("Payment method: Bank Transfer", margin, yPos);
      yPos += 8;
      doc.text("Account Name: Jumoke Obembe", margin, yPos);
      yPos += 8;
      doc.text("Account Number: 0038685089", margin, yPos);
      yPos += 8;
      doc.text("Bank Name: Stanbic IBTC Bank", margin, yPos);

      // Footer
      yPos = pageHeight - 15;
      doc.setFontSize(8);
      doc.text("Thank you for shopping with F.E.B Luxury!", pageWidth/2, yPos,      { align: 'center' });
      doc.text("For inquiries, contact: febluxurycloset@gmail.com", pageWidth/2, yPos+5, { align: 'center' });
      doc.text("Visit us at: www.febluxury.com",                    pageWidth/2, yPos+10, { align: 'center' });

      // Output PDF blob & URL
      let pdfBlob;
      try {
        pdfBlob = doc.output('blob');
      } catch {
        const buf = doc.output('arraybuffer');
        pdfBlob = new Blob([buf], { type: 'application/pdf' });
      }
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
      return { doc, pdfBlob };
    } catch (error) {
      console.error('PDF generation error:', error);
      setIsGenerating(false);
      toast.error('Error generating receipt. Please try again or contact support.');
      return null;
    }
  };

  // ── EMAIL RECEIPT SENDER ───────────────────────────────────────────────────────────
  const sendEmailReceipt = async (email, totalAmount, pdfBlob, receiptNumber) => {
    try {
      const formData = new FormData();
      formData.append('receipt', new Blob([pdfBlob], { type: 'application/pdf' }), `receipt-${receiptNumber}.pdf`);
      formData.append('receiptNumber', receiptNumber);
      formData.append('customerName', billingDetails ? `${billingDetails.firstName} ${billingDetails.lastName}`.trim() : 'Customer');
      formData.append('customerEmail', email);
      formData.append('orderDate', new Date().toLocaleDateString());
      formData.append('totalAmount', totalAmount.toString());
      const images = cartItems.filter(i => !!i.image).map(i => i.image);
      formData.append('productImages', JSON.stringify(images));
      formData.append('adminEmails',    JSON.stringify(['febluxurycloset@gmail.com']));

      await axios.post('https://feb-backend.vercel.app/api/send-receipt-email', formData, {
        headers:        { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      toast.success('Order confirmation emailed successfully');
      return true;
    } catch (err) {
      console.error('Email send error:', err);
      toast.error('Email delivery failed, but your order is confirmed. Please download your receipt.');
      return true;
    }
  };

  // ── CALCULATE DELIVERY DATE ────────────────────────────────────────────────────────
  const calculateDeliveryDate = (stockStatus) => {
    const addBusinessDays = (date, days) => {
      let d = new Date(date), added = 0;
      while (added < days) {
        d.setDate(d.getDate() + 1);
        if (d.getDay() !== 0 && d.getDay() !== 6) added++;
      }
      return d;
    };
    return stockStatus === 'Pre Order'
      ? addBusinessDays(new Date(), 14)
      : addBusinessDays(new Date(), 3);
  };

  const expectedDeliveryDate = calculateDeliveryDate(cartItems[0]?.stockStatus || 'In Stock');
  const receiptNumber        = formatReceiptNumber();

  // ── HANDLE CHECKOUT COMPLETE ──────────────────────────────────────────────────────
  const handleCheckoutComplete = async () => {
    // Fire conversion event first
    if (window.gtag_report_conversion) {
      window.gtag_report_conversion();
    }

    setIsGenerating(true);
    try {
      const result = await generateAndDownloadPDF(null, billingDetails, calculatedCartTotal, receiptNumber);
      if (!result) {
        toast.success('Order placed! Check your email for payment instructions.');
        setShowSuccessMessage(true);
        setIsGenerating(false);
        return;
      }
      const { pdfBlob } = result;

      // Create order in backend (best-effort)
      try {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/orders/create`,
          {
            orderNumber:           `FEB-${receiptNumber}`,
            userId:                user?._id,
            items:                 cartItems.map(i => ({
              product:       i._id,
              quantity:      i.quantity,
              price:         i.price,
              selectedSize:  i.selectedSize,
              selectedColor: i.selectedColor,
            })),
            totalAmount:           calculatedCartTotal,
            shippingAddress:       `${billingDetails.address}, ${billingDetails.city}, ${billingDetails.state}`,
            status:                'pending',
            expectedDeliveryDate:  deliveryDate,
            paymentStatus:         'awaiting_payment',
          },
          {
            headers:       { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
          }
        );
      } catch {}

      // Send receipt email
      if (billingDetails?.email && pdfBlob) {
        await sendEmailReceipt(billingDetails.email, calculatedCartTotal, pdfBlob, receiptNumber);
        dispatch(clearCart());
        setShowSuccessMessage(true);
        setPdfUrl(null);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      showErrorMessageWithTimeout('Processing error. Your order may still be complete.');
      toast.success('Order received! There was an issue generating your receipt.');
      setShowSuccessMessage(true);
    } finally {
      setIsGenerating(false);
    }
  };

  // ── RENDER ────────────────────────────────────────────────────────────────────────
  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      {/* Processing Overlay */}
      {isGenerating && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999]">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg p-8 max-w-sm w-full text-center shadow-xl"
          >
            <div className="relative w-16 h-16 mx-auto mb-4">
              <div className="absolute inset-0 rounded-full border-4 border-gold/30"></div>
              <div className="absolute inset-0 rounded-full border-4 border-gold border-t-transparent animate-spin"></div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Processing Order</h3>
            <p className="text-gray-600">Please wait while we generate your invoice...</p>
          </motion.div>
        </div>
      )}

      {/* Success Message */}
      {showSuccessMessage && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-xl"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            <motion.div
              className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-6"
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", duration: 0.5, delay: 0.2 }}
            >
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <motion.path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.5 }}
                />
              </svg>
            </motion.div>
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2 text-gray-800">Order Successfully Placed!</h2>
              <p className="text-gray-600 mb-6">Thank you for shopping with FEB Luxury</p>
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Order Number:</span>
                    <span className="text-sm font-medium">FEB-{receiptNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Expected Delivery:</span>
                    <span className="text-sm font-medium">{deliveryDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Amount:</span>
                    <span className="text-sm font-medium">₦{calculatedCartTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 text-left">
                <h3 className="font-medium text-yellow-800 mb-2">Next Steps:</h3>
                <ol className="list-decimal list-inside text-sm text-gray-700 space-y-2 ml-1">
                  <li>Check your email for payment instructions</li>
                  <li>Complete the bank transfer using the provided details</li>
                  <li>Forward your payment proof via WhatsApp</li>
                  <li>Wait for order processing confirmation</li>
                </ol>
              </div>
              <div className="text-sm text-gray-600 mb-6">
                Questions? Contact us:
                <div className="flex items-center justify-center gap-4 mt-2">
                  <a href="mailto:febluxurycloset@gmail.com" className="inline-flex items-center hover:text-gray-800">
                    <FaEnvelope className="mr-2"/>Email
                  </a>
                  <a href="https://wa.me/message/NP6XO5SXNXG5G1" target="_blank" rel="noopener noreferrer" className="inline-flex items-center hover:text-green-700">
                    <FaWhatsapp className="mr-2"/>WhatsApp
                  </a>
                </div>
              </div>
              <div className="flex gap-3 justify-center">
                <Link to="/shop" className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 flex items-center">
                  Continue Shopping
                </Link>
                {pdfUrl && (
                  <a href={pdfUrl} download={`FEB_LUXURY_Receipt_${receiptNumber}.pdf`} className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center">
                    <FaExternalLinkAlt className="mr-2"/>Download Receipt
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Error Message */}
      {showErrorMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-md shadow-lg z-50">
          <p>{errorDetails || 'Error processing your order. Please try again.'}</p>
        </div>
      )}

      {/* Back Link */}
      <div className="mb-6">
        <Link to="/billing-details" className="inline-flex items-center text-gray-600 hover:text-black text-sm">
          <FaArrowLeft className="mr-2"/>Back to Billing Details
        </Link>
      </div>

      {/* Main Checkout Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Complete Your Order</h1>

        {/* Order Summary */}
        <div className="mb-6">
          <div className="overflow-x-auto">
            <table className="w-full min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {cartItems.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-4 flex items-center">
                      <div className="h-16 w-16 mr-4 bg-gray-100 rounded-md overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                          onError={e => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/64?text=Product';
                          }}
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {item.selectedSize && <p>Size: {item.selectedSize}</p>}
                      {item.selectedColor && (
                        <div className="flex items-center mt-1">
                          <span className="mr-1">Color:</span>
                          <div
                            className="w-4 h-4 rounded-full border border-gray-300"
                            style={{ backgroundColor: item.selectedColor }}
                          />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 text-right font-medium">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">₦{calculatedSubtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">₦{deliveryFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t mt-2 py-3 text-lg font-bold">
              <span>Total</span>
              <span>₦{calculatedCartTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Complete Order */}
        <div ref={receiptRef} className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-4">Complete Order</h2>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <h3 className="font-medium text-yellow-800 mb-2">How it works:</h3>
            <ol className="list-decimal list-inside text-sm text-gray-700 space-y-2 ml-2">
              <li>Click the button below to generate your payment invoice</li>
              <li>Make a bank transfer using the account details in the email we’ll send you</li>
              <li>Forward your proof of payment as instructed in the email</li>
              <li>Your order will be processed once payment is confirmed</li>
            </ol>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleCheckoutComplete}
              disabled={isGenerating}
              className="flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Processing order...
                </>
              ) : (
                <>
                  <FaEnvelope className="mr-2" />
                  Generate Payment Invoice & Place Order
                </>
              )}
            </button>
            {pdfUrl && (
              <a
                href={pdfUrl}
                download={`FEB_Luxury_Receipt_${receiptNumber}.pdf`}
                className="flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-white text-black border border-black rounded-md hover:bg-gray-100"
              >
                <FaExternalLinkAlt className="mr-2" />
                Download Receipt
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

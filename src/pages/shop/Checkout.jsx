import { useState, useRef, useEffect, useMemo } from 'react';
import { FaExternalLinkAlt, FaArrowLeft, FaEnvelope } from 'react-icons/fa';
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
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorDetails, setErrorDetails] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const location = useLocation();
  
  // Get cart state from Redux store
  const cartState = useSelector((state) => state.cart);
  const { deliveryFee, grandTotal } = cartState;
  
  // Calculate cart total price if not provided in location state
  const calculateCartTotal = (items) => {
    return items.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
  };
  
  // Get cart items from location state or Redux store (with priority to location state)
  const cartItems = location.state?.cartItems || cartState.products;
  
  // Calculate the total from the cart items in real-time
  const cartItemsTotal = useMemo(() => {
    return calculateCartTotal(cartItems);
  }, [cartItems]);
  
  // Calculate the subtotal and grand total
  const subtotal = location.state?.subtotal || cartItemsTotal;
  // Use grandTotal from Redux if available, otherwise calculate it
  const cartTotal = location.state?.total || grandTotal || (subtotal + deliveryFee);
  
  const billingDetails = location.state?.billingDetails || null;
  const deliveryDate = location.state?.deliveryDate || '';
  const receiptRef = useRef(null);
  
  // Generate a receipt number
  const receiptNumber = formatReceiptNumber();
  
  // Clean up any created object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  // Verify cart has items
  useEffect(() => {
    if (cartItems.length === 0 && !location.state?.cartItems) {
      toast.error("Your cart is empty. Please add items to your cart before checkout.");
      navigate('/shop');
    }
  }, [cartItems, location.state, navigate]);
  
  const showErrorMessageWithTimeout = (details = '') => {
    setErrorDetails(details);
    setShowErrorMessage(true);
    setTimeout(() => {
      setShowErrorMessage(false);
    }, 5000);
  };
  
  const generateAndDownloadPDF = async (event, details, totalAmount, receiptNumber) => {
    if (event) {
      event.preventDefault();
    }
    
    // Set generating state to show loading indicator
    setIsGenerating(true);
    
    try {
      console.log('Starting PDF generation...');
      
      // Calculate subtotal - sum of all items' (price * quantity)
      const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      // Use the delivery fee from Redux store (already extracted at the top of the component)
      // const deliveryFee = deliveryFeeAmount || 8800; // Default to 8800 if not defined
      
      // Create new PDF document
      const doc = new jsPDF();
      
      // Set PDF metadata
      doc.setProperties({
        title: `Feb Luxury - Receipt ${receiptNumber}`,
        subject: 'Order Receipt',
        author: 'FEB Luxury',
        creator: 'FEB Luxury E-commerce'
      });
      
      // Define page dimensions
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 15;
      
      // Add logo (placeholder for now)
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text("FEB LUXURY", pageWidth / 2, 20, { align: 'center' });
      
      // Add headline
      doc.setFontSize(12);
      doc.text("ORDER RECEIPT", pageWidth / 2, 30, { align: 'center' });
      
      // Left column - Receipt info
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(`Receipt No.: FEB-${receiptNumber}`, margin, 40);
      
      // Add current date
      const today = new Date();
      doc.text(`Order Date: ${today.toLocaleDateString()}`, margin, 45);
      
      // Right column - Customer info
      if (details) {
        doc.text("BILL TO:", pageWidth - margin - 50, 40);
        doc.text(`${details.firstName} ${details.lastName}`, pageWidth - margin - 50, 45);
        doc.text(`${details.email}`, pageWidth - margin - 50, 50);
        doc.text(`${details.phone}`, pageWidth - margin - 50, 55);
        doc.text(`${details.address}, ${details.city}`, pageWidth - margin - 50, 60);
        doc.text(`${details.state}, Nigeria`, pageWidth - margin - 50, 65);
      }
      
      // Expected Delivery date
      const isPreOrder = location.state?.isPreOrder;
      const deliveryDays = isPreOrder ? 14 : 3;
      const expectedDeliveryDate = new Date(today.getTime() + deliveryDays * 24 * 60 * 60 * 1000);
      doc.text(`Expected Delivery: ${expectedDeliveryDate.toLocaleDateString()} (${isPreOrder ? '14 working days' : '3 business days'})`, margin, 50);
      
      // Add line
      doc.line(margin, 70, pageWidth - margin, 70);
      
      // Product table headers
      doc.setFont('helvetica', 'bold');
      doc.text("Item Detail", margin, 80);
      doc.text("Qty", 110, 80);
      doc.text("Price", 130, 80);
      doc.text("Total", 160, 80);
      
      // Add line
      doc.line(margin, 85, pageWidth - margin, 85);
      
      // Product table content
      doc.setFont('helvetica', 'normal');
      let yPos = 95;
      
      if (cartItems && cartItems.length > 0) {
        cartItems.forEach((item) => {
          const itemDetails = [];
          itemDetails.push(item.name);
          
          if (item.selectedSize) {
            itemDetails.push(`Size: ${item.selectedSize}`);
          }
          
          if (item.selectedColor) {
            itemDetails.push(`Color: ${item.selectedColor}`);
          }
          
          // Write item name and details
          doc.text(itemDetails.join(', '), margin, yPos);
          
          // Write quantity
          doc.text(item.quantity.toString(), 110, yPos);
          
          // Write price
          doc.text(`₦${item.price.toLocaleString()}`, 130, yPos);
          
          // Write total
          doc.text(`₦${(item.price * item.quantity).toLocaleString()}`, 160, yPos);
          
          yPos += 10;
          
          // Check if we need a new page
          if (yPos > pageHeight - 50) {
            doc.addPage();
            yPos = 20;
          }
        });
      }
      
      // Add horizontal line
      doc.line(margin, yPos, pageWidth - margin, yPos);
      
      // Add totals
      yPos += 10;
      doc.text("Subtotal:", 130, yPos);
      doc.text(`₦${subtotal.toLocaleString()}`, 160, yPos);
      
      yPos += 8;
      doc.text("Shipping:", 130, yPos);
      doc.text(`₦${deliveryFee.toLocaleString()}`, 160, yPos);
      
      yPos += 8;
      doc.setFont('helvetica', 'bold');
      doc.text("Total Amount:", 130, yPos);
      doc.text(`₦${totalAmount.toLocaleString()}`, 160, yPos);
      
      // Payment section
      yPos += 20;
      doc.setFont('helvetica', 'bold');
      doc.text("Payment Details:", margin, yPos);
      
      // Bank transfer information
      yPos += 10;
      doc.setFont('helvetica', 'normal');
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
      doc.text("Thank you for shopping with F.E.B Luxury!", pageWidth / 2, yPos, { align: 'center' });
      doc.text("For inquiries, please contact us at: febluxurycloset@gmail.com", pageWidth / 2, yPos + 5, { align: 'center' });
      doc.text("Visit us at: www.febluxury.com", pageWidth / 2, yPos + 10, { align: 'center' });
      
      // Create a PDF blob 
      let pdfBlob = null;
      try {
        console.log("Converting PDF to blob...");
        pdfBlob = doc.output('blob');
        console.log("PDF blob created successfully", {
          type: pdfBlob.type, 
          size: pdfBlob.size + " bytes"
        });
      } catch (blobError) {
        console.error("Error creating PDF blob:", blobError);
        
        try {
          console.log("Trying alternative blob creation method...");
          const pdfData = doc.output('arraybuffer');
          pdfBlob = new Blob([pdfData], { type: 'application/pdf' });
          console.log("PDF blob created using fallback method");
        } catch (fallbackError) {
          console.error("Fallback blob creation also failed:", fallbackError);
          throw new Error("Failed to create PDF data. " + fallbackError.message);
        }
      }

      // Store the PDF URL for optional download later
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
      
      return { doc, pdfBlob };
    } catch (error) {
      console.error('Error generating PDF:', error);
      setIsGenerating(false);
      toast.error(
        'There was an error generating your receipt. Please try again or contact support.'
      );
      return null;
    }
  };

  // Update the email sending logic
  const sendEmailReceipt = async (email, totalAmount, pdfBlob, receiptNumber) => {
    try {
      console.log('Preparing to send email receipt...');
      
      const formData = new FormData();
      const fileBlob = new Blob([pdfBlob], { type: 'application/pdf' });
      formData.append('receipt', fileBlob, `receipt-${receiptNumber}.pdf`);
      formData.append('receiptNumber', receiptNumber);
      formData.append('customerName', billingDetails ? `${billingDetails.firstName} ${billingDetails.lastName}`.trim() : 'Customer');
      formData.append('customerEmail', email);
      formData.append('orderDate', new Date().toLocaleDateString());
      formData.append('totalAmount', totalAmount.toString());

      const productImages = cartItems
        .filter(item => item.image && typeof item.image === 'string')
        .map(item => item.image);
      
      formData.append('productImages', JSON.stringify(productImages));
      formData.append('adminEmails', JSON.stringify(['febluxurycloset@gmail.com']));

      try {
        const response = await axios.post('https://feb-backend.vercel.app/api/send-receipt-email', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          withCredentials: true
        });

        console.log('Email receipt sent successfully:', response.data);
        toast.success('Order confirmation has been sent to your email');
        return true;
      } catch (error) {
        console.error('Email sending failed:', error);
        toast.error('Email delivery failed, but your order is confirmed. Please download your receipt.');
        return true;
      }
    } catch (error) {
      console.error('Email sending failed:', error);
      toast.error('Email delivery failed, but your order is confirmed. Please download your receipt.');
      return true;
    }
  };
  
  // Update the checkout flow to send the receipt via email
  const handleCheckoutComplete = async () => {
    setIsGenerating(true);
    
    try {
      console.log("Starting checkout completion process...");
      
      // First properly generate the PDF content
      const result = await generateAndDownloadPDF(null, billingDetails, cartTotal, receiptNumber);
      
      if (!result) {
        console.warn("PDF generation failed, but continuing with order completion");
        toast.success('Order placed successfully! Please check your email for payment instructions.');
        setShowSuccessMessage(true);
        setIsGenerating(false);
        return null;
      }
      
      const { doc, pdfBlob } = result;
      console.log("PDF generated successfully, proceeding to email");
      
      // Attempt to send the email receipt
      if (billingDetails && billingDetails.email && pdfBlob) {
        try {
          await sendEmailReceipt(billingDetails.email, cartTotal, pdfBlob, receiptNumber);
          // Show notice screen
          setShowSuccessMessage(true);
          // Clear cart after successful order
          dispatch(clearCart());
          // Hide download button
          setPdfUrl(null);
        } catch (emailError) {
          console.warn('Email sending failed but order is complete:', emailError);
          toast.success('Order placed! Please check your email for payment instructions.');
        }
      }
      
      setIsGenerating(false);
      return { doc, pdfBlob };
    } catch (error) {
      console.error('Error in checkout process:', error);
      setIsGenerating(false);
      showErrorMessageWithTimeout('Processing error. Your order may still be complete.');
      
      // Show a more informative message to the user
      toast.success('Order received! There was an issue with receipt generation.');
      
      // Set success anyway to provide a better user experience
      setShowSuccessMessage(true);
      return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      {/* Processing Overlay */}
      {isGenerating && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] animate-fadeIn" style={{ opacity: 1, pointerEvents: 'auto' }}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg p-8 max-w-sm w-full text-center shadow-xl relative"
          >
            <div className="inline-block mb-4">
              <div className="relative w-16 h-16 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-gold/30"></div>
                <div className="absolute inset-0 rounded-full border-4 border-gold border-t-transparent animate-spin"></div>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Processing Order</h3>
            <p className="text-gray-600">Please wait while we generate your invoice...</p>
          </motion.div>
        </div>
      )}

      {/* Success Message Overlay */}
      {showSuccessMessage && (
        <motion.div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-xl"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            {/* Success Icon */}
            <motion.div
              className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.5, delay: 0.2 }}
            >
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <motion.path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                />
              </svg>
            </motion.div>

            {/* Order Success Content */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-center"
            >
              <h2 className="text-2xl font-bold mb-2 text-gray-800">Order Successfully Placed!</h2>
              <p className="text-gray-600 mb-6">Thank you for shopping with FEB Luxury</p>

              {/* Order Details */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Order Number:</span>
                    <span className="text-sm font-medium">FEB-{receiptNumber}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Expected Delivery:</span>
                    <span className="text-sm font-medium">{deliveryDate}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Amount:</span>
                    <span className="text-sm font-medium">₦{cartTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 text-left">
                <h3 className="font-medium text-yellow-800 mb-2">Next Steps:</h3>
                <ol className="list-decimal list-inside text-sm text-gray-700 space-y-2 ml-1">
                  <li>Check your email for payment instructions</li>
                  <li>Complete the bank transfer using the provided details</li>
                  <li>Forward your payment proof via WhatsApp</li>
                  <li>Wait for order processing confirmation</li>
                </ol>
              </div>

              {/* Contact Information */}
              <div className="text-sm text-gray-600 mb-6">
                Questions? Contact us:
                <div className="flex items-center justify-center gap-4 mt-2">
                  <a href="mailto:febluxurycloset@gmail.com" 
                     className="text-gold hover:underline flex items-center">
                    <FaEnvelope className="mr-1" /> 
                    Email
                  </a>
                  <a href="https://wa.me/2348033825144" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="text-green-600 hover:underline flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    </svg>
                    WhatsApp
                  </a>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/shop"
                  className="w-full sm:w-auto px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors flex items-center justify-center font-medium"
                >
                  Continue Shopping
                </Link>
                {pdfUrl && (
                  <a
                    href={pdfUrl}
                    download={`FEB_Luxury_Receipt_${receiptNumber}.pdf`}
                    className="w-full sm:w-auto px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center"
                  >
                    <FaExternalLinkAlt className="mr-2" />
                    Download Receipt
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
      
      {showErrorMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-md shadow-lg z-50 animate-fade-in-out">
          <p>{errorDetails || 'Error downloading receipt. Please try again.'}</p>
        </div>
      )}
      
      {/* Back to billing details link */}
      <div className="mb-6">
        <Link to="/billing-details" className="inline-flex items-center text-gray-600 hover:text-black text-sm">
          <FaArrowLeft className="mr-2" />
          Back to Billing Details
        </Link>
      </div>
      
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">Complete Your Order</h1>
      
      <div className="grid grid-cols-1 gap-8">
        {/* Order Summary */}
        <div className="order-2">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold mb-4 pb-2 border-b">Order Summary</h2>
            
            <div className="mb-6">
              <div className="overflow-x-auto">
                <table className="w-full min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                      <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {cartItems && cartItems.length > 0 ? (
                      cartItems.map((item, index) => (
                        <tr key={`${item._id || index}-${index}`} className="hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              <div className="h-16 w-16 flex-shrink-0 mr-4 bg-gray-100 rounded-md overflow-hidden">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="h-full w-full object-cover"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://via.placeholder.com/64?text=Product";
                                  }}
                                />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{item.name}</p>
                                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-sm text-gray-500">
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
                            </div>
                          </td>
                          <td className="py-4 px-4 text-sm text-right font-medium">
                            ₦{(item.price * item.quantity).toLocaleString()}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="py-4 px-4 text-center text-gray-500">
                          No items in cart
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₦{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">₦{deliveryFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-3 border-t mt-2 text-lg font-bold">
                <span>Total</span>
                <span>₦{cartTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          {/* Order Completion Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6" ref={receiptRef}>
            <h2 className="text-xl font-bold mb-4 pb-2 border-b">Complete Order</h2>
            
            <div className="bg-yellow-50 p-4 rounded-md mb-6 border-l-4 border-yellow-400">
              <h3 className="text-lg font-medium text-yellow-800 mb-2">How it works:</h3>
              <ol className="list-decimal list-inside text-sm text-gray-700 space-y-2 ml-2">
                <li>Click the button below to generate your payment invoice</li>
                <li>Make a bank transfer using the account details in the email we&apos;ll send you</li>
                <li>Forward your proof of payment as instructed in the email</li>
                <li>Your order will be processed once payment is confirmed</li>
              </ol>
            </div>
            
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleCheckoutComplete}
                disabled={isGenerating}
                className="flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-black text-white border border-black rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    <span className="text-white">Processing order...</span>
                  </>
                ) : (
                  <>
                    <FaEnvelope className="mr-2 text-white" />
                    <span className="text-white">Generate Payment Invoice & Place Order</span>
                  </>
                )}
              </button>
            
              {pdfUrl && (
                <a 
                  href={pdfUrl} 
                  download={`FEB_Luxury_Receipt_${receiptNumber}.pdf`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-white text-black border border-black rounded-md hover:bg-gray-100 transition-colors"
                >
                  <FaExternalLinkAlt className="mr-2" />
                  Download Receipt
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
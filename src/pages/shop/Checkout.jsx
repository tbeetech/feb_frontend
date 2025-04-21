import { useState, useRef, useEffect, useMemo } from 'react';
import { FaExternalLinkAlt, FaArrowLeft, FaEnvelope } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import { saveAs } from 'file-saver';
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
  const orderDate = location.state?.orderDate || new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
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
  
  const downloadWithFallbacks = (doc, pdfBlob, filename) => {
    // Try multiple methods in sequence to maximize compatibility
    return new Promise((resolve, reject) => {
      // Method 1: FileSaver (most compatible)
      try {
        saveAs(pdfBlob, filename);
        console.log('PDF downloaded using FileSaver');
        resolve('FileSaver');
        return;
      } catch (saveError) {
        console.warn('FileSaver method failed, trying alternative methods:', saveError);
      }
      
      // Method 2: Native jsPDF save
      try {
        doc.save(filename);
        console.log('PDF downloaded using native jsPDF save');
        resolve('jsPDFSave');
        return;
      } catch (jspdfError) {
        console.warn('jsPDF save method failed, trying alternative methods:', jspdfError);
      }
      
      // Method 3: Create object URL and trigger download programmatically
      try {
        const url = URL.createObjectURL(pdfBlob);
        setPdfUrl(url);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        console.log('PDF downloaded using object URL and programmatic click');
        resolve('objectURL');
        return;
      } catch (urlError) {
        console.warn('Object URL method failed:', urlError);
        reject(new Error('All download methods failed'));
      }
    });
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

  // Add a new function to send email receipts
  const sendEmailReceipt = async (email, totalAmount, pdfBlob, receiptNumber) => {
    try {
      console.log('Preparing to send email receipt...');
      
      // Create a FormData object to send the PDF attachment
      const formData = new FormData();
      
      // Ensure pdfBlob is a proper Blob object with correct mime type
      let fileBlob;
      if (pdfBlob instanceof Blob) {
        // If it's already a Blob, just ensure it has the correct type
        console.log("Using existing PDF blob");
        fileBlob = new Blob([pdfBlob], { type: 'application/pdf' });
      } else if (typeof pdfBlob === 'string') {
        // If it's a base64 string or similar, convert to Blob
        console.log("Converting string PDF data to blob");
        const byteString = atob(pdfBlob.split(',')[1] || pdfBlob);
        const byteArrays = [];
        
        for (let i = 0; i < byteString.length; i++) {
          byteArrays.push(byteString.charCodeAt(i));
        }
        
        fileBlob = new Blob([new Uint8Array(byteArrays)], { type: 'application/pdf' });
      } else {
        console.warn('Invalid PDF data, creating a simple text file instead');
        // Create a simple text file as fallback
        fileBlob = new Blob([`Receipt Number: FEB-${receiptNumber}\nAmount: ₦${totalAmount.toLocaleString()}`], 
                            { type: 'text/plain' });
      }
      
      // Validate the created blob
      if (!fileBlob || fileBlob.size === 0) {
        throw new Error("Generated PDF is empty or invalid");
      }
      
      console.log("PDF attachment prepared", {
        type: fileBlob.type,
        size: fileBlob.size + " bytes"
      });
      
      // Now append the properly-formatted Blob to the form
      formData.append('receipt', fileBlob, `receipt-${receiptNumber}.pdf`);
      
      // Add order information to the form data
      formData.append('receiptNumber', receiptNumber);
      
      // Make sure billingDetails exists before accessing it
      const customerName = billingDetails ? 
        `${billingDetails.firstName || ''} ${billingDetails.lastName || ''}`.trim() : 
        'Customer';
      
      formData.append('customerName', customerName);
      formData.append('customerEmail', email);
      formData.append('orderDate', orderDate || new Date().toLocaleDateString());
      formData.append('deliveryDate', deliveryDate || '');
      formData.append('totalAmount', totalAmount.toString());

      // Add product images to the email - only valid URLs
      const productImages = cartItems
        .filter(item => item.image && typeof item.image === 'string' && item.image.startsWith('http'))
        .map(item => item.image);
      
      formData.append('productImages', JSON.stringify(productImages));

      // Add admin emails to notify
      formData.append('adminEmails', JSON.stringify(['tobirammar@gmail.com', 'febluxurycloset@gmail.com']));

      // Set a timeout to prevent hanging on slow requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      try {
        // Send the email request with timeout
        console.log("Sending email API request...");
        const response = await axios.post('/api/send-receipt-email', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId); // Clear the timeout if successful
        
        console.log('Email receipt sent successfully:', response.data);
        toast.success('Order confirmation has been sent to your email');
        return true;
      } catch (apiError) {
        clearTimeout(timeoutId); // Clear the timeout
        
        console.error('API email attempt failed:', apiError);
        
        // Get a more detailed error message from the improved error response
        let errorMessage = 'Could not send email receipt';
        let troubleshooting = null;
        let alternativeContact = null;
        
        // Extract detailed error information if available
        if (apiError.response && apiError.response.data) {
          const errorData = apiError.response.data;
          
          // Use server-provided error message if available
          if (errorData.message) {
            errorMessage = `Email error: ${errorData.message}`;
          }
          
          // Get troubleshooting tips if available
          if (errorData.troubleshooting) {
            troubleshooting = errorData.troubleshooting;
          }
          
          // Get alternative contact information if available
          if (errorData.alternativeContact) {
            alternativeContact = errorData.alternativeContact;
          }
        } else if (apiError.message) {
          // Use generic error message if server didn't provide structured error data
          errorMessage = `Email error: ${apiError.message}`;
          
          // Special case for timeout errors
          if (apiError.message.includes('aborted')) {
            errorMessage = 'Email request timed out. The server might be busy.';
            troubleshooting = 'Please try again later or use the download option instead.';
          }
        }
        
        // Show toast error to user
        toast.error(errorMessage);
        
        // Show troubleshooting information if available
        if (troubleshooting) {
          toast.error(troubleshooting, { duration: 5000 });
        }
        
        // Show alternative contact information if available
        if (alternativeContact) {
          toast.success(alternativeContact, { duration: 6000 });
        }
        
        // Return true to continue the checkout process despite email failure
        return true;
      }
    } catch (error) {
      console.error('All email methods failed:', error);
      
      // Final fallback: just create a direct download link for the PDF
      toast.error('Email delivery failed, but your order is confirmed. Please download your receipt.');
      
      // Return true to continue the checkout process despite email failure
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
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg p-8 max-w-md w-full shadow-2xl relative"
          >
            <div className="text-center">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="mb-6"
              >
                <span className="material-icons text-6xl text-green-600">check_circle</span>
              </motion.div>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Thank You for Your Order!</h2>
              <div className="space-y-4 mb-6">
                <p className="text-gray-900 text-base">
                  Your order <span className="font-semibold text-gray-900">#{receiptNumber}</span> has been successfully placed.
                </p>
                <div className="bg-yellow-50/80 border border-yellow-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Next Steps:</h3>
                  <ol className="text-left text-gray-800 space-y-2 list-decimal list-inside">
                    <li>Check your email for payment instructions and invoice</li>
                    <li>Complete the bank transfer using the provided details</li>
                    <li>Forward your proof of payment as instructed</li>
                    <li>Await order confirmation (usually within 24 hours)</li>
                  </ol>
                </div>
                <p className="text-gray-800">
                  Expected delivery: <span className="font-medium text-gray-900">3-5 business days after payment confirmation</span>
                </p>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowSuccessMessage(false);
                    navigate('/shop');
                  }}
                  className="w-full py-3 bg-black text-white font-medium hover:bg-gray-800 transition-colors rounded-sm"
                >
                  Continue Shopping
                </button>
                <p className="text-gray-800">
                  Questions? Contact us at <a href="mailto:febluxurycloset@gmail.com" className="text-gold hover:text-gold/80 hover:underline font-medium">febluxurycloset@gmail.com</a>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
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
                className={`w-full py-3 bg-black text-white font-medium hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2 ${isGenerating ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    <span>Processing order...</span>
                  </>
                ) : (
                  <>
                    <FaEnvelope className="mr-2" />
                    <span>Generate Payment Invoice & Place Order</span>
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
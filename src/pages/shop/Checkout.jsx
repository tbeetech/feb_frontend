import React, { useState, useRef, useEffect, useMemo } from 'react';
import { FaWhatsapp, FaEye, FaEyeSlash, FaDownload, FaExternalLinkAlt, FaArrowLeft } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { saveAs } from 'file-saver';
import { formatReceiptNumber } from '../../utils/formatters';
import { toast } from 'react-hot-toast';

const Checkout = () => {
  const navigate = useNavigate();
  const [showAccountNumber, setShowAccountNumber] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorDetails, setErrorDetails] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const whatsappNumber = '+2348033825144';
  const location = useLocation();
  
  // Get cart state from Redux store
  const cartState = useSelector((state) => state.cart);
  
  // Calculate cart total price if not provided in location state
  const calculateCartTotal = (items) => {
    return items.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
  };
  
  // Get cart items from location state or Redux store (with priority to location state)
  const cartItems = location.state?.cartItems || useSelector((state) => state.cart.products);
  
  // Calculate the total from the cart items in real-time
  const cartItemsTotal = useMemo(() => {
    return calculateCartTotal(cartItems);
  }, [cartItems]);
  
  // Use the total from location state or calculated total (with priority to location state)
  const cartTotal = location.state?.total || cartItemsTotal;
  
  const isPreOrder = location.state?.isPreOrder || false;
  const billingDetails = location.state?.billingDetails || null;
  const orderDate = location.state?.orderDate || new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
  const deliveryDate = location.state?.deliveryDate || '';
  const accountNumber = '0038685089';
  const receiptRef = useRef(null);
  
  // Generate a receipt number
  const receiptNumber = formatReceiptNumber();
  const currentDate = new Date().toLocaleDateString('en-GB');
  
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
  
  const handleWhatsAppClick = () => {
    window.open(`https://wa.me/${whatsappNumber}`, '_blank');
  };

  const toggleAccountNumber = () => {
    setShowAccountNumber(!showAccountNumber);
  };
  
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
  
  const generateAndDownloadPDF = async () => {
    setIsGenerating(true);
    
    try {
      // Check if jsPDF is available
      if (typeof jsPDF !== 'function') {
        throw new Error('PDF library is not loaded properly. Please refresh the page and try again.');
      }
      
      // Validate cart data
      if (!Array.isArray(cartItems) || cartItems.length === 0) {
        console.warn('Cart is empty or invalid. Will create receipt with placeholder data.');
      }
      
      // Sanitize cart data to ensure it's valid
      const validatedCartItems = Array.isArray(cartItems) ? cartItems.filter(item => 
        item && typeof item === 'object' && (item.name || item._id)
      ) : [];
      
      // Create a new jsPDF instance
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Add logo placeholder (could be replaced with an actual logo)
      doc.setFillColor(245, 245, 245);
      doc.rect(15, 15, 180, 25, 'F');
      
      // Set up the document
      doc.setFontSize(20);
      doc.setTextColor(33, 33, 33);
      doc.text('F.E.B LUXURY', 105, 30, { align: 'center' });
      doc.setFontSize(12);
      doc.text('Receipt / Invoice', 105, 40, { align: 'center' });
      doc.setLineWidth(0.5);
      doc.line(15, 45, 195, 45);
      
      // Receipt details
      doc.setFontSize(10);
      doc.text(`Receipt No: ${receiptNumber}`, 15, 55);
      doc.text(`Date: ${currentDate}`, 15, 62);
      doc.text(`Payment Method: Bank Transfer`, 15, 69);
      
      // Customer section
      doc.text('BILL TO:', 140, 55);
      if (billingDetails) {
        doc.text(`${billingDetails.firstName} ${billingDetails.lastName}`, 140, 62);
        doc.text(`${billingDetails.email}`, 140, 69);
        doc.text(`${billingDetails.phone}`, 140, 76);
        doc.text(`${billingDetails.address}`, 140, 83);
        doc.text(`${billingDetails.city}, ${billingDetails.state}`, 140, 90);
      } else {
        doc.text('Customer', 140, 62);
      }
      
      // Delivery information
      doc.text('DELIVERY INFO:', 15, 76);
      doc.text(`Order Date: ${orderDate}`, 15, 83);
      doc.text(`Expected Delivery: ${deliveryDate}`, 15, 90);
      if (isPreOrder) {
        doc.text('(Pre-Order Item)', 15, 97);
      }
      
      // Items table
      const tableColumn = ["Item", "Size", "Color", "Qty", "Unit Price (₦)", "Total (₦)"];
      const tableRows = [];
      
      // Ensure cartItems exists and is an array
      if (validatedCartItems.length > 0) {
        validatedCartItems.forEach(item => {
          const itemData = [
            (item.name || 'Unnamed Product').substring(0, 30), // Limit name length to avoid overflow
            item.selectedSize || 'N/A',
            item.selectedColor ? 'Custom' : 'N/A', // Since we can't display colors in PDF text directly
            item.quantity || 1,
            (item.price || 0).toLocaleString(),
            ((item.price || 0) * (item.quantity || 1)).toLocaleString()
          ];
          tableRows.push(itemData);
        });
      } else {
        // Add a fallback row if cart is empty
        tableRows.push(['No items in cart', 'N/A', 'N/A', '0', '0', '0']);
      }
      
      // Create a manual table instead of using autoTable to avoid compatibility issues
      // Set up table styles
      const startY = 100;
      const cellPadding = 5;
      const tableWidth = 180;
      // Adjust column widths to provide more space for the price columns
      const colWidths = [50, 20, 20, 15, 35, 40]; // Column widths that sum to tableWidth
      
      // Draw table header with background
      doc.setFillColor(0, 0, 0);
      doc.setTextColor(255, 255, 255);
      doc.rect(15, startY, tableWidth, 10, 'F');
      
      // Draw header text
      doc.setFontSize(9);
      let currentX = 15;
      tableColumn.forEach((col, index) => {
        // Align price columns to the right
        if (index >= 3) {
          doc.text(col, currentX + colWidths[index] - cellPadding, startY + 7, { align: 'right' });
        } else {
          doc.text(col, currentX + cellPadding, startY + 7);
        }
        currentX += colWidths[index];
      });
      
      // Draw table rows
      doc.setTextColor(0, 0, 0);
      let currentY = startY + 10;
      let isGray = false;
      
      tableRows.forEach(row => {
        // Alternate row colors
        if (isGray) {
          doc.setFillColor(245, 245, 245);
          doc.rect(15, currentY, tableWidth, 10, 'F');
        }
        isGray = !isGray;
        
        // Draw cell text
        currentX = 15;
        row.forEach((cell, index) => {
          // Right align price columns
          if (index >= 3) {
            doc.text(String(cell), currentX + colWidths[index] - cellPadding, currentY + 7, { align: 'right' });
          } else {
            doc.text(String(cell), currentX + cellPadding, currentY + 7);
          }
          currentX += colWidths[index];
        });
        
        currentY += 10;
      });
      
      // Draw table border
      doc.setLineWidth(0.1);
      doc.rect(15, startY, tableWidth, currentY - startY, 'S');
      
      // Draw column dividers
      currentX = 15;
      for (let i = 0; i < colWidths.length - 1; i++) {
        currentX += colWidths[i];
        doc.line(currentX, startY, currentX, currentY);
      }
      
      // Calculate the Y position after the table
      let finalY = currentY + 10;
      
      // Add total
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(`Total Amount: ₦${cartTotal.toLocaleString()}`, 180, finalY, { align: 'right' });
      
      // Payment details
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Payment Details:', 15, finalY + 15);
      doc.text(`Bank: Stanbic IBTC Bank`, 15, finalY + 22);
      doc.text(`Account Name: Jumoke Obembe`, 15, finalY + 29);
      doc.text(`Account Number: ${accountNumber}`, 15, finalY + 36);
      
      // Footer
      doc.setFontSize(8);
      doc.text('Thank you for shopping with F.E.B Luxury!', 105, finalY + 50, { align: 'center' });
      doc.text('For inquiries, please contact us at +2348033825144', 105, finalY + 55, { align: 'center' });
      doc.text('Visit us at: www.febluxury.com', 105, finalY + 60, { align: 'center' });
      
      // Generate a blob for the PDF
      let pdfBlob;
      try {
        pdfBlob = doc.output('blob');
      } catch (blobError) {
        throw new Error('Failed to generate PDF blob: ' + blobError.message);
      }
      
      // Set up the direct download URL regardless
      try {
        const objectUrl = URL.createObjectURL(pdfBlob);
        setPdfUrl(objectUrl);
      } catch (urlError) {
        console.warn('Failed to create object URL as fallback:', urlError);
      }
      
      // Try different download methods
      const filename = `FEB_Luxury_Receipt_${receiptNumber}.pdf`;
      try {
        const method = await downloadWithFallbacks(doc, pdfBlob, filename);
        console.log(`Successfully downloaded PDF using ${method} method`);
        
        // Show success message
        setIsGenerating(false);
        setShowSuccessMessage(true);
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 5000);
        
        return true;
      } catch (downloadError) {
        console.warn('Primary download methods failed:', downloadError);
        
        // Don't throw an error here, try to recover
        // Create a direct download link as a fallback
        try {
          const fallbackUrl = URL.createObjectURL(pdfBlob);
          setPdfUrl(fallbackUrl);
          
          setIsGenerating(false);
          // Show a different success message prompting to use the direct download link
          setErrorDetails('Direct download failed. Please use the "Direct Download" button below.');
          setShowErrorMessage(true);
          
          return false;
        } catch (fallbackError) {
          throw new Error('All download methods failed. Please try again later.');
        }
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      setIsGenerating(false);
      showErrorMessageWithTimeout(`Error downloading receipt: ${error.message || 'Please try again later'}`);
      
      // Still try to create the blob URL as a fallback
      try {
        const doc = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });
        doc.text('F.E.B LUXURY RECEIPT', 105, 20, { align: 'center' });
        doc.text(`Total Amount: ₦${cartTotal.toLocaleString()}`, 105, 40, { align: 'center' });
        doc.text(`Receipt No: ${receiptNumber}`, 105, 50, { align: 'center' });
        doc.text(`Date: ${currentDate}`, 105, 60, { align: 'center' });
        doc.text('Visit us at: www.febluxury.com', 105, 70, { align: 'center' });
        
        const simplePdfBlob = doc.output('blob');
        const objectUrl = URL.createObjectURL(simplePdfBlob);
        setPdfUrl(objectUrl);
        console.log('Created fallback PDF URL after error');
      } catch (fallbackError) {
        console.error('Even fallback PDF creation failed:', fallbackError);
      }
      
      return false;
    }
  };
  
  const downloadReceiptPDF = () => {
    // We're using a wrapper function so we can add more error handling if needed
    if (isGenerating) return; // Prevent multiple clicks
    generateAndDownloadPDF();
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      {/* Alert messages */}
      {showSuccessMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-md shadow-lg z-50 animate-fade-in-out">
          <p>Receipt downloaded successfully!</p>
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
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Order Summary - Left Column on Desktop, Top on Mobile */}
        <div className="lg:col-span-3 lg:order-1 order-2">
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
                <span className="font-medium">₦{cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">₦0.00</span>
              </div>
              <div className="flex justify-between py-3 border-t mt-2 text-lg font-bold">
                <span>Total</span>
                <span>₦{cartTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          {/* Receipt Preview */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6" ref={receiptRef}>
            <h2 className="text-xl font-bold mb-4 pb-2 border-b">Receipt Preview</h2>
            
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold">F.E.B LUXURY</h3>
              <p className="text-gray-600">Receipt / Invoice</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-sm">
            <div>
                <p><span className="font-medium">Receipt No:</span> {receiptNumber}</p>
                <p><span className="font-medium">Date:</span> {currentDate}</p>
                <p><span className="font-medium">Payment Method:</span> Bank Transfer</p>
                <p><span className="font-medium">Order Date:</span> {orderDate}</p>
                <p><span className="font-medium">Expected Delivery:</span> {deliveryDate}</p>
                {isPreOrder && <p><span className="font-medium">Order Type:</span> Pre-Order</p>}
            </div>
            <div>
                <p className="font-medium">BILL TO:</p>
              {billingDetails ? (
                <>
                  <p>{billingDetails.firstName} {billingDetails.lastName}</p>
                  <p>{billingDetails.email}</p>
                    <p>{billingDetails.phone}</p>
                  <p>{billingDetails.address}</p>
                  <p>{billingDetails.city}, {billingDetails.state}</p>
                </>
              ) : (
                <p>Customer</p>
              )}
            </div>
                        </div>
            
            <div className="text-center text-xs text-gray-500 mt-6">
            <p>Thank you for shopping with F.E.B Luxury!</p>
            <p>For inquiries, please contact us at +2348033825144</p>
            <p>Visit us at: www.febluxury.com</p>
            </div>
            
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <button 
                onClick={downloadReceiptPDF} 
                disabled={isGenerating}
                className="flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <FaDownload className="mr-2" />
                {isGenerating ? 'Generating PDF...' : 'Download Receipt'}
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
                  Direct Download
                </a>
              )}
            </div>
          </div>
        </div>
        
        {/* Payment Details - Right Column on Desktop, Bottom on Mobile */}
        <div className="lg:col-span-2 lg:order-2 order-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-4 pb-2 border-b">Payment Details</h2>
            
            <div className="mb-6">
              <div className="bg-gray-50 p-4 rounded-md text-center mb-6">
                <p className="text-lg font-bold">Total Amount</p>
                <p className="text-2xl font-bold">₦{cartTotal.toLocaleString()}</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Bank Name</p>
                  <p className="font-medium">Stanbic IBTC Bank</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">Account Name</p>
                  <p className="font-medium">Jumoke Obembe</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">Account Number</p>
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{showAccountNumber ? accountNumber : '••••••••••'}</p>
                    <button 
                      onClick={toggleAccountNumber}
                      className="text-gray-500 hover:text-black"
                    >
                      {showAccountNumber ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleWhatsAppClick}
              className="w-full flex items-center justify-center px-6 py-3 bg-[#25D366] text-white rounded-md hover:bg-[#128C7E] transition-colors mb-6"
            >
              <FaWhatsapp className="mr-2 text-xl" />
              Send Payment Receipt
            </button>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-medium mb-3">How to Complete Your Order</h3>
              <ol className="list-decimal list-inside text-sm text-gray-700 space-y-2">
              <li>Make a bank transfer for the total amount shown above</li>
                <li>Download your receipt</li>
              <li>Send proof of payment via WhatsApp</li>
              <li>Your order will be processed after payment confirmation</li>
            </ol>
        </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
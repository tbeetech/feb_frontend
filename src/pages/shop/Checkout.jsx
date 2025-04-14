import React, { useState, useRef, useEffect, useMemo } from 'react';
import { FaWhatsapp, FaEye, FaEyeSlash, FaDownload, FaExternalLinkAlt, FaArrowLeft, FaEnvelope } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { saveAs } from 'file-saver';
import { formatReceiptNumber } from '../../utils/formatters';
import { toast } from 'react-hot-toast';
import axios from 'axios';

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
  
  // Fixed delivery fee
  const deliveryFee = 8800;
  
  // Get cart items from location state or Redux store (with priority to location state)
  const cartItems = location.state?.cartItems || useSelector((state) => state.cart.products);
  
  // Calculate the total from the cart items in real-time
  const cartItemsTotal = useMemo(() => {
    return calculateCartTotal(cartItems);
  }, [cartItems]);
  
  // Calculate the subtotal and grand total
  const subtotal = location.state?.subtotal || cartItemsTotal;
  const cartTotal = location.state?.total || (subtotal + deliveryFee);
  
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
      
      // Calculate row totals and grand total
      let subtotalValue = 0;

      validatedCartItems.forEach(item => {
        const quantity = item.quantity || 1;
        const price = typeof item.price === 'number' ? item.price : parseFloat(item.price || 0);
        const totalPrice = price * quantity;
        subtotalValue += totalPrice;
        
        tableRows.push([
          item.name || 'Unknown Product',
          item.selectedSize || '-',
          (item.selectedColor && typeof item.selectedColor === 'string') 
            ? item.selectedColor.startsWith('#') 
              ? item.selectedColor 
              : '-'
            : '-',
          quantity.toString(),
          price.toLocaleString(),
          totalPrice.toLocaleString()
        ]);
      });

      // Add delivery fee row
      tableRows.push([
        'Delivery Fee',
        '-',
        '-',
        '1',
        '8,800',
        '8,800'
      ]);
      
      // Grand total
      const grandTotal = subtotalValue + 8800;
      
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 105,
        theme: 'grid',
        styles: { fontSize: 9, cellPadding: 3 },
        headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' },
        columnStyles: {
          0: { cellWidth: 50 },
          3: { halign: 'center' },
          4: { halign: 'right' },
          5: { halign: 'right' }
        },
        didDrawPage: (data) => {
          // Add page numbers
          const pageCount = doc.internal.getNumberOfPages();
          for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.text(`Page ${i} of ${pageCount}`, 195, 285, { align: 'right' });
          }
        }
      });
      
      // Calculate totals 
      const tableEndY = doc.lastAutoTable.finalY + 10;
      doc.setFontSize(10);
      
      // Display subtotal
      doc.text('Subtotal:', 140, tableEndY);
      doc.text(`₦${subtotalValue.toLocaleString()}`, 195, tableEndY, { align: 'right' });
      
      // Display delivery fee
      doc.text('Delivery Fee:', 140, tableEndY + 8);
      doc.text('₦8,800', 195, tableEndY + 8, { align: 'right' });
      
      // Display Grand Total (bold)
      doc.setFontStyle('bold');
      doc.text('GRAND TOTAL:', 140, tableEndY + 16);
      doc.text(`₦${grandTotal.toLocaleString()}`, 195, tableEndY + 16, { align: 'right' });
      doc.setFontStyle('normal');
      
      // Payment details
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Payment Details:', 15, tableEndY + 25);
      doc.text(`Bank: Stanbic IBTC Bank`, 15, tableEndY + 32);
      doc.text(`Account Name: Jumoke Obembe`, 15, tableEndY + 39);
      doc.text(`Account Number: ${accountNumber}`, 15, tableEndY + 46);
      
      // Footer
      doc.setFontSize(8);
      doc.text('Thank you for shopping with F.E.B Luxury!', 105, tableEndY + 50, { align: 'center' });
      doc.text('For inquiries, please contact us at +2348033825144', 105, tableEndY + 55, { align: 'center' });
      doc.text('Visit us at: www.febluxury.com', 105, tableEndY + 60, { align: 'center' });
      
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
        
        return { doc, pdfBlob };
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
          
          return { doc, pdfBlob };
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
      
      return { doc, pdfBlob };
    }
  };
  
  const downloadReceiptPDF = () => {
    // We're using a wrapper function so we can add more error handling if needed
    if (isGenerating) return; // Prevent multiple clicks
    generateAndDownloadPDF();
  };

  // Add a new function to send email receipts
  const sendEmailReceipt = async (pdfBlob, billingDetails, receiptNumber) => {
    try {
      // Create a FormData object to send the PDF attachment
      const formData = new FormData();
      
      // Ensure pdfBlob is a proper Blob object with correct mime type
      let fileBlob;
      if (pdfBlob instanceof Blob) {
        // If it's already a Blob, just ensure it has the correct type
        fileBlob = new Blob([pdfBlob], { type: 'application/pdf' });
      } else if (typeof pdfBlob === 'string') {
        // If it's a base64 string or similar, convert to Blob
        const byteCharacters = atob(pdfBlob.split(',')[1] || pdfBlob);
        const byteArrays = [];
        for (let i = 0; i < byteCharacters.length; i++) {
          byteArrays.push(byteCharacters.charCodeAt(i));
        }
        fileBlob = new Blob([new Uint8Array(byteArrays)], { type: 'application/pdf' });
      } else {
        // If it's something else, try to convert it
        console.log("Received non-Blob PDF data, attempting conversion:", typeof pdfBlob);
        
        // Get the PDF as an ArrayBuffer if using jsPDF
        const pdfData = doc.output('arraybuffer');
        fileBlob = new Blob([pdfData], { type: 'application/pdf' });
      }
      
      // Now append the properly-formatted Blob to the form
      formData.append('receipt', fileBlob, `receipt-${receiptNumber}.pdf`);
      
      // Add order information to the form data
      formData.append('receiptNumber', receiptNumber);
      formData.append('customerName', `${billingDetails.firstName} ${billingDetails.lastName}`);
      formData.append('customerEmail', billingDetails.email);
      formData.append('orderDate', orderDate);
      formData.append('deliveryDate', deliveryDate);
      formData.append('totalAmount', cartTotal.toFixed(2));

      // Add product images to the email
      const productImages = cartItems
        .filter(item => item.image)
        .map(item => item.image);
      formData.append('productImages', JSON.stringify(productImages));

      // Add admin emails to notify
      formData.append('adminEmails', JSON.stringify(['tobirammar@gmail.com', 'febluxurycloset@gmail.com']));

      // Set a timeout to prevent hanging on slow requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 second timeout
      
      try {
        // Send the email request with timeout
        const response = await axios.post('/api/send-receipt-email', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId); // Clear the timeout if successful
        
        console.log('Email receipt sent:', response.data);
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
        
        // Create a download link for the PDF
        if (pdfUrl) {
          // Create a temporary download link element
          const downloadLink = document.createElement('a');
          downloadLink.href = pdfUrl;
          downloadLink.download = `FEB_Luxury_Receipt_${receiptNumber}.pdf`;
          downloadLink.style.display = 'none';
          document.body.appendChild(downloadLink);
          
          // Show a more informative message to the user
          toast.success('Order complete! Please download your receipt using the button below.');
          
          // Create a client-side email template that includes order details
          if (billingDetails && billingDetails.email) {
            // Create an email template with order details
            const emailSubject = `Your FEB Luxury Order #${receiptNumber}`;
            const emailBody = `
Dear ${billingDetails.firstName} ${billingDetails.lastName},

Thank you for your order with FEB Luxury!

Order Details:
- Receipt Number: ${receiptNumber}
- Order Date: ${orderDate}
- Expected Delivery: ${deliveryDate}
- Total Amount: ₦${cartTotal.toLocaleString()}

Please save your receipt for your records.

To complete your order, please make payment using the details on your receipt
and contact us via WhatsApp at +2348033825144 to confirm your payment.

Thank you for shopping with us!

FEB Luxury Team
            `;
            
            // Create a mailto link as a fallback
            const subject = encodeURIComponent(emailSubject);
            const body = encodeURIComponent(emailBody);
            
            // Create a mailto link that can be used to manually send an email
            const fallbackMailLink = document.createElement('a');
            fallbackMailLink.href = `mailto:${billingDetails.email}?subject=${subject}&body=${body}`;
            fallbackMailLink.textContent = 'Send Receipt Details via Email';
            fallbackMailLink.style.display = 'none';
            
            document.body.appendChild(fallbackMailLink);
            console.log('Email fallback link created');
            
            // Alert user about alternate options
            toast.success('You can also contact us on WhatsApp for order confirmation', {
              duration: 6000
            });
            
            return false;
          }
        }
        return false;
      }
    } catch (error) {
      console.error('All email methods failed:', error);
      
      // Final fallback: just create a direct download link for the PDF
      toast.error('Email delivery failed, but your order is confirmed. Please download your receipt.');
      
      if (pdfUrl) {
        // Create a temporary download link element that's bigger and more visible
        const downloadSection = document.createElement('div');
        downloadSection.style.margin = '20px auto';
        downloadSection.style.textAlign = 'center';
        
        const downloadText = document.createElement('p');
        downloadText.textContent = 'Please download your receipt:';
        downloadText.style.marginBottom = '10px';
        
        const downloadLink = document.createElement('a');
        downloadLink.href = pdfUrl;
        downloadLink.download = `FEB_Luxury_Receipt_${receiptNumber}.pdf`;
        downloadLink.textContent = 'Download Receipt';
        downloadLink.className = 'bg-black text-white py-2 px-4 rounded hover:bg-gray-800';
        
        downloadSection.appendChild(downloadText);
        downloadSection.appendChild(downloadLink);
        
        // Append to the receipt preview section if it exists
        if (receiptRef.current) {
          receiptRef.current.appendChild(downloadSection);
        }
      }
      
      return false;
    }
  };

  // Update the checkout flow to send the receipt via email
  const handleCheckoutComplete = async () => {
    setIsGenerating(true);
    
    try {
      // First properly generate the PDF content
      const { doc, pdfBlob } = await generateAndDownloadPDF();
      
      if (!doc || !pdfBlob) {
        throw new Error('Failed to generate receipt PDF');
      }
      
      console.log("PDF generated successfully, size:", pdfBlob.size);
      
      // Get a fresh proper Blob from the document for the email attachment
      // This ensures we have a valid Blob object with the correct MIME type and content
      const pdfArrayBuffer = doc.output('arraybuffer');
      const properPdfBlob = new Blob([pdfArrayBuffer], { type: 'application/pdf' });
      
      console.log("Created PDF Blob for email:", properPdfBlob instanceof Blob, properPdfBlob.size, properPdfBlob.type);
      
      // Attempt to send the email receipt
      if (billingDetails && billingDetails.email) {
        const emailSent = await sendEmailReceipt(properPdfBlob, billingDetails, receiptNumber);
        if (emailSent) {
          console.log('Email receipt sent successfully');
          
          // Show success messages
          toast.success('Order placed! Receipt has been emailed to you.');
          setShowSuccessMessage(true);
        } else {
          console.warn('Email delivery failed, but continuing checkout');
          toast.error('Order placed, but email delivery failed. You can still download the receipt.');
        }
      } else {
        console.warn('No billing email available, skipping email receipt');
        toast.error('Please provide an email address to receive your receipt.');
      }
      
      setIsGenerating(false);
      return { doc, pdfBlob: properPdfBlob };
    } catch (error) {
      console.error('Error in checkout process:', error);
      setIsGenerating(false);
      showErrorMessageWithTimeout(error.message || 'Failed to complete checkout');
      toast.error('There was a problem processing your order. Please try again.');
      return null;
    }
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
                <span className="font-medium">₦{subtotal.toLocaleString()}</span>
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
              <p className="text-gray-600">Order Details / Quote</p>
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
                onClick={handleCheckoutComplete}
                disabled={isGenerating}
                className="w-full py-3 bg-black text-white font-medium hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
              >
                {isGenerating ? (
                  <>
                    <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <FaEnvelope className="mr-2" />
                    <span>Place Order & Send Receipt</span>
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
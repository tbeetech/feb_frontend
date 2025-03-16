import React, { useState, useRef, useEffect } from 'react';
import { FaWhatsapp, FaEye, FaEyeSlash, FaDownload, FaExternalLinkAlt } from 'react-icons/fa';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { saveAs } from 'file-saver';
import { formatDate, formatPrice, formatReceiptNumber } from '../../utils/formatters';

const Checkout = () => {
  const [showAccountNumber, setShowAccountNumber] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorDetails, setErrorDetails] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const whatsappNumber = '+2348033825144';
  const location = useLocation();
  const cartTotal = location.state?.total || 0;
  const isPreOrder = location.state?.isPreOrder || false;
  const billingDetails = location.state?.billingDetails || null;
  const orderDate = location.state?.orderDate || new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
  const deliveryDate = location.state?.deliveryDate || '';
  const accountNumber = '0038685089';
  const receiptRef = useRef(null);
  
  // Get cart items from Redux store or from location state
  const cartItems = location.state?.cartItems || useSelector((state) => state.cart.products);
  
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
  
  // Pre-load libraries to ensure they're available
  useEffect(() => {
    // Load jsPDF scripts asynchronously to ensure they're ready
    const loadScripts = async () => {
      try {
        // Dynamic import as a backup to ensure the library is properly loaded
        const jspdfModule = await import('jspdf');
        const autotableModule = await import('jspdf-autotable');
        
        // Verify the library is loaded correctly
        if (typeof jsPDF !== 'function') {
          console.warn('jsPDF is not available as a global function, trying to use the imported module');
          window.jsPDF = jspdfModule.jsPDF; // Make it globally available
        }
        
        console.log('PDF libraries loaded successfully');
      } catch (err) {
        console.error('Error loading PDF libraries:', err);
        setErrorDetails('Failed to load PDF libraries. Please try refreshing the page.');
      }
    };
    
    loadScripts();
  }, []);
  
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
      doc.setFillColor(240, 240, 240);
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
        doc.text(`${billingDetails.phoneNumber}`, 140, 76);
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
      const tableColumn = ["Item", "Size", "Qty", "Unit Price (₦)", "Total (₦)"];
      const tableRows = [];
      
      // Ensure cartItems exists and is an array
      if (validatedCartItems.length > 0) {
        validatedCartItems.forEach(item => {
          const itemData = [
            (item.name || 'Unnamed Product').substring(0, 30), // Limit name length to avoid overflow
            item.selectedSize || 'N/A',
            item.quantity || 1,
            (item.price || 0).toLocaleString(),
            ((item.price || 0) * (item.quantity || 1)).toLocaleString()
          ];
          tableRows.push(itemData);
        });
      } else {
        // Add a fallback row if cart is empty
        tableRows.push(['No items in cart', 'N/A', '0', '0', '0']);
      }
      
      // Create a manual table instead of using autoTable to avoid compatibility issues
      // Set up table styles
      const startY = 80;
      const cellPadding = 5;
      const tableWidth = 180;
      // Adjust column widths to provide more space for the price columns
      const colWidths = [60, 25, 15, 35, 45]; // Column widths that sum to tableWidth
      
      // Draw table header with background
      doc.setFillColor(33, 150, 243);
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
          doc.setFillColor(240, 240, 240);
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
    <CheckoutContainer>
      {showSuccessMessage && (
        <SuccessMessage>
          <p>Receipt downloaded successfully!</p>
        </SuccessMessage>
      )}
      {showErrorMessage && (
        <ErrorMessage>
          <p>{errorDetails || 'Error downloading receipt. Please try again.'}</p>
        </ErrorMessage>
      )}
      <div className="flex flex-col lg:flex-row gap-6 w-full max-w-5xl">
        {/* Receipt Preview */}
        <ReceiptCard ref={receiptRef}>
          <ReceiptHeader>
            <h1>F.E.B LUXURY</h1>
            <p>Receipt / Invoice</p>
          </ReceiptHeader>
          
          <ReceiptDetails>
            <div>
              <p><strong>Receipt No:</strong> {receiptNumber}</p>
              <p><strong>Date:</strong> {currentDate}</p>
              <p><strong>Payment Method:</strong> Bank Transfer</p>
              <p><strong>Order Date:</strong> {orderDate}</p>
              <p><strong>Expected Delivery:</strong> {deliveryDate}</p>
              {isPreOrder && <p><strong>Order Type:</strong> Pre-Order</p>}
            </div>
            <div>
              <p><strong>BILL TO:</strong></p>
              {billingDetails ? (
                <>
                  <p>{billingDetails.firstName} {billingDetails.lastName}</p>
                  <p>{billingDetails.email}</p>
                  <p>{billingDetails.phoneNumber}</p>
                  <p>{billingDetails.address}</p>
                  <p>{billingDetails.city}, {billingDetails.state}</p>
                </>
              ) : (
                <p>Customer</p>
              )}
            </div>
          </ReceiptDetails>
          
          <ItemsTable>
            <thead>
              <tr>
                <th>Item</th>
                <th>Size</th>
                <th>Qty</th>
                <th>Unit Price (₦)</th>
                <th>Total (₦)</th>
              </tr>
            </thead>
            <tbody>
              {cartItems && cartItems.length > 0 ? (
                cartItems.map((item, index) => (
                  <tr key={`${item._id || index}-${index}`}>
                    <td>{item.name}</td>
                    <td>{item.selectedSize || 'N/A'}</td>
                    <td>{item.quantity}</td>
                    <td>{item.price.toLocaleString()}</td>
                    <td>{(item.price * item.quantity).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4">No items in cart</td>
                </tr>
              )}
            </tbody>
          </ItemsTable>
          
          <TotalRow>
            <span>Total:</span>
            <span>₦{cartTotal.toLocaleString()}</span>
          </TotalRow>
          
          <ReceiptFooter>
            <p>Thank you for shopping with F.E.B Luxury!</p>
            <p>For inquiries, please contact us at +2348033825144</p>
            <p>Visit us at: www.febluxury.com</p>
          </ReceiptFooter>
          
          <ButtonsContainer>
            <DownloadButton onClick={downloadReceiptPDF} disabled={isGenerating}>
              <FaDownload />
              <span>{isGenerating ? 'Generating PDF...' : 'Download Receipt'}</span>
            </DownloadButton>
            
            {pdfUrl && (
              <DirectDownloadLink href={pdfUrl} download={`FEB_Luxury_Receipt_${receiptNumber}.pdf`} target="_blank" rel="noopener noreferrer">
                <FaExternalLinkAlt />
                <span>Direct Download</span>
              </DirectDownloadLink>
            )}
          </ButtonsContainer>
        </ReceiptCard>
      
        {/* Payment Details Card */}
        <AccountDetailsCard>
          <TotalAmount>Total Amount: ₦{cartTotal.toLocaleString()}</TotalAmount>
          <h2>Payment Details</h2>
          <DetailRow>
            <Label>Bank Name:</Label>
            <Value>Stanbic IBTC Bank</Value>
          </DetailRow>
          <DetailRow>
            <Label>Account Name:</Label>
            <Value>Jumoke Obembe</Value>
          </DetailRow>
          <DetailRow>
            <Label>Account Number:</Label>
            <AccountNumberContainer>
              <Value>{showAccountNumber ? accountNumber : '••••••••••'}</Value>
              <ToggleButton onClick={toggleAccountNumber}>
                {showAccountNumber ? <FaEyeSlash /> : <FaEye />}
              </ToggleButton>
            </AccountNumberContainer>
          </DetailRow>
          <WhatsAppButton onClick={handleWhatsAppClick}>
            <FaWhatsapp size={24} />
            <span>Send Payment Receipt</span>
          </WhatsAppButton>
          <PaymentInstructions>
            <h3>How to Complete Your Order:</h3>
            <ol>
              <li>Make a bank transfer for the total amount shown above</li>
              <li>Download your receipt by clicking the button</li>
              <li>Send proof of payment via WhatsApp</li>
              <li>Your order will be processed after payment confirmation</li>
            </ol>
          </PaymentInstructions>
        </AccountDetailsCard>
      </div>
    </CheckoutContainer>
  );
};

const CheckoutContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: calc(100vh - 180px);
  padding: 2rem;
  margin-top: 80px;
  margin-bottom: 80px;
  background: #f8f9fa;

  @media (max-width: 768px) {
    margin-bottom: 100px;
    padding: 1rem;
  }
`;

const AccountDetailsCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;

  h2 {
    color: #1a1a1a;
    font-size: 1.8rem;
    margin-bottom: 2rem;
    text-align: center;
    font-weight: 600;
  }
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #eee;
`;

const Label = styled.span`
  color: #666;
  font-weight: 500;
`;

const Value = styled.span`
  color: #1a1a1a;
  font-weight: 600;
`;

const WhatsAppButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 1rem;
  margin-top: 2rem;
  background: #25D366;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #128C7E;
    transform: translateY(-2px);
  }

  svg {
    margin-right: 8px;
  }
`;

const TotalAmount = styled.div`
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  font-size: 1.4rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 2rem;
  border: 2px solid #e9ecef;
`;

const AccountNumberContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  transition: color 0.3s ease;

  &:hover {
    color: var(--primary-color);
  }
`;

// New styled components for receipt
const ReceiptCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 700px;
`;

const ReceiptHeader = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
  
  h1 {
    font-size: 1.8rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    color: #1a1a1a;
  }
  
  p {
    font-size: 1.2rem;
    color: #666;
  }
`;

const ReceiptDetails = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  
  div {
    p {
      margin-bottom: 0.5rem;
      color: #666;
    }
  }
`;

const ItemsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 2rem;
  
  th, td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid #eee;
  }
  
  th {
    background-color: #f8f9fa;
    font-weight: 600;
    color: #1a1a1a;
  }
  
  td {
    color: #666;
  }
  
  @media (max-width: 768px) {
    th, td {
      padding: 0.5rem;
      font-size: 0.9rem;
    }
  }
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem 0;
  border-top: 2px solid #eee;
  margin-bottom: 2rem;
  font-weight: 700;
  font-size: 1.2rem;
  color: #1a1a1a;
`;

const ReceiptFooter = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  color: #666;
  
  p {
    margin-bottom: 0.5rem;
  }
`;

const DownloadButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 1rem;
  background: #4285F4;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: ${props => props.disabled ? 0.7 : 1};
  pointer-events: ${props => props.disabled ? 'none' : 'auto'};

  &:hover {
    background: ${props => props.disabled ? '#4285F4' : '#3367D6'};
    transform: ${props => props.disabled ? 'none' : 'translateY(-2px)'};
  }

  svg {
    margin-right: 8px;
  }
`;

// Add new styled components for success message and payment instructions
const SuccessMessage = styled.div`
  position: fixed;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #4CAF50;
  color: white;
  padding: 15px 25px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  animation: fadeIn 0.3s, fadeOut 0.3s 4.7s;
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
  
  p {
    margin: 0;
    font-weight: 500;
  }
`;

const ErrorMessage = styled.div`
  position: fixed;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #f44336;
  color: white;
  padding: 15px 25px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  animation: fadeIn 0.3s, fadeOut 0.3s 4.7s;
  
  p {
    margin: 0;
    font-weight: 500;
  }
`;

const PaymentInstructions = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  
  h3 {
    font-size: 1.1rem;
    margin-bottom: 1rem;
    color: #333;
  }
  
  ol {
    padding-left: 1.2rem;
    
    li {
      margin-bottom: 0.5rem;
      color: #555;
    }
  }
`;

// Update styled components to include new button container and direct download link
const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const DirectDownloadLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 1rem;
  background: #34A853;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #2E8B57;
    transform: translateY(-2px);
  }

  svg {
    margin-right: 8px;
  }
`;

export default Checkout;
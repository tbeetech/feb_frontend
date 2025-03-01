import React, { useState } from 'react';
import { FaWhatsapp, FaEye, FaEyeSlash } from 'react-icons/fa';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

const Checkout = () => {
  const [showAccountNumber, setShowAccountNumber] = useState(false);
  const whatsappNumber = '+2348033825144';
  const location = useLocation();
  const cartTotal = location.state?.total || 0;
  const accountNumber = '0038685089';

  const handleWhatsAppClick = () => {
    window.open(`https://wa.me/${whatsappNumber}`, '_blank');
  };

  const toggleAccountNumber = () => {
    setShowAccountNumber(!showAccountNumber);
  };

  return (
    <CheckoutContainer>
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
      </AccountDetailsCard>
    </CheckoutContainer>
  );
};

const CheckoutContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 180px); /* Adjust for header and footer */
  padding: 2rem;
  margin-top: 80px; /* Add space below header */
  margin-bottom: 80px; /* Add space above footer/bottom nav */
  background: #f8f9fa;

  @media (max-width: 768px) {
    margin-bottom: 100px; /* Additional space for bottom nav on mobile */
  }
`;

const AccountDetailsCard = styled.div`
  background: white;
  padding: 2.5rem;
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

export default Checkout;
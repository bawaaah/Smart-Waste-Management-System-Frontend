import axios from 'axios';
import { toast } from 'react-toastify';

// Factory function for calculating payment based on device type
export const calculatePayment = (deviceType, spaceLeft, capacity) => {
    const usedCapacity = capacity - spaceLeft;
    const usagePercentage = (usedCapacity / capacity) * 100;
  
    // Modify the base amount calculation based on used capacity
    let baseAmount = usedCapacity * 1; // Assuming $1 per unit used
    let discountAmount = 0;
  
    if (deviceType === 'Paper' || deviceType === 'Glass') {
      discountAmount = baseAmount * 0.2; // 20% discount
      baseAmount *= 0.8; // Apply discount (80% of original amount)
    }
  
    return {
      usedCapacity,
      usagePercentage: usagePercentage.toFixed(2),
      baseAmount: baseAmount.toFixed(2),
      discountAmount: discountAmount.toFixed(2),
      finalAmount: (baseAmount - discountAmount).toFixed(2),
    };
  };
  

// Payment Strategy for handling different payment methods
export const cardPaymentStrategy = (amount, userId, navigate) => {
  navigate('/PaymentGateway', { state: { amount: amount, userId: userId } });
};

export const walletPaymentStrategy = (amount, userId, navigate) => {
  console.log(`Processing wallet payment for userId: ${userId}, amount: $${amount}`);
  // Show toast message for wallet payment confirmation
  toast.success(`Wallet payment of $${amount} confirmed!`, { autoClose: 3000 });

  // Redirect to the homepage after 3 seconds (delay for toast to show)
  setTimeout(() => {
    navigate('/schedule');
  }, 3000);
};

// Function to fetch device data from the API
export const fetchDeviceData = async (deviceId) => {
  const response = await axios.get(`http://localhost:3000/api/payments/viewSchedulePayment`, {
    params: { deviceId: deviceId },
  });
  return response.data[0]; // Assuming data[0] contains the required device info
};

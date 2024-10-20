class GeneralWastePaymentCalculator {
    calculate(usagePercentage) {
      let discountAmount = 0;
      const baseAmount = usagePercentage * 2; // Base rate $2 per percentage
      if (usagePercentage >= 80) {
        discountAmount = baseAmount * 0.2; // 20% discount for high usage
      }
      const calculatedAmount = baseAmount - discountAmount;
      return { calculatedAmount, discountAmount };
    }
  }
  
  class HazardousWastePaymentCalculator {
    calculate(usagePercentage) {
      let discountAmount = 0;
      const baseAmount = usagePercentage * 3; // Base rate $3 per percentage for hazardous waste
      if (usagePercentage >= 80) {
        discountAmount = baseAmount * 0.1; // 10% discount
      }
      const calculatedAmount = baseAmount - discountAmount;
      return { calculatedAmount, discountAmount };
    }
  }
  
  // Factory for creating payment calculators
  const PaymentCalculationFactory = {
    createPaymentCalculator(deviceType) {
      switch (deviceType) {
        case 'general_waste':
          return new GeneralWastePaymentCalculator();
        case 'hazardous_waste':
          return new HazardousWastePaymentCalculator();
        default:
          throw new Error('Unsupported device type');
      }
    },
  };
  
  export default PaymentCalculationFactory;
  
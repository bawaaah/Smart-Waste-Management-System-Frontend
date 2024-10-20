import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { 
  calculatePayment, 
  cardPaymentStrategy, 
  walletPaymentStrategy, 
  fetchDeviceData 
} from './PaymentService'; // Adjust the import path as necessary
import { toast } from 'react-toastify';

// Create a mock adapter for axios
const mock = new MockAdapter(axios);

describe('PaymentService', () => {
  afterEach(() => {
    // Reset the mock adapter after each test
    mock.reset();
  });

  describe('calculatePayment', () => {
    it('should calculate payment correctly for standard devices', () => {
      const deviceType = 'Plastic';
      const spaceLeft = 50;
      const capacity = 100;

      const result = calculatePayment(deviceType, spaceLeft, capacity);
      expect(result).toEqual({
        usedCapacity: 50,
        usagePercentage: '50.00',
        baseAmount: '50.00', // 50 units used * $1/unit
        discountAmount: '0.00',
        finalAmount: '50.00',
      });
    });

    it('should apply discount for Paper devices', () => {
      const deviceType = 'Paper';
      const spaceLeft = 30;
      const capacity = 100;

      const result = calculatePayment(deviceType, spaceLeft, capacity);
      expect(result).toEqual({
        usedCapacity: 70,
        usagePercentage: '70.00',
        baseAmount: '56.00', // 70 units used * $1/unit * 0.8 after discount
        discountAmount: '14.00', // 20% of 70
        finalAmount: '42.00', // 56 - 14
      });
    });

    it('should apply discount for Glass devices', () => {
      const deviceType = 'Glass';
      const spaceLeft = 20;
      const capacity = 100;

      const result = calculatePayment(deviceType, spaceLeft, capacity);
      expect(result).toEqual({
        usedCapacity: 80,
        usagePercentage: '80.00',
        baseAmount: '64.00', // 80 units used * $1/unit * 0.8 after discount
        discountAmount: '16.00', // 20% of 80
        finalAmount: '48.00', // 64 - 16
      });
    });
  });

  describe('cardPaymentStrategy', () => {
    it('should navigate to PaymentGateway with correct parameters', () => {
      const navigateMock = jest.fn();
      const amount = 10.00;
      const userId = '12345';

      cardPaymentStrategy(amount, userId, navigateMock);

      expect(navigateMock).toHaveBeenCalledWith('/PaymentGateway', { state: { amount: amount, userId: userId } });
    });
  });

  describe('walletPaymentStrategy', () => {
    it('should log the wallet payment processing and show a toast message', () => {
      const consoleLogMock = jest.spyOn(console, 'log').mockImplementation();
      const toastMock = jest.spyOn(toast, 'success').mockImplementation();
      const navigateMock = jest.fn();
      const amount = 20.00;
      const userId = '12345';

      walletPaymentStrategy(amount, userId, navigateMock);

      expect(consoleLogMock).toHaveBeenCalledWith(`Processing wallet payment for userId: ${userId}, amount: $${amount}`);
      expect(toastMock).toHaveBeenCalledWith(`Wallet payment of $${amount} confirmed!`, { autoClose: 3000 });

      consoleLogMock.mockRestore();
      toastMock.mockRestore();
    });
  });

  describe('fetchDeviceData', () => {
    it('should fetch device data from the API', async () => {
      const deviceId = 'abc123';
      const mockDeviceData = { id: deviceId, spaceLeft: 50, capacity: 100, deviceType: 'Plastic' };

      // Mock the GET request to the specific URL
      mock.onGet(`http://localhost:3000/api/payments/viewSchedulePayment`, {
        params: { deviceId: deviceId },
      }).reply(200, [mockDeviceData]);

      const result = await fetchDeviceData(deviceId);
      expect(result).toEqual(mockDeviceData);
    });

    it('should throw an error if the API call fails', async () => {
      const deviceId = 'abc123';
      mock.onGet(`http://localhost:3000/api/payments/viewSchedulePayment`).reply(500);

      await expect(fetchDeviceData(deviceId)).rejects.toThrow();
    });
  });
});

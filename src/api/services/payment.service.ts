import { apiClient } from '../client';
import { Endpoints } from '@/constants/api';
import type {
  InitiatePaymentRequest,
  RazorpayInitiateResponse,
  VerifyPaymentRequest,
  VerifyPaymentResponse,
  CreateOrderRequest,
  CreatedOrder,
} from '@/types/order.types';

export const PaymentService = {
  // Step 1: Create the order → status becomes RESERVED
  async createOrder(data: CreateOrderRequest): Promise<CreatedOrder> {
    const res = await apiClient.post<{ message: string; data: CreatedOrder }>(
      Endpoints.orders.create,
      data,
    );
    return res.data.data;
  },

  // Step 2: Initiate payment → get Razorpay order details (or COD shortcut)
  async initiatePayment(data: InitiatePaymentRequest): Promise<RazorpayInitiateResponse> {
    const res = await apiClient.post<{ message: string; data: RazorpayInitiateResponse }>(
      Endpoints.payments.initiate,
      data,
    );
    return res.data.data;
  },

  // Step 4: Verify Razorpay signature → order status → PAID
  async verifyPayment(data: VerifyPaymentRequest): Promise<VerifyPaymentResponse> {
    const res = await apiClient.post<{ message: string; data: VerifyPaymentResponse }>(
      Endpoints.payments.verify,
      data,
    );
    return res.data.data;
  },
};

import { apiClient } from '../client';
import { Endpoints } from '@/constants/api';

export const NewsletterService = {
  async subscribe(email: string): Promise<void> {
    await apiClient.post(Endpoints.newsletter.subscribe, { email });
  },
};

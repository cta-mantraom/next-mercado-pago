// Shared payment domain-ish types and helpers for Checkout Pro boundaries
// Keep lightweight and framework-agnostic so it can be imported by client and server code.

export interface CheckoutFormData {
  testeId: string;
  name: string;
  phone: string;
  email: string;
  userEmail?: string;
}

export interface CheckoutMetadata {
  testeId: string;
  name?: string;
  phone?: string;
  userEmail?: string;
  // Versioning helps evolve metadata safely over time
  version?: 'v1';
}

export type PaymentStatus = 'approved' | 'rejected' | 'pending';

export function mapMpStatusToInternal(status: string): PaymentStatus {
  switch (status) {
    case 'approved':
      return 'approved';
    case 'rejected':
      return 'rejected';
    case 'in_process':
    case 'pending':
    default:
      return 'pending';
  }
}
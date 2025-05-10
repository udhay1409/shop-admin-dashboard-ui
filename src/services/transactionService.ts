
import { supabase } from "@/integrations/supabase/client";

// Define transaction type
interface Transaction {
  id: string;
  orderId: string;
  amount: number;
  status: string;
  method: string;
  email: string;
  contact: string;
  created: Date;
  card?: {
    last4: string;
    network: string;
  };
  upi?: {
    vpa: string;
  };
  bank?: {
    name: string;
  };
  wallet?: {
    name: string;
  };
}

interface TransactionsResponse {
  transactions: Transaction[];
  total: number;
}

export const fetchTransactions = async (): Promise<TransactionsResponse> => {
  try {
    // In a real implementation this would fetch from the payments table
    // For now we'll fetch orders and treat them as transactions
    const { data: orders, error, count } = await supabase
      .from('orders')
      .select(`
        id,
        created_at,
        total_amount,
        payment_status,
        payment_method,
        user_id,
        profiles:user_id (email, phone)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (error) throw error;
    
    // Map orders to transaction format
    const transactions: Transaction[] = orders.map(order => {
      const paymentMethod = order.payment_method || 'card';
      
      const transaction: Transaction = {
        id: `pay_${order.id.substring(0, 8)}`,
        orderId: order.id,
        amount: order.total_amount || 0,
        status: mapPaymentStatus(order.payment_status || 'pending'),
        method: paymentMethod,
        email: order.profiles?.email || 'customer@example.com',
        contact: order.profiles?.phone || '+919876543210',
        created: new Date(order.created_at)
      };
      
      // Add payment method details based on the method
      if (paymentMethod === 'card') {
        transaction.card = {
          last4: '1234',
          network: 'Visa'
        };
      } else if (paymentMethod === 'upi') {
        transaction.upi = {
          vpa: 'user@upi'
        };
      } else if (paymentMethod === 'netbanking') {
        transaction.bank = {
          name: 'HDFC'
        };
      } else if (paymentMethod === 'wallet') {
        transaction.wallet = {
          name: 'Paytm'
        };
      }
      
      return transaction;
    });
    
    return {
      transactions,
      total: count || transactions.length
    };
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};

// Helper function to map payment status from database to display status
function mapPaymentStatus(status: string): string {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'captured';
    case 'pending':
      return 'authorized';
    case 'failed':
      return 'failed';
    case 'refunded':
      return 'refunded';
    default:
      return status;
  }
}

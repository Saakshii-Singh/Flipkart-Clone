import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function OrderConfirmation() {
  const { id } = useParams<{ id: string }>();

  const { data: order } = useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*, products(*))')
        .eq('id', id!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-card rounded-sm shadow-sm p-8 text-center">
          <CheckCircle className="w-16 h-16 text-flipkart-green mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Order Placed Successfully!</h1>
          <p className="text-muted-foreground mb-6">Your order has been confirmed</p>
          
          <div className="bg-accent rounded-sm p-4 mb-6 inline-block">
            <p className="text-sm text-muted-foreground">Order ID</p>
            <p className="text-lg font-bold text-foreground font-mono">{id?.slice(0, 8).toUpperCase()}</p>
          </div>

          {order && (
            <div className="text-left border-t border-border pt-6 mt-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Amount</span>
                <span className="font-bold text-foreground">₹{Number(order.total_amount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <span className="text-flipkart-green font-medium capitalize">{order.status}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Items</span>
                <span className="text-foreground">{order.order_items?.length || 0} items</span>
              </div>
            </div>
          )}

          <Link to="/" className="block mt-8">
            <Button className="bg-primary text-primary-foreground font-bold px-8 rounded-sm">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

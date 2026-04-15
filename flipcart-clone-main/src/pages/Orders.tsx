import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Package, ShoppingBag } from 'lucide-react';

export default function Orders() {
  const { user } = useAuth();

  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*, products(title, images))')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-lg font-medium text-foreground mb-2">Login to view your orders</h2>
          <Link to="/login"><Button className="bg-primary text-primary-foreground">Login</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-xl font-bold text-foreground mb-4">My Orders</h1>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="bg-card rounded-sm shadow-sm h-32 animate-pulse" />)}
          </div>
        ) : orders?.length === 0 ? (
          <div className="bg-card rounded-sm shadow-sm p-12 text-center">
            <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground mb-4">No orders yet</p>
            <Link to="/"><Button className="bg-primary text-primary-foreground">Start Shopping</Button></Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders?.map((order) => (
              <div key={order.id} className="bg-card rounded-sm shadow-sm overflow-hidden">
                <div className="p-4 bg-muted flex flex-wrap items-center justify-between gap-2 text-sm">
                  <div className="flex gap-6">
                    <div>
                      <span className="text-muted-foreground">Order ID</span>
                      <p className="font-mono font-bold text-foreground">{order.id.slice(0, 8).toUpperCase()}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Date</span>
                      <p className="font-medium text-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Total</span>
                      <p className="font-bold text-foreground">₹{Number(order.total_amount).toLocaleString()}</p>
                    </div>
                  </div>
                  <span className="text-xs bg-flipkart-green text-primary-foreground px-2 py-1 rounded-sm font-medium capitalize">{order.status}</span>
                </div>
                <div className="divide-y divide-border">
                  {(order.order_items as any[])?.map((item: any) => (
                    <div key={item.id} className="p-4 flex items-center gap-4">
                      <img src={item.products?.images?.[0] || '/placeholder.svg'} alt="" className="w-14 h-14 object-contain flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground line-clamp-1">{item.products?.title}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity} × ₹{Number(item.price).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

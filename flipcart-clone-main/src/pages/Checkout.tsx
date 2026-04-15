import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { getSessionId } from '@/lib/session';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

export default function Checkout() {
  const { cartQuery, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    name: '', phone: '', pincode: '', locality: '', address: '', city: '', state: '',
  });

  const items = cartQuery.data?.items || [];

  const subtotal = items.reduce((sum, item) => {
    const product = item.products as any;
    const price = Number(product.price);
    const discount = product.discount || 0;
    return sum + Math.round(price * (1 - discount / 100)) * item.quantity;
  }, 0);

  const handleOrder = async () => {
    if (!address.name || !address.phone || !address.pincode || !address.address || !address.city || !address.state) {
      toast({ title: 'Please fill all address fields', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          session_id: getSessionId(),
          user_id: user?.id || null,
          total_amount: subtotal,
          address: address as any,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = items.map((item) => {
        const product = item.products as any;
        const price = Number(product.price);
        const discount = product.discount || 0;
        return {
          order_id: order.id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: Math.round(price * (1 - discount / 100)),
        };
      });

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;

      await clearCart.mutateAsync();
      navigate(`/order/${order.id}`);
    } catch (error) {
      toast({ title: 'Failed to place order', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-6 grid md:grid-cols-[1fr_300px] gap-4">
        {/* Address Form */}
        <div className="bg-card rounded-sm shadow-sm">
          <div className="p-4 border-b border-border bg-primary">
            <h2 className="text-base font-bold text-primary-foreground">DELIVERY ADDRESS</h2>
          </div>
          <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <Input placeholder="Name" value={address.name} onChange={e => setAddress(a => ({...a, name: e.target.value}))} className="rounded-sm" />
            <Input placeholder="Phone Number" value={address.phone} onChange={e => setAddress(a => ({...a, phone: e.target.value}))} className="rounded-sm" />
            <Input placeholder="Pincode" value={address.pincode} onChange={e => setAddress(a => ({...a, pincode: e.target.value}))} className="rounded-sm" />
            <Input placeholder="Locality" value={address.locality} onChange={e => setAddress(a => ({...a, locality: e.target.value}))} className="rounded-sm" />
            <Input placeholder="Address (Area and Street)" value={address.address} onChange={e => setAddress(a => ({...a, address: e.target.value}))} className="sm:col-span-2 rounded-sm" />
            <Input placeholder="City/District/Town" value={address.city} onChange={e => setAddress(a => ({...a, city: e.target.value}))} className="rounded-sm" />
            <Input placeholder="State" value={address.state} onChange={e => setAddress(a => ({...a, state: e.target.value}))} className="rounded-sm" />
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-card rounded-sm shadow-sm h-fit sticky top-20">
          <div className="p-4 border-b border-border">
            <h3 className="text-sm font-bold text-muted-foreground uppercase">Order Summary</h3>
          </div>
          <div className="p-4 space-y-2 text-sm">
            {items.map((item) => {
              const product = item.products as any;
              return (
                <div key={item.id} className="flex justify-between">
                  <span className="text-foreground line-clamp-1 flex-1">{product.title} × {item.quantity}</span>
                </div>
              );
            })}
            <div className="border-t border-dashed border-border pt-3 flex justify-between font-bold text-base">
              <span className="text-foreground">Total</span>
              <span className="text-foreground">₹{subtotal.toLocaleString()}</span>
            </div>
          </div>
          <div className="p-4 border-t border-border">
            <Button
              onClick={handleOrder}
              disabled={loading}
              className="w-full bg-flipkart-orange hover:bg-flipkart-orange/90 text-primary-foreground font-bold py-5 rounded-sm"
            >
              {loading ? 'Placing Order...' : 'PLACE ORDER'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

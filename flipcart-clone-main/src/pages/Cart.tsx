import { useCart } from '@/hooks/useCart';
import Navbar from '@/components/Navbar';
import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

export default function Cart() {
  const { cartQuery, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();
  const items = cartQuery.data?.items || [];

  const subtotal = items.reduce((sum, item) => {
    const product = item.products as any;
    const price = Number(product.price);
    const discount = product.discount || 0;
    const discountedPrice = Math.round(price * (1 - discount / 100));
    return sum + discountedPrice * item.quantity;
  }, 0);

  const totalDiscount = items.reduce((sum, item) => {
    const product = item.products as any;
    const price = Number(product.price);
    const discount = product.discount || 0;
    return sum + Math.round(price * discount / 100) * item.quantity;
  }, 0);

  if (cartQuery.isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {items.length === 0 ? (
          <div className="bg-card rounded-sm shadow-sm p-8 sm:p-12 text-center">
            <p className="text-lg text-muted-foreground mb-4">Your cart is empty</p>
            <Link to="/"><Button className="bg-primary text-primary-foreground">Shop Now</Button></Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_300px] gap-4">
            <div className="bg-card rounded-sm shadow-sm">
              <div className="p-4 border-b border-border">
                <h2 className="text-base sm:text-lg font-medium text-foreground">My Cart ({items.length})</h2>
              </div>
              <div className="divide-y divide-border">
                {items.map((item) => {
                  const product = item.products as any;
                  const price = Number(product.price);
                  const discount = product.discount || 0;
                  const discountedPrice = Math.round(price * (1 - discount / 100));

                  return (
                    <div key={item.id} className="p-3 sm:p-4 flex gap-3 sm:gap-4">
                      <Link to={`/product/${product.id}`} className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
                        <img src={product.images?.[0] || '/placeholder.svg'} alt={product.title} className="w-full h-full object-contain" />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link to={`/product/${product.id}`}>
                          <h3 className="text-xs sm:text-sm font-medium text-foreground line-clamp-2 hover:text-primary">{product.title}</h3>
                        </Link>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className="text-sm sm:text-base font-bold text-foreground">₹{discountedPrice.toLocaleString()}</span>
                          {discount > 0 && (
                            <>
                              <span className="text-[10px] sm:text-xs text-muted-foreground line-through">₹{price.toLocaleString()}</span>
                              <span className="text-[10px] sm:text-xs text-flipkart-green font-medium">{discount}% off</span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-2 sm:mt-3">
                          <div className="flex items-center border border-border rounded-full overflow-hidden">
                            <button onClick={() => updateQuantity.mutate({ itemId: item.id, quantity: item.quantity - 1 })} className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center hover:bg-muted transition-colors">
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 sm:w-10 text-center text-xs sm:text-sm font-medium border-x border-border">{item.quantity}</span>
                            <button onClick={() => updateQuantity.mutate({ itemId: item.id, quantity: item.quantity + 1 })} className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center hover:bg-muted transition-colors">
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button onClick={() => removeItem.mutate(item.id)} className="text-xs sm:text-sm font-medium text-muted-foreground hover:text-destructive transition-colors uppercase">
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="p-4 flex justify-end border-t border-border">
                <Button onClick={() => navigate('/checkout')} className="bg-flipkart-orange hover:bg-flipkart-orange/90 text-primary-foreground font-bold px-8 sm:px-12 py-5 rounded-sm text-sm">
                  PLACE ORDER
                </Button>
              </div>
            </div>

            {/* Price Details */}
            <div className="bg-card rounded-sm shadow-sm h-fit lg:sticky lg:top-20">
              <div className="p-4 border-b border-border">
                <h3 className="text-sm font-bold text-muted-foreground uppercase">Price Details</h3>
              </div>
              <div className="p-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-foreground">Price ({items.length} items)</span>
                  <span className="text-foreground">₹{(subtotal + totalDiscount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground">Discount</span>
                  <span className="text-flipkart-green">−₹{totalDiscount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground">Delivery Charges</span>
                  <span className="text-flipkart-green">FREE</span>
                </div>
                <div className="border-t border-dashed border-border pt-3 flex justify-between font-bold text-base">
                  <span className="text-foreground">Total Amount</span>
                  <span className="text-foreground">₹{subtotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

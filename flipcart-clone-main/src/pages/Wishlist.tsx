import { Link } from 'react-router-dom';
import { useWishlist } from '@/hooks/useWishlist';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Heart, ShoppingCart, Trash2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Wishlist() {
  const { user } = useAuth();
  const { wishlistQuery, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center px-4">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-lg font-medium text-foreground mb-2">Login to view your wishlist</h2>
            <Link to="/login"><Button className="bg-primary text-primary-foreground">Login</Button></Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const items = wishlistQuery.data || [];

  const handleMoveToCart = (productId: string) => {
    addToCart.mutate({ productId, quantity: 1 });
    toggleWishlist.mutate(productId);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-7xl mx-auto px-4 py-6 w-full">
        <h1 className="text-lg font-semibold text-foreground mb-4">My Wishlist ({items.length})</h1>
        {items.length === 0 ? (
          <div className="bg-card rounded-sm shadow-sm p-12 text-center">
            <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground mb-4">Your wishlist is empty</p>
            <Link to="/"><Button className="bg-primary text-primary-foreground">Explore Products</Button></Link>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => {
              const p = item.products as any;
              const discountedPrice = Math.round(Number(p.price) * (1 - (p.discount || 0) / 100));
              return (
                <div key={item.id} className="bg-card rounded-sm shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border border-border">
                  {/* Image */}
                  <Link to={`/product/${p.id}`} className="shrink-0 w-24 h-24 flex items-center justify-center">
                    <img src={p.images?.[0] || '/placeholder.svg'} alt={p.title} className="max-h-full max-w-full object-contain" />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${p.id}`} className="text-sm font-medium text-foreground hover:text-primary line-clamp-2">
                      {p.title}
                    </Link>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="inline-flex items-center gap-0.5 bg-flipkart-green text-primary-foreground text-[10px] px-1.5 py-0.5 rounded-sm font-medium">
                        {Number(p.rating)} <Star className="w-2.5 h-2.5 fill-current" />
                      </span>
                      <span className="text-[10px] text-muted-foreground">({(p.rating_count || 0).toLocaleString()})</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className="text-base font-bold text-foreground">₹{discountedPrice.toLocaleString()}</span>
                      {(p.discount || 0) > 0 && (
                        <>
                          <span className="text-xs text-muted-foreground line-through">₹{Number(p.price).toLocaleString()}</span>
                          <span className="text-xs text-flipkart-green font-medium">{p.discount}% off</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
                    <Button
                      size="sm"
                      className="flex-1 sm:flex-none bg-primary text-primary-foreground text-xs gap-1.5"
                      onClick={() => handleMoveToCart(p.id)}
                    >
                      <ShoppingCart className="w-3.5 h-3.5" /> Move to Cart
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 sm:flex-none text-xs gap-1.5"
                      onClick={() => toggleWishlist.mutate(p.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

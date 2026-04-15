import { useParams, useNavigate } from 'react-router-dom';
import { useProduct } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';
import { Star, ShoppingCart, Zap, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading } = useProduct(id!);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [imageIndex, setImageIndex] = useState(0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-6 grid md:grid-cols-2 gap-8">
          <Skeleton className="aspect-square" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return <div>Product not found</div>;

  const discountedPrice = Math.round(Number(product.price) * (1 - (product.discount || 0) / 100));
  const images = product.images?.length ? product.images : ['/placeholder.svg'];
  const wishlisted = isInWishlist(product.id);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="bg-card rounded-sm shadow-sm p-4 sm:p-8 grid md:grid-cols-[minmax(250px,400px)_1fr] gap-6 sm:gap-8">
          {/* Image carousel */}
          <div className="md:sticky md:top-20">
            <div className="relative aspect-square flex items-center justify-center bg-card border border-border rounded-sm overflow-hidden mb-3">
              <img src={images[imageIndex]} alt={product.title} className="max-h-full max-w-full object-contain" />
              {images.length > 1 && (
                <>
                  <button onClick={() => setImageIndex((i) => (i > 0 ? i - 1 : images.length - 1))} className="absolute left-2 top-1/2 -translate-y-1/2 bg-card/80 rounded-full p-1 shadow hover:bg-card">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button onClick={() => setImageIndex((i) => (i < images.length - 1 ? i + 1 : 0))} className="absolute right-2 top-1/2 -translate-y-1/2 bg-card/80 rounded-full p-1 shadow hover:bg-card">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
              {user && (
                <button onClick={() => toggleWishlist.mutate(product.id)} className="absolute top-2 right-2 p-2 rounded-full bg-card/80 hover:bg-card shadow-sm">
                  <Heart className={`w-5 h-5 ${wishlisted ? 'fill-destructive text-destructive' : 'text-muted-foreground'}`} />
                </button>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setImageIndex(i)} className={`w-14 h-14 sm:w-16 sm:h-16 border rounded-sm overflow-hidden flex-shrink-0 ${i === imageIndex ? 'border-primary' : 'border-border'}`}>
                    <img src={img} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
            <div className="flex gap-2 sm:gap-3 mt-4">
              <Button onClick={() => addToCart.mutate({ productId: product.id })} className="flex-1 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold py-5 sm:py-6 rounded-sm text-xs sm:text-sm">
                <ShoppingCart className="w-4 sm:w-5 h-4 sm:h-5 mr-1 sm:mr-2" /> ADD TO CART
              </Button>
              <Button onClick={() => { addToCart.mutate({ productId: product.id }); navigate('/cart'); }} className="flex-1 bg-flipkart-orange hover:bg-flipkart-orange/90 text-primary-foreground font-bold py-5 sm:py-6 rounded-sm text-xs sm:text-sm">
                <Zap className="w-4 sm:w-5 h-4 sm:h-5 mr-1 sm:mr-2" /> BUY NOW
              </Button>
            </div>
          </div>

          {/* Product info */}
          <div className="space-y-4">
            <h1 className="text-lg sm:text-xl md:text-2xl font-medium text-foreground">{product.title}</h1>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-0.5 bg-flipkart-green text-primary-foreground text-sm px-2 py-0.5 rounded-sm font-bold">
                {product.rating} <Star className="w-3.5 h-3.5 fill-current" />
              </span>
              <span className="text-sm text-muted-foreground font-medium">{product.rating_count?.toLocaleString()} Ratings</span>
            </div>
            <div className="flex items-baseline gap-2 sm:gap-3 flex-wrap">
              <span className="text-2xl sm:text-3xl font-bold text-foreground">₹{discountedPrice.toLocaleString()}</span>
              {(product.discount || 0) > 0 && (
                <>
                  <span className="text-base sm:text-lg text-muted-foreground line-through">₹{Number(product.price).toLocaleString()}</span>
                  <span className="text-base sm:text-lg text-flipkart-green font-medium">{product.discount}% off</span>
                </>
              )}
            </div>
            <div className="text-sm">
              {product.stock > 0 ? (
                <span className="text-flipkart-green font-medium">In Stock ({product.stock} available)</span>
              ) : (
                <span className="text-destructive font-medium">Out of Stock</span>
              )}
            </div>
            <div className="border-t border-border pt-4">
              <h3 className="font-medium text-foreground mb-2">Description</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
            </div>
            <div className="border-t border-border pt-4">
              <h3 className="font-medium text-foreground mb-2">Category</h3>
              <span className="text-sm bg-accent text-accent-foreground px-3 py-1 rounded-sm">{product.category}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

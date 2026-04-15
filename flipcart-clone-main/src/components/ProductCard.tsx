import { Link } from 'react-router-dom';
import { Star, Heart } from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';
import { useAuth } from '@/hooks/useAuth';

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  discount: number;
  images: string[];
  rating: number;
  rating_count: number;
}

export default function ProductCard({ id, title, price, discount, images, rating, rating_count }: ProductCardProps) {
  const discountedPrice = Math.round(price * (1 - discount / 100));
  const { user } = useAuth();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const wishlisted = isInWishlist(id);

  return (
    <div className="bg-card rounded-sm shadow-sm hover:shadow-lg transition-shadow p-3 sm:p-4 group relative h-full flex flex-col">
      {user && (
        <button
          onClick={(e) => { e.preventDefault(); toggleWishlist.mutate(id); }}
          className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-card/80 hover:bg-card shadow-sm transition-colors"
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-destructive text-destructive' : 'text-muted-foreground'}`} />
        </button>
      )}
      <Link to={`/product/${id}`} className="flex-1 flex flex-col">
        <div className="aspect-square flex items-center justify-center overflow-hidden mb-2 sm:mb-3">
          <img
            src={images?.[0] || '/placeholder.svg'}
            alt={title}
            loading="lazy"
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="flex-1 flex flex-col gap-1">
          <h3 className="text-xs sm:text-sm text-foreground font-medium line-clamp-2">{title}</h3>
          <div className="flex items-center gap-1">
            <span className="inline-flex items-center gap-0.5 bg-flipkart-green text-primary-foreground text-[10px] sm:text-xs px-1 sm:px-1.5 py-0.5 rounded-sm font-medium">
              {rating} <Star className="w-2.5 sm:w-3 h-2.5 sm:h-3 fill-current" />
            </span>
            <span className="text-[10px] sm:text-xs text-muted-foreground">({rating_count.toLocaleString()})</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 mt-auto pt-1 flex-wrap">
            <span className="text-sm sm:text-base font-bold text-foreground">₹{discountedPrice.toLocaleString()}</span>
            {discount > 0 && (
              <>
                <span className="text-[10px] sm:text-xs text-muted-foreground line-through">₹{price.toLocaleString()}</span>
                <span className="text-[10px] sm:text-xs text-flipkart-green font-medium">{discount}% off</span>
              </>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}

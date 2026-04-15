import { useSearchParams } from 'react-router-dom';
import { useProducts, useCategories } from '@/hooks/useProducts';
import ProductCard from '@/components/ProductCard';
import Navbar from '@/components/Navbar';
import PromoBanner from '@/components/PromoBanner';
import { Skeleton } from '@/components/ui/skeleton';
import Footer from '@/components/Footer';

export default function Index() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || 'All';

  const { data: products, isLoading } = useProducts(search, category);
  const { data: categories } = useCategories();

  const handleCategory = (cat: string) => {
    const params = new URLSearchParams(searchParams);
    if (cat === 'All') params.delete('category');
    else params.set('category', cat);
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      {/* Promo Banner */}
      {!search && category === 'All' && <PromoBanner />}

      {/* Category bar */}
      <div className="bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 flex gap-4 sm:gap-6 overflow-x-auto py-3 scrollbar-hide">
          {categories?.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategory(cat)}
              className={`text-xs sm:text-sm whitespace-nowrap font-medium transition-colors ${
                category === cat
                  ? 'text-primary border-b-2 border-primary pb-1'
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="flex-1 max-w-7xl mx-auto px-3 sm:px-4 py-4 w-full">
        {search && (
          <p className="text-sm text-muted-foreground mb-3">
            Showing results for "<span className="font-medium text-foreground">{search}</span>"
          </p>
        )}

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-56 sm:h-72 rounded-sm" />
            ))}
          </div>
        ) : products?.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg text-muted-foreground">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
            {products?.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                title={product.title}
                price={Number(product.price)}
                discount={product.discount || 0}
                images={product.images}
                rating={Number(product.rating)}
                rating_count={product.rating_count || 0}
              />
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}

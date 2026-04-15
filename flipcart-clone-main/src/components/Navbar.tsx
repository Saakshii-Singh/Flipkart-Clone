import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Heart, User, Package, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Navbar() {
  const [search, setSearch] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { cartItemCount } = useCart();
  const { user, signOut } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/?search=${encodeURIComponent(search)}`);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-primary shadow-md">
      <div className="max-w-7xl mx-auto px-4 flex items-center h-14 gap-3">
        <Link to="/" className="flex items-center gap-1 shrink-0">
          <span className="text-xl font-bold text-primary-foreground italic">Flipkart</span>
          <span className="text-[10px] text-flipkart-yellow italic hidden sm:block">
            Explore <span className="text-primary-foreground">Plus</span> ⁺
          </span>
        </Link>

        {/* Desktop search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xl hidden sm:block">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for products, brands and more"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full py-2 px-4 pr-10 rounded-sm text-sm bg-card text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-primary">
              <Search className="w-5 h-5" />
            </button>
          </div>
        </form>

        <div className="flex items-center gap-1 sm:gap-3 ml-auto">
          {/* User dropdown */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-primary-foreground hover:opacity-90 transition-opacity text-sm font-medium px-2 py-1">
                <User className="w-5 h-5" />
                <span className="hidden md:block max-w-[100px] truncate">{user.email?.split('@')[0]}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => navigate('/orders')}>
                  <Package className="w-4 h-4 mr-2" /> My Orders
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/wishlist')}>
                  <Heart className="w-4 h-4 mr-2" /> Wishlist
                </DropdownMenuItem>
                <DropdownMenuItem onClick={async () => { await signOut(); navigate('/'); }}>
                  <LogOut className="w-4 h-4 mr-2" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login" className="text-primary-foreground text-sm font-medium hover:opacity-90 px-2 py-1 hidden sm:block">
              Login
            </Link>
          )}

          {/* Wishlist */}
          <Link to="/wishlist" className="text-primary-foreground hover:opacity-90 transition-opacity hidden sm:block">
            <Heart className="w-5 h-5" />
          </Link>

          {/* Cart */}
          <Link to="/cart" className="flex items-center gap-1 text-primary-foreground hover:opacity-90 transition-opacity relative">
            <ShoppingCart className="w-5 h-5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-secondary text-secondary-foreground text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
            <span className="text-sm font-medium hidden md:block">Cart</span>
          </Link>

          {/* Mobile menu toggle */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="sm:hidden text-primary-foreground">
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-primary border-t border-primary-foreground/10 px-4 pb-3 space-y-3">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full py-2 px-4 rounded-sm text-sm bg-card text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </form>
          <div className="flex flex-col gap-2">
            {user ? (
              <>
                <Link to="/orders" onClick={() => setMobileMenuOpen(false)} className="text-primary-foreground text-sm py-1 flex items-center gap-2">
                  <Package className="w-4 h-4" /> My Orders
                </Link>
                <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)} className="text-primary-foreground text-sm py-1 flex items-center gap-2">
                  <Heart className="w-4 h-4" /> Wishlist
                </Link>
                <button onClick={async () => { await signOut(); setMobileMenuOpen(false); navigate('/'); }} className="text-primary-foreground text-sm py-1 flex items-center gap-2 text-left">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-primary-foreground text-sm py-1 flex items-center gap-2">
                <User className="w-4 h-4" /> Login / Sign Up
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

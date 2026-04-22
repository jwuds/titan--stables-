import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogIn, LogOut, Menu, X, LayoutDashboard, Home, Info, BookOpen, 
  Sparkles, Star, Settings, ShoppingCart, Phone, MapPin, ShoppingBag, HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { useAuth } from '@/contexts/SupabaseAuthContext.jsx';
import { cn } from '@/lib/utils.js';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu.jsx';
import { useCart } from '@/hooks/useCart.jsx';
import SocialMediaLinks from '@/components/SocialMediaLinks.jsx';

const Header = ({ setIsCartOpen }) => {
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { cartItems } = useCart();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const isAdmin = user?.user_metadata?.role === 'admin' || user?.user_metadata?.role === 'super_admin';

  // Comprehensive Silo-based Navigation Structure
  const mainLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Horses', path: '/horses', icon: Sparkles },
    { name: 'Services', path: '/services', icon: Star },
    { name: 'Store', path: '/store', icon: ShoppingBag },
    { name: 'Locations', path: '/locations', icon: MapPin },
    { name: 'Blog', path: '/blog', icon: BookOpen },
    { name: 'FAQs', path: '/faqs', icon: HelpCircle },
    { name: 'About', path: '/about', icon: Info },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 text-foreground shadow-sm">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 group shrink-0" aria-label="Titan Stables Home">
          <div className="relative transition-transform group-hover:scale-105 h-[50px] md:h-[60px] flex items-center justify-center shrink-0">
            <img 
              src="https://horizons-cdn.hostinger.com/26e5af24-e95b-4c1d-b14c-1303ec73c93a/3ff94b3b66803dbf9ac97d0db5431ae1.jpg" 
              alt="Titan Stables - Premium KFPS Friesian Horses" 
              className="h-full w-auto object-contain rounded-sm" 
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-serif font-bold tracking-tight leading-none">
              Titan <span className="text-[#D4AF37]">Stables</span>
            </span>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground hidden lg:block">USA Import Experts</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center space-x-1" aria-label="Main Navigation">
          {mainLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => cn(
                "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap",
                isActive || (location.pathname === '/' && link.path === '/') || (location.pathname.startsWith(link.path + '/') && link.path !== '/')
                  ? "bg-secondary/20 text-primary font-bold" 
                  : "text-foreground/80 hover:bg-secondary/10 hover:text-primary"
              )}
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden xl:flex items-center space-x-3 shrink-0">
          <a 
            href="tel:+14342535844" 
            className="inline-flex items-center justify-center rounded-full text-sm font-bold transition-all h-10 px-5 bg-[#D4AF37] text-white hover:bg-[#b5952f] shadow-md hover:shadow-lg hover:-translate-y-0.5"
            aria-label="Call Titan Stables"
          >
            <Phone className="mr-2 h-4 w-4" /> Call Now
          </a>

          <Button 
            variant="ghost" 
            size="icon" 
            className="relative h-10 w-10 rounded-full hover:bg-secondary/20 transition-colors"
            onClick={() => setIsCartOpen && setIsCartOpen(true)}
            aria-label="Open Shopping Cart"
          >
            <ShoppingCart className="h-5 w-5 text-foreground" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-background shadow-sm">
                {cartItemCount}
              </span>
            )}
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full border border-border bg-background hover:bg-secondary/20">
                  <Settings className="h-5 w-5 text-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-card text-foreground border-border" align="end" forceMount>
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="cursor-pointer hover:bg-secondary/20"><LayoutDashboard className="mr-2 h-4 w-4" />Admin Dashboard</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer text-red-600 hover:bg-red-50"><LogOut className="mr-2 h-4 w-4" />Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/admin-login">
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-sm rounded-full px-5">
                <LogIn className="mr-2 h-4 w-4" /> Sign In
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Actions */}
        <div className="flex xl:hidden items-center gap-2">
           <a href="tel:+14342535844" className="inline-flex items-center justify-center rounded-full h-9 w-9 bg-[#D4AF37] text-white hover:bg-[#b5952f] shadow-sm mr-1"><Phone className="h-4 w-4" /></a>
           <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full text-foreground hover:bg-secondary/20" onClick={() => setIsCartOpen && setIsCartOpen(true)}>
            <ShoppingCart className="h-5 w-5" />
            {cartItemCount > 0 && <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-background">{cartItemCount}</span>}
          </Button>
           <Button variant="ghost" size="icon" onClick={toggleMenu} className="text-foreground hover:text-primary hover:bg-secondary/20">
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="xl:hidden bg-card border-t border-border shadow-xl overflow-hidden"
          >
            <div className="flex flex-col p-4 space-y-4 max-h-[85vh] overflow-y-auto">
              <nav className="flex flex-col space-y-1">
                {mainLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) => cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-base font-medium",
                      isActive || (location.pathname === '/' && link.path === '/') || (location.pathname.startsWith(link.path + '/') && link.path !== '/')
                        ? "bg-secondary/20 text-primary border-l-4 border-primary" 
                        : "text-foreground/80 hover:bg-secondary/10 hover:text-primary"
                    )}
                  >
                    <link.icon className={cn("w-5 h-5", ({ isActive }) => isActive ? "text-primary" : "text-foreground/60")} />
                    <span>{link.name}</span>
                  </NavLink>
                ))}
              </nav>

              <div className="pt-4 border-t border-border px-4 pb-2">
                <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-3">Connect With Us</p>
                <SocialMediaLinks containerClass="justify-start gap-3" />
              </div>

              <div className="pt-2 border-t border-border">
                {user ? (
                  <div className="space-y-3">
                    {isAdmin && (
                      <Link to="/admin"><Button variant="secondary" className="w-full justify-start mb-3 rounded-xl"><LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard</Button></Link>
                    )}
                    <Button onClick={() => signOut()} variant="destructive" className="w-full justify-start rounded-xl"><LogOut className="mr-2 h-4 w-4" /> Sign Out</Button>
                  </div>
                ) : (
                  <Link to="/admin-login"><Button className="w-full bg-primary text-primary-foreground font-bold h-11 rounded-xl"><LogIn className="mr-2 h-5 w-5" /> Sign In</Button></Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
import React from 'react';
import { Helmet } from 'react-helmet';
import ProductsList from '@/components/ProductsList';
import PageHeader from '@/components/PageHeader';
import Editable from '@/components/Editable';
import EditableImage from '@/components/EditableImage';
import { ShoppingBag, Tag, Gift } from 'lucide-react';
import SEO from '@/components/SEO';
import Breadcrumbs from '@/components/Breadcrumbs';

const StorePage = () => {
  const canonicalUrl = 'https://titanstables.org/store';
  const heroImages = [
    "https://images.unsplash.com/photo-1544211100-335607c37618?q=80&w=2000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?q=80&w=2000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1616850343005-c038341248c5?q=80&w=2000&auto=format&fit=crop"
  ];

  return (
    <>
      <Helmet>
        <title>Shop Premium Friesian Horse Products | Titan Stables Store</title>
        <meta name="description" content="Shop premium Friesian horse products and accessories. Quality items for horse care, training, and maintenance. Fast shipping available." />
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>

      <SEO 
        title="Shop Premium Friesian Horse Products | Titan Stables Store"
        description="Shop premium Friesian horse products and accessories. Quality items for horse care, training, and maintenance. Fast shipping available."
        keywords="horse tack shop, equestrian gear, riding equipment, Titan Stables store"
        url="/store"
      />
      
      <PageHeader
        pageName="store"
        defaultTitle="Tack Shop & Collection"
        defaultSubtitle="Premium equestrian gear, merchandise, and our exclusive horses for sale."
        images={heroImages}
        heightClass="h-[60vh]"
      >
        <div className="inline-flex items-center justify-center px-4 py-2 border border-white/30 rounded-full backdrop-blur-md bg-white/10 mb-6 text-white text-sm font-bold uppercase tracking-widest">
          <ShoppingBag className="w-4 h-4 mr-2 text-primary" />
          Official Store
        </div>
      </PageHeader>
      
      <Breadcrumbs items={[{ name: 'Store', path: '/store' }]} />

      <h1 className="sr-only">Shop Premium Friesian Horse Products</h1>

      {/* Promotional Banner Section - Fully Editable for Admin */}
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="container mx-auto px-4 py-12">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/1] min-h-[300px] group">
                <EditableImage 
                    name="store_promo_banner"
                    defaultValue="https://images.unsplash.com/photo-1616850343005-c038341248c5?q=80&w=2000&auto=format&fit=crop"
                    alt="Store Promotion Banner"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    containerClassName="absolute inset-0 w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/50 to-transparent flex items-center p-8 md:p-16">
                    <div className="max-w-xl text-white relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary text-slate-900 text-xs font-bold uppercase tracking-wider mb-4">
                           <Tag className="w-3 h-3" /> Limited Offer
                        </div>
                        <Editable
                            name="store_promo_title"
                            defaultValue="Seasonal Tack Sale"
                            className="text-4xl md:text-6xl font-bold mb-6 text-white font-serif leading-tight"
                            as="h2"
                        />
                        <Editable
                            name="store_promo_subtitle"
                            defaultValue="Upgrade your gear with our premium leather collection. Limited time offers available on select bridles and saddles."
                            className="text-lg md:text-xl text-slate-200 font-light leading-relaxed"
                        />
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="min-h-screen py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-10">
             <div className="p-3 bg-primary/10 rounded-xl text-primary"><Gift className="w-6 h-6" /></div>
             <h2 className="text-3xl font-serif font-bold text-slate-900">Featured Products</h2>
          </div>
          <ProductsList />
        </div>
      </div>
    </>
  );
};

export default StorePage;
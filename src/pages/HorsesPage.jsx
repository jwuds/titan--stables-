import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, Moon, Sun, Search, MapPin } from 'lucide-react'; 
import { Link, useNavigate, useLocation } from 'react-router-dom';
import HorseCard from '@/components/HorseCard';
import HorseFilters from '@/components/HorseFilters';
import { Button } from '@/components/ui/button';
import { getHorses } from '@/data/horses';
import { cn } from '@/lib/utils';
import EditableHero from '@/components/EditableHero';
import Breadcrumbs from '@/components/Breadcrumbs';
import SEO from '@/components/SEO';

const HorsesPage = () => {
  const [allHorses, setAllHorses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState('newest');
  const navigate = useNavigate();
  const location = useLocation();
  
  // Parse region from URL params if present
  const searchParams = new URLSearchParams(location.search);
  const initialRegion = searchParams.get('region') || 'all';

  const [isBlackTheme, setIsBlackTheme] = useState(() => {
    const savedTheme = localStorage.getItem('horsesPageTheme');
    return savedTheme ? JSON.parse(savedTheme) : true;
  });

  useEffect(() => {
    const fetchHorses = async () => {
      setLoading(true);
      try {
        const horsesData = await getHorses();
        // Mocking region data onto horses if missing for demo purposes
        const regions = ['usa', 'canada', 'australia', 'netherlands', 'mexico'];
        const enhancedHorses = horsesData.map((h, i) => ({
            ...h,
            region: h.region || regions[i % regions.length]
        }));
        setAllHorses(enhancedHorses || []);
      } catch (error) {
        console.error("Failed to fetch horses:", error);
        setAllHorses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchHorses();
  }, []);

  useEffect(() => {
    localStorage.setItem('horsesPageTheme', JSON.stringify(isBlackTheme));
  }, [isBlackTheme]);

  const [filters, setFilters] = useState({
    searchQuery: '',
    category: 'all',
    priceRange: 'all',
    age: 'all',
    region: initialRegion,
  });

  // Sync region filter with URL
  useEffect(() => {
    const currentParams = new URLSearchParams(location.search);
    if (filters.region === 'all') {
      currentParams.delete('region');
    } else {
      currentParams.set('region', filters.region);
    }
    const newSearch = currentParams.toString();
    const newUrl = `${location.pathname}${newSearch ? `?${newSearch}` : ''}`;
    // Replace state to avoid blowing up history stack when just filtering
    navigate(newUrl, { replace: true });
  }, [filters.region, location.pathname, navigate, location.search]);

  const filteredAndSortedHorses = useMemo(() => {
    if (loading || !allHorses) return [];
    
    let result = allHorses.filter(horse => {
      const matchesSearch = horse.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
                            horse.breed.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
                            horse.description.toLowerCase().includes(filters.searchQuery.toLowerCase());

      let matchesAgeRange = true;
      if (filters.age !== 'all') {
        const [min, max] = filters.age.split('-').map(Number);
        if (max) {
          matchesAgeRange = horse.age >= min && horse.age <= max;
        } else {
          matchesAgeRange = horse.age >= min;
        }
      }

      let matchesCategory = true;
      if (filters.category !== 'all') {
        if (filters.category === 'Foal') {
          matchesCategory = horse.age < 3;
        } else {
          matchesCategory = horse.gender === filters.category;
        }
      }

      let matchesPriceRange = true;
      if (filters.priceRange !== 'all') {
        if (filters.priceRange === '75000') {
          matchesPriceRange = horse.price >= 75000;
        } else {
          const [minPrice, maxPrice] = filters.priceRange.split('-').map(Number);
          matchesPriceRange = horse.price >= minPrice && horse.price <= maxPrice;
        }
      }

      let matchesRegion = true;
      if (filters.region !== 'all') {
          matchesRegion = horse.region === filters.region;
      }

      return matchesSearch && matchesAgeRange && matchesCategory && matchesPriceRange && matchesRegion;
    });

    // Sort Logic
    return result.sort((a, b) => {
       if (sortOption === 'price-asc') return a.price - b.price;
       if (sortOption === 'price-desc') return b.price - a.price;
       if (sortOption === 'name-asc') return a.name.localeCompare(b.name);
       return 0; 
    });

  }, [allHorses, filters, loading, sortOption]);

  const toggleTheme = () => setIsBlackTheme(!isBlackTheme);

  return (
    <>
      <SEO 
        title="Friesian Horses for Sale - Titan Stables"
        description="Explore our exclusive collection of KFPS registered Friesian horses for sale. Stallions, mares, and geldings available for international importation worldwide."
        keywords="KFPS Friesian horses, Friesian breeding, international importation, equestrian business standards, horse farm services"
        url="/horses"
      />
      
      <EditableHero 
        pageName="horses"
        defaultTitle="Friesian Horses for Sale"
        defaultSubtitle="Discover our premium collection of KFPS registered Friesian horses available for international export."
        defaultCtaText="Browse Collection"
        defaultCtaLink="#collection"
        defaultBadgeText="Export Ready"
      />

      <h1 className="sr-only">Friesian Horses for Sale</h1>

      <Breadcrumbs items={[{ name: 'Horses', path: '/horses' }]} />

      <div className={cn(
          "min-h-screen py-16 transition-colors duration-500 relative overflow-hidden", 
          isBlackTheme ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
        )}>
        
        <div className="container mx-auto px-4 relative z-10">
          
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4" id="collection">
             <div className="flex items-center gap-4">
                 <h2 className="text-2xl font-bold font-serif flex items-center gap-2">
                    <Award className="w-6 h-6 text-primary" /> Browse Collection
                 </h2>
             </div>

             <div className="flex flex-wrap items-center gap-3">
                 {/* Custom Region Filter UI augmenting standard filters */}
                 <div className={cn("flex items-center px-3 py-1.5 rounded-lg border text-sm gap-2", 
                    isBlackTheme ? "bg-slate-900 border-slate-700" : "bg-white border-slate-300"
                 )}>
                    <MapPin className="w-4 h-4 text-primary" />
                    <select 
                       value={filters.region}
                       onChange={(e) => setFilters(prev => ({...prev, region: e.target.value}))}
                       className="bg-transparent focus:outline-none w-full max-w-[120px]"
                    >
                       <option value="all">Global (All)</option>
                       <option value="usa">USA</option>
                       <option value="canada">Canada</option>
                       <option value="australia">Australia</option>
                       <option value="netherlands">Netherlands</option>
                       <option value="mexico">Mexico</option>
                    </select>
                 </div>

                 <select 
                    value={sortOption} 
                    onChange={(e) => setSortOption(e.target.value)}
                    className={cn("px-3 py-1.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary", 
                        isBlackTheme ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900"
                    )}
                 >
                    <option value="newest">Newest Arrivals</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name-asc">Name: A to Z</option>
                 </select>

                <Button 
                variant="outline" 
                size="sm"
                onClick={toggleTheme}
                className={cn(
                    "border-primary/50 hover:bg-primary/10 transition-colors rounded-full px-4 shrink-0",
                    isBlackTheme ? "text-primary border-primary hover:text-white" : "text-slate-600"
                )}
                >
                {isBlackTheme ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </Button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-12"
          >
            <div className={cn("p-6 rounded-2xl shadow-lg border backdrop-blur-sm", isBlackTheme ? "bg-slate-900/80 border-slate-800" : "bg-white/80 border-slate-200")}>
               <h3 className="sr-only">Friesian Horse Selection Criteria</h3>
               <HorseFilters filters={filters} setFilters={setFilters} />
            </div>
          </motion.div>

          <div className="min-h-[400px]">
            {loading ? (
                 <div className="text-center py-20">Loading collection...</div>
            ) : filteredAndSortedHorses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredAndSortedHorses.map((horse, index) => (
                  <motion.div
                    key={horse.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className={cn("relative h-full rounded-2xl overflow-hidden transition-all duration-300", isBlackTheme ? "bg-slate-900 border border-slate-800 hover:border-primary/50" : "bg-white hover:shadow-2xl hover:-translate-y-1")}>
                         {/* Visual Region Badge */}
                         {horse.region && horse.region !== 'all' && (
                             <div className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-white/20 flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-[#D4AF37]" /> {horse.region}
                             </div>
                         )}
                         <HorseCard horse={horse} altText={`${horse.name || 'Premium'} - KFPS Friesian - Titan Stables`} /> 
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p className="text-xl">No horses found for selected criteria.</p>
                {filters.region !== 'all' && (
                    <Button onClick={() => setFilters(prev => ({...prev, region: 'all'}))} variant="outline" className="mt-4">
                        Clear Region Filter
                    </Button>
                )}
              </div>
            )}
          </div>
          
          {/* Custom Search Request & Regional Link */}
          <section className="mt-24 bg-primary/5 rounded-3xl p-8 md:p-12 text-center border border-primary/10">
              <h2 className="text-3xl font-bold font-serif mb-4">Dedicated Support</h2>
              <p className="max-w-3xl mx-auto text-lg mb-8 opacity-80">
                  Our specialists are ready to assist you in finding the perfect horse. We manage all horse farm services and handle all international importation logistics, making your purchase seamless.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link to="/contact">
                      <Button className="bg-primary text-white rounded-full px-8 py-6 text-lg w-full sm:w-auto">Contact Us</Button>
                  </Link>
                  {filters.region !== 'all' && (
                      <Link to={`/regional/${filters.region}`}>
                          <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 rounded-full px-8 py-6 text-lg w-full sm:w-auto">
                              View {filters.region.toUpperCase()} Import Details
                          </Button>
                      </Link>
                  )}
              </div>
          </section>

        </div>
      </div>
    </>
  );
};

export default HorsesPage;
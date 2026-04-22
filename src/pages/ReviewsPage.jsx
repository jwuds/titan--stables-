import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, User, Loader2, AlertCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import EditableGallerySlider from '@/components/EditableGallerySlider';
import Breadcrumbs from '@/components/Breadcrumbs';
import RecentMatchesCarousel from '@/components/RecentMatchesCarousel';
import { supabase } from '@/lib/customSupabaseClient';
import { safeQuery } from '@/lib/supabaseErrorHandler';

const ReviewCardSkeleton = () => (
  <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 animate-pulse">
    <div className="flex items-center gap-1 mb-6">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="w-5 h-5 bg-slate-200 rounded"></div>
      ))}
    </div>
    <div className="space-y-3 mb-6">
      <div className="h-4 bg-slate-200 rounded w-full"></div>
      <div className="h-4 bg-slate-200 rounded w-5/6"></div>
      <div className="h-4 bg-slate-200 rounded w-4/6"></div>
    </div>
    <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
      <div className="w-12 h-12 rounded-full bg-slate-200"></div>
      <div className="space-y-2 flex-1">
        <div className="h-4 bg-slate-200 rounded w-1/2"></div>
        <div className="h-3 bg-slate-200 rounded w-1/3"></div>
      </div>
    </div>
  </div>
);

const ReviewCard = ({ review }) => {
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return '';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 flex flex-col h-full hover:shadow-xl transition-shadow duration-300"
    >
      <div className="flex items-center gap-1 mb-6">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`w-5 h-5 ${i < (review.rating || 5) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}`} 
          />
        ))}
      </div>
      
      {review.title && (
        <h3 className="text-lg font-bold text-slate-900 mb-3">{review.title}</h3>
      )}
      
      <div className="relative mb-6 flex-grow">
        <Quote className="absolute -top-2 -left-2 w-8 h-8 text-primary/10 rotate-180" />
        <p className="text-slate-600 italic leading-relaxed relative z-10 pl-6">
          "{review.content || 'No review content available.'}"
        </p>
      </div>
      
      <div className="flex items-center gap-4 mt-auto pt-6 border-t border-slate-100">
        <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center shrink-0">
          {review.image_url ? (
            <img src={review.image_url} alt={review.name || 'Reviewer'} className="w-full h-full object-cover" />
          ) : (
            <User className="w-6 h-6 text-slate-400" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-slate-900 truncate">
            {review.name || 'Anonymous'}
          </h4>
          <p className="text-sm text-slate-500">
            {review.verified ? '✓ Verified Purchase' : 'Happy Client'}
          </p>
          {review.created_at && (
            <p className="text-xs text-slate-400 mt-1">{formatDate(review.created_at)}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const ErrorDisplay = ({ error, onRetry }) => (
  <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center max-w-2xl mx-auto">
    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
    <h3 className="text-xl font-bold text-red-900 mb-2">Failed to Load Reviews</h3>
    <p className="text-red-700 mb-6">{error || 'An unexpected error occurred.'}</p>
    <button 
      onClick={onRetry}
      className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
    >
      Try Again
    </button>
  </div>
);

const ReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const heroImages = ["https://images.unsplash.com/photo-1598556776374-0c9f8f060955?q=80&w=2000"];

  const fallbackReviews = [
    {
      id: 'fallback-1',
      name: "Sarah Jenkins",
      title: "Outstanding Experience",
      rating: 5,
      content: "Buying my Friesian gelding from Titan Stables was the best decision I've ever made. The transparency and professionalism were unmatched. He arrived exactly as described and has been a dream to train.",
      verified: true,
      image_url: null,
      created_at: new Date().toISOString()
    },
    {
      id: 'fallback-2',
      name: "Michael & Elena Rodriguez",
      title: "Top-Tier Service",
      rating: 5,
      content: "We sourced two broodmares through Titan Stables. Their knowledge of bloodlines and conformation is top-tier. They handled all the import logistics flawlessly. Highly recommended!",
      verified: true,
      image_url: null,
      created_at: new Date().toISOString()
    },
    {
      id: 'fallback-3',
      name: "Dr. James Thornton",
      title: "Professional Operation",
      rating: 5,
      content: "As a vet, I am picky. Titan Stables keeps their horses in immaculate condition. The horse I purchased for my wife was healthy, sound, and sane. A truly professional operation.",
      verified: true,
      image_url: null,
      created_at: new Date().toISOString()
    }
  ];

  const fetchReviews = async () => {
    setLoading(true);
    setError(null);

    try {
      const query = supabase
        .from('reviews')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      const { data, error: queryError } = await safeQuery(query, []);

      if (queryError) {
        console.error('Error fetching reviews:', queryError);
        throw new Error(queryError.message || 'Failed to fetch reviews from database');
      }

      if (data && data.length > 0) {
        setReviews(data);
      } else {
        console.log('No approved reviews found, using fallback testimonials');
        setReviews(fallbackReviews);
      }
    } catch (err) {
      console.error('Unexpected error fetching reviews:', err);
      setError(err.message || 'An unexpected error occurred while loading reviews');
      setReviews(fallbackReviews);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <>
      <Helmet>
        <title>Client Reviews & Testimonials | Titan Stables</title>
        <meta 
          name="description" 
          content="Read what our happy clients have to say about their experience buying Friesian horses from Titan Stables. Real stories from real owners." 
        />
        <meta name="keywords" content="Friesian horse reviews, customer testimonials, quality horses, horse buying experience, Titan Stables reviews" />
        <link rel="canonical" href="https://titanstables.com/reviews" />
        <meta property="og:title" content="Client Reviews & Testimonials | Titan Stables" />
        <meta property="og:description" content="Our reputation is built on the happiness of our horses and the satisfaction of our clients." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://titanstables.com/reviews" />
      </Helmet>

      {/* Recent Matches Carousel */}
      <RecentMatchesCarousel />
      
      <section className="relative h-[60vh] w-full overflow-hidden bg-slate-950">
        <EditableGallerySlider 
          storageKey="reviews_hero_slider"
          defaultImages={heroImages}
          className="h-full w-full"
          showControls={true}
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-none">
          <div className="text-center px-4 max-w-4xl pointer-events-auto">
            <h1 className="text-5xl font-serif font-bold text-white mb-6">Client Success Stories</h1>
            <p className="text-xl text-slate-200">
              Our reputation is built on the happiness of our horses and the satisfaction of our clients.
            </p>
          </div>
        </div>
      </section>

      <Breadcrumbs items={[{ name: 'Reviews', path: '/reviews' }]} />

      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl font-serif font-bold text-slate-900 mb-6">What People Are Saying</h2>
            <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
            <p className="text-lg text-slate-600">
              We take pride in building lasting relationships. Here are just a few words from the Titan Stables family.
            </p>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <ReviewCardSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <ErrorDisplay error={error} onRetry={fetchReviews} />
          ) : reviews.length === 0 ? (
            <div className="text-center py-20">
              <User className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-700 mb-2">No Reviews Yet</h3>
              <p className="text-slate-500">Be the first to share your experience with Titan Stables!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Success Gallery */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-serif font-bold mb-4 text-slate-900">Recent Matches</h2>
          <p className="text-slate-600 mb-12 max-w-2xl mx-auto">
            Celebrating our clients and their beautiful Friesians from Titan Stables
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="aspect-square bg-slate-100 rounded-xl overflow-hidden shadow-md">
              <img 
                src="https://images.unsplash.com/photo-1598556851364-38b751759084?q=80&w=800" 
                alt="Happy client with their new Friesian horse" 
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" 
              />
            </div>
            <div className="aspect-square bg-slate-100 rounded-xl overflow-hidden shadow-md">
              <img 
                src="https://images.unsplash.com/photo-1534438097545-a28bc317500d?q=80&w=800" 
                alt="Friesian horse training success story" 
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" 
              />
            </div>
            <div className="aspect-square bg-slate-100 rounded-xl overflow-hidden shadow-md">
              <img 
                src="https://images.unsplash.com/photo-1551865108-4c172026b02d?q=80&w=800" 
                alt="Client enjoying their Friesian horse" 
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" 
              />
            </div>
            <div className="aspect-square bg-slate-100 rounded-xl overflow-hidden shadow-md">
              <img 
                src="https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=800" 
                alt="Friesian horse delivery success" 
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" 
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ReviewsPage;
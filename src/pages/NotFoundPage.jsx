import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import SEO from '@/components/SEO';

const NotFoundPage = () => {
  return (
    <>
      <SEO 
        title="Page Not Found - 404 Error"
        description="The page you are looking for could not be found."
        noindex={true}
        status={404}
        pageId="404"
      />
      
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 bg-slate-50 text-center">
            <div className="bg-white p-12 rounded-3xl shadow-xl border border-slate-100 max-w-lg w-full">
                <h1 className="text-6xl md:text-8xl font-bold text-primary/20 mb-2 font-serif">404</h1>
                <h2 className="text-3xl font-bold text-slate-900 mb-4 font-serif">Page Not Found</h2>
                <p className="text-slate-600 mb-8 text-lg">
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/">
                        <Button size="lg" className="w-full sm:w-auto">Return Home</Button>
                    </Link>
                    <Link to="/contact">
                         <Button variant="outline" size="lg" className="w-full sm:w-auto">Contact Support</Button>
                    </Link>
                </div>
            </div>
      </div>
    </>
  );
};

export default NotFoundPage;
import React from 'react';
import { Helmet } from 'react-helmet';
import AdminAccessGranter from '@/components/AdminAccessGranter';
import PageTransition from '@/components/PageTransition';

const AdminAccessPage = () => {
  return (
    <PageTransition>
      <Helmet>
        <title>Admin Authorization | Titan Stables</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 p-4 py-12 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-blue-100 opacity-50 blur-3xl mix-blend-multiply"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-amber-100 opacity-50 blur-3xl mix-blend-multiply"></div>
        
        <div className="relative z-10 w-full max-w-md">
          <AdminAccessGranter />
        </div>
      </div>
    </PageTransition>
  );
};

export default AdminAccessPage;
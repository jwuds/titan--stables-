import React from 'react';

const TermsSection = () => {
  return (
    <section className="py-20 bg-background border-t border-border">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">
            Our Commitment to Excellence & Horse Welfare
          </h2>
          <div className="w-24 h-1 bg-secondary mx-auto"></div>
        </div>

        <div className="prose prose-lg prose-slate max-w-none text-foreground font-light leading-relaxed">
          <p className="mb-6">
            At Titan Stables, our paramount focus is the health, safety, and longevity of our magnificent KFPS registered Friesian horses. From the moment they are born to the day they arrive at your facility, every step of our process is governed by uncompromising <strong>Horse Welfare Standards</strong>. Based at our premium Virginia-based facility, our horses receive meticulous daily care, scientifically balanced nutrition, and rigorous veterinary oversight. Our Friesian conditioning programs are specifically designed to respect the biomechanics of the breed, ensuring their development is both powerful and ethical.
          </p>

          <p className="mb-6">
            We hold ourselves to the highest <strong>International Buyer Policies</strong> to guarantee a seamless transition for both horse and owner. The exportation of a premium equine athlete requires exact precision. We facilitate all KFPS registration transfers, comprehensive health testing, and required customs documentation. Our global transportation partners are carefully vetted to ensure they meet our elite standards, prioritizing the horse's hydration, rest, and comfort across all borders.
          </p>

          <p className="mb-6">
            Authenticity is the cornerstone of our operation. Our adherence to <strong>KFPS Registration & Authenticity</strong> ensures that every horse represents the pure, unadulterated Dutch Friesian bloodlines. We strictly follow the breed standards established in the Netherlands, maintaining the classic Baroque horse silhouette and exceptional dressage movement. Every transaction includes certified documentation, proving the lineage and quality of your investment.
          </p>

          <p className="mb-6">
            Our <strong>Ethical Commitment</strong> extends far beyond the sale. We focus on responsible breeding practices that eliminate genetic flaws and promote excellent temperaments. We take immense pride in buyer matching, ensuring our gentle giants are paired with owners who understand and respect their unique needs. 
          </p>

          <p>
            Engaging in our <strong>Secure Reservation Process</strong> means partnering with a trusted industry leader. We provide completely transparent terms, highly secure payment structures, and comprehensive legal documentation. This guarantees your peace of mind while ensuring your new Friesian partner receives the world-class treatment they deserve from day one.
          </p>
        </div>
      </div>
    </section>
  );
};

export default TermsSection;
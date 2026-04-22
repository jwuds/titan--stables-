import React from 'react';
import { Link } from 'react-router-dom';

const ReserveCTA = () => {
  return (
    <section className="py-24 bg-card flex items-center justify-center border-t border-border">
      <div className="container mx-auto px-4 text-center">
        <Link to="/contact">
          <button className="bg-secondary text-primary border-2 border-secondary h-12 md:h-14 w-[300px] md:w-[400px] text-lg font-serif font-bold rounded-lg shadow-sm hover:bg-secondary/80 hover:shadow-lg hover:scale-105 transition-all duration-300">
            Secure Your Reservation
          </button>
        </Link>
      </div>
    </section>
  );
};

export default ReserveCTA;
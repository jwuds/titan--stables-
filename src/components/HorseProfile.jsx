import React from 'react';

const DetailRow = ({ label, value }) => (
  <div className="flex flex-col sm:flex-row sm:items-center py-4 border-b border-border last:border-0">
    <span className="text-sm uppercase tracking-wider font-bold text-foreground/70 sm:w-1/3 mb-1 sm:mb-0">
      {label}
    </span>
    <span className="text-base font-medium text-primary sm:w-2/3">
      {value}
    </span>
  </div>
);

const HorseProfile = ({ horseData }) => {
  // Use provided data or fallback to a premium placeholder
  const details = horseData || {
    name: "Tjerk van de Zwarte Parel",
    age: "5 Years Old",
    height: "16.2 Hands (168 cm)",
    trainingLevel: "Z1 Dressage",
    temperament: "Gentle, willing, and eager to please",
    kfpsRegistration: "KFPS Studbook Ster Stallion",
    breedingStatus: "Approved for select breeding",
    specialFeatures: "Exceptional Baroque silhouette, phenomenal suspension"
  };

  return (
    <section className="py-20 bg-card">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          
          {/* Image Column */}
          <div className="w-full lg:w-1/2">
            <div className="relative aspect-[4/5] rounded-lg overflow-hidden border border-border shadow-sm p-2 bg-background">
              <img 
                src="https://images.unsplash.com/photo-1613437190836-d59585104264" 
                alt="Premium KFPS registered black Friesian stallion profile - Titan Stables" 
                className="w-full h-full object-cover rounded-md"
              />
            </div>
          </div>

          {/* Details Column */}
          <div className="w-full lg:w-1/2 bg-background p-8 md:p-10 rounded-lg border border-border shadow-sm">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-2">
              {details.name}
            </h2>
            <p className="text-secondary-foreground mb-8 font-light italic">
              Exemplary KFPS Registered Friesian
            </p>
            
            <div className="flex flex-col">
              <DetailRow label="Horse Name" value={details.name} />
              <DetailRow label="Age" value={details.age} />
              <DetailRow label="Height" value={details.height} />
              <DetailRow label="Training Level" value={details.trainingLevel} />
              <DetailRow label="Temperament" value={details.temperament} />
              <DetailRow label="KFPS Registration" value={details.kfpsRegistration} />
              <DetailRow label="Breeding Status" value={details.breedingStatus} />
              <DetailRow label="Special Features" value={details.specialFeatures} />
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default HorseProfile;
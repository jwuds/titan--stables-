import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  Star, 
  ShieldCheck, 
  Truck, 
  Award, 
  Globe, 
  ChevronRight,
  Check,
  MapPin,
  Calendar,
  Users,
  Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Breadcrumbs from '@/components/Breadcrumbs';

const ServicesPage = () => {
  const scrollToServices = () => {
    const element = document.getElementById('training-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    initial: {},
    whileInView: { transition: { staggerChildren: 0.1 } },
    viewport: { once: true }
  };

  const trainingFAQs = [
    {
      question: "What training levels do you offer?",
      answer: "We offer comprehensive dressage training from beginner through FEI levels. Our programs include Walk/Trot basics ($150/hr), Intermediate Canter/Collection work ($175/hr), and Advanced FEI Levels I-III preparation ($200/hr). We also offer specialized young horse development programs."
    },
    {
      question: "What are your instructor credentials?",
      answer: "Our training staff consists of USDF-certified instructors with FEI competition experience. Our head trainer has competed internationally at Grand Prix level and has over 20 years of professional training experience with Friesian horses specifically."
    },
    {
      question: "Do you offer package discounts?",
      answer: "Yes! We offer full training packages ranging from $2,500-$4,500/month that include daily training sessions, arena access, and personalized development plans. Package clients receive priority scheduling and quarterly progress assessments."
    },
    {
      question: "Can I watch my training sessions?",
      answer: "Absolutely! We encourage owners to observe sessions and we provide video analysis for package clients. Our covered viewing area offers comfortable seating with excellent arena visibility."
    }
  ];

  const boardingFAQs = [
    {
      question: "What's included in full board?",
      answer: "Full board ($1,200/mo) includes a climate-controlled 12x14 stall, premium hay and customized grain program, daily turnout in managed pastures, regular grooming, tack cleaning services, and access to all training facilities including indoor/outdoor arenas."
    },
    {
      question: "Do you have 24/7 veterinary care?",
      answer: "Yes, we maintain partnerships with board-certified equine veterinarians who are on-call 24/7. Our facility also has a dedicated veterinary treatment area and we keep comprehensive health records for all boarded horses."
    },
    {
      question: "What are your turnout arrangements?",
      answer: "We offer both individual and group turnout options in spacious, well-maintained pastures with run-in shelters. Turnout schedules are customized based on each horse's needs and owner preferences."
    },
    {
      question: "Can I customize my horse's nutrition plan?",
      answer: "Absolutely! Our nutritionist works with each owner to develop customized feeding programs. We accommodate all dietary requirements including special medical needs, performance nutrition, and weight management protocols."
    }
  ];

  const importationFAQs = [
    {
      question: "How long does the import process take?",
      answer: "The complete import process typically takes 4-8 weeks from horse selection to delivery. This includes health certifications (1-2 weeks), transportation arrangements (2-3 weeks), customs clearance (3-5 days), and quarantine period (7-14 days depending on origin)."
    },
    {
      question: "What does the import cost include?",
      answer: "Our import services ($3,000-$5,000) cover horse sourcing from European breeders, pre-purchase veterinary examinations, export health certificates, international transportation (air and ground), customs clearance documentation, quarantine facility fees, and delivery to your location."
    },
    {
      question: "Which countries do you import from?",
      answer: "We primarily source Friesian horses from the Netherlands, Germany, Belgium, and France. Our established breeder network includes KFPS-registered farms with exceptional bloodlines and proven performance records."
    },
    {
      question: "What guarantees do you provide?",
      answer: "All imported horses undergo comprehensive pre-purchase veterinary examinations. We provide full health documentation, transportation insurance, and a 30-day health guarantee. Our team monitors each horse throughout the import process to ensure safe arrival in optimal condition."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Premium Equestrian Services - Training, Boarding & Import | Titan Stables</title>
        <meta 
          name="description" 
          content="World-class dressage training, luxury boarding facilities, and international Friesian horse importation. FEI-certified trainers, state-of-the-art facilities, and comprehensive care." 
        />
        <meta name="keywords" content="dressage training, horse boarding, Friesian import, equestrian services, FEI training, luxury stables" />
      </Helmet>

      {/* HERO SECTION */}
      <section className="relative h-screen w-full overflow-hidden bg-black">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1599053581540-248ea75b59cb?q=80&w=2400" 
            alt="Premium Friesian horses at Titan Stables"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        </div>

        <div className="relative z-10 h-full flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center px-4 max-w-5xl"
          >
            <h1 className="text-5xl md:text-7xl font-playfair font-bold text-white mb-6 leading-tight">
              Titan Stables Premium Services
            </h1>
            <p className="text-xl md:text-2xl text-slate-200 mb-10 font-montserrat font-light leading-relaxed max-w-3xl mx-auto">
              World-Class Training, Boarding, and International Importation
            </p>
            <Button 
              onClick={scrollToServices}
              className="bg-[#D4AF37] hover:bg-[#B8860B] text-black font-bold text-lg px-10 py-6 rounded-full transition-all duration-300 hover:scale-105 shadow-2xl"
            >
              Explore Our Services
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      <Breadcrumbs items={[{ name: 'Services', path: '/services' }]} />

      {/* SECTION 1 - PROFESSIONAL DRESSAGE TRAINING */}
      <section id="training-section" className="py-24 bg-[#1a1a1a] text-white">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-6 text-[#D4AF37]">
              Professional Dressage Training
            </h2>
            <p className="text-lg font-playfair text-slate-300 mb-2">FEI-Level Excellence</p>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto mb-8"></div>
            <p className="text-lg text-slate-300 max-w-4xl mx-auto font-montserrat leading-relaxed">
              Our world-class dressage training program is designed for riders and horses at all levels, from foundational basics to advanced FEI competition preparation. Led by certified trainers with international competition experience, we specialize in developing harmonious partnerships between horse and rider using classical training methods combined with modern sports science.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left - Image and Features */}
            <motion.div {...fadeInUp} className="space-y-8">
              <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-[#D4AF37]/20">
                <img 
                  src="https://images.unsplash.com/photo-1596634279626-da07218808fe?q=80&w=1200" 
                  alt="Professional dressage training at Titan Stables"
                  className="w-full h-auto"
                />
              </div>

              <Card className="bg-black/40 border-[#D4AF37]/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl font-playfair text-[#D4AF37]">Training Program Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    'One-on-one personalized training sessions',
                    'Group clinics with international guest trainers',
                    'Young horse development programs (3-6 years)',
                    'Competition preparation and coaching',
                    'Biomechanical analysis and video feedback',
                    'Customized training plans based on individual goals'
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#D4AF37] mt-1 flex-shrink-0" />
                      <span className="text-slate-300 font-montserrat">{feature}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Instructor Credentials */}
              <Card className="bg-gradient-to-br from-[#D4AF37]/10 to-black/40 border-2 border-[#D4AF37]">
                <CardHeader>
                  <CardTitle className="text-2xl font-playfair text-[#D4AF37]">Head Trainer: Elena Rodriguez</CardTitle>
                  <CardDescription className="text-slate-300 font-montserrat">USDF Gold Medalist | FEI Grand Prix Competitor</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-slate-200 font-montserrat">
                  <p>• 20+ years professional training experience</p>
                  <p>• International competition record in Europe and USA</p>
                  <p>• Specialized expertise in Friesian dressage</p>
                  <p>• USDF Certified Instructor through Fourth Level</p>
                  <p>• Multiple national championship titles</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Right - Pricing Cards */}
            <motion.div {...staggerContainer} className="grid gap-6">
              {[
                { 
                  title: 'Beginner Training', 
                  price: '$150', 
                  unit: '/hour', 
                  description: 'Walk/Trot Foundations',
                  features: ['Basic position and aids', 'Groundwork fundamentals', 'Confidence building', 'Introduction to dressage movements']
                },
                { 
                  title: 'Intermediate Training', 
                  price: '$175', 
                  unit: '/hour', 
                  description: 'Canter & Collection Work',
                  features: ['Advanced lateral movements', 'Collection development', 'Show preparation', 'Transitions refinement'],
                  popular: true
                },
                { 
                  title: 'Advanced Training', 
                  price: '$200', 
                  unit: '/hour', 
                  description: 'FEI Levels I-III',
                  features: ['Grand Prix movements', 'Competition coaching', 'Advanced collection', 'Piaffe and passage']
                },
                { 
                  title: 'Full Training Package', 
                  price: '$2,500-$4,500', 
                  unit: '/month', 
                  description: 'Daily training + care',
                  features: ['5-6 training sessions/week', 'Exercise on off days', 'Progress reports', 'Show coaching included']
                },
                { 
                  title: 'Young Horse Development', 
                  price: '$3,000', 
                  unit: '/month', 
                  description: '3-6 year olds',
                  features: ['Foundation training', 'Lunging program', 'Groundwork', 'First show experience']
                }
              ].map((plan, idx) => (
                <motion.div key={idx} {...fadeInUp}>
                  <Card className={`bg-black/60 border-2 transition-all duration-300 hover:border-[#D4AF37] hover:shadow-2xl hover:shadow-[#D4AF37]/20 hover:scale-105 ${plan.popular ? 'border-[#D4AF37]' : 'border-slate-700'}`}>
                    <CardHeader>
                      {plan.popular && (
                        <div className="inline-block bg-[#D4AF37] text-black text-xs font-bold px-3 py-1 rounded-full mb-2 w-fit">
                          MOST POPULAR
                        </div>
                      )}
                      <CardTitle className="text-2xl font-playfair text-white">{plan.title}</CardTitle>
                      <CardDescription className="text-slate-400 font-montserrat">{plan.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <span className="text-4xl font-bold text-[#D4AF37]">{plan.price}</span>
                        <span className="text-slate-400">{plan.unit}</span>
                      </div>
                      <div className="space-y-2">
                        {plan.features.map((feature, fidx) => (
                          <div key={fidx} className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-[#D4AF37]" />
                            <span className="text-sm text-slate-300 font-montserrat">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Link to="/contact" className="w-full">
                        <Button className="w-full bg-[#D4AF37] hover:bg-[#B8860B] text-black font-bold">
                          Book Now
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Training Image Carousel */}
          <motion.div {...fadeInUp} className="mt-16 grid md:grid-cols-2 gap-6">
            <div className="rounded-xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1690112329849-a10a0dc8ce55?q=80&w=1200" 
                alt="Dressage training session in progress"
                className="w-full h-80 object-cover"
              />
              <div className="bg-black/80 p-4 text-center">
                <p className="text-white font-montserrat">Training in Progress - Indoor Arena</p>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1587997460079-d078a31109fa?q=80&w=1200" 
                alt="Modern training facility"
                className="w-full h-80 object-cover"
              />
              <div className="bg-black/80 p-4 text-center">
                <p className="text-white font-montserrat">State-of-the-Art Training Facilities</p>
              </div>
            </div>
          </motion.div>

          {/* Testimonials */}
          <motion.div {...fadeInUp} className="mt-16">
            <h3 className="text-3xl font-playfair font-bold text-[#D4AF37] text-center mb-8">Client Success Stories</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  name: "Jennifer Martinez",
                  rating: 5,
                  text: "Elena transformed my riding completely. In 6 months, we went from struggling with canter transitions to successfully competing at Second Level. Her patience and expertise are unmatched!"
                },
                {
                  name: "Robert Chen",
                  rating: 5,
                  text: "The young horse development program gave my 4-year-old Friesian the perfect foundation. The progress in just 3 months was remarkable. Highly recommended!"
                },
                {
                  name: "Sarah Thompson",
                  rating: 5,
                  text: "Training here has been a game-changer. The facility is world-class, the instruction is top-tier, and the community is incredibly supportive. Worth every penny!"
                }
              ].map((testimonial, idx) => (
                <Card key={idx} className="bg-black/40 border-[#D4AF37]/30">
                  <CardContent className="p-6">
                    <div className="flex gap-1 mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-[#D4AF37] text-[#D4AF37]" />
                      ))}
                    </div>
                    <p className="text-slate-300 font-montserrat mb-4 italic">"{testimonial.text}"</p>
                    <p className="text-[#D4AF37] font-bold font-montserrat">- {testimonial.name}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* Training FAQ */}
          <motion.div {...fadeInUp} className="mt-16">
            <h3 className="text-3xl font-playfair font-bold text-[#D4AF37] text-center mb-8">Training FAQs</h3>
            <Accordion type="single" collapsible className="max-w-3xl mx-auto">
              {trainingFAQs.map((faq, idx) => (
                <AccordionItem key={idx} value={`item-${idx}`} className="border-[#D4AF37]/30">
                  <AccordionTrigger className="text-white font-montserrat hover:text-[#D4AF37]">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-300 font-montserrat">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2 - PREMIUM BOARDING */}
      <section className="py-24 bg-black text-white">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-6 text-[#D4AF37]">
              Premium Boarding and Care
            </h2>
            <p className="text-lg font-playfair text-slate-300 mb-2">World-Class Facilities</p>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto mb-8"></div>
            <p className="text-lg text-slate-300 max-w-4xl mx-auto font-montserrat leading-relaxed">
              Titan Stables offers luxury boarding facilities designed for the discerning equestrian. Our state-of-the-art facility features climate-controlled stables, premium pasture management, and comprehensive veterinary care. Each horse receives individualized attention and customized nutrition plans to ensure optimal health and performance.
            </p>
          </motion.div>

          {/* Boarding Comparison Table */}
          <motion.div {...fadeInUp} className="mb-16 overflow-x-auto">
            <table className="w-full bg-black/40 border-2 border-[#D4AF37]/30 rounded-xl overflow-hidden">
              <thead className="bg-[#D4AF37]/20">
                <tr>
                  <th className="p-4 text-left font-playfair text-[#D4AF37]">Service</th>
                  <th className="p-4 text-center font-playfair text-white">Standard<br/>$800/mo</th>
                  <th className="p-4 text-center font-playfair text-white">Premium<br/>$1,200/mo</th>
                  <th className="p-4 text-center font-playfair text-white">Elite<br/>$1,800/mo</th>
                </tr>
              </thead>
              <tbody className="font-montserrat text-slate-300">
                <tr className="border-t border-[#D4AF37]/20">
                  <td className="p-4">12x14 Climate-Controlled Stall</td>
                  <td className="p-4 text-center"><Check className="w-5 h-5 text-[#D4AF37] mx-auto" /></td>
                  <td className="p-4 text-center"><Check className="w-5 h-5 text-[#D4AF37] mx-auto" /></td>
                  <td className="p-4 text-center"><Check className="w-5 h-5 text-[#D4AF37] mx-auto" /></td>
                </tr>
                <tr className="border-t border-[#D4AF37]/20 bg-black/20">
                  <td className="p-4">Premium Hay & Basic Grain</td>
                  <td className="p-4 text-center"><Check className="w-5 h-5 text-[#D4AF37] mx-auto" /></td>
                  <td className="p-4 text-center"><Check className="w-5 h-5 text-[#D4AF37] mx-auto" /></td>
                  <td className="p-4 text-center"><Check className="w-5 h-5 text-[#D4AF37] mx-auto" /></td>
                </tr>
                <tr className="border-t border-[#D4AF37]/20">
                  <td className="p-4">Daily Turnout</td>
                  <td className="p-4 text-center">4 hours</td>
                  <td className="p-4 text-center">8 hours</td>
                  <td className="p-4 text-center">All day</td>
                </tr>
                <tr className="border-t border-[#D4AF37]/20 bg-black/20">
                  <td className="p-4">Customized Nutrition Plan</td>
                  <td className="p-4 text-center">-</td>
                  <td className="p-4 text-center"><Check className="w-5 h-5 text-[#D4AF37] mx-auto" /></td>
                  <td className="p-4 text-center"><Check className="w-5 h-5 text-[#D4AF37] mx-auto" /></td>
                </tr>
                <tr className="border-t border-[#D4AF37]/20">
                  <td className="p-4">Daily Grooming</td>
                  <td className="p-4 text-center">-</td>
                  <td className="p-4 text-center">3x/week</td>
                  <td className="p-4 text-center">Daily</td>
                </tr>
                <tr className="border-t border-[#D4AF37]/20 bg-black/20">
                  <td className="p-4">Tack Cleaning</td>
                  <td className="p-4 text-center">-</td>
                  <td className="p-4 text-center">Weekly</td>
                  <td className="p-4 text-center">After each ride</td>
                </tr>
                <tr className="border-t border-[#D4AF37]/20">
                  <td className="p-4">Arena Access Priority</td>
                  <td className="p-4 text-center">Standard</td>
                  <td className="p-4 text-center">Priority</td>
                  <td className="p-4 text-center">Exclusive slots</td>
                </tr>
              </tbody>
            </table>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left - Facility Images */}
            <motion.div {...fadeInUp} className="space-y-6">
              <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-[#D4AF37]/20">
                <img 
                  src="https://images.unsplash.com/photo-1622656890628-e282191c566e?q=80&w=1200" 
                  alt="Modern stable facilities at Titan Stables"
                  className="w-full h-auto"
                />
                <div className="bg-black/80 p-4 text-center">
                  <p className="text-white font-montserrat">Climate-Controlled Stables</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl overflow-hidden shadow-xl">
                  <img 
                    src="https://images.unsplash.com/photo-1695820279014-b8a5c271d9b9?q=80&w=600" 
                    alt="Boarding facilities"
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="rounded-xl overflow-hidden shadow-xl">
                  <img 
                    src="https://images.unsplash.com/photo-1678568890380-008d398d918c?q=80&w=600" 
                    alt="Horse care services"
                    className="w-full h-48 object-cover"
                  />
                </div>
              </div>

              <Card className="bg-black/40 border-[#D4AF37]/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl font-playfair text-[#D4AF37]">Daily Care Schedule</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 font-montserrat text-slate-300">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-[#D4AF37] mt-1" />
                    <div>
                      <p className="font-bold text-white">Morning (7:00 AM)</p>
                      <p className="text-sm">Feeding, stall cleaning, health check, turnout</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-[#D4AF37] mt-1" />
                    <div>
                      <p className="font-bold text-white">Afternoon (1:00 PM)</p>
                      <p className="text-sm">Midday feeding, pasture check, water refresh</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-[#D4AF37] mt-1" />
                    <div>
                      <p className="font-bold text-white">Evening (6:00 PM)</p>
                      <p className="text-sm">Bring in from turnout, evening feeding, final check</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Right - Amenities and Services */}
            <motion.div {...staggerContainer} className="space-y-6">
              <Card className="bg-black/40 border-[#D4AF37]/30">
                <CardHeader>
                  <CardTitle className="text-2xl font-playfair text-[#D4AF37]">Facility Amenities</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 font-montserrat text-slate-300">
                  {[
                    'Indoor 80x200 arena with premium footing',
                    'Outdoor 100x200 dressage arena',
                    'Cross-country course (Elite members)',
                    'Multiple spacious turnout paddocks',
                    'Climate-controlled tack rooms',
                    'Wash stalls with hot/cold water',
                    '24/7 security and surveillance',
                    'Viewing lounge with refreshments'
                  ].map((amenity, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#D4AF37] mt-1 flex-shrink-0" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-[#D4AF37]/10 to-black/40 border-2 border-[#D4AF37]">
                <CardHeader>
                  <CardTitle className="text-2xl font-playfair text-[#D4AF37]">Additional Services</CardTitle>
                </CardHeader>
                <CardContent className="grid sm:grid-cols-2 gap-4 font-montserrat">
                  {[
                    { service: 'Farrier Services', price: '$150' },
                    { service: 'Veterinary Care', price: 'On-call 24/7' },
                    { service: 'Massage Therapy', price: '$120/session' },
                    { service: 'Dental Care', price: '$200' },
                    { service: 'Chiropractic', price: '$150' },
                    { service: 'Supplements', price: 'Cost + 10%' }
                  ].map((item, idx) => (
                    <div key={idx} className="bg-black/40 p-3 rounded-lg border border-[#D4AF37]/30">
                      <p className="text-white font-bold">{item.service}</p>
                      <p className="text-[#D4AF37] text-sm">{item.price}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <div className="rounded-xl overflow-hidden shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1680392408008-c0444a6ac762?q=80&w=1200" 
                  alt="Professional veterinary care services"
                  className="w-full h-64 object-cover"
                />
                <div className="bg-black/80 p-4">
                  <p className="text-white font-montserrat font-bold mb-2">Partnership with Leading Veterinarians</p>
                  <p className="text-slate-300 text-sm">Board-certified equine veterinarians on-call 24/7 for emergency and routine care</p>
                </div>
              </div>

              <Link to="/contact">
                <Button className="w-full bg-[#D4AF37] hover:bg-[#B8860B] text-black font-bold text-lg py-6">
                  Inquire About Boarding
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Boarding FAQ */}
          <motion.div {...fadeInUp} className="mt-16">
            <h3 className="text-3xl font-playfair font-bold text-[#D4AF37] text-center mb-8">Boarding FAQs</h3>
            <Accordion type="single" collapsible className="max-w-3xl mx-auto">
              {boardingFAQs.map((faq, idx) => (
                <AccordionItem key={idx} value={`item-${idx}`} className="border-[#D4AF37]/30">
                  <AccordionTrigger className="text-white font-montserrat hover:text-[#D4AF37]">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-300 font-montserrat">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* SECTION 3 - INTERNATIONAL IMPORTATION */}
      <section className="py-24 bg-[#1a1a1a] text-white">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-6 text-[#D4AF37]">
              International Importation and Logistics
            </h2>
            <p className="text-lg font-playfair text-slate-300 mb-2">Global Friesian Excellence</p>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto mb-8"></div>
            <p className="text-lg text-slate-300 max-w-4xl mx-auto font-montserrat leading-relaxed">
              Titan Stables specializes in sourcing, importing, and logistics for premium Friesian horses from Europe's finest breeders. Our extensive network spans the Netherlands, Germany, Belgium, and France. We handle every aspect of the import process including veterinary inspections, health certificates, transportation, and customs clearance, ensuring your horse arrives in perfect condition.
            </p>
          </motion.div>

          {/* Import Process Timeline */}
          <motion.div {...fadeInUp} className="mb-16 max-w-4xl mx-auto">
            <Card className="bg-black/40 border-2 border-[#D4AF37]">
              <CardHeader>
                <CardTitle className="text-2xl font-playfair text-[#D4AF37] text-center">Import Process Timeline</CardTitle>
                <CardDescription className="text-center text-slate-300 font-montserrat">Complete service from selection to delivery in 4-8 weeks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { step: '1', title: 'Selection', duration: '1 week', description: 'Browse our European breeder network and select your perfect Friesian' },
                  { step: '2', title: 'Health Certification', duration: '1-2 weeks', description: 'Pre-purchase vet exam and export health certificates' },
                  { step: '3', title: 'Transportation', duration: '2-3 weeks', description: 'International shipping coordination (air and ground)' },
                  { step: '4', title: 'Customs Clearance', duration: '3-5 days', description: 'Import documentation and customs processing' },
                  { step: '5', title: 'Delivery', duration: '1-2 weeks', description: 'Quarantine period and final delivery to your location' }
                ].map((phase, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-[#D4AF37] flex items-center justify-center font-bold text-black">
                        {phase.step}
                      </div>
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-xl font-playfair font-bold text-white mb-1">{phase.title}</h4>
                      <p className="text-[#D4AF37] text-sm font-montserrat mb-2">{phase.duration}</p>
                      <p className="text-slate-300 font-montserrat">{phase.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left - Images and Success Stories */}
            <motion.div {...fadeInUp} className="space-y-8">
              <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-[#D4AF37]/20">
                <img 
                  src="https://images.unsplash.com/photo-1697658452083-02947cba35a2?q=80&w=1200" 
                  alt="International horse transport and importation services"
                  className="w-full h-auto"
                />
                <div className="bg-black/80 p-4 text-center">
                  <p className="text-white font-montserrat">Professional International Transport</p>
                </div>
              </div>

              <div className="rounded-xl overflow-hidden shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1578783931049-165bde93e43f?q=80&w=1200" 
                  alt="Horse cargo transport"
                  className="w-full h-64 object-cover"
                />
              </div>

              <Card className="bg-gradient-to-br from-[#D4AF37]/10 to-black/40 border-2 border-[#D4AF37]">
                <CardHeader>
                  <CardTitle className="text-2xl font-playfair text-[#D4AF37]">Recent Import Success</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 font-montserrat text-slate-300">
                  <div>
                    <p className="text-white font-bold mb-1">Magnus van de Heuvel</p>
                    <p className="text-sm">Imported from Netherlands → California</p>
                    <p className="text-sm">6-year-old KFPS registered stallion</p>
                    <p className="text-[#D4AF37] text-sm mt-2">✓ Completed in 5 weeks</p>
                    <p className="text-xs italic mt-2">"The entire process was seamless. Titan Stables handled everything professionally and my horse arrived in perfect health!" - Michael Rodriguez</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Right - Pricing and Services */}
            <motion.div {...staggerContainer} className="grid gap-6">
              <Card className="bg-black/60 border-2 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-2xl font-playfair text-white">Complete Import Package</CardTitle>
                  <CardDescription className="text-[#D4AF37] text-3xl font-bold">$3,000 - $5,000</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 font-montserrat text-slate-300">
                  <p className="text-sm">Pricing varies based on origin country and destination</p>
                  <div className="space-y-2 mt-4">
                    {[
                      'Horse sourcing from European breeders',
                      'Pre-purchase veterinary examination',
                      'Export health certificates',
                      'International transportation (air & ground)',
                      'Customs clearance documentation',
                      'Quarantine facility arrangements',
                      'Final delivery to your location',
                      'Transportation insurance included'
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#D4AF37] mt-1 flex-shrink-0" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Link to="/contact" className="w-full">
                    <Button className="w-full bg-[#D4AF37] hover:bg-[#B8860B] text-black font-bold">
                      Request Import Consultation
                    </Button>
                  </Link>
                </CardFooter>
              </Card>

              <Card className="bg-black/40 border-[#D4AF37]/30">
                <CardHeader>
                  <CardTitle className="text-xl font-playfair text-[#D4AF37]">Breeder Network</CardTitle>
                </CardHeader>
                <CardContent className="font-montserrat text-slate-300">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-[#D4AF37]" />
                      <span className="font-bold text-white">Netherlands</span>
                    </div>
                    <p className="text-sm">Premier KFPS-registered breeding farms with championship bloodlines</p>
                    
                    <div className="flex items-center gap-2 mt-4">
                      <MapPin className="w-5 h-5 text-[#D4AF37]" />
                      <span className="font-bold text-white">Germany</span>
                    </div>
                    <p className="text-sm">Performance-bred Friesians with dressage competition records</p>
                    
                    <div className="flex items-center gap-2 mt-4">
                      <MapPin className="w-5 h-5 text-[#D4AF37]" />
                      <span className="font-bold text-white">Belgium & France</span>
                    </div>
                    <p className="text-sm">Specialized breeding programs for temperament and conformation</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-900/20 to-black/40 border-2 border-green-500/30">
                <CardHeader>
                  <CardTitle className="text-xl font-playfair text-green-400">Insurance & Guarantees</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 font-montserrat text-slate-300">
                  {[
                    '30-day health guarantee',
                    'Full mortality insurance during transport',
                    'Pre-purchase vet exam included',
                    'Money-back satisfaction policy',
                    'Ongoing support post-arrival'
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-green-400" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Importation FAQ */}
          <motion.div {...fadeInUp} className="mt-16">
            <h3 className="text-3xl font-playfair font-bold text-[#D4AF37] text-center mb-8">Import FAQs</h3>
            <Accordion type="single" collapsible className="max-w-3xl mx-auto">
              {importationFAQs.map((faq, idx) => (
                <AccordionItem key={idx} value={`item-${idx}`} className="border-[#D4AF37]/30">
                  <AccordionTrigger className="text-white font-montserrat hover:text-[#D4AF37]">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-300 font-montserrat">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* WHY CHOOSE TITAN STABLES */}
      <section className="py-24 bg-black text-white">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-6 text-[#D4AF37]">
              Why Choose Titan Stables
            </h2>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto"></div>
          </motion.div>

          <motion.div {...staggerContainer} className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
            {[
              {
                icon: Globe,
                title: 'International Expertise',
                description: 'Decades of experience sourcing from Europe\'s finest breeders'
              },
              {
                icon: Award,
                title: 'FEI-Certified Trainers',
                description: 'World-class training staff with competition credentials'
              },
              {
                icon: ShieldCheck,
                title: 'Premium Facilities',
                description: 'State-of-the-art climate-controlled stables and training arenas'
              },
              {
                icon: Heart,
                title: 'Comprehensive Care',
                description: 'Full-service boarding with veterinary and nutrition support'
              },
              {
                icon: Truck,
                title: 'Seamless Logistics',
                description: 'End-to-end import process with customs and documentation expertise'
              }
            ].map((item, idx) => (
              <motion.div key={idx} {...fadeInUp}>
                <Card className="bg-black/40 border-2 border-slate-700 h-full transition-all duration-300 hover:border-[#D4AF37] hover:shadow-2xl hover:shadow-[#D4AF37]/20 hover:scale-105">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <item.icon className="w-8 h-8 text-[#D4AF37]" />
                    </div>
                    <h3 className="text-xl font-playfair font-bold text-white mb-3">{item.title}</h3>
                    <p className="text-sm text-slate-300 font-montserrat leading-relaxed">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="py-24 bg-gradient-to-b from-black to-[#1a1a1a] text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div {...fadeInUp}>
            <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-6 text-white">
              Ready to Experience Premium Equestrian Services?
            </h2>
            <p className="text-xl text-slate-300 mb-10 font-montserrat max-w-2xl mx-auto">
              Contact us today to discuss your training, boarding, or importation needs
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contact">
                <Button className="bg-[#D4AF37] hover:bg-[#B8860B] text-black font-bold text-lg px-10 py-6 rounded-full transition-all duration-300 hover:scale-105 shadow-2xl">
                  Schedule a Consultation
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" className="border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-bold text-lg px-10 py-6 rounded-full transition-all duration-300 hover:scale-105">
                  Contact Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default ServicesPage;
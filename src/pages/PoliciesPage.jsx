
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Heart, 
  Stethoscope, 
  Truck, 
  DollarSign, 
  FileText, 
  Gavel, 
  Lock,
  ClipboardList,
  GraduationCap,
  AlertCircle
} from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const PoliciesPage = () => {
  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('[data-section]');
      let currentSection = null;

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 150 && rect.bottom >= 150) {
          currentSection = section.getAttribute('data-section');
        }
      });

      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -100;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const policies = [
    {
      id: 'health-safety',
      title: 'Health & Safety Policies',
      icon: Stethoscope,
      color: 'text-emerald-600',
      sections: [
        {
          subtitle: 'Vaccination Requirements',
          content: `All horses at Titan Stables must maintain current vaccinations for:
          
• **Equine Influenza** - Annual vaccination required
• **Tetanus** - Updated every 12 months
• **Rhinopneumonitis (EHV-1/EHV-4)** - Semi-annual boosters
• **West Nile Virus** - Annual vaccination recommended
• **Rabies** - Required annually per state regulations

Proof of vaccination must be provided by a licensed veterinarian within 7 days of arrival.`
        },
        {
          subtitle: 'Health Screening & Quarantine',
          content: `New arrivals undergo mandatory health screening:
          
• Temperature check upon arrival
• Visual inspection for signs of illness
• 14-day quarantine period for horses from out-of-state
• Negative Coggins test (within 12 months)
• Health certificate from origin state veterinarian

During quarantine, horses are monitored twice daily for any signs of illness.`
        },
        {
          subtitle: 'Veterinary Care Standards',
          content: `Professional veterinary care is available 24/7:
          
• On-site veterinary visits scheduled bi-weekly
• Emergency vet response within 2 hours
• Comprehensive health records maintained digitally
• Routine dental examinations every 6 months
• Annual wellness examinations included in boarding

Horse owners are notified immediately of any health concerns.`
        },
        {
          subtitle: 'Emergency Procedures',
          content: `Our emergency response protocol includes:
          
• 24/7 on-call staff for immediate response
• Direct line to emergency veterinary hospital
• Fire evacuation plan with designated safe zones
• Emergency lighting and generator backup
• Staff trained in equine first aid and CPR
• Incident reporting within 1 hour of occurrence`
        },
        {
          subtitle: 'Biosecurity Measures',
          content: `To prevent disease transmission:
          
• Dedicated equipment for quarantine horses
• Hand washing stations throughout facility
• Disinfection protocols between horse handling
• Visitor health screening and log
• Limited access to barn areas
• Shoe sanitation mats at entry points`
        },
        {
          subtitle: 'Parasite Control Program',
          content: `Comprehensive deworming schedule:
          
• Fecal egg counts performed quarterly
• Strategic deworming based on individual needs
• Rotation of anthelmintic classes
• Pasture management to reduce parasite load
• Education on parasite prevention for owners`
        }
      ]
    },
    {
      id: 'boarding',
      title: 'Boarding Policies',
      icon: ClipboardList,
      color: 'text-blue-600',
      sections: [
        {
          subtitle: 'Boarding Agreement Terms',
          content: `All boarding clients must sign a comprehensive boarding agreement:
          
• Minimum 30-day commitment required
• 30-day written notice for termination
• Liability waiver and assumption of risk
• Emergency contact information mandatory
• Proof of ownership or lease agreement

Agreements are renewable monthly and subject to rate adjustments with 60-day notice.`
        },
        {
          subtitle: 'Facility Rules & Conduct',
          content: `For the safety and enjoyment of all:
          
• No smoking in barn or within 50 feet
• Quiet hours: 9 PM - 7 AM
• Clean up after your horse in all areas
• Children under 12 must be supervised
• Dogs must be leashed at all times
• Helmet required for riders under 18`
        },
        {
          subtitle: 'Turnout Schedule',
          content: `Turnout schedule varies by boarding package:
          
**Standard Boarding**: 4 hours daily turnout
**Premium Boarding**: 8 hours daily turnout  
**Elite Boarding**: All-day turnout with shelter

Turnout groups are determined by temperament and size. Individual turnout available upon request for additional fee.`
        },
        {
          subtitle: 'Feed & Nutrition Standards',
          content: `Quality nutrition program includes:
          
• Premium timothy/orchard grass hay twice daily
• Customized grain programs available
• Free-choice minerals and salt blocks
• Fresh water checked twice daily
• Owner-provided supplements administered at no charge

Special dietary needs accommodated with veterinary approval.`
        },
        {
          subtitle: 'Stall Maintenance',
          content: `Stalls are maintained to the highest standards:
          
• Daily mucking and fresh bedding
• Complete stall stripping weekly
• Shavings or pelleted bedding available
• Automatic waterers cleaned daily
• Disinfection between occupants`
        },
        {
          subtitle: 'Guest Horse Policies',
          content: `Guest horses welcome with advance notice:
          
• 48-hour advance reservation required
• $75/night guest stall fee
• Current health certificate and Coggins required
• Proof of liability insurance recommended
• Maximum 14-day guest stay

Guest horses may not use resident training facilities without supervision.`
        },
        {
          subtitle: 'Liability Waivers',
          content: `All participants must sign liability waivers acknowledging:
          
• Inherent risks of equine activities
• Release of liability for injury or property damage
• Assumption of risk
• Indemnification of facility
• Agreement to follow all facility rules

Waivers must be renewed annually.`
        },
        {
          subtitle: 'Insurance Requirements',
          content: `Strongly recommended for all boarders:
          
• Personal liability insurance ($1M minimum)
• Equine mortality insurance
• Major medical/surgical insurance

Facility carries comprehensive liability and property insurance. Certificate of insurance available upon request.`
        }
      ]
    },
    {
      id: 'training',
      title: 'Training Policies',
      icon: GraduationCap,
      color: 'text-purple-600',
      sections: [
        {
          subtitle: 'Training Methodology',
          content: `Our training philosophy emphasizes:
          
• Positive reinforcement techniques
• Classical dressage principles
• Individual assessment and customized programs
• Progressive skill development
• Mental and physical conditioning balance

All training methods prioritize horse welfare and willing partnership.`
        },
        {
          subtitle: 'Lesson Cancellation Policy',
          content: `Cancellation terms:
          
• **24+ hours notice**: Full credit toward future lesson
• **Less than 24 hours**: Charged at 50% of lesson fee
• **No-show**: Charged at full lesson rate
• **Weather cancellations**: Rescheduled at no charge
• **Trainer illness**: Rescheduled or credit issued

Make-up lessons must be used within 30 days.`
        },
        {
          subtitle: 'Training Package Terms',
          content: `Full training packages include:
          
• 5-6 training sessions per week
• Exercise on non-training days
• Monthly progress reports with video
• Quarterly evaluations with owner
• Show coaching (travel fees separate)

Minimum 3-month commitment required for training packages.`
        },
        {
          subtitle: 'Horse Welfare in Training',
          content: `We prioritize equine well-being:
          
• Maximum 45-minute training sessions
• Mandatory rest days each week
• Regular bodywork and massage
• Monitored weight and body condition
• Immediate cessation if horse shows stress or pain

Training intensity adjusted based on age, fitness level, and individual needs.`
        },
        {
          subtitle: 'Trainer Qualifications',
          content: `Our training staff maintains:
          
• USDF Certified Instructor credentials
• FEI-level competition experience
• Continued education requirements
• First Aid/CPR certification
• Background checks completed
• Minimum 10 years professional experience`
        },
        {
          subtitle: 'Progress Tracking',
          content: `Transparent progress documentation:
          
• Video recordings of monthly progress
• Written evaluations every 30 days
• Owner access to training portal
• Goal-setting sessions quarterly
• Show result tracking
• Communication via email, phone, or in-person`
        },
        {
          subtitle: 'Equipment Requirements',
          content: `Properly fitted equipment mandatory:
          
• Approved safety helmets (ASTM/SEI certified)
• Riding boots with heel (no tennis shoes)
• Well-fitted saddle and bridle
• Grooming tools and equipment
• Horse provided tack for training horses

Facility equipment available for rent or purchase.`
        },
        {
          subtitle: 'Behavioral Expectations',
          content: `Professional conduct expected from all clients:
          
• Respectful communication with staff
• Punctuality for scheduled lessons
• Preparedness with proper attire and equipment
• Following instructor direction
• Sportsmanship during group activities

Repeated policy violations may result in termination of services.`
        }
      ]
    },
    {
      id: 'importation',
      title: 'Importation & Logistics',
      icon: Truck,
      color: 'text-amber-600',
      sections: [
        {
          subtitle: 'Import Process Timeline',
          content: `Standard importation process (4-8 weeks):
          
**Week 1**: Horse selection and pre-purchase examination
**Week 2**: Export health certificates and documentation
**Week 3-4**: Transportation arrangement and booking
**Week 5-6**: Customs clearance and processing
**Week 7-8**: Quarantine period and final delivery

Timeline may vary based on origin country and seasonal factors.`
        },
        {
          subtitle: 'Health Certification',
          content: `Required documentation includes:
          
• USDA-endorsed veterinary health certificate
• Negative EIA (Coggins) test
• Pre-export isolation requirements met
• Country-specific vaccination records
• Import permit from destination country
• International health certificate (VS Form 17-140)

All documents must be in English or officially translated.`
        },
        {
          subtitle: 'Transport Safety Standards',
          content: `Safe transport guaranteed through:
          
• USDA-approved transport companies only
• Climate-controlled air transport
• Professional flight attendants for horses
• Specialized equine containers
• Real-time GPS tracking
• Insurance coverage during transit

Ground transport uses air-ride equipped vans with video monitoring.`
        },
        {
          subtitle: 'Customs & Documentation',
          content: `We handle all customs procedures:
          
• Filing of USDA Form VS 17-140
• Coordination with customs brokers
• Payment of import duties and fees
• Verification of all paperwork accuracy
• Communication with port veterinarians
• Expedited clearance arrangements`
        },
        {
          subtitle: 'Insurance Coverage',
          content: `Comprehensive insurance includes:
          
• Full mortality coverage during transport
• Trip cancellation protection
• Delay coverage for quarantine extension
• Veterinary care coverage in transit
• Loss of use insurance available

Insurance certificates provided before transport begins.`
        },
        {
          subtitle: 'Delivery Guarantees',
          content: `Our commitment to you:
          
• Horse delivered as described in contract
• 30-day health guarantee post-arrival
• Pre-purchase examination honored
• Veterinary follow-up included
• Full transparency throughout process
• Money-back guarantee if misrepresented`
        },
        {
          subtitle: 'Dispute Resolution',
          content: `In case of disputes:
          
• Direct communication with management first
• Mediation services available
• Independent veterinary assessment
• Arbitration before litigation
• Refund or replacement options
• Resolution within 60 days targeted`
        },
        {
          subtitle: 'Refund Policies',
          content: `Refund eligibility:
          
• Full refund if horse not as described
• Partial refund for delayed delivery (pro-rated)
• No refund for buyer's change of mind after transport
• Deposits non-refundable after health certificate issued
• Documentation required for all refund claims

Refunds processed within 14 business days of approval.`
        }
      ]
    },
    {
      id: 'payment',
      title: 'Payment & Cancellation',
      icon: DollarSign,
      color: 'text-green-600',
      sections: [
        {
          subtitle: 'Payment Methods',
          content: `Accepted payment methods:
          
• Bank wire transfer (preferred for international)
• Credit/Debit cards (Visa, Mastercard, AmEx)
• ACH bank transfer (US clients)
• Cash (up to $10,000)
• Certified checks (3-day clearing period)

Payment processing is PCI-DSS compliant and secure.`
        },
        {
          subtitle: 'Invoice & Billing Terms',
          content: `Standard billing practices:
          
• Invoices issued on 1st of each month
• Payment due within 15 days of invoice date
• Late fees of 1.5% per month after due date
• Service suspension after 30 days unpaid
• Collections referral after 60 days
• Automatic payment options available`
        },
        {
          subtitle: 'Late Payment Procedures',
          content: `Late payment protocol:
          
**15 days past due**: Email reminder sent
**20 days past due**: Phone call and second notice
**30 days past due**: Service suspension begins
**45 days past due**: Horse removal notice issued
**60 days past due**: Collections agency referral

Late fees and collection costs added to outstanding balance.`
        },
        {
          subtitle: 'Cancellation Deadlines',
          content: `Service cancellation requirements:
          
• **Boarding**: 30-day written notice required
• **Training**: 15-day written notice required
• **Lessons**: 24-hour notice for single lessons
• **Imports**: 50% deposit non-refundable after contracts signed

Cancellations without proper notice charged at full rate.`
        },
        {
          subtitle: 'Refund Eligibility',
          content: `Refund conditions:
          
• Prepaid services refunded pro-rata with proper notice
• Deposits for imports non-refundable after health certificates
• Lesson packages refunded for unused lessons only
• Emergency situations considered case-by-case
• Administrative fee ($50) deducted from refunds

Refunds processed within 30 days of approved request.`
        },
        {
          subtitle: 'Service Suspension',
          content: `Services suspended for:
          
• Non-payment of account balance
• Repeated policy violations
• Unsafe or disruptive behavior
• Failure to maintain required insurance
• Falsification of health records

Reinstatement requires full payment and compliance agreement.`
        },
        {
          subtitle: 'Deposit Requirements',
          content: `Deposits required for:
          
**Horse Imports**: 50% of total purchase price
**Training Packages**: First month payment
**Boarding**: First and last month rent
**Guest Horses**: Full payment in advance

Deposits held in segregated escrow account for client protection.`
        }
      ]
    },
    {
      id: 'liability',
      title: 'Liability & Insurance',
      icon: Shield,
      color: 'text-red-600',
      sections: [
        {
          subtitle: 'Liability Limitations',
          content: `Under state equine activity liability laws:
          
• Titan Stables not liable for inherent risks of equine activities
• Assumption of risk acknowledged by all participants
• No liability for acts of the horse
• Limited liability for negligence
• Maximum liability capped at contract value

"WARNING: Under state law, an equine professional is not liable for an injury to or the death of a participant in equine activities resulting from the inherent risks of equine activities."`
        },
        {
          subtitle: 'Insurance Requirements for Boarders',
          content: `Recommended insurance coverage:
          
• **Personal Liability**: $1,000,000 minimum
• **Equine Mortality**: Full market value
• **Major Medical**: $10,000+ recommended
• **Care, Custody, and Control**: If applicable

Facility reserves right to require proof of insurance.`
        },
        {
          subtitle: 'Accident Reporting',
          content: `All accidents must be reported immediately:
          
• Staff notified within 1 hour of incident
• Written incident report within 24 hours
• Photographs of injury scene
• Witness statements collected
• Insurance companies notified promptly
• Medical treatment documented

Failure to report may void liability coverage.`
        },
        {
          subtitle: 'Injury Waivers',
          content: `All participants sign comprehensive waivers:
          
• Release of liability for injury or death
• Assumption of known and unknown risks
• Agreement to indemnify facility
• Consent to emergency medical treatment
• Photo/video release for promotional use

Waivers binding and enforceable under state law.`
        },
        {
          subtitle: 'Property Damage',
          content: `Clients responsible for damage caused by their horse:
          
• Repair or replacement costs
• Damage to fencing, buildings, or equipment
• Injury to other horses
• Damage to vehicles or personal property

Facility insurance does not cover client-caused damage.`
        },
        {
          subtitle: 'Third-Party Liability',
          content: `Clients liable for:
          
• Guest injuries on property
• Damage caused by unattended horses
• Negligent supervision of children
• Violation of facility safety rules

Facility not responsible for third-party claims against clients.`
        }
      ]
    },
    {
      id: 'code-conduct',
      title: 'Code of Conduct',
      icon: Heart,
      color: 'text-pink-600',
      sections: [
        {
          subtitle: 'Professional Behavior Standards',
          content: `Expected conduct from all clients:
          
• Respectful language and tone
• Professional appearance and attire
• Consideration for others using facilities
• Honesty in all dealings
• Punctuality for scheduled activities
• Responsible social media conduct`
        },
        {
          subtitle: 'Facility Etiquette',
          content: `Please observe these courtesies:
          
• Ask before handling others' horses
• Clean up after yourself and your horse
• Share facilities cooperatively
• Keep noise to minimum during quiet hours
• Park in designated areas only
• No loitering in barn aisles`
        },
        {
          subtitle: 'Safety Protocol Compliance',
          content: `Mandatory safety rules:
          
• Wear helmet when mounted (required for under 18)
• Closed-toe footwear with heel required
• No loose clothing or jewelry while handling horses
• Always use crossties or have someone hold horse
• Report all safety hazards immediately
• Follow staff instructions without exception`
        },
        {
          subtitle: 'Respect for Staff & Riders',
          content: `Treat everyone with dignity:
          
• No harassment, discrimination, or bullying
• Respect staff expertise and authority
• Encourage fellow riders
• Maintain confidentiality
• Support facility community
• Resolve conflicts maturely`
        },
        {
          subtitle: 'Violation Consequences',
          content: `Policy violations result in:
          
**First offense**: Written warning and counseling
**Second offense**: 30-day suspension of privileges  
**Third offense**: Permanent termination of services
**Serious violations**: Immediate termination and legal action

No refunds for termination due to policy violations.`
        },
        {
          subtitle: 'Dispute Resolution Process',
          content: `For concerns or complaints:
          
1. Discuss directly with involved party
2. Escalate to barn manager if unresolved
3. Submit written complaint to ownership
4. Mediation session scheduled within 7 days
5. Final decision by ownership within 14 days

All parties agree to good faith resolution efforts.`
        }
      ]
    },
    {
      id: 'privacy',
      title: 'Data Privacy & GDPR',
      icon: Lock,
      color: 'text-indigo-600',
      sections: [
        {
          subtitle: 'Personal Data Collection',
          content: `We collect:
          
• Name, address, phone, email
• Payment and billing information
• Horse ownership and health records
• Emergency contact details
• Photos and videos (with consent)

Data collected only for legitimate business purposes.`
        },
        {
          subtitle: 'Data Usage & Storage',
          content: `Your data is used for:
          
• Service delivery and communication
• Billing and payment processing
• Health and safety record keeping
• Marketing communications (opt-in only)
• Legal compliance and record retention

Stored securely using industry-standard encryption.`
        },
        {
          subtitle: 'Third-Party Sharing',
          content: `Data shared only with:
          
• Veterinarians (for health care)
• Payment processors (for transactions)
• Insurance providers (for claims)
• Legal authorities (when required by law)

No sale of personal data to third parties.`
        },
        {
          subtitle: 'User Rights & Access',
          content: `You have the right to:
          
• Access your personal data
• Request corrections or updates
• Request deletion (subject to legal requirements)
• Withdraw consent for marketing
• Data portability
• Lodge complaints with authorities`
        },
        {
          subtitle: 'Data Retention Policy',
          content: `Data retained for:
          
• Active clients: Duration of relationship + 7 years
• Health records: 10 years minimum
• Financial records: 7 years (tax compliance)
• Marketing data: Until opt-out requested
• Legal records: As required by law`
        },
        {
          subtitle: 'Cookie Policy',
          content: `Website uses cookies for:
          
• Essential site functionality
• User preference storage
• Analytics and performance tracking
• Marketing and remarketing (opt-in)

Manage cookie preferences in browser settings.`
        },
        {
          subtitle: 'Contact Preferences',
          content: `Control your communications:
          
• Email newsletter: Opt-in/opt-out anytime
• SMS notifications: Opt-in required
• Phone calls: Business hours only
• Mail: Opt-out available
• Third-party offers: Never without permission`
        }
      ]
    },
    {
      id: 'terms',
      title: 'Terms of Service',
      icon: Gavel,
      color: 'text-slate-600',
      sections: [
        {
          subtitle: 'Website Usage Terms',
          content: `By using our website, you agree to:
          
• Accurate information provision
• Lawful and respectful use
• No unauthorized access attempts
• No automated data scraping
• Compliance with all applicable laws
• Acceptance of terms updates`
        },
        {
          subtitle: 'Intellectual Property Rights',
          content: `All content is protected:
          
• Copyrights © 2026 Titan Stables
• Trademarks and service marks
• Training methodologies and curricula
• Photos, videos, and graphics
• Written content and documentation

Unauthorized use prohibited and subject to legal action.`
        },
        {
          subtitle: 'Limitation of Liability',
          content: `To the maximum extent permitted by law:
          
• No liability for indirect or consequential damages
• Liability limited to amount paid for services
• No warranty of uninterrupted service
• Not liable for third-party content
• Force majeure exemptions apply`
        },
        {
          subtitle: 'Governing Law',
          content: `These terms governed by:
          
• Laws of the State of Virginia
• Federal laws of the United States
• Venue: Southampton County, Virginia
• Dispute resolution through arbitration
• Class action waiver
• Severability of provisions`
        },
        {
          subtitle: 'Contact Information',
          content: `For policy questions:
          
**Email**: sales@titanstables.org
**Phone**: +1 (434) 253-5844
**Address**: 13486 Cedar View Rd, Drewryville, VA 23844
**Business Hours**: Monday-Saturday, 8 AM - 6 PM EST

Policy department responds within 2 business days.`
        }
      ]
    }
  ];

  const tableOfContents = policies.map(policy => ({
    id: policy.id,
    title: policy.title,
    icon: policy.icon,
    color: policy.color,
  }));

  return (
    <>
      <Helmet>
        <title>Policies & Standards | Titan Stables - Comprehensive Equestrian Policies</title>
        <meta 
          name="description" 
          content="Comprehensive policies covering health & safety, boarding, training, importation, liability, data privacy, and terms of service at Titan Stables." 
        />
        <meta name="keywords" content="equestrian policies, horse boarding policies, training policies, importation policies, liability waivers, GDPR compliance" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative bg-black text-white py-20">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?q=80&w=2000" 
            alt="Professional equestrian facility"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-playfair font-bold mb-6">
            Policies & Standards
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto font-montserrat">
            Transparent, comprehensive policies ensuring the highest standards of care, safety, and professionalism
          </p>
          <div className="mt-6 text-sm text-slate-400">
            <p>Last Updated: April 22, 2026</p>
          </div>
        </div>
      </section>

      <Breadcrumbs items={[{ name: 'Policies & Standards', path: '/policies' }]} />

      {/* Main Content */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Sticky Table of Contents - Desktop Only */}
            <aside className="hidden lg:block lg:w-1/4">
              <div className="sticky top-24 bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                <h2 className="text-2xl font-playfair font-bold text-slate-900 mb-6">Contents</h2>
                <nav className="space-y-2">
                  {tableOfContents.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className={`w-full text-left flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                          activeSection === item.id
                            ? 'bg-[#D4AF37] text-black font-bold'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${activeSection === item.id ? 'text-black' : item.color}`} />
                        <span className="text-sm font-montserrat">{item.title}</span>
                      </button>
                    );
                  })}
                </nav>

                <div className="mt-8 pt-6 border-t border-slate-200">
                  <p className="text-xs text-slate-500 mb-2">Have questions?</p>
                  <a 
                    href="mailto:sales@titanstables.org" 
                    className="text-sm text-[#D4AF37] hover:underline font-montserrat font-medium"
                  >
                    Contact Policy Department
                  </a>
                </div>
              </div>
            </aside>

            {/* Content Area */}
            <div className="flex-1 space-y-12">
              {/* Mobile TOC - Accordion */}
              <div className="lg:hidden bg-white rounded-xl shadow-md border border-slate-200 p-6 mb-8">
                <h2 className="text-xl font-playfair font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#D4AF37]" />
                  Quick Navigation
                </h2>
                <div className="grid grid-cols-2 gap-2">
                  {tableOfContents.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className="flex items-center gap-2 p-2 rounded-lg text-left border border-slate-200 hover:border-[#D4AF37] transition-all"
                      >
                        <Icon className={`w-4 h-4 ${item.color}`} />
                        <span className="text-xs font-montserrat text-slate-700">{item.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Policy Sections */}
              {policies.map((policy, index) => {
                const Icon = policy.icon;
                return (
                  <motion.div
                    key={policy.id}
                    id={policy.id}
                    data-section={policy.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden"
                  >
                    {/* Section Header */}
                    <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-8">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-[#D4AF37] flex items-center justify-center">
                          <Icon className="w-7 h-7 text-black" />
                        </div>
                        <div>
                          <h2 className="text-3xl font-playfair font-bold text-white">
                            {policy.title}
                          </h2>
                          <p className="text-slate-300 text-sm mt-1 font-montserrat">
                            {policy.sections.length} detailed subsections
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Section Content */}
                    <div className="p-8">
                      <Accordion type="single" collapsible className="space-y-4">
                        {policy.sections.map((section, idx) => (
                          <AccordionItem 
                            key={idx} 
                            value={`section-${idx}`}
                            className="border border-slate-200 rounded-lg overflow-hidden"
                          >
                            <AccordionTrigger className="px-6 py-4 bg-slate-50 hover:bg-slate-100 text-left">
                              <div className="flex items-center gap-3">
                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#D4AF37] text-black flex items-center justify-center font-bold text-sm">
                                  {idx + 1}
                                </span>
                                <span className="font-playfair font-bold text-lg text-slate-900">
                                  {section.subtitle}
                                </span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-6 py-6 bg-white">
                              <div className="prose prose-slate max-w-none">
                                {section.content.split('\n\n').map((paragraph, pIdx) => (
                                  <div key={pIdx} className="mb-4 last:mb-0">
                                    {paragraph.split('\n').map((line, lIdx) => {
                                      // Check if line starts with bullet point
                                      if (line.trim().startsWith('•')) {
                                        return (
                                          <div key={lIdx} className="flex items-start gap-3 mb-2">
                                            <span className="text-[#D4AF37] mt-1">•</span>
                                            <span className="flex-1 text-slate-700 font-montserrat">
                                              {line.replace(/^•\s*/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').split('<strong>').map((part, i) => {
                                                if (i % 2 === 1) {
                                                  return <strong key={i} className="font-bold text-slate-900">{part}</strong>;
                                                }
                                                return part;
                                              })}
                                            </span>
                                          </div>
                                        );
                                      }
                                      // Regular paragraph
                                      return (
                                        <p key={lIdx} className="text-slate-700 font-montserrat leading-relaxed">
                                          {line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').split('<strong>').map((part, i) => {
                                            if (i % 2 === 1) {
                                              return <strong key={i} className="font-bold text-slate-900">{part}</strong>;
                                            }
                                            return part;
                                          })}
                                        </p>
                                      );
                                    })}
                                  </div>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  </motion.div>
                );
              })}

              {/* Contact Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-gradient-to-r from-[#D4AF37] to-[#B8860B] rounded-2xl shadow-xl p-8 md:p-12 text-center"
              >
                <AlertCircle className="w-12 h-12 text-black mx-auto mb-4" />
                <h3 className="text-2xl md:text-3xl font-playfair font-bold text-black mb-4">
                  Questions About Our Policies?
                </h3>
                <p className="text-black/90 font-montserrat mb-6 max-w-2xl mx-auto">
                  Our policy department is here to help clarify any questions or concerns you may have about our standards and procedures.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="mailto:sales@titanstables.org" 
                    className="bg-black text-white px-8 py-4 rounded-full font-bold hover:bg-slate-800 transition-colors inline-flex items-center justify-center gap-2"
                  >
                    Email Policy Department
                  </a>
                  <a 
                    href="tel:+14342535844" 
                    className="bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-slate-100 transition-colors inline-flex items-center justify-center gap-2"
                  >
                    Call (434) 253-5844
                  </a>
                </div>
                <p className="text-xs text-black/70 mt-6">
                  Business Hours: Monday-Saturday, 8 AM - 6 PM EST
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PoliciesPage;

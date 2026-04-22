import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Filter, X, Award, Activity, Search } from 'lucide-react';

const HorseFilterSidebar = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden w-full md:w-[300px] shrink-0 sticky top-24">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
        <h3 className="font-heading font-bold text-lg text-slate-900 flex items-center gap-2">
          <Filter className="w-5 h-5 text-[#D4AF37]" />
          Filters
        </h3>
        <span className="bg-slate-900 text-white text-xs px-2 py-1 rounded-full font-bold">12 Results</span>
      </div>

      <ScrollArea className="h-[calc(100vh-250px)] px-5 py-6">
        <div className="space-y-8">
          
          {/* Bloodline */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Bloodline</h4>
            <div className="space-y-2">
              {['Jasper 366', 'Tsjalke 397', 'Beart 411', 'Norbert 444'].map(line => (
                <div key={line} className="flex items-center space-x-2">
                  <Checkbox id={`line-${line}`} className="border-slate-300 text-[#D4AF37]" />
                  <label htmlFor={`line-${line}`} className="text-sm text-slate-600 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {line}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Gender */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Gender</h4>
            <div className="space-y-2">
              {['Stallion', 'Mare', 'Gelding'].map(gender => (
                <div key={gender} className="flex items-center space-x-2">
                  <Checkbox id={`gender-${gender}`} className="border-slate-300 text-[#D4AF37]" />
                  <label htmlFor={`gender-${gender}`} className="text-sm text-slate-600 leading-none">
                    {gender}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Age Slider */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Age</h4>
              <span className="text-xs text-[#D4AF37] font-semibold">3 - 15 yrs</span>
            </div>
            <Slider defaultValue={[3, 15]} min={1} max={30} step={1} className="py-2" />
          </div>

          {/* Health Status */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#D4AF37]" /> Health Tier
            </h4>
            <Select>
              <SelectTrigger className="w-full text-slate-600 text-sm">
                <SelectValue placeholder="Select Tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excellent">Excellent (Vet Verified)</SelectItem>
                <SelectItem value="good">Good Condition</SelectItem>
                <SelectItem value="fair">Fair / Rehab</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Certifications */}
          <div className="pt-4 border-t border-slate-100">
             <div className="flex items-start space-x-3 bg-[#D4AF37]/5 p-4 rounded-xl border border-[#D4AF37]/20">
                <Checkbox id="kfps-cert" className="mt-1 border-[#D4AF37] data-[state=checked]:bg-[#D4AF37]" />
                <div>
                  <label htmlFor="kfps-cert" className="text-sm font-bold text-slate-900 block cursor-pointer">
                    KFPS Certified
                  </label>
                  <p className="text-xs text-slate-500 mt-1">Show only officially registered Royal Friesians.</p>
                </div>
             </div>
          </div>
        </div>
      </ScrollArea>

      <div className="p-5 border-t border-slate-100 bg-white grid grid-cols-2 gap-3">
        <Button variant="outline" className="w-full rounded-full text-slate-600 border-slate-200 hover:bg-slate-50">
           <X className="w-4 h-4 mr-2" /> Clear
        </Button>
        <Button className="w-full rounded-full bg-slate-900 text-white hover:bg-[#D4AF37]">
           Apply
        </Button>
      </div>
    </div>
  );
};

export default HorseFilterSidebar;
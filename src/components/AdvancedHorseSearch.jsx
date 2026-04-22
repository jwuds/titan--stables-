import React, { useState } from 'react';
import { Search, SlidersHorizontal, MapPin, Award, Activity, Heart, Bookmark, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AdvancedHorseSearch = ({ onSearch }) => {
  const [filters, setFilters] = useState({
    query: '',
    ageRange: [1, 30],
    priceRange: [10000, 150000],
    color: 'all',
    gender: 'all',
    kfpsCertified: false,
    region: 'all',
    healthStatus: 'all'
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    if (onSearch) onSearch(newFilters);
  };

  const clearFilters = () => {
    const defaultFilters = {
      query: '',
      ageRange: [1, 30],
      priceRange: [10000, 150000],
      color: 'all',
      gender: 'all',
      kfpsCertified: false,
      region: 'all',
      healthStatus: 'all'
    };
    setFilters(defaultFilters);
    if (onSearch) onSearch(defaultFilters);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8 transition-all">
      {/* Search Bar & Quick Filters */}
      <div className="p-4 md:p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50/50">
        <div className="relative w-full md:w-[40%]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input 
            value={filters.query}
            onChange={(e) => handleFilterChange('query', e.target.value)}
            placeholder="Search by name, bloodline, or traits..." 
            className="pl-12 py-6 rounded-full bg-white border-slate-200 text-slate-900 focus-visible:ring-[#D4AF37]"
          />
        </div>
        
        <div className="flex w-full md:w-auto gap-3 flex-wrap">
          <Select value={filters.region} onValueChange={(val) => handleFilterChange('region', val)}>
            <SelectTrigger className="w-full md:w-[160px] bg-white rounded-full">
              <MapPin className="w-4 h-4 mr-2 text-slate-400" />
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Global Hubs</SelectItem>
              <SelectItem value="usa">USA</SelectItem>
              <SelectItem value="canada">Canada</SelectItem>
              <SelectItem value="europe">Europe (NL)</SelectItem>
              <SelectItem value="australia">Australia</SelectItem>
            </SelectContent>
          </Select>

          <Button 
            variant="outline" 
            onClick={() => setIsExpanded(!isExpanded)}
            className={`rounded-full px-6 transition-colors ${isExpanded ? 'bg-slate-900 text-white hover:bg-slate-800 hover:text-white' : 'bg-white'}`}
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Expanded Filters Panel */}
      {isExpanded && (
        <div className="p-6 md:p-8 bg-white grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 animate-in fade-in slide-in-from-top-4 duration-300">
          {/* Age Range */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-slate-700">Age Range</label>
              <span className="text-xs text-[#D4AF37] font-semibold">{filters.ageRange[0]} - {filters.ageRange[1]} years</span>
            </div>
            <Slider 
              value={filters.ageRange} 
              onValueChange={(val) => handleFilterChange('ageRange', val)}
              min={1} max={30} step={1} 
              className="py-4"
            />
          </div>

          {/* Price Range */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-slate-700">Price Range ($)</label>
              <span className="text-xs text-[#D4AF37] font-semibold">${(filters.priceRange[0]/1000).toFixed(0)}k - ${(filters.priceRange[1]/1000).toFixed(0)}k</span>
            </div>
            <Slider 
              value={filters.priceRange} 
              onValueChange={(val) => handleFilterChange('priceRange', val)}
              min={5000} max={250000} step={5000} 
              className="py-4"
            />
          </div>

          {/* Quick Selects */}
          <div className="space-y-4">
            <label className="text-sm font-bold text-slate-700">Gender & Color</label>
            <div className="grid grid-cols-2 gap-2">
              <Select value={filters.gender} onValueChange={(val) => handleFilterChange('gender', val)}>
                <SelectTrigger className="bg-slate-50"><SelectValue placeholder="Gender" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Gender</SelectItem>
                  <SelectItem value="stallion">Stallion</SelectItem>
                  <SelectItem value="mare">Mare</SelectItem>
                  <SelectItem value="gelding">Gelding</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filters.color} onValueChange={(val) => handleFilterChange('color', val)}>
                <SelectTrigger className="bg-slate-50"><SelectValue placeholder="Color" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Color</SelectItem>
                  <SelectItem value="black">True Black</SelectItem>
                  <SelectItem value="fading_black">Fading Black</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Certifications & Actions */}
          <div className="space-y-6">
             <div className="flex items-center space-x-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <Checkbox 
                  id="kfps" 
                  checked={filters.kfpsCertified}
                  onCheckedChange={(checked) => handleFilterChange('kfpsCertified', checked)}
                  className="data-[state=checked]:bg-[#D4AF37] data-[state=checked]:border-[#D4AF37]"
                />
                <label htmlFor="kfps" className="text-sm font-semibold text-slate-700 cursor-pointer flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#D4AF37]" /> KFPS Certified Only
                </label>
             </div>
             
             <div className="flex gap-3">
               <Button onClick={clearFilters} variant="outline" className="w-full rounded-full">
                 <X className="w-4 h-4 mr-2" /> Clear
               </Button>
               <Button className="w-full rounded-full bg-[#D4AF37] hover:bg-slate-900 text-white">
                 <Bookmark className="w-4 h-4 mr-2" /> Save Filter
               </Button>
             </div>
          </div>

        </div>
      )}
      
      {/* Results Bar */}
      <div className="px-6 py-3 bg-slate-900 text-white text-xs font-medium flex justify-between items-center">
        <span>Showing <strong className="text-[#D4AF37]">24</strong> premium horses matching criteria</span>
        <button onClick={clearFilters} className="text-slate-400 hover:text-white transition-colors underline decoration-dotted">Reset All</button>
      </div>
    </div>
  );
};

export default AdvancedHorseSearch;
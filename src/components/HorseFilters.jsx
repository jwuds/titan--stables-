import React from 'react';
import { Search } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { sanitizeInput } from '@/lib/inputValidation';

const HorseFilters = ({ filters, setFilters }) => {
  
  const handleSearchChange = (e) => {
    // Sanitize input immediately on change to prevent invalid state
    // but allow typing (so we don't aggressively strip harmless chars like spaces while typing)
    const rawValue = e.target.value;
    
    // Basic block for high-risk chars like < > ;
    const safeValue = rawValue.replace(/[<>;]/g, '');
    
    setFilters({ ...filters, searchQuery: safeValue });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-primary/20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {/* Search */}
        <div className="lg:col-span-2">
          <Label htmlFor="search" className="mb-2 block text-slate-700 font-semibold">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary" />
            <Input
              id="search"
              type="text"
              placeholder="Search by name, breed..."
              value={filters.searchQuery}
              onChange={handleSearchChange}
              className="pl-10 border-primary/30 focus:border-primary"
              maxLength={50}
            />
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <Label htmlFor="category" className="mb-2 block text-slate-700 font-semibold">Category</Label>
          <Select
            value={filters.category}
            onValueChange={(value) => setFilters({ ...filters, category: value })}
          >
            <SelectTrigger id="category" className="border-primary/30 focus:border-primary">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Stallion">Stallions</SelectItem>
              <SelectItem value="Mare">Mares</SelectItem>
              <SelectItem value="Gelding">Geldings</SelectItem>
              <SelectItem value="Foal">Foals</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Price Range Filter */}
        <div>
          <Label htmlFor="price" className="mb-2 block text-slate-700 font-semibold">Price Range</Label>
          <Select
            value={filters.priceRange}
            onValueChange={(value) => setFilters({ ...filters, priceRange: value })}
          >
            <SelectTrigger id="price" className="border-primary/30 focus:border-primary">
              <SelectValue placeholder="All Prices" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Prices</SelectItem>
              <SelectItem value="0-25000">Under $25,000</SelectItem>
              <SelectItem value="25000-50000">$25,000 - $50,000</SelectItem>
              <SelectItem value="50000-75000">$50,000 - $75,000</SelectItem>
              <SelectItem value="75000">$75,000+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Age Filter */}
        <div>
          <Label htmlFor="age" className="mb-2 block text-slate-700 font-semibold">Age</Label>
          <Select
            value={filters.age}
            onValueChange={(value) => setFilters({ ...filters, age: value })}
          >
            <SelectTrigger id="age" className="border-primary/30 focus:border-primary">
              <SelectValue placeholder="All Ages" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ages</SelectItem>
              <SelectItem value="0-2">Foals (0-2 years)</SelectItem>
              <SelectItem value="3-7">Young (3-7 years)</SelectItem>
              <SelectItem value="8-12">Mature (8-12 years)</SelectItem>
              <SelectItem value="13">Senior (13+ years)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default HorseFilters;
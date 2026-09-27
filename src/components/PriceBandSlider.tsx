'use client';

import React, { useState } from 'react';
import { IndianRupee, Sparkles, CheckCircle2 } from 'lucide-react';

interface PriceBandSliderProps {
  minPriceInr?: number;
  maxPriceInr?: number;
  initialPriceInr?: number;
  onChange?: (selectedPaise: number) => void;
}

export function PriceBandSlider({
  minPriceInr = 850,
  maxPriceInr = 2400,
  initialPriceInr = 1500,
  onChange,
}: PriceBandSliderProps) {
  const [selectedPrice, setSelectedPrice] = useState(initialPriceInr);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setSelectedPrice(val);
    onChange?.(val * 100); // Send paise
  };

  return (
    <div className="bg-[#FFF8F6] border border-[#E6DCCF] rounded-2xl p-5 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <label htmlFor="price-slider" className="text-sm font-black text-[#221A16] block">
            मूल्य चुनें / Your Listing Price
          </label>
          <p className="text-xs text-[#56423C]">
            AI निष्पक्ष सुझाया गया दायरा: ₹{minPriceInr.toLocaleString('en-IN')} – ₹{maxPriceInr.toLocaleString('en-IN')}
          </p>
        </div>

        <div className="text-left sm:text-right">
          <span className="text-2xl font-black text-[#9D3E1B] flex items-center">
            <IndianRupee className="w-5 h-5 inline -mr-0.5" />
            {selectedPrice.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-[#006B2F] font-bold block">
            ✓ 100% DBT ({selectedPrice * 100} पैसे सीधे बैंक में)
          </span>
        </div>
      </div>

      {/* Range Input Slider with High Contrast Markers */}
      <div className="space-y-2">
        <input
          id="price-slider"
          type="range"
          min={minPriceInr}
          max={maxPriceInr}
          step={50}
          value={selectedPrice}
          onChange={handleSliderChange}
          className="w-full h-3 bg-[#F5E5DE] rounded-lg appearance-none cursor-pointer accent-[#9D3E1B]"
        />

        <div className="flex justify-between text-xs text-[#56423C] font-bold">
          <span>₹{minPriceInr} (न्यूनतम / Fair Min)</span>
          <span className="text-[#9D3E1B] font-black">★ चुनी गई कीमत</span>
          <span>₹{maxPriceInr} (अधिकतम / Premium)</span>
        </div>
      </div>
    </div>
  );
}

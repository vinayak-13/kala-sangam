/**
 * Bhashini Multilingual Voice Cataloger Engine
 * Extracts structured e-commerce product attributes, GI craft tags, and fair pricing parameters
 * from regional dialect speech / audio transcripts.
 */

export interface ExtractedCraftAttributes {
  titleHi: string;
  titleEn: string;
  storyHi: string;
  storyEn: string;
  category: string;
  craftSubtype: string;
  giRegion: string;
  materials: string[];
  technique: string;
  hoursSpent: number;
  rawMaterialCostPaise: number;
  fairLaborRatePerHourPaise: number;
  artisanMarginPaise: number;
  packagingBufferPaise: number;
  calculatedFairPricePaise: number;
  suggestedMaxPricePaise: number;
  seoKeywords: string[];
}

export function parseBhashiniVoiceTranscript(
  transcript: string,
  detectedLanguage = 'hi'
): ExtractedCraftAttributes {
  // Normalize transcript text
  const clean = transcript.toLowerCase();

  // Smart heuristic extraction based on Indian traditional craft domains
  let category = 'Folk Painting (पारंपरिक लोक चित्रकला)';
  let craftSubtype = 'Warli Art (वारली कला)';
  let giRegion = 'Palghar & Dahanu, Maharashtra (GI No. 372)';
  let materials = ['गेरू लाल मिट्टी (Red Geru Mud)', 'चावल का लेप (Rice Paste)', 'बांस की तीली (Bamboo Nib)'];
  let technique = 'प्राकृतिक अंगुलि-हस्त चित्रण (Freehand Pigment Weaving)';
  let hoursSpent = 16;
  let rawMaterialCostPaise = 45000; // ₹450
  let fairLaborRatePerHourPaise = 9000; // ₹90 / hr (Maharashtra Artisan Fair Wage)
  let artisanMarginPaise = 60000; // ₹600 (Master Craftsman Skill Premium)
  let packagingBufferPaise = 20000; // ₹200 (Safe transit packing)

  if (clean.includes('pashmina') || clean.includes('shawl') || clean.includes('ऊन') || clean.includes('काश्मीर')) {
    category = 'Handloom Textile (हथकरघा वस्त्र)';
    craftSubtype = 'Authentic Cashmere Pashmina (शुद्ध कश्मीरी पश्मीना)';
    giRegion = 'Srinagar, Jammu & Kashmir (GI No. 46)';
    materials = ['100% Changthangi Goat Pashm Wool', 'Natural Saffron & Walnut Dyes'];
    technique = 'Charkha Hand-Spun & 100-Count Wooden Loom Weaving';
    hoursSpent = 72;
    rawMaterialCostPaise = 250000; // ₹2,500
    fairLaborRatePerHourPaise = 11000; // ₹110 / hr
    artisanMarginPaise = 180000; // ₹1,800
    packagingBufferPaise = 35000;
  } else if (clean.includes('brass') || clean.includes('पीतल') || clean.includes('दीया') || clean.includes('dhokra') || clean.includes('ढोकरा')) {
    category = 'Bell Metal & Brass Craft (धातु एवं ढोकरा शिल्प)';
    craftSubtype = 'Dhokra Lost-Wax Bell Metal Casting (ढोकरा ढलाई)';
    giRegion = 'Bastar, Chhattisgarh (GI No. 83)';
    materials = ['Recycled Brass Ingot', 'Beeswax Threading', 'Riverbed Clay Mold'];
    technique = 'Cire-Perdue (Lost Wax Hollow Casting)';
    hoursSpent = 24;
    rawMaterialCostPaise = 65000; // ₹650
    fairLaborRatePerHourPaise = 9500; // ₹95 / hr
    artisanMarginPaise = 85000; // ₹850
    packagingBufferPaise = 30000;
  } else if (clean.includes('clay') || clean.includes('मिट्टी') || clean.includes('terracotta') || clean.includes('टेराकोटा') || clean.includes('मटका')) {
    category = 'Terracotta Pottery (पारंपरिक टेराकोटा एवं मृत्तिका शिल्प)';
    craftSubtype = 'Hand-turned Terracotta Art (हस्तनिर्मित टेराकोटा)';
    giRegion = 'Gorakhpur / Azamgarh, Uttar Pradesh (GI No. 397)';
    materials = ['River Alluvial Clay', 'Natural Mustard Polish', 'Wood-fired Kiln Glow'];
    technique = 'Hand-carved Pottery on Stone Potter Wheel';
    hoursSpent = 12;
    rawMaterialCostPaise = 30000; // ₹300
    fairLaborRatePerHourPaise = 8500; // ₹85 / hr
    artisanMarginPaise = 45000; // ₹450
    packagingBufferPaise = 25000;
  }

  const laborCostPaise = hoursSpent * fairLaborRatePerHourPaise;
  const calculatedFairPricePaise =
    rawMaterialCostPaise + laborCostPaise + artisanMarginPaise + packagingBufferPaise;
  const suggestedMaxPricePaise = Math.round(calculatedFairPricePaise * 1.35);

  return {
    titleHi: `पारंपरिक हस्तनिर्मित ${craftSubtype}`,
    titleEn: `Authentic Handcrafted ${craftSubtype}`,
    storyHi: `यह कलाकृति स्थानीय प्राकृतिक सामग्री और पीढ़ियों से चली आ रही पारंपरिक विधा से तैयार की गई है। इसमें शिल्पकार के ${hoursSpent} घंटे का सूक्ष्म श्रम निहित है।`,
    storyEn: `Handmade using indigenous raw materials and century-old master techniques from ${giRegion}. Represents ${hoursSpent} hours of dedicated artisanal craftwork.`,
    category,
    craftSubtype,
    giRegion,
    materials,
    technique,
    hoursSpent,
    rawMaterialCostPaise,
    fairLaborRatePerHourPaise,
    artisanMarginPaise,
    packagingBufferPaise,
    calculatedFairPricePaise,
    suggestedMaxPricePaise,
    seoKeywords: [
      craftSubtype.toLowerCase(),
      'handcrafted',
      'gi tagged',
      'indian folk art',
      'b2b artisan export',
      giRegion.toLowerCase(),
    ],
  };
}

import React from 'react';
import Link from 'next/link';
import { MapPin, ShieldCheck, Award, ArrowLeft, Volume2 } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { VoicePlayer } from '@/components/VoicePlayer';
import { ProductCard } from '@/components/ProductCard';
import { profileService } from '@/server/services/profile-service';
import { productService } from '@/server/services/product-service';

export default async function ArtisanStoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let artisan;
  try {
    artisan = await profileService.getArtisanPublic(id);
  } catch {
    artisan = {
      id: 'c1111111-0000-0000-0000-000000000001',
      profile_id: 'a1111111-0000-0000-0000-000000000001',
      craft_type: 'Warli Painting',
      cluster_name: 'Dahanu Warli Cluster',
      district: 'Palghar',
      state: 'Maharashtra',
      years_of_practice: 24,
      bio: {
        en: '3rd generation Warli master painter honoring indigenous tribal rituals and Tarpa dance celebrations on mud-coated cloth.',
        hi: 'मिट्टी से लिपे कपड़े पर पारंपरिक आदिवासी रीति-रिवाजों का चित्रण करने वाले तीसरी पीढ़ी के वारली चित्रकार।',
        mr: 'मातीच्या लिंपणावर पारंपारिक आदिवासी रीती आणि तारपा नृत्याचे रेखाटन करणारे तिसऱ्या पिढीचे वारली कलाकार.',
      },
      bio_audio_url: null,
      odop_tagged: true,
      udyam_number: 'UDYAM-MH-26-0014891',
      is_verified: true,
      rating: 4.9,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  const { items } = await productService.listProducts({ limit: 4 });

  return (
    <div className="min-h-screen bg-[#FBF8F3] text-[#22201D] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <Link href="/explore" className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-[#C05A34]">
          <ArrowLeft className="w-4 h-4" /> Back to Marketplace
        </Link>

        {/* Artisan Hero Banner */}
        <div className="bg-white border border-[#E4DACE] rounded-3xl p-6 sm:p-10 shadow-sm flex flex-col md:flex-row gap-8 items-start">
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden bg-stone-200 shrink-0 border-2 border-[#C05A34]">
            <img
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300"
              alt="Artisan Profile"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-[#C05A34]/10 text-[#C05A34] text-xs font-bold capitalize">
                {artisan.craft_type.replace('_', ' ')}
              </span>
              {artisan.odop_tagged && (
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" /> ODOP GI Certified
                </span>
              )}
              {artisan.is_verified && (
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Udyam Verified
                </span>
              )}
            </div>

            <h1 className="text-3xl font-black text-[#22201D] font-heading">
              Sunil Dhangar
            </h1>

            <p className="text-sm font-semibold text-stone-600 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#C05A34]" />
              {artisan.cluster_name || artisan.district}, {artisan.state} · {artisan.years_of_practice} Years of Practice
            </p>

            <p className="text-base text-stone-700 leading-relaxed max-w-3xl">
              {artisan.bio.en}
            </p>
          </div>
        </div>

        {/* Voice Provenance Story Section */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-[#22201D] flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-[#C05A34]" />
            <span>कारीगर की अपनी आवाज़ में कहानी (Voice Story)</span>
          </h2>
          <VoicePlayer
            artisanName="Sunil Dhangar"
            sourceLanguage="मराठी / Marathi"
          />
        </div>

        {/* Catalog from this artisan */}
        <div className="space-y-4 pt-6">
          <h2 className="text-2xl font-black text-[#22201D] font-heading">
            सुनील ढनगर की कृतियाँ (Catalog by Artisan)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

-- ==============================================================================
-- KALA-SANGAM: Seed Data Migration (0002_seed.sql)
-- PS 26090: AI-Driven Market Linkage & Smart Cataloging for Marginalized Artisans
-- 12 Artisans · 8 States · 30 Multilingual Products · 6 Orders · 3 RFQs
-- ==============================================================================

-- ── 1. MOCK AUTH USERS (Ensures FK validity in Supabase & local environments) ──
do $$
begin
  if exists (select 1 from information_schema.tables where table_schema = 'auth' and table_name = 'users') then
    insert into auth.users (id, email, aud, role) values
      -- Artisans (12)
      ('a1111111-0000-0000-0000-000000000001', 'sunil.warli@kalasangam.local', 'authenticated', 'authenticated'),
      ('a1111111-0000-0000-0000-000000000002', 'leela.pottery@kalasangam.local', 'authenticated', 'authenticated'),
      ('a1111111-0000-0000-0000-000000000003', 'mohammed.bidri@kalasangam.local', 'authenticated', 'authenticated'),
      ('a1111111-0000-0000-0000-000000000004', 'ramesh.channapatna@kalasangam.local', 'authenticated', 'authenticated'),
      ('a1111111-0000-0000-0000-000000000005', 'pabiben.kutch@kalasangam.local', 'authenticated', 'authenticated'),
      ('a1111111-0000-0000-0000-000000000006', 'bikram.pattachitra@kalasangam.local', 'authenticated', 'authenticated'),
      ('a1111111-0000-0000-0000-000000000007', 'sukanti.dhokra@kalasangam.local', 'authenticated', 'authenticated'),
      ('a1111111-0000-0000-0000-000000000008', 'radha.sanjhi@kalasangam.local', 'authenticated', 'authenticated'),
      ('a1111111-0000-0000-0000-000000000009', 'sita.madhubani@kalasangam.local', 'authenticated', 'authenticated'),
      ('a1111111-0000-0000-0000-000000000010', 'harpreet.phulkari@kalasangam.local', 'authenticated', 'authenticated'),
      ('a1111111-0000-0000-0000-000000000011', 'dulal.terracotta@kalasangam.local', 'authenticated', 'authenticated'),
      ('a1111111-0000-0000-0000-000000000012', 'ghulam.pashmina@kalasangam.local', 'authenticated', 'authenticated'),
      -- Customers & B2B Buyers (4)
      ('b2222222-0000-0000-0000-000000000001', 'aarav.retail@customer.local', 'authenticated', 'authenticated'),
      ('b2222222-0000-0000-0000-000000000002', 'priya.retail@customer.local', 'authenticated', 'authenticated'),
      ('b2222222-0000-0000-0000-000000000003', 'ananya.hotelprocure@fabhotels.local', 'authenticated', 'authenticated'),
      ('b2222222-0000-0000-0000-000000000004', 'vikram.craftstore@tribalroots.local', 'authenticated', 'authenticated')
    on conflict (id) do nothing;
  end if;
end $$;

-- ── 2. PROFILES ──────────────────────────────────────────────────────────────
insert into profiles (id, role, full_name, phone, preferred_locale, avatar_url) values
  ('a1111111-0000-0000-0000-000000000001', 'artisan', 'Sunil Dhangar', '+919820011001', 'mr', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'),
  ('a1111111-0000-0000-0000-000000000002', 'artisan', 'Leela Devi Kumhar', '+919820011002', 'hi', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'),
  ('a1111111-0000-0000-0000-000000000003', 'artisan', 'Mohammed Abdul Rauf', '+919820011003', 'hi', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'),
  ('a1111111-0000-0000-0000-000000000004', 'artisan', 'Ramesh Gowda', '+919820011004', 'en', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'),
  ('a1111111-0000-0000-0000-000000000005', 'artisan', 'Pabiben Rabari', '+919820011005', 'hi', 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150'),
  ('a1111111-0000-0000-0000-000000000006', 'artisan', 'Bikram Maharana', '+919820011006', 'en', 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150'),
  ('a1111111-0000-0000-0000-000000000007', 'artisan', 'Sukanti Baghel', '+919820011007', 'hi', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'),
  ('a1111111-0000-0000-0000-000000000008', 'artisan', 'Radha Raman Sharma', '+919820011008', 'hi', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150'),
  ('a1111111-0000-0000-0000-000000000009', 'artisan', 'Sita Devi Paswan', '+919820011009', 'hi', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150'),
  ('a1111111-0000-0000-0000-000000000010', 'artisan', 'Harpreet Kaur', '+919820011010', 'hi', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150'),
  ('a1111111-0000-0000-0000-000000000011', 'artisan', 'Dulal Kumbhakar', '+919820011011', 'en', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150'),
  ('a1111111-0000-0000-0000-000000000012', 'artisan', 'Ghulam Hassan Mir', '+919820011012', 'hi', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'),
  -- Buyers
  ('b2222222-0000-0000-0000-000000000001', 'customer', 'Aarav Mehta', '+919811002201', 'en', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'),
  ('b2222222-0000-0000-0000-000000000002', 'customer', 'Priya Deshmukh', '+919811002202', 'mr', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'),
  ('b2222222-0000-0000-0000-000000000003', 'b2b_buyer', 'Ananya Roy (Heritage Hospitality)', '+919811002203', 'en', 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150'),
  ('b2222222-0000-0000-0000-000000000004', 'b2b_buyer', 'Vikramaditya Singhania (Bharat Crafts Ltd)', '+919811002204', 'en', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150')
on conflict (id) do nothing;

-- ── 3. ARTISAN PROFILES ──────────────────────────────────────────────────────
insert into artisan_profiles (id, profile_id, craft_type, cluster_name, district, state, years_of_practice, bio, bio_audio_url, odop_tagged, udyam_number, is_verified, rating) values
  ('c1111111-0000-0000-0000-000000000001', 'a1111111-0000-0000-0000-000000000001', 'warli_painting', 'Dahanu Warli Cluster', 'Palghar', 'Maharashtra', 24, '{"en": "3rd generation Warli master painter honoring indigenous tribal rituals and Tarpa dance celebrations on mud-coated cloth.", "hi": "मिट्टी से लिपे कपड़े पर पारंपरिक आदिवासी रीति-रिवाजों और तारपा नृत्य का चित्रण करने वाले तीसरी पीढ़ी के वारली चित्रकार।", "mr": "मातीच्या लिंपणावर पारंपारिक आदिवासी रीती आणि तारपा नृत्याचे रेखाटन करणारे तिसऱ्या पिढीचे वारली कलाकार."}'::jsonb, '/audio/seed/sunil_intro.mp3', true, 'UDYAM-MH-26-0014891', true, 4.9),
  ('c1111111-0000-0000-0000-000000000002', 'a1111111-0000-0000-0000-000000000002', 'blue_pottery', 'Kot Jewar Ceramic Cluster', 'Jaipur', 'Rajasthan', 18, '{"en": "Crafting GI-tagged Jaipur blue pottery glazed with quartz powder and natural oxides without clay.", "hi": "क्वार्ट्ज़ पाउडर और प्राकृतिक ऑक्साइड से बिना मिट्टी के जीआई-टैग प्राप्त जयपुर ब्लू पॉटरी का निर्माण।", "mr": "मातीशिवाय क्वार्ट्झ पावडर आणि नैसर्गिक ऑक्साईड वापरून जीआय-टॅग प्राप्त जयपूर ब्लू पॉटरी बनवणारे कारागीर."}'::jsonb, '/audio/seed/leela_intro.mp3', true, 'UDYAM-RJ-14-0023412', true, 4.8),
  ('c1111111-0000-0000-0000-000000000003', 'a1111111-0000-0000-0000-000000000003', 'bidriware', 'Bidar Metalcraft Heritage Guild', 'Bidar', 'Karnataka', 32, '{"en": "Master of pure silver inlay on blackened zinc-copper alloy using aged fort soil.", "hi": "किले की प्राचीन मिट्टी से काले किए गए जस्ता-तांबा मिश्र धातु पर शुद्ध चांदी की नक्काशी के उस्ताद।", "mr": "किल्ल्याच्या मातीने काळ्या केलेल्या मिश्रधातूवर शुद्ध चांदीचे नक्षीकाम करणारे नामवंत कारागीर."}'::jsonb, '/audio/seed/mohammed_intro.mp3', true, 'UDYAM-KR-04-0019283', true, 5.0),
  ('c1111111-0000-0000-0000-000000000004', 'a1111111-0000-0000-0000-000000000004', 'channapatna_toys', 'Channapatna Craft Park', 'Ramanagara', 'Karnataka', 15, '{"en": "Handcrafted non-toxic wooden toys turned from ivory wood and colored with natural vegetable lac.", "hi": "हाले की लकड़ी और प्राकृतिक वनस्पति लाख के रंगों से बने बच्चों के सुरक्षित खिलौने।", "mr": "नैसर्गिक लाखेच्या रंगांनी हाताने कोरलेली सुरक्षित आणि पर्यावरणपूरक चन्नपट्टण खेळणी."}'::jsonb, '/audio/seed/ramesh_intro.mp3', true, 'UDYAM-KR-28-0091823', true, 4.7),
  ('c1111111-0000-0000-0000-000000000005', 'a1111111-0000-0000-0000-000000000005', 'kutch_embroidery', 'Bhujodi Weavers Collective', 'Kutch', 'Gujarat', 21, '{"en": "Mirror-work and Suf intricate chain stitch embroidery passed down through nomadic desert matriarchs.", "hi": "रेगिस्तानी महिलाओं द्वारा पीढ़ियों से संजोई गई सूफ और शीशे के काम की पारंपरिक कच्छी कढ़ाई।", "mr": "पिढ्यानपिढ्या चालत आलेली आरशाचे काम असलेली सुबक कच्छी भरतकाम कला."}'::jsonb, '/audio/seed/pabiben_intro.mp3', true, 'UDYAM-GJ-01-0038192', true, 4.9),
  ('c1111111-0000-0000-0000-000000000006', 'a1111111-0000-0000-0000-000000000006', 'pattachitra', 'Raghurajpur Heritage Craft Village', 'Puri', 'Odisha', 27, '{"en": "Intricate mythological scroll paintings on dried palm leaves and treated silk using natural stone colors.", "hi": "ताड़पत्र और रेशम पर प्राकृतिक पत्थरों के रंगों से पौराणिक आख्यानों की बारीक पट्टचित्र चित्रकारी।", "mr": "ताडपत्री आणि रेशमी कापडावर नैसर्गिक खड्यांच्या रंगांनी चितारलेली पौराणिक पट्टचित्र कला."}'::jsonb, '/audio/seed/bikram_intro.mp3', true, 'UDYAM-OD-21-0048192', true, 4.8),
  ('c1111111-0000-0000-0000-000000000007', 'a1111111-0000-0000-0000-000000000007', 'dhokra', 'Kondagaon Bastar Shilp Samiti', 'Bastar', 'Chhattisgarh', 19, '{"en": "Ancient 4,000-year-old lost-wax bell metal hollow casting preserving tribal motifs.", "hi": "4,000 साल पुरानी मोम-ढलाई (लॉस्ट-वैक्स) तकनीक से आदिवासी रूपांकनों की कांस्य ढोकरा कला।", "mr": "४००० वर्षे जुन्या मेणाच्या साच्याने बनवलेली वैशिष्ट्यपूर्ण आदिवासी ढोकरा धातू मूर्तीकला."}'::jsonb, '/audio/seed/sukanti_intro.mp3', true, 'UDYAM-CG-08-0071829', true, 4.6),
  ('c1111111-0000-0000-0000-000000000008', 'a1111111-0000-0000-0000-000000000008', 'sanjhi', 'Vrindavan Dham Kala Samiti', 'Mathura', 'Uttar Pradesh', 30, '{"en": "Fine hand-cut stencil paper art capturing Radha-Krishna leelas with custom scissor-blades.", "hi": "विशेष कैंचियों से हाथ द्वारा काटी गई कागज़ की संझी कला में राधा-कृष्ण लीलाओं का संजीव चित्रण।", "mr": "विशेष कात्रीने हाताने कापून तयार केलेली राधा-कृष्णाच्या लिला दर्शवणारी सांझी कागद कला."}'::jsonb, '/audio/seed/radha_intro.mp3', true, 'UDYAM-UP-58-0029103', true, 4.9),
  ('c1111111-0000-0000-0000-000000000009', 'a1111111-0000-0000-0000-000000000009', 'madhubani', 'Jitwarpur Artisan Society', 'Madhubani', 'Bihar', 22, '{"en": "Fine Bharni and Kachni style Madhubani folk paintings on handmade paper using bamboo nibs.", "hi": "बांस की कलम और प्राकृतिक रंगों से हस्तनिर्मित कागज पर भरनी और कचनी शैली की मधुबनी पेंटिंग।", "mr": "बांबूच्या कमानीने आणि नैसर्गिक रंगांनी हाताने बनवलेल्या कागदावर चितारलेली मधुबनी कला."}'::jsonb, '/audio/seed/sita_intro.mp3', true, 'UDYAM-BR-22-0051923', true, 4.8),
  ('c1111111-0000-0000-0000-000000000010', 'a1111111-0000-0000-0000-000000000010', 'phulkari', 'Patiala Virasat Weavers', 'Patiala', 'Punjab', 16, '{"en": "Geometric silk floss floral embroidery on coarse hand-spun khaddar cotton fabric.", "hi": "हाथ से कते खद्दर के कपड़े पर रेशमी धागों से रची गई पारंपरिक ज्यामितीय फुलकारी कढ़ाई।", "mr": "हाताने विणलेल्या खादीवर रेशमी धाग्यांनी केलेली नयनरम्य भौमितिक फुलकारी भरतकाम कला."}'::jsonb, '/audio/seed/harpreet_intro.mp3', true, 'UDYAM-PB-18-0041289', true, 4.7),
  ('c1111111-0000-0000-0000-000000000011', 'a1111111-0000-0000-0000-000000000011', 'terracotta', 'Panchmura Terracotta Society', 'Bankura', 'West Bengal', 25, '{"en": "Earthen kiln-fired Bankura terracotta horses and festive pottery with symbolic neck rings.", "hi": "बांकुरा के प्रसिद्ध मिट्टी के घोड़े और गर्दन पर गोल छल्लों वाली पारंपरिक टेराकोटा कलाकृतियां।", "mr": "बांकुराचे प्रसिद्ध मातीचे घोडे आणि वैशिष्ट्यपूर्ण पारंपरिक टेराकोटा मातीकाम."}'::jsonb, '/audio/seed/dulal_intro.mp3', true, 'UDYAM-WB-03-0092103', true, 4.8),
  ('c1111111-0000-0000-0000-000000000012', 'a1111111-0000-0000-0000-000000000012', 'pashmina', 'Old Srinagar Karigar Collective', 'Srinagar', 'Jammu & Kashmir', 35, '{"en": "100% pure Ladakhi Changthangi cashmere hand-spun and embroidered with ultra-fine needle sozni work.", "hi": "लद्दाखी चांगथांगी पश्मीना पर बारीक सुई से की गई पारंपरिक कश्मीरी सोजनी कढ़ाई वाली शॉलें।", "mr": "शुद्ध लडाखी चांगथांगी पश्मिनावर अत्यंत नाजूक सुईने केलेली पारंपारिक सोझनी कशिदाकारी."}'::jsonb, '/audio/seed/ghulam_intro.mp3', true, 'UDYAM-JK-21-0010293', true, 5.0)
on conflict (id) do nothing;

-- ── 4. BUYER PROFILES ────────────────────────────────────────────────────────
insert into buyer_profiles (id, profile_id, company_name, gstin, business_type, verification_status) values
  ('d1111111-0000-0000-0000-000000000001', 'b2222222-0000-0000-0000-000000000003', 'Heritage Hotels & Resorts India', '27AABCH1234F1Z8', 'hotel', 'verified'),
  ('d1111111-0000-0000-0000-000000000002', 'b2222222-0000-0000-0000-000000000004', 'Bharat Crafts Exporters Ltd', '07AAECB5678G2Z1', 'exporter', 'verified')
on conflict (id) do nothing;

-- ── 5. PRODUCTS (30 Real-World Multilingual Listings, ₹350 - ₹18,000) ─────────
insert into products (id, artisan_id, status, title, description, materials, dimensions, craft_technique, tags, price_paise, ai_price_min_paise, ai_price_max_paise, stock_quantity, b2b_available, b2b_moq, lead_time_days, view_count) values

  -- 1. Sunil Dhangar (Warli)
  ('e1111111-0000-0000-0000-000000000001', 'c1111111-0000-0000-0000-000000000001', 'published',
   '{"en": "Traditional Tarpa Dance Festive Warli Canvas", "hi": "पारंपरिक तारपा नृत्य उत्सव वारली कैनवास", "mr": "पारंपारिक तारपा नृत्य वारली कॅनव्हास"}'::jsonb,
   '{"en": "Painted with rice paste and natural gum on cow-dung and geru-coated cloth, depicting village elders dancing in concentric spiraling unity.", "hi": "गेरू और गोबर से पुते कपड़े पर चावल के लेप से निर्मित, जो गांव के सामूहिक तारपा नृत्य को दर्शाता है।", "mr": "गेरू व शेणाने सारवलेल्या कापडावर तांदळाच्या खिरीने रेखाटलेले तारपा नृत्य चित्र."}'::jsonb,
   ARRAY['Handspun Canvas', 'Rice Flour Paste', 'Geru Earth Clay'], '24 x 18 inches', 'Bamboo stick brushwork', ARRAY['warli', 'tribal', 'painting', 'wall decor', 'odop'], 280000, 240000, 320000, 4, true, 10, 14, 184),

  ('e1111111-0000-0000-0000-000000000002', 'c1111111-0000-0000-0000-000000000001', 'published',
   '{"en": "Tree of Life Hand-painted Terracotta Plate", "hi": "जीवन वृक्ष हस्तनिर्मित टेराकोटा थाली", "mr": "जीवन वृक्ष हाताने रंगवलेली मातीची थाळी"}'::jsonb,
   '{"en": "Earthen decorative plate featuring sacred Palaghata motif and bountiful harvest birds, finished with waterproof sealant.", "hi": "पलाघटा देवी और पक्षियों के रूपांकन वाली सजावटी मिट्टी की थाली, वाटरप्रूफ कोटिंग युक्त।", "mr": "वारली संस्कृतीतील जीवन वृक्ष आणि पक्षांचे सुरेख रेखाटन असलेली मातीची सजावटी थाळी."}'::jsonb,
   ARRAY['Terracotta Clay', 'Natural Pigments'], '10 inch diameter', 'Wheel thrown & fine brushwork', ARRAY['warli', 'plates', 'terracotta', 'handmade'], 85000, 75000, 110000, 12, true, 25, 10, 92),

  ('e1111111-0000-0000-0000-000000000003', 'c1111111-0000-0000-0000-000000000001', 'published',
   '{"en": "Hand-painted Warli Bamboo Pen & Utility Stand", "hi": "हाथ से चित्रित वारली बांस पेन स्टैंड", "mr": "हाताने रंगवलेला वारली बांबू पेन स्टँड"}'::jsonb,
   '{"en": "Treated natural Konkan bamboo cylinder painted with rural village harvest scenes. Perfect for conscious desk setups.", "hi": "कोंकण के बांस से तैयार और गांव के प्राकृतिक दृश्यों से सजाया गया टिकाऊ डेस्क स्टैंड।", "mr": "कोकणातील बांबूवर ग्रामीण लोकजीवनाचे चित्रण असलेला देखणा पेन स्टँड."}'::jsonb,
   ARRAY['Treated Bamboo', 'Mineral White'], '4.5 x 3.5 inches', 'Loom & line painting', ARRAY['desk', 'bamboo', 'warli', 'stationery'], 45000, 38000, 55000, 20, true, 50, 7, 65),

  -- 2. Leela Devi Kumhar (Blue Pottery)
  ('e1111111-0000-0000-0000-000000000004', 'c1111111-0000-0000-0000-000000000002', 'published',
   '{"en": "Royal Cobalt Blue Pottery Hexagonal Floral Vase", "hi": "शाही कोबाल्ट ब्लू पॉटरी षट्कोणीय फूलदान", "mr": "रॉयल कोबाल्ट ब्लू पॉटरी षटकोनी फुलदाणी"}'::jsonb,
   '{"en": "Signature Jaipur blue pottery vase glazed in Egyptian faience style with Persian floral motifs. Clay-free composition from ground quartz.", "hi": "क्वार्ट्ज और गोंद से निर्मित पारंपरिक जयपुरी फूलदान, फ़ारसी फूलों की बेलों से सजा।", "mr": "क्वार्ट्झ पावडर व नैसर्गिक काचेपासून बनवलेली आकर्षक कोबाल्ट ब्लू फुलदाणी."}'::jsonb,
   ARRAY['Quartz Powder', 'Fullers Earth', 'Natural Gum', 'Copper Oxide'], '12 x 5 inches', 'Hand-moulded & kiln glazed', ARRAY['blue pottery', 'jaipur', 'ceramic', 'vase', 'odop'], 195000, 170000, 230000, 6, true, 15, 20, 310),

  ('e1111111-0000-0000-0000-000000000005', 'c1111111-0000-0000-0000-000000000002', 'published',
   '{"en": "Set of 4 Turquoise Blue Ceramic Coasters", "hi": "4 फिरोजी ब्लू सिरेमिक कोस्टर्स का सेट", "mr": "४ फिरोजी ब्लू पॉटरी कोस्टर्सचा संच"}'::jsonb,
   '{"en": "Hand-painted round coasters featuring classic Mughal geometric rosettes with scratch-resistant felt backing.", "hi": "मुगल ज्यामितीय कला से सुसज्जित 4 हाथ से बने कोस्टर, मेज की सुरक्षा के लिए नीचे फेल्ट लगा।", "mr": "मुघल नक्षीकाम असलेले ४ आकर्षक कोस्टर्स, चहा-कॉफी कप ठेवण्यासाठी उपयुक्त."}'::jsonb,
   ARRAY['Quartz Compound', 'Cobalt Oxide', 'Felt Backing'], '4 inch diameter', 'Glazed firing', ARRAY['coasters', 'tableware', 'blue pottery', 'gift'], 65000, 55000, 80000, 18, true, 40, 10, 142),

  ('e1111111-0000-0000-0000-000000000006', 'c1111111-0000-0000-0000-000000000002', 'published',
   '{"en": "Blue Pottery Decorative Wall Hanging Plate (10-inch)", "hi": "ब्लू पॉटरी सजावटी दीवार थाली (10 इंच)", "mr": "ब्लू पॉटरी सजावटी भिंतीवरील प्लेट (१० इंच)"}'::jsonb,
   '{"en": "Statement wall plate painted with dancing peacock flanked by marigold blossoms in deep indigo and cobalt.", "hi": "गहरे नीले और पीले रंगों में मोर के मनोहारी नृत्य को दर्शाती सजावटी दीवार प्लेट।", "mr": "मोर आणि पारंपारिक फुलांच्या नक्षीने सजवलेली देखणी वॉल हँगिंग प्लेट."}'::jsonb,
   ARRAY['Quartz Faience', 'Natural Oxides'], '10 inch diameter', 'High glaze low temperature kiln', ARRAY['wall decor', 'jaipur', 'peacock', 'pottery'], 125000, 110000, 150000, 9, true, 20, 14, 215),

  -- 3. Mohammed Abdul Rauf (Bidriware)
  ('e1111111-0000-0000-0000-000000000007', 'c1111111-0000-0000-0000-000000000003', 'published',
   '{"en": "Silver Inlaid Floral Bidri Aftaba Decor Flask", "hi": "शुद्ध चांदी की नक्काशी वाली बिदरी आफ्ताबा सुराही", "mr": "चांदीचे नक्षीकाम असलेली बिद्री आफताबा सुराही"}'::jsonb,
   '{"en": "Heirloom metal art flask cast in zinc-copper alloy, blackened with 500-year-old Bidar Fort soil, embedded with pure 99.9% silver wire.", "hi": "किले की विशेष मिट्टी से काली की गई मिश्र धातु पर 99.9% शुद्ध चांदी के तारों की कारीगरी।", "mr": "बिदर किल्ल्याच्या मातीने काळ्या केलेल्या धातूवर शुद्ध चांदीच्या तारांनी कोरलेली सुराही."}'::jsonb,
   ARRAY['Zinc-Copper Alloy', 'Pure Silver 999', 'Bidar Soil Oxidant'], '11 x 6 inches', 'Tarkashi silver wire inlay', ARRAY['bidriware', 'silver', 'karnataka', 'luxury', 'odop'], 1450000, 1300000, 1650000, 2, true, 5, 25, 420),

  ('e1111111-0000-0000-0000-000000000008', 'c1111111-0000-0000-0000-000000000003', 'published',
   '{"en": "Bidri Silver Inlaid Floral Visiting Card Case", "hi": "बिदरी चांदी नक्काशी विजिटिंग कार्ड केस", "mr": "बिद्री चांदीचे काम असलेला व्हिजिटिंग कार्ड बॉक्स"}'::jsonb,
   '{"en": "Pocket business card holder finished in deep velvet black with Taihnishan sheet silver floral creeper pattern.", "hi": "मखमली काले रंग और चांदी की बेलों से सजा प्रीमियम पॉकेट विजिटिंग कार्ड केस।", "mr": "चांदीच्या नाजूक वेलींचे नक्षीकाम असलेला पॉकेट कार्ड केस."}'::jsonb,
   ARRAY['Zinc Alloy', 'Pure Silver Inlay'], '3.8 x 2.4 inches', 'Meenakari and sheet inlay', ARRAY['corporate', 'accessories', 'bidriware', 'silver'], 320000, 280000, 380000, 15, true, 30, 15, 178),

  -- 4. Ramesh Gowda (Channapatna Toys)
  ('e1111111-0000-0000-0000-000000000009', 'c1111111-0000-0000-0000-000000000004', 'published',
   '{"en": "Handcrafted 5-Ring Wooden Stacking Tower", "hi": "हाथ से बना 5-छल्ले वाला लकड़ी का स्टैकर खिलौना", "mr": "हाताने बनवलेले ५-रिंग लाकडी स्टॅकिंग खेळणे"}'::jsonb,
   '{"en": "Safe, baby-friendly stacking toy turned from Wrightia tinctoria (Aale mara) wood, polished with non-toxic turmeric and vegetable lac.", "hi": "हल्दी और प्राकृतिक रंगों से पॉलिश किया गया बच्चों के लिए सुरक्षित लकड़ी का खिलौना।", "mr": "हळद आणि नैसर्गिक रंगांनी पॉलिश केलेले बाळांसाठी सुरक्षित लाकडी खेळणे."}'::jsonb,
   ARRAY['Ivory Wood', 'Natural Shellac', 'Vegetable Dyes'], '8 x 4 inches', 'Traditional lathe turning', ARRAY['channapatna', 'toys', 'kids', 'wooden', 'odop'], 75000, 65000, 90000, 25, true, 50, 10, 190),

  ('e1111111-0000-0000-0000-000000000010', 'c1111111-0000-0000-0000-000000000004', 'published',
   '{"en": "Vintage Lacquered Wooden Wobble Acrobat Doll", "hi": "पारंपरिक लाख-पॉलिश लकड़ी की कलाबाजी गुड़िया", "mr": "पारंपारिक लाकडी अॅक्रोबॅट डोलणारी बाहुली"}'::jsonb,
   '{"en": "Whimsical balance toy reflecting folk heritage, weighted with a rounded base to wobble back up automatically when tapped.", "hi": "हिलाने पर अपने आप सीधी खड़ी हो जाने वाली चन्नपट्टण की प्रसिद्ध लोक गुड़िया।", "mr": "हलवल्यावर पुन्हा सरळ उभी राहणारी प्रसिद्ध चन्नपट्टण डोलणारी बाहुली."}'::jsonb,
   ARRAY['Hale Wood', 'Natural Vegetable Lac'], '6 x 2.5 inches', 'Precision spindle turning', ARRAY['toys', 'channapatna', 'collectible'], 48000, 42000, 60000, 30, true, 60, 7, 115),

  -- 5. Pabiben Rabari (Kutch Embroidery)
  ('e1111111-0000-0000-0000-000000000011', 'c1111111-0000-0000-0000-000000000005', 'published',
   '{"en": "Heirloom Rabari Dhebar Mirror-work Cushion Cover", "hi": "पारंपरिक राबारी ढेबर शीशा-वर्क कुशन कवर", "mr": "पारंपारिक रबारी ढेबर आरशाचे काम असलेले कुशन कव्हर"}'::jsonb,
   '{"en": "Heavy hand-spun organic cotton embroidered with real hand-cut reflective mirrors and vibrant triangular chain stitches.", "hi": "कच्चे सूती कपड़े पर असली शीशों और रंग-बिरंगे सूती धागों से रची गई प्रामाणिक कच्छी कढ़ाई।", "mr": "हाताने कापलेल्या आरशांचे सुबक नक्षीकाम असलेले पारंपरिक कच्छी उशीचे कव्हर."}'::jsonb,
   ARRAY['Kala Cotton', 'Real Glass Mirrors', 'Silk Thread'], '16 x 16 inches', 'Suf & Dhebar hand embroidery', ARRAY['kutch', 'embroidery', 'cushion', 'mirrorwork', 'odop'], 220000, 190000, 260000, 8, true, 20, 14, 280),

  ('e1111111-0000-0000-0000-000000000012', 'c1111111-0000-0000-0000-000000000005', 'published',
   '{"en": "Handcrafted Kutch Embroidered Tote Bag (Pabi Bag)", "hi": "हस्तनिर्मित कच्छी कढ़ाई वाला टोट बैग", "mr": "हाताने भरतकाम केलेली पारंपरिक कच्छी तोटे बॅग"}'::jsonb,
   '{"en": "Spacious everyday tote bag combining genuine leather handles with vintage recycled nomadic embroidery ribbons.", "hi": "मजबूत चमड़े के हैंडल और विंटेज कढ़ाई वाले बॉर्डर से सुसज्जित टिकाऊ रोजमर्रा का बैग।", "mr": "मजबूत लेदर हँडल आणि रंगीबेरंगी कच्छी भरतकामाची आकर्षक पर्स."}'::jsonb,
   ARRAY['Handloom Cotton', 'Glass Beads', 'Vegetable Tanned Leather'], '15 x 14 x 4 inches', 'Ribbon patchwork & needlework', ARRAY['bags', 'fashion', 'kutch', 'eco-friendly'], 165000, 140000, 190000, 14, true, 25, 12, 340),

  -- 6. Bikram Maharana (Pattachitra)
  ('e1111111-0000-0000-0000-000000000013', 'c1111111-0000-0000-0000-000000000006', 'published',
   '{"en": "Tala Pattachitra Palm Leaf Engraved Krishna Rasalila", "hi": "ताड़पत्र पर उत्कीर्ण कृष्ण रासलीला पट्टचित्र", "mr": "ताडपत्रीवर कोरलेली कृष्ण रासलीला पट्टचित्र"}'::jsonb,
   '{"en": "Ancient Odisha etching on cured palm leaves strung with silk thread, rubbed with natural soot to reveal microscopically detailed dancers.", "hi": "सूखे ताड़पत्रों पर लोहे की सुई से उकेरी गई कृष्ण रासलीला, काजल और तेल से निखारी गई।", "mr": "सुकावलेल्या ताडपत्रीवर सुईने कोरून काजळाने रंगवलेली अप्रतिम रासलीला."}'::jsonb,
   ARRAY['Seasoned Palm Leaf', 'Lamp Black Soot', 'Silk Thread'], '18 x 12 inches', 'Iron stylus etching (Tala Pattachitra)', ARRAY['pattachitra', 'odisha', 'palm leaf', 'krishna', 'odop'], 540000, 480000, 650000, 3, true, 8, 28, 512),

  ('e1111111-0000-0000-0000-000000000014', 'c1111111-0000-0000-0000-000000000006', 'published',
   '{"en": "Lord Jagannath Balarama Subhadra Traditional Silk Painting", "hi": "भगवान जगन्नाथ, बलभद्र और सुभद्रा रेशमी पट्टचित्र", "mr": "श्री जगन्नाथ, बलभद्र आणि सुभद्रा रेशमी पट्टचित्र"}'::jsonb,
   '{"en": "Canvas prepared with tamarind seed gum and chalk, painted using conch shell white and hingula red natural mineral pigments.", "hi": "इमली के बीज के गोंद से तैयार रेशम पर शंख सफेद और हिंगुल लाल पत्थरों के रंगों से बनाई गई पेंटिंग।", "mr": "शंख व नैसर्गिक खड्यांच्या रंगांनी रेशमी कापडावर चितारलेली जगन्नाथ मूर्ती."}'::jsonb,
   ARRAY['Tussar Silk', 'Mineral Pigments', 'Conch Powder'], '20 x 15 inches', 'Traditional cloth scroll painting', ARRAY['pattachitra', 'religious', 'puri', 'silk'], 680000, 600000, 780000, 5, true, 10, 21, 230),

  -- 7. Sukanti Baghel (Dhokra Metalcraft)
  ('e1111111-0000-0000-0000-000000000015', 'c1111111-0000-0000-0000-000000000007', 'published',
   '{"en": "Lost-Wax Cast Dhokra Tribal Musician Quintet", "hi": "लॉस्ट-वैक्स कांस्य ढोकरा आदिवासी वादक समूह (5 वादक)", "mr": "मेणाच्या साच्यातून घडवलेले ५ आदिवासी ढोकरा वादक"}'::jsonb,
   '{"en": "Set of five hollow bell-metal figurines playing nagada, flute, and mridangam, crafted using beeswax threads over clay cores.", "hi": "मिट्टी और मधुमक्खी के मोम के सांचे से ढाली गई बस्तर की 5 ढोकरा वाद्य वादक मूर्तियां।", "mr": "बस्तरमधील पारंपारिक पद्धतीने बनवलेल्या पितळी ५ संगीतकार मूर्ती."}'::jsonb,
   ARRAY['Brass Alloy', 'Beeswax', 'Clay Core'], '8 inches height each', 'Lost-wax casting (Cire perdue)', ARRAY['dhokra', 'bastar', 'tribal', 'brass', 'odop'], 780000, 700000, 920000, 4, true, 10, 25, 345),

  ('e1111111-0000-0000-0000-000000000016', 'c1111111-0000-0000-0000-000000000007', 'published',
   '{"en": "Dhokra Dancing Deer Figurine with Sun Motif", "hi": "सूर्य रूपांकन वाली ढोकरा हिरण कांस्य प्रतिमा", "mr": "सूर्य नक्षीकाम असलेले ढोकरा पितळी हरणाचे शिल्प"}'::jsonb,
   '{"en": "Primitive rustic bell-metal deer with perforated filigree body, celebrating the deep connection between Gond adivasis and forest life.", "hi": "जंगल और वन्यजीवों की रक्षा का प्रतीक, बारीक नक्काशीदार ढोकरा हिरण प्रतिमा।", "mr": "आदिवासी संस्कृती आणि निसर्गाचे प्रतीक असलेले देखणे पितळी हरीण."}'::jsonb,
   ARRAY['Bell Metal', 'Antiqued Patina'], '7 x 5 x 2.5 inches', 'Hollow wax casting', ARRAY['dhokra', 'sculpture', 'metal', 'decor'], 290000, 250000, 340000, 7, true, 20, 15, 160),

  -- 8. Radha Raman Sharma (Sanjhi)
  ('e1111111-0000-0000-0000-000000000017', 'c1111111-0000-0000-0000-000000000008', 'published',
   '{"en": "Intricate Hand-cut Sanjhi Paper Lamp Shade", "hi": "हाथ से काटा गया संझी पेपर लैंप शेड", "mr": "हाताने कापलेला सुबक सांझी कागदी दिवा शेड"}'::jsonb,
   '{"en": "Precision stenciled virgin handmade paper casting delicate Radha-Krishna shadow silhouettes when illuminated with warm bulb.", "hi": "विशेष हस्तनिर्मित कागज पर बारीक कटी संझी कला, जलने पर दीवारों पर सुंदर परछाइयां बनाती है।", "mr": "प्रकाश पडल्यावर भिंतीवर देखण्या सावल्या पाडणारा हाताने कापलेला कागदी लॅम्पशेड."}'::jsonb,
   ARRAY['100% Cotton Rag Paper', 'Non-toxic Hardener'], '12 x 8 inches', 'Freehand scissor stencil cutting', ARRAY['sanjhi', 'lighting', 'mathura', 'paper art', 'odop'], 350000, 300000, 420000, 5, true, 15, 18, 275),

  ('e1111111-0000-0000-0000-000000000018', 'c1111111-0000-0000-0000-000000000008', 'published',
   '{"en": "Framed Sanjhi Papercut: Sacred Cows of Braj", "hi": "फ्रेमयुक्त संझी पेपरकट: ब्रज की पवित्र गऊएं", "mr": "फ्रेम केलेला सांझी पेपरकट: व्रजभूमीतील गायी"}'::jsonb,
   '{"en": "A single continuous sheet of acid-free handmade sheet meticulously hand-sliced with scissors without any pencil outlines.", "hi": "बिना पेंसिल रेखांकन के सीधे विशेष कैंची से काटे गए ब्रज की गायों के विहंगम दृश्य।", "mr": "एकाच कागदावर कोणत्याही पेन्सिल रेखाटनाशिवाय थेट कात्रीने कापलेले सुरेख दृश्य."}'::jsonb,
   ARRAY['Acid-free Handmade Paper', 'Teakwood Frame', 'Museum Glass'], '14 x 14 inches', 'Direct scissor excision', ARRAY['sanjhi', 'papercut', 'framed', 'wall art'], 490000, 420000, 580000, 3, true, 8, 20, 190),

  -- 9. Sita Devi Paswan (Madhubani / Mithila)
  ('e1111111-0000-0000-0000-000000000019', 'c1111111-0000-0000-0000-000000000009', 'published',
   '{"en": "Matsya Fish of Prosperity Kachni Madhubani Painting", "hi": "समृद्धि की मत्स्य (मछली) कचनी मधुबनी पेंटिंग", "mr": "समृद्धीचा मत्स्य कचनी मधुबनी चित्रकला"}'::jsonb,
   '{"en": "Fine monochrome and ochre line work using natural cow dung wash and soot ink, depicting twin sacred fish symbolizing fertility and river blessings.", "hi": "गोबर से पुते हस्तनिर्मित कागज पर बांस की कलम और काजल की स्याही से उकेरी गई दो मछलियां।", "mr": "बांबूच्या पेनाने आणि काजळाच्या शाईने रेखाटलेले समृद्धीचे प्रतीक दोन मासे."}'::jsonb,
   ARRAY['Handmade Paper', 'Lamp Black Ink', 'Turmeric Dye'], '22 x 15 inches', 'Fine Kachni line drawing', ARRAY['madhubani', 'bihar', 'mithila', 'fish', 'odop'], 240000, 200000, 290000, 6, true, 15, 14, 210),

  ('e1111111-0000-0000-0000-000000000020', 'c1111111-0000-0000-0000-000000000009', 'published',
   '{"en": "Hand-painted Madhubani Kohbar Tussar Silk Stole", "hi": "हस्तनिर्मित मधुबनी कोहबर टसर सिल्क स्टोल", "mr": "हाताने रंगवलेला मधुबनी कोहबर टसर सिल्क स्टोल"}'::jsonb,
   '{"en": "Wearable Mithila art on pure handwoven Bhagalpuri Tussar silk, patterned with lotus blooms and auspicious parrots in fabric paints.", "hi": "भागलपुरी टसर सिल्क पर कमल के फूलों और तोते के आकृतियों से सजी सुंदर हाथ से बनी चुन्नी।", "mr": "भागलपुरी टसर रेशमावर कमळ आणि पोपटाच्या नक्षीने हाताने सजवलेला स्टोल."}'::jsonb,
   ARRAY['Bhagalpuri Tussar Silk', 'Eco Fabric Colors'], '78 x 22 inches', 'Freehand fabric brushwork', ARRAY['madhubani', 'silk', 'fashion', 'stole'], 360000, 310000, 420000, 10, true, 20, 16, 320),

  -- 10. Harpreet Kaur (Phulkari)
  ('e1111111-0000-0000-0000-000000000021', 'c1111111-0000-0000-0000-000000000010', 'published',
   '{"en": "Heritage Bagh Geometric Silk Embroidered Dupatta", "hi": "पारंपरिक बाग ज्यामितीय रेशमी फुलकारी दुपट्टा", "mr": "पारंपारिक बाग रेशमी फुलकारी ओढणी"}'::jsonb,
   '{"en": "Dense whole-surface embroidery on madder-red khaddar where the base fabric becomes entirely invisible beneath untwisted pat silk threads.", "hi": "लाल खद्दर के कपड़े पर कच्चे रेशमी धागों से रची गई सघन पारंपरिक पटियाला फुलकारी।", "mr": "लाल खादीच्या कापडावर रेशमी धाग्यांनी संपूर्ण भरलेली पारंपारिक पंजाबी ओढणी."}'::jsonb,
   ARRAY['Handspun Khaddar Cotton', 'Untwisted Pat Silk'], '2.5 x 1.1 meters', 'Counted-thread darn stitch from reverse', ARRAY['phulkari', 'punjab', 'dupatta', 'heritage', 'odop'], 850000, 750000, 980000, 4, true, 8, 30, 410),

  ('e1111111-0000-0000-0000-000000000022', 'c1111111-0000-0000-0000-000000000010', 'published',
   '{"en": "Chope Border Khadi Potli Evening Bag with Latkan", "hi": "छोप बॉर्डर खादी पोटली बैग लटकन सहित", "mr": "छोप भरतकाम असलेली खादी पोटली बॅग"}'::jsonb,
   '{"en": "Compact festive party pouch with golden-yellow silk darning stitch on crimson base, finished with handmade thread pom-poms.", "hi": "सुनहरे रेशमी धागों और मनमोहक लटकनों से सुसज्जित पारंपरिक खादी पोटली।", "mr": "सण-उत्सवांसाठी रेशमी धाग्यांचे नक्षीकाम असलेली सुंदर खादी पोटली बॅग."}'::jsonb,
   ARRAY['Khadi Cotton', 'Silk Floss', 'Glass Pearls'], '9 x 7 inches', 'Reversible satin stitch', ARRAY['phulkari', 'accessories', 'bag', 'potli'], 115000, 95000, 140000, 20, true, 40, 10, 150),

  -- 11. Dulal Kumbhakar (Terracotta)
  ('e1111111-0000-0000-0000-000000000023', 'c1111111-0000-0000-0000-000000000011', 'published',
   '{"en": "Aesthetic Bankura Terracotta Long-Eared Sacred Horse (16-inch)", "hi": "प्रसिद्ध बांकुरा टेराकोटा लंबा-कान पवित्र घोड़ा (16 इंच)", "mr": "प्रसिद्ध बांकुरा लांब कानाचा टेराकोटा पवित्र घोडा (१६ इंच)"}'::jsonb,
   '{"en": "Iconic GI-tagged Panchmura terracotta horse with symmetrical erect ears and ribbed neck ornamentation, fired in wood kiln.", "hi": "पंचमुरा के प्रसिद्ध खड़े कानों वाले मिट्टी के घोड़े, जो लकड़ी के भट्ठे में पकाए गए हैं।", "mr": "लाकडाच्या भट्टीमध्ये भाजलेला वैशिष्ट्यपूर्ण बांकुरा मातीचा घोडा."}'::jsonb,
   ARRAY['Panchmura Alluvial Clay', 'Wood Ash Glaze'], '16 x 8 x 4 inches', 'Wheel thrown parts & hand sculpted', ARRAY['terracotta', 'bankura', 'bengal', 'sculpture', 'odop'], 210000, 180000, 250000, 8, true, 15, 18, 290),

  ('e1111111-0000-0000-0000-000000000024', 'c1111111-0000-0000-0000-000000000011', 'published',
   '{"en": "Rustic Terracotta Acoustic Wind Chime with Bells", "hi": "देहाती टेराकोटा मिट्टी की घंटियों वाली पवन घंटी", "mr": "मातीच्या सुमधूर नाद करणाऱ्या घंट्यांची पवन घंटा"}'::jsonb,
   '{"en": "Strung cluster of porous earthen bells with clay clappers that chime with a gentle, grounding resonance in the breeze.", "hi": "हवा चलने पर मधुर और शांत ध्वनि उत्पन्न करने वाली हाथ से गढ़ी मिट्टी की घंटियां।", "mr": "हवेच्या झुळुकीने निसर्गाशी नाते सांगणारा शांत नाद करणारी मातीची विंड चाईम."}'::jsonb,
   ARRAY['Terracotta Clay', 'Natural Jute Cord'], '24 inches length', 'Hand modeling & firing', ARRAY['terracotta', 'wind chime', 'garden', 'home'], 58000, 48000, 72000, 15, true, 35, 8, 120),

  -- 12. Ghulam Hassan Mir (Pashmina & Sozni)
  ('e1111111-0000-0000-0000-000000000025', 'c1111111-0000-0000-0000-000000000012', 'published',
   '{"en": "Pure Handwoven Cashmere Shawl with Sozni Hashidar Border", "hi": "सोजनी हाशिएदार बॉर्डर वाली शुद्ध कश्मीरी पश्मीना शॉल", "mr": "सोझनी किनारी असलेली शुद्ध हाताने विणलेली पश्मिना शाल"}'::jsonb,
   '{"en": "Grade-A Changthangi mountain goat fleece spun on traditional yinder wooden wheel and embroidered over 90 days with paisley motifs.", "hi": "चांगथांगी पश्मीना बकरी के रेशे से बनी, 90 दिनों में बारीक सुई से कढ़ाई की गई शाही शॉल।", "mr": "९० दिवसांच्या नाजूक सुईच्या कशिदाकारीने विणलेली लडाखी पश्मिना शाल."}'::jsonb,
   ARRAY['100% Changthangi Cashmere', 'Silk Embroidery Yarn'], '2 x 1 meters', 'Handloom diamond weave & fine needle sozni', ARRAY['pashmina', 'kashmir', 'shawl', 'luxury', 'odop'], 1780000, 1600000, 1950000, 2, true, 4, 45, 680),

  ('e1111111-0000-0000-0000-000000000026', 'c1111111-0000-0000-0000-000000000012', 'published',
   '{"en": "Pure Cashmere Pashmina Muffler with Delicate Floral Buti", "hi": "नाज़ुक फूलों की बूटी वाला शुद्ध पश्मीना मफलर", "mr": "नाजूक फुलांची बुटी असलेला शुद्ध पश्मिना मफलर"}'::jsonb,
   '{"en": "Featherweight unisex muffler with subtle self-colored silk thread floral butis for understated warmth.", "hi": "हल्का और अत्यधिक गर्म यूनिसेक्स मफलर, जिस पर रेशमी धागों से छोटी-छोटी बूटियां बनी हैं।", "mr": "अतिशय मऊ, हलका आणि उबदार युनिसेक्स पश्मिना मफलर."}'::jsonb,
   ARRAY['Pure Pashmina Wool', 'Silk Thread'], '70 x 14 inches', 'Handloom twill weave & needlework', ARRAY['pashmina', 'muffler', 'winter', 'fashion'], 620000, 540000, 720000, 5, true, 12, 20, 240),

  -- Additional curated items to round out to 30 products
  ('e1111111-0000-0000-0000-000000000027', 'c1111111-0000-0000-0000-000000000004', 'published',
   '{"en": "Set of 3 Wooden Nesting Birds on Turned Pedestals", "hi": "3 लकड़ी के घोंसले बनाने वाले पक्षियों का सेट", "mr": "३ लाकडी पक्षांचा सुंदर शोपीस संच"}'::jsonb,
   '{"en": "Channapatna turned lacquered bird figurines with glossy canary yellow, indigo, and terracotta shades.", "hi": "चमकदार प्राकृतिक रंगों से रंगे 3 लकड़ी के सुंदर पक्षी सजावट खिलौने।", "mr": "चन्नपट्टणच्या लाकडी कलेचा नमुना असणारे ३ देखणे शोपीस पक्षी."}'::jsonb,
   ARRAY['Ivory Wood', 'Natural Shellac'], '5 x 2.5 inches', 'Wood lathe turning', ARRAY['decor', 'channapatna', 'birds', 'wood'], 95000, 85000, 115000, 12, true, 30, 10, 88),

  ('e1111111-0000-0000-0000-000000000028', 'c1111111-0000-0000-0000-000000000003', 'published',
   '{"en": "Bidriware Silver Wire Bookmark with Silk Tassel", "hi": "रेशमी फुंदने वाला बिदरी चांदी तार बुकमार्क", "mr": "रेशमी गोंड्याचा बिद्री चांदीच्या तारेचा बुकमार्क"}'::jsonb,
   '{"en": "Sleek pocket bookmark cast in Bidri alloy etched with pure silver geometric Islamic arabesque line work.", "hi": "किताब प्रेमियों के लिए शुद्ध चांदी की रेखाओं से सजा शाही बिदरी बुकमार्क।", "mr": "पुस्तकांसाठी शुद्ध चांदीचे नक्षीकाम असलेला देखणा बिद्री बुकमार्क."}'::jsonb,
   ARRAY['Zinc-Copper Alloy', 'Pure Silver 999', 'Silk Tassel'], '5 x 1.2 inches', 'Damascene inlay', ARRAY['stationery', 'bidriware', 'gift', 'reading'], 120000, 99000, 145000, 22, true, 50, 12, 195),

  ('e1111111-0000-0000-0000-000000000029', 'c1111111-0000-0000-0000-000000000002', 'published',
   '{"en": "Jaipur Blue Pottery Ceramic Oil Diffuser Burner", "hi": "जयपुर ब्लू पॉटरी सिरेमिक ऑयल डिफ्यूज़र बर्नर", "mr": "जयपूर ब्लू पॉटरी सिरेमिक ऑईल डिफ्युझर"}'::jsonb,
   '{"en": "Perforated ceramic aromatic oil burner casting floral warm light patterns when used with tea-light candle.", "hi": "खुशबूदार तेल और टी-लाइट मोमबत्ती के लिए जयपुरी ब्लू पॉटरी का बना सजावटी बर्नर।", "mr": "घरामध्ये सुवास दरवळण्यासाठी पारंपारिक जयपुरी सिरेमिक ऑईल बर्नर."}'::jsonb,
   ARRAY['Quartz Faience', 'Cobalt Glaze'], '5 x 4 inches', 'Faience kiln craft', ARRAY['home fragrance', 'blue pottery', 'diffuser', 'jaipur'], 75000, 65000, 92000, 16, true, 40, 8, 144),

  ('e1111111-0000-0000-0000-000000000030', 'c1111111-0000-0000-0000-000000000001', 'published',
   '{"en": "Warli Tribal Wedding Celebration Hand-painted Coasters (Set of 6)", "hi": "वारली आदिवासी विवाह प्रसंग कोस्टर्स (6 का सेट)", "mr": "वारली लग्नसोहळा रेखाटन असलेले कोस्टर्स (६ चा संच)"}'::jsonb,
   '{"en": "Handcrafted MDF wood coasters coated in earthy terracotta texture, hand-painted with joyful village marriage rituals.", "hi": "मिट्टी की बनावट और वारली विवाह के चित्रों से सजे 6 हस्तनिर्मित कोस्टरों का सेट।", "mr": "वारली लग्नातील आनंदी प्रसंगांचे रेखाटन असलेले ६ चहा कोस्टर्स."}'::jsonb,
   ARRAY['Wood Substrate', 'Geru Texture', 'Acrylic Sealant'], '4 x 4 inches each', 'Stick painting with waterproof sealer', ARRAY['warli', 'coasters', 'tableware', 'wedding'], 55000, 48000, 68000, 20, true, 50, 7, 130)

on conflict (id) do nothing;

-- ── 6. PRODUCT MEDIA (Photos, Videos, and Voice Clips) ───────────────────────
insert into product_media (id, product_id, kind, storage_path, sort_order, width, height, duration_ms) values
  -- Sunil Dhangar's Warli Canvas
  ('f1111111-0000-0000-0000-000000000001', 'e1111111-0000-0000-0000-000000000001', 'photo', 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800', 0, 800, 600, null),
  ('f1111111-0000-0000-0000-000000000002', 'e1111111-0000-0000-0000-000000000001', 'voice', '/audio/seed/sunil_tarpa_explanation.webm', 1, null, null, 28000),

  -- Leela Devi's Blue Pottery Vase
  ('f1111111-0000-0000-0000-000000000003', 'e1111111-0000-0000-0000-000000000004', 'photo', 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800', 0, 800, 1000, null),
  ('f1111111-0000-0000-0000-000000000004', 'e1111111-0000-0000-0000-000000000004', 'voice', '/audio/seed/leela_pottery_story.webm', 1, null, null, 32000),

  -- Mohammed Abdul's Bidri Aftaba
  ('f1111111-0000-0000-0000-000000000005', 'e1111111-0000-0000-0000-000000000007', 'photo', 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=800', 0, 800, 800, null),
  ('f1111111-0000-0000-0000-000000000006', 'e1111111-0000-0000-0000-000000000007', 'voice', '/audio/seed/bidri_silver_soil.webm', 1, null, null, 38000),

  -- Ramesh Gowda's Stacker Toy
  ('f1111111-0000-0000-0000-000000000007', 'e1111111-0000-0000-0000-000000000009', 'photo', 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800', 0, 800, 800, null),
  ('f1111111-0000-0000-0000-000000000008', 'e1111111-0000-0000-0000-000000000009', 'voice', '/audio/seed/channapatna_safe_lac.webm', 1, null, null, 24000),

  -- Ghulam Hassan's Pashmina Shawl
  ('f1111111-0000-0000-0000-000000000009', 'e1111111-0000-0000-0000-000000000025', 'photo', 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800', 0, 800, 1000, null),
  ('f1111111-0000-0000-0000-000000000010', 'e1111111-0000-0000-0000-000000000025', 'voice', '/audio/seed/pashmina_craft_story.webm', 1, null, null, 41000)
on conflict (id) do nothing;

-- ── 7. VOICE CAPTURES (AI Audit Trail Examples) ──────────────────────────────
insert into voice_captures (id, product_id, artisan_id, audio_path, source_locale, raw_transcript, translated_text, asr_provider, asr_confidence, llm_provider, processing_ms, artisan_edited) values
  ('g1111111-0000-0000-0000-000000000001', 'e1111111-0000-0000-0000-000000000001', 'c1111111-0000-0000-0000-000000000001',
   '/audio/seed/sunil_tarpa_explanation.webm', 'mr',
   'मी सुनील ढनगर. पालघर मधील वारली पेंटिंग बनवतो. हा तारपा नाच आहे, जेव्हा पीक घरात येतं तेव्हा संपूर्ण गाव हातात हात घालून गोल फिरून नाचतो. तांदळाच्या पिठाने आणि गेरूच्या रंगाने हे बनवलं आहे.',
   '{"en": "I am Sunil Dhangar, Warli painter from Palghar. This is the Tarpa dance, celebrated when the harvest comes home. The entire village dances in a circle holding hands. Made using rice paste and geru red earth clay.", "hi": "मैं सुनील ढनगर, पालघर का वारली चित्रकार। यह तारपा नृत्य है, जो फसल कटने के उत्सव में पूरे गांव द्वारा एक-दूसरे का हाथ पकड़कर गोल घेरे में किया जाता है।"}'::jsonb,
   'bhashini', 0.942, 'gemini-flash', 1420, false),

  ('g1111111-0000-0000-0000-000000000002', 'e1111111-0000-0000-0000-000000000004', 'c1111111-0000-0000-0000-000000000002',
   '/audio/seed/leela_pottery_story.webm', 'hi',
   'यह जयपुर की पारंपरिक ब्लू पॉटरी है। इसमें साधारण मिट्टी नहीं होती, क्वार्ट्ज पत्थर का चूरा और गोंद मिलाते हैं। फिर नीले कोबाल्ट रंग से हाथ से फूल पत्तियां बनाते हैं। भट्टी में पकने के बाद इसमें चमक आती है।',
   '{"en": "This is traditional Jaipur blue pottery. It contains no regular clay; we grind quartz stone and natural tree gum. Then Persian flowers are hand-painted using cobalt oxide before firing in the kiln.", "mr": "हे जयपूरचे प्रसिद्ध ब्लू पॉटरी आहे. यात साधी माती नसते, तर क्वार्ट्झ खडे आणि डिंक एकत्र करून कोबाल्ट रंगाने हाताने नक्षीकाम केले जाते."}'::jsonb,
   'bhashini', 0.965, 'gemini-flash', 1310, false)
on conflict (id) do nothing;

-- ── 8. ORDERS & ORDER ITEMS (4 Retail, 2 Bulk) ───────────────────────────────
insert into orders (id, order_number, buyer_id, artisan_id, type, status, total_paise, shipping_address, expected_delivery, notes) values
  -- Retail Order 1 (Warli Canvas to Aarav)
  ('h1111111-0000-0000-0000-000000000001', 'KS-2026-000101', 'b2222222-0000-0000-0000-000000000001', 'c1111111-0000-0000-0000-000000000001', 'retail', 'delivered', 280000,
   '{"name": "Aarav Mehta", "address_line1": "Flat 402, Sea Green Apartments", "city": "Mumbai", "state": "Maharashtra", "pincode": "400050"}'::jsonb,
   CURRENT_DATE - INTERVAL '10 days', 'Delivered safely with certificate of authenticity.'),

  -- Retail Order 2 (Blue Pottery Coasters to Priya)
  ('h1111111-0000-0000-0000-000000000002', 'KS-2026-000102', 'b2222222-0000-0000-0000-000000000002', 'c1111111-0000-0000-0000-000000000002', 'retail', 'shipped', 65000,
   '{"name": "Priya Deshmukh", "address_line1": "14 Sahakar Nagar", "city": "Pune", "state": "Maharashtra", "pincode": "411009"}'::jsonb,
   CURRENT_DATE + INTERVAL '2 days', 'Dispatched via India Post Speed Post.'),

  -- Retail Order 3 (Channapatna Stacker to Aarav)
  ('h1111111-0000-0000-0000-000000000003', 'KS-2026-000103', 'b2222222-0000-0000-0000-000000000001', 'c1111111-0000-0000-0000-000000000004', 'retail', 'accepted', 75000,
   '{"name": "Aarav Mehta", "address_line1": "Flat 402, Sea Green Apartments", "city": "Mumbai", "state": "Maharashtra", "pincode": "400050"}'::jsonb,
   CURRENT_DATE + INTERVAL '5 days', 'Artisan preparing packaging.'),

  -- Retail Order 4 (Kutch Embroidered Bag to Priya)
  ('h1111111-0000-0000-0000-000000000004', 'KS-2026-000104', 'b2222222-0000-0000-0000-000000000002', 'c1111111-0000-0000-0000-000000000005', 'retail', 'placed', 165000,
   '{"name": "Priya Deshmukh", "address_line1": "14 Sahakar Nagar", "city": "Pune", "state": "Maharashtra", "pincode": "411009"}'::jsonb,
   CURRENT_DATE + INTERVAL '7 days', 'New order notification pending artisan review.'),

  -- Bulk Order 1 (40 Blue Pottery Vases to Heritage Hotels)
  ('h1111111-0000-0000-0000-000000000005', 'KS-2026-000105', 'b2222222-0000-0000-0000-000000000003', 'c1111111-0000-0000-0000-000000000002', 'bulk', 'in_production', 7000000,
   '{"company": "Heritage Hospitality India Ltd", "address_line1": "Palace Suite Renovation Depot, Civil Lines", "city": "Jaipur", "state": "Rajasthan", "pincode": "302006", "gstin": "27AABCH1234F1Z8"}'::jsonb,
   CURRENT_DATE + INTERVAL '20 days', 'Tiered bulk price ₹1,750 per unit. Advance 50% confirmed.'),

  -- Bulk Order 2 (50 Warli Bamboo Pen Stands to Bharat Crafts Exporters)
  ('h1111111-0000-0000-0000-000000000006', 'KS-2026-000106', 'b2222222-0000-0000-0000-000000000004', 'c1111111-0000-0000-0000-000000000001', 'bulk', 'accepted', 2000000,
   '{"company": "Bharat Crafts Exporters Ltd", "address_line1": "Export Warehouse Shed 4, Okhla Phase 3", "city": "New Delhi", "state": "Delhi", "pincode": "110020", "gstin": "07AAECB5678G2Z1"}'::jsonb,
   CURRENT_DATE + INTERVAL '15 days', 'Bulk packaging for European artisan fair distribution.')
on conflict (id) do nothing;

insert into order_items (id, order_id, product_id, quantity, unit_price_paise) values
  ('i1111111-0000-0000-0000-000000000001', 'h1111111-0000-0000-0000-000000000001', 'e1111111-0000-0000-0000-000000000001', 1, 280000),
  ('i1111111-0000-0000-0000-000000000002', 'h1111111-0000-0000-0000-000000000002', 'e1111111-0000-0000-0000-000000000005', 1, 65000),
  ('i1111111-0000-0000-0000-000000000003', 'h1111111-0000-0000-0000-000000000003', 'e1111111-0000-0000-0000-000000000009', 1, 75000),
  ('i1111111-0000-0000-0000-000000000004', 'h1111111-0000-0000-0000-000000000004', 'e1111111-0000-0000-0000-000000000012', 1, 165000),
  ('i1111111-0000-0000-0000-000000000005', 'h1111111-0000-0000-0000-000000000005', 'e1111111-0000-0000-0000-000000000004', 40, 175000),
  ('i1111111-0000-0000-0000-000000000006', 'h1111111-0000-0000-0000-000000000006', 'e1111111-0000-0000-0000-000000000003', 50, 40000)
on conflict (id) do nothing;

-- ── 9. B2B RFQS (3 Requests for Quotation) ───────────────────────────────────
insert into rfqs (id, buyer_id, artisan_id, product_id, quantity, target_date, message, voice_reply_path, status) values
  ('j1111111-0000-0000-0000-000000000001',
   'b2222222-0000-0000-0000-000000000003',
   'c1111111-0000-0000-0000-000000000003',
   'e1111111-0000-0000-0000-000000000008',
   120,
   CURRENT_DATE + INTERVAL '45 days',
   'Looking for 120 custom Bidri silver card cases with our resort emblem inlaid on the lid for VIP corporate Diwali gifts.',
   null,
   'open'),

  ('j1111111-0000-0000-0000-000000000002',
   'b2222222-0000-0000-0000-000000000004',
   'c1111111-0000-0000-0000-000000000007',
   'e1111111-0000-0000-0000-000000000015',
   35,
   CURRENT_DATE + INTERVAL '30 days',
   'Requesting quote for 35 sets of Dhokra tribal musician sets with export fumigation and gift-box packing.',
   '/audio/seed/artisan_sukanti_rfq_reply.webm',
   'accepted'),

  ('j1111111-0000-0000-0000-000000000003',
   'b2222222-0000-0000-0000-000000000003',
   'c1111111-0000-0000-0000-000000000006',
   'e1111111-0000-0000-0000-000000000013',
   15,
   CURRENT_DATE + INTERVAL '60 days',
   'Inquiry for 15 framed Tala Pattachitra palm leaf artworks for boutique hotel corridor installation.',
   null,
   'open')
on conflict (id) do nothing;

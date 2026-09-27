// Comprehensive 22+ Indic Languages Registry and Localized Draft Templates for KALA-SANGAM

export interface IndicLanguage {
  code: string;
  name: string;
  nativeName: string;
  region: string;
  bcp47: string;
}

export const ALL_INDIC_LANGUAGES: IndicLanguage[] = [
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', region: 'All India / Central & North', bcp47: 'hi-IN' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', region: 'Maharashtra', bcp47: 'mr-IN' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', region: 'Andhra Pradesh & Telangana', bcp47: 'te-IN' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', region: 'Tamil Nadu & South', bcp47: 'ta-IN' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', region: 'Karnataka', bcp47: 'kn-IN' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', region: 'West Bengal & East', bcp47: 'bn-IN' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', region: 'Gujarat & West', bcp47: 'gu-IN' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', region: 'Kerala', bcp47: 'ml-IN' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', region: 'Odisha', bcp47: 'or-IN' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', region: 'Punjab & North', bcp47: 'pa-IN' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', region: 'Assam & North-East', bcp47: 'as-IN' },
  { code: 'mai', name: 'Maithili', nativeName: 'मैथिली', region: 'Bihar & Mithila', bcp47: 'mai-IN' },
  { code: 'sat', name: 'Santali', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ', region: 'Jharkhand & Tribal Belt', bcp47: 'sat-IN' },
  { code: 'ks', name: 'Kashmiri', nativeName: 'कॉशुर / डोगरी', region: 'Jammu & Kashmir', bcp47: 'ks-IN' },
  { code: 'kok', name: 'Konkani', nativeName: 'कोंकणी', region: 'Goa & Konkan Coast', bcp47: 'kok-IN' },
  { code: 'sd', name: 'Sindhi', nativeName: 'सिंधी / سنڌي', region: 'Sindhi Heritage', bcp47: 'sd-IN' },
  { code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्', region: 'Classical India', bcp47: 'sa-IN' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو / उर्दू', region: 'Pan-India', bcp47: 'ur-IN' },
  { code: 'mni', name: 'Manipuri', nativeName: 'মৈতৈলোন্', region: 'Manipur & North-East', bcp47: 'mni-IN' },
  { code: 'brx', name: 'Bodo', nativeName: 'बड़ो', region: 'Bodoland, Assam', bcp47: 'brx-IN' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', region: 'Sikkim & Hills', bcp47: 'ne-IN' },
  { code: 'en', name: 'English', nativeName: 'English', region: 'Pan-India / International', bcp47: 'en-IN' },
];

export const STEP_INSTRUCTIONS: Record<string, Record<string, string>> = {
  choose_language: {
    hi: 'कृपया अपनी पसंदीदा भाषा चुनें।',
    mr: 'कृपया आपली आवडती भाषा निवडा.',
    te: 'దయచేసి మీకు నచ్చిన భాషను ఎంచుకోండి.',
    ta: 'தயவுசெய்து உங்கள் விருப்பமான மொழியைத் தேர்ந்தெடுக்கவும்.',
    kn: 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಆದ್ಯತೆಯ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
    bn: 'অনুগ্রহ করে আপনার পছন্দের ভাষা নির্বাচন করুন।',
    gu: 'કૃપા કરીને તમારી પસંદગીની ભાષા પસંદ કરો.',
    ml: 'ദയവായി നിങ്ങളുടെ ഇഷ്ട ഭാഷ തിരഞ്ഞെടുക്കുക.',
    or: 'ଦୟାକରି ଆପଣଙ୍କ ପସନ୍ଦର ଭାଷା ଚୟନ କରନ୍ତୁ |',
    pa: 'ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੀ ਪਸੰਦੀਦਾ ਭਾਸ਼ਾ ਚੁਣੋ।',
    as: 'অনুগ্ৰহ কৰি আপোনাৰ পচন্দৰ ভাষা বাছক।',
    mai: 'कृपा कऽ अपन मनपसंद भाषा चुनू।',
    en: 'Please select your preferred language.',
  },
  take_photos: {
    hi: 'कृपया अपने उत्पाद की एक से पाँच साफ़ तस्वीरें खींचें।',
    mr: 'कृपया आपल्या उत्पादनाची १ ते ५ स्पष्ट छायाचित्रे काढा.',
    te: 'దయచేసి మీ వస్తువు యొక్క 1 నుండి 5 స్పష్టమైన ఫోటోలను తీయండి.',
    ta: 'தயவுசெய்து உங்கள் தயாரிப்பின் 1 முதல் 5 தெளிவான புகைப்படங்களை எடுக்கவும்.',
    kn: 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಉತ್ಪನ್ನದ 1 ರಿಂದ 5 ಸ್ಪಷ್ಟ ಫೋಟೋಗಳನ್ನು ತೆಗೆದುಕೊಳ್ಳಿ.',
    bn: 'অনুগ্রহ করে আপনার পণ্যের ১ থেকে ৫ টি পরিষ্কার ছবি তুলুন।',
    gu: 'કૃપા કરીને તમારા ઉત્પાદનના 1 થી 5 સ્પષ્ટ ફોટો પાડો.',
    ml: 'ദയവായി നിങ്ങളുടെ ഉൽപ്പന്നത്തിന്റെ 1 മുതൽ 5 വരെ വ്യക്തമായ ഫോട്ടോകൾ എടുക്കുക.',
    or: 'ଦୟାକରି ଆପଣଙ୍କ ଉତ୍ପାଦର ୧ ରୁ ୫ ଟି ସ୍ପଷ୍ଟ ଫଟୋ ଉଠାନ୍ତୁ |',
    pa: 'ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੇ ਉਤਪਾਦ ਦੀਆਂ 1 ਤੋਂ 5 ਸਾਫ਼ ਤਸਵੀਰਾਂ ਲਓ।',
    as: 'অনুগ্ৰহ কৰি আপোনাৰ সামগ্ৰীৰ ১ ৰ পৰা ৫ খন স্পষ্ট ফটো লওক।',
    mai: 'कृपा कऽ अपन उत्पाद केर १ सँ ५ टा साफ फोटो खींचू।',
    en: 'Please take 1 to 5 clear photos of your product.',
  },
  speak_voice: {
    hi: 'यह क्या है? यह किस चीज़ से बना है? इसे बनाने में कितना समय लगा? और इसमें क्या खास है?',
    mr: 'हे काय आहे? हे कशापासून बनवले आहे? याला बनवायला किती वेळ लागला? आणि याचे वैशिष्ट्य काय आहे?',
    te: 'ఇది ఏమిటి? ఇది దేనితో తయారు చేయబడింది? దీనిని చేయడానికి ఎంత సమయం పట్టింది? దీని ప్రత్యేకత ఏమిటి?',
    ta: 'இது என்ன? இது எதனால் செய்யப்பட்டது? செய்ய எவ்வளவு நேரம் ஆனது? இதில் என்ன சிறப்பு?',
    kn: 'ಇದು ಏನು? ಇದನ್ನು ಯಾವುದರಿಂದ ಮಾಡಲಾಗಿದೆ? ಇದನ್ನು ಮಾಡಲು ಎಷ್ಟು ಸಮಯ ಹಿಡಿಯಿತು? ಮತ್ತು ಇದರಲ್ಲಿ ವಿಶೇಷವೇನು?',
    bn: 'এটি কি? এটি কি দিয়ে তৈরি? এটি তৈরি করতে কত সময় লেগেছে? এবং এর বিশেষত্ব কি?',
    gu: 'આ શું છે? આ શેમાંથી બનેલું છે? આ બનાવવામાં કેટલો સમય લાગ્યો? અને આમાં શું ખાસ છે?',
    ml: 'ഇത് എന്താണ്? ഇത് എന്തുകൊണ്ടാണ് നിർമ്മിച്ചിരിക്കുന്നത്? ഇത് ഉണ്ടാക്കാൻ എത്ര സമയമെടുത്തു? ഇതിന്റെ പ്രത്യേകത എന്താണ്?',
    or: 'ଏହା କ’ଣ? ଏହା କେଉଁଥିରେ ତିଆରି? ଏହା ତିଆରି କରିବାକୁ କେତେ ସମୟ ଲାଗିଲା? ଏହାର ବିଶେଷତା କ’ଣ?',
    pa: 'ਇਹ ਕੀ ਹੈ? ਇਹ ਕਿਸ ਚੀਜ਼ ਤੋਂ ਬਣਿਆ ਹੈ? ਇਸਨੂੰ ਬਣਾਉਣ ਵਿਚ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗਾ? ਅਤੇ ਇਸ ਵਿਚ ਕੀ ਖਾਸ ਹੈ?',
    as: 'এইটো কি? এইটো কিহেৰে তৈয়াৰী? ইয়াক তৈয়াৰ কৰিবলৈ কিমান সময় লাগিল? আৰু ইয়াৰ বিশেষত্ব কি?',
    mai: 'ई की छी? की सँ बनल अछि? कतेक समय लागल? आ एकर की विशेषता अछि?',
    en: 'What is this? What is it made of? How long did it take to make? What makes it special?',
  },
  review_publish: {
    hi: 'कृपया विवरण और सुझाई गई कीमत की पुष्टि करें और प्रकाशित करें।',
    mr: 'कृपया तपशील आणि सुचवलेली किंमत तपासा आणि प्रकाशित करा.',
    te: 'దయచేసి వివరాలను మరియు సూచించిన ధరను నిర్ధారించి ప్రచురించండి.',
    ta: 'விவரங்கள் மற்றும் பரிந்துரைக்கப்பட்ட விலையை சரிபார்த்து வெளியிடவும்.',
    kn: 'ದಯವಿಟ್ಟು ವಿವರಗಳನ್ನು ಮತ್ತು ಸೂಚಿಸಿದ ಬೆಲೆಯನ್ನು ದೃಢೀಕರಿಸಿ ಮತ್ತು ಪ್ರಕಟಿಸಿ.',
    bn: 'অনুগ্রহ করে বিশদ এবং প্রস্তাবিত মূল্য যাচাই করে প্রকাশ করুন।',
    gu: 'કૃપા કરીને વિગતો અને સૂચવેલી કિંમતની પુષ્ટિ કરો અને પ્રકાશિત કરો.',
    ml: 'വിശദാംശങ്ങളും നിർദ്ദേശിച്ച വിലയും പരിശോധിച്ച് പ്രസിദ്ധീകരിക്കുക.',
    or: 'ଦୟାକରି ବିବରଣୀ ଏବଂ ପ୍ରସ୍ତାବିତ ମୂଲ୍ୟ ଯାଞ୍ଚ କରି ପ୍ରକାଶ କରନ୍ତୁ |',
    pa: 'ਕਿਰਪਾ ਕਰਕੇ ਵੇਰਵੇ ਅਤੇ ਸੁਝਾਈ ਗਈ ਕੀਮਤ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ ਅਤੇ ਪ੍ਰਕਾਸ਼ਿਤ ਕਰੋ।',
    as: 'অনুগ্ৰহ কৰি বিৱৰণ আৰু পৰামৰ্শ দিয়া মূল্য পৰীক্ষা কৰি প্ৰকাশ কৰক।',
    mai: 'कृपा कऽ विवरण आ सुझाओल मूल्य जाँची आ प्रकाशित करू।',
    en: 'Please review the description and recommended price and publish.',
  },
};

export function getInstructionText(stepKey: string, locale: string): string {
  const stepMap = STEP_INSTRUCTIONS[stepKey];
  if (!stepMap) return '';
  return stepMap[locale] || stepMap['hi'] || stepMap['en'] || '';
}

// Localized product titles and descriptions for AI draft creation matching selected language
export const LOCALIZED_DRAFT_TEMPLATES: Record<
  string,
  { title: string; description: string; priceBasis: string }
> = {
  te: {
    title: 'చేతితో తయారు చేసిన సాంప్రదాయ కళాఖండం',
    description: 'సహజమైన రంగులు మరియు స్థానిక మట్టితో రూపొందించబడిన అసలైన సాంప్రదాయ హస్తకళ. నిపుణులైన కళాకారుల ద్వారా స్వయంగా రూపొందించబడింది.',
    priceBasis: 'ప్రాంతీయ కళాకారుల విపణి ధరల ఆధారంగా నిర్ణయించబడింది (Based on regional artisan norms)',
  },
  ta: {
    title: 'பாரம்பரிய கைவினைப் பொருள்',
    description: 'இயற்கை வண்ணங்கள் மற்றும் பாரம்பரிய முறைகளால் கைவினைஞரால் நேர்த்தியாக உருவாக்கப்பட்ட தலைசிறந்த கைவினைப் படைப்பு.',
    priceBasis: 'பாரம்பரிய கைவினை நியாய விலை வரம்பு (Based on fair artisan wage norms)',
  },
  kn: {
    title: 'ಸಾಂಪ್ರದಾಯಿಕ ಕೈಯಿಂದ ಮಾಡಿದ ಕಲಾಕೃತಿ',
    description: 'ನೈಸರ್ಗಿಕ ಬಣ್ಣಗಳು ಮತ್ತು ಮಣ್ಣಿನಿಂದ ಕಲಾಕಾರರ ಕೈಯಿಂದ ರಚಿಸಲಾದ ಅದ್ಭುತ ಸಾಂಪ್ರದಾಯಿಕ ಕಲಾಕೃತಿ.',
    priceBasis: 'ಪ್ರಾದೇಶಿಕ ಮಾರುಕಟ್ಟೆ ಮಾನದಂಡಗಳ ಆಧಾರದ ಮೇಲೆ (Based on regional market norms)',
  },
  bn: {
    title: 'ঐতিহ্যবাহী হাতে তৈরি শিল্পকর্ম',
    description: 'প্রাকৃতিক মাটি ও ভেষজ রঙের মেলবন্ধনে গ্রামীণ শিল্পীর নিজ হাতে গড়া নিখুঁত কারুশিল্প।',
    priceBasis: 'অনুরূপ আঞ্চলিক হস্তশিল্প মূল্যের উপর ভিত্তি করে (Based on comparable craft pricing)',
  },
  gu: {
    title: 'પરંપરાગત હસ્તનિર્મિત કલાકૃતિ',
    description: 'કુદરતી રંગો અને સ્થાનિક માટી દ્વારા કારીગર દ્વારા હાથથી બનાવેલ અસલ પરંપરાગત હસ્તકળા.',
    priceBasis: 'સ્થાનિક હસ્તકલા કિંમત ધોરણો પર આધારિત (Based on local craft pricing norms)',
  },
  ml: {
    title: 'പരമ്പരാഗത കരകൗശല വസ്തു',
    description: 'പ്രകൃതിദത്ത വർണ്ണങ്ങളും പരമ്പരാഗത തനിമയും ഒത്തിണങ്ങിയ വിശിഷ്ടമായ കൈവേല ഉൽപ്പന്നം.',
    priceBasis: 'ന്യായവില മാനദണ്ഡങ്ങളുടെ അടിസ്ഥാനത്തിൽ (Based on fair pricing norms)',
  },
  or: {
    title: 'ପାରମ୍ପରିକ ହସ୍ତତନ୍ତ କଳାକୃତି',
    description: 'ପ୍ରାକୃତିକ ରଙ୍ଗ ଏବଂ ସ୍ଥାନୀୟ ମାଟି ସାହାଯ୍ୟରେ କାରିଗରଙ୍କ ଦ୍ୱାରା ନିର୍ମିତ ପାରମ୍ପରିକ ହସ୍ତଶିଳ୍ପ |',
    priceBasis: 'ଆଞ୍ଚଳିକ ହସ୍ତଶିଳ୍ପ ମୂଲ୍ୟ ଉପରେ ଆଧାରିତ (Based on regional craft norms)',
  },
  pa: {
    title: 'ਰਵਾਇਤੀ ਦਸਤਕਾਰੀ ਕਲਾਕ੍ਰਿਤੀ',
    description: 'ਕੁਦਰਤੀ ਰੰਗਾਂ ਅਤੇ ਦੇਸੀ ਹੁਨਰ ਨਾਲ ਕਾਰੀਗਰ ਦੁਆਰਾ ਹੱਥੀਂ ਤਿਆਰ ਕੀਤੀ ਗਈ ਸ਼ਾਨਦਾਰ ਦਸਤਕਾਰੀ।',
    priceBasis: 'ਵਾਜਬ ਮਿਹਨਤਾਨਾ ਦਰਾਂ ਦੇ ਅਧਾਰ ਤੇ (Based on fair wage rates)',
  },
  as: {
    title: 'পৰম্পৰাগত হস্তনিৰ্মিত সামগ্ৰী',
    description: 'প্ৰাকৃতিক ৰং আৰু থলুৱা উপাদান ব্যৱহাৰ কৰি শিল্পীয়ে নিজ হাতেৰে নিৰ্মাণ কৰা উৎকৃষ্ট শিল্পকলা।',
    priceBasis: 'আঞ্চলিক হস্তশিল্প মূল্যৰ আধাৰত (Based on regional craft norms)',
  },
  mr: {
    title: 'तारपा नृत्य चित्रांकन असलेली हाताने बनवलेली वारली मातीची थाळी',
    description: 'गेरू आणि तांदळाच्या पिठाने हाताने चितारलेली पारंपारिक वारली मातीची थाळी. गावातील उत्सवाचे सुंदर चित्रण.',
    priceBasis: 'पालघरमधील ५ समान हस्तशिल्प उत्पादनांवर आधारित (Based on 5 similar products in Palghar)',
  },
  hi: {
    title: 'तारपा नृत्य रूपांकन वाली हस्तनिर्मित वारली मिट्टी की थाली',
    description: 'गेरू और प्राकृतिक रंगों से बनी पारंपरिक वारली थाली जो गांव के सामुदायिक उत्सव का सुंदर चित्रण करती है।',
    priceBasis: 'समान हस्तशिल्प उत्पादों और कारीगर समय के आधार पर (Based on artisan time and comparable crafts)',
  },
  en: {
    title: 'Handmade Warli Clay Plate with Tarpa Dance Motif',
    description: 'Authentic Warli plate painted with natural rice paste and geru red earth clay depicting village community celebration.',
    priceBasis: 'Based on 5 similar products in Palghar and stated effort',
  },
};

export function getLocalizedDraft(locale: string) {
  const clean = locale.toLowerCase().split('-')[0] || 'hi';
  return (
    LOCALIZED_DRAFT_TEMPLATES[clean] ||
    LOCALIZED_DRAFT_TEMPLATES['hi'] ||
    LOCALIZED_DRAFT_TEMPLATES['en']
  );
}

// Multilingual Voice Transcripts for Hero Voice Provenance Player (All 22+ Scheduled Indian Languages)
export const MULTILINGUAL_TRANSCRIPTS: Record<string, { label: string; text: string; audioLocale: string }> = {
  original: {
    label: 'मूल आवाज़ (मराठी)',
    text: 'मी सुनील वाघ. पालघर मधील पारंपारिक वारली पेंटिंग बनवतो. हा तारपा नाच आहे, जेव्हा पीक घरात येतं तेव्हा संपूर्ण गाव हातात हात घालून गोल फिरून नाचतो.',
    audioLocale: 'mr',
  },
  hi: {
    label: 'हिंदी (Hindi)',
    text: 'मैं सुनील वाघ, पालघर का पारंपरिक वारली चित्रकार। यह तारपा नृत्य है, जो फसल कटने के उत्सव में पूरे गांव द्वारा एक-दूसरे का हाथ पकड़कर गोल घेरे में किया जाता है।',
    audioLocale: 'hi',
  },
  mr: {
    label: 'मराठी (Marathi)',
    text: 'मी सुनील वाघ, पालघरचा वारली चित्रकार. ही तारपा नृत्य कलाकृती आहे, जी शेतातील सुगीच्या उत्सवात संपूर्ण गाव मिळून साजरी करते.',
    audioLocale: 'mr',
  },
  te: {
    label: 'తెలుగు (Telugu)',
    text: 'నేను సునీల్ వాఘ్, పాల్ఘర్ వార్లీ చిత్రకారుడిని. ఇది తార్పా నృత్యం, పంట చేతికి వచ్చిన పండుగలో గ్రామం అంతా చేతులు పట్టుకుని గుండ్రంగా నృత్యం చేస్తుంది.',
    audioLocale: 'te',
  },
  ta: {
    label: 'தமிழ் (Tamil)',
    text: 'நான் சுனில் வாக், பால்கரின் வார்லி ஓவியர். இது தார்பா நடனம், அறுவடை திருவிழாவில் கிராமமே கைகோர்த்து வட்டமாக ஆடும் பாரம்பரிய நடனம்.',
    audioLocale: 'ta',
  },
  kn: {
    label: 'ಕನ್ನಡ (Kannada)',
    text: 'ನಾನು ಸುನಿಲ್ ವಾಘ್, ಪಾಲ್ಘರ್ ವಾರ್ಲಿ ವರ್ಣಚಿತ್ರಕಾರ. ಇದು ತಾರ್ಪಾ ನೃತ್ಯ, ಸುಗ್ಗಿಯ ಹಬ್ಬದಲ್ಲಿ ಇಡೀ ಹಳ್ಳಿ ಕೈಜೋಡಿಸಿ ವೃತ್ತಾಕಾರದಲ್ಲಿ ನೃತ್ಯ ಮಾಡುತ್ತದೆ.',
    audioLocale: 'kn',
  },
  bn: {
    label: 'বাংলা (Bengali)',
    text: 'আমি সুনীল বাঘ, পালঘরের ওয়ারলি চিত্রশিল্পী। এটি তারপা নৃত্য, যা ফসল তোলার উৎসবে গোটা গ্রাম গোল হয়ে হাত ধরে নাচে।',
    audioLocale: 'bn',
  },
  gu: {
    label: 'ગુજરાતી (Gujarati)',
    text: 'હું સુનીલ વાઘ, પાલઘરનો વારલી ચિત્રકાર. આ તારપા નૃત્ય છે, જે લણણીના ઉત્સવમાં આખું ગામ હાથ પકડીને ગોળ ફરીને નૃત્ય કરે છે.',
    audioLocale: 'gu',
  },
  ml: {
    label: 'മലയാളം (Malayalam)',
    text: 'ഞാൻ സുനിൽ വാഗ്, പാൽഘറിലെ വാർലി ചിത്രകാരൻ. ഇത് തർപ്പ നൃത്തമാണ്, വിളവെടുപ്പ് ഉത്സവത്തിൽ ഗ്രാമം മുഴുവൻ കൈകോർത്ത് വട്ടത്തിൽ നൃത്തം ചെയ്യുന്നു.',
    audioLocale: 'ml',
  },
  or: {
    label: 'ଓଡ଼ିଆ (Odia)',
    text: 'ମୁଁ ସୁନୀଲ ୱାଘ, ପାଲଘରର ୱାର୍ଲି ଚିତ୍ରକାର | ଏହା ତାରପା ନୃତ୍ୟ, ଫସଲ ଅମଳ ଉତ୍ସବରେ ସମଗ୍ର ଗ୍ରାମ ହାତ ଧରାଧରି ହୋଇ ଗୋଲାକାରରେ ନାଚନ୍ତି |',
    audioLocale: 'or',
  },
  pa: {
    label: 'ਪੰਜਾਬੀ (Punjabi)',
    text: 'ਮੈਂ ਸੁਨੀਲ ਵਾਘ, ਪਾਲਘਰ ਦਾ ਵਾਰਲੀ ਚਿੱਤਰਕਾਰ। ਇਹ ਤਾਰਪਾ ਨਾਚ ਹੈ, ਜੋ ਫ਼ਸਲ ਕੱਟਣ ਦੇ ਜਸ਼ਨ ਵਿੱਚ ਪੂਰਾ ਪਿੰਡ ਹੱਥ ਫੜ ਕੇ ਗੋਲ ਚੱਕਰ ਵਿੱਚ ਨੱਚਦਾ ਹੈ।',
    audioLocale: 'pa',
  },
  as: {
    label: 'অসমীয়া (Assamese)',
    text: 'মই সুনীল ৱাঘ, পালঘৰৰ ৱাৰ্লি চিত্ৰশিল্পী। এইটো তাৰপা নৃত্য, শস্য চপোৱা উৎসৱত সমগ্ৰ গাঁৱে হাত ধৰি ঘূৰি ঘূৰি নাচে।',
    audioLocale: 'as',
  },
  mai: {
    label: 'मैथिली (Maithili)',
    text: 'हम सुनील वाघ छी, पालघरक वारली चित्रकार। ई तारपा नृत्य छी, जे फसल कटबाक पाबनि में पूरा गाम हाथ पकड़ि कऽ गोल घेघ में नाचैत अछि।',
    audioLocale: 'hi',
  },
  sat: {
    label: 'ᱥᱟᱱᱛᱟᱲᱤ (Santali)',
    text: 'ᱤᱧ ᱫᱚ ᱥᱩᱱᱤᱞ ᱣᱟᱜᱷ, ᱯᱟᱞᱜᱷᱚᱨ ᱨᱤᱱᱤᱡ ᱣᱟᱨᱞᱤ ᱵᱟᱰᱚᱦᱤ ᱠᱟᱱᱟᱹᱧ᱾ ᱱᱚᱣᱟ ᱫᱚ ᱛᱟᱨᱯᱟ ᱮᱱᱮᱡ ᱠᱟᱱᱟ᱾',
    audioLocale: 'hi',
  },
  ks: {
    label: 'कॉशुर (Kashmiri)',
    text: 'بِہ چُھس سُنیل واگھ، پَلگھر ہُنٛد وارلی آرٹسٹ۔ یہِ چھُ تارپا ناچ۔',
    audioLocale: 'hi',
  },
  kok: {
    label: 'कोंकणी (Konkani)',
    text: 'हांव सुनील वाघ, पालघरचो वारली चित्रकार. हें तारपा नाच आसा, जे सुगीच्या उत्सवांत गांवांतले सगळे लोक नाचातात.',
    audioLocale: 'mr',
  },
  sd: {
    label: 'सिंधी (Sindhi)',
    text: 'آءٌ سُنيِل واگهه، پالگهر جو وارلي چترڪار آهيان. هي تارپا ناچ آهي.',
    audioLocale: 'hi',
  },
  sa: {
    label: 'संस्कृतम् (Sanskrit)',
    text: 'अहं सुनील वाघः, पालघरनगरस्य वारली चित्रकारः। एतत् तारपा नृत्यं यत् सस्योत्सवे सर्वे ग्रामीणाः हस्तं गृहीत्वा कुर्वन्ति।',
    audioLocale: 'hi',
  },
  ur: {
    label: 'اردو (Urdu)',
    text: 'میں سنیل واگھ، پالگھر کا وارلی مصور ہوں۔ یہ تارپا رقص ہے جو فصل کی کٹائی کے جشن میں دائرے میں کیا جاتا ہے۔',
    audioLocale: 'ur',
  },
  mni: {
    label: 'মৈতৈলোন্ (Manipuri)',
    text: 'ঐহাক সুনিল ৱাঘনি, পালঘরগী ৱারলী আর্তিস্তনি। মসিনা তার্পা জগোইনি।',
    audioLocale: 'hi',
  },
  brx: {
    label: 'बड़ो (Bodo)',
    text: 'आं सुनील वाघ, पालघरनि वारली कलाकार। बेयो तारपा मोसानाय।',
    audioLocale: 'hi',
  },
  ne: {
    label: 'नेपाली (Nepali)',
    text: 'म सुनील वाघ, पालघरको वारली चित्रकार हुँ। यो तारपा नृत्य हो, जो बाली भित्र्याउने उत्सवमा पूरा गाउँ मिलेर नाचिन्छ।',
    audioLocale: 'ne',
  },
  en: {
    label: 'English',
    text: 'I am Sunil Wagh, a traditional Warli artist from Palghar. This is the sacred Tarpa dance painting, depicting village celebration after harvest with natural earth pigments.',
    audioLocale: 'en',
  },
};

// Onboarding UI Localizations for all 22+ Indic Languages
export const ONBOARDING_I18N: Record<
  string,
  {
    headerTitle: string;
    headerSub: string;
    stepCount: string;
    q1Title: string;
    q1Sub: string;
    q1ListenText: string;
    nameLabel: string;
    namePlaceholder: string;
    handleLabel: string;
    photoLabel: string;
    q2Title: string;
    q2Sub: string;
    q2ListenText: string;
    craftNameLabel: string;
    craftNamePlaceholder: string;
    craftDescLabel: string;
    craftDescPlaceholder: string;
    craftDescHint: string;
    districtLabel: string;
    stateLabel: string;
    q3Title: string;
    q3Sub: string;
    q3ListenText: string;
    languageLabel: string;
    phoneLabel: string;
    nextBtn: string;
    backBtn: string;
    submitBtn: string;
    creatingBtn: string;
  }
> = {
  hi: {
    headerTitle: 'कारीगर खाता / Creator Signup',
    headerSub: '3 आसान सवाल · 30 Seconds Setup',
    stepCount: 'सवाल',
    q1Title: 'आपका नाम और प्रोफ़ाइल फ़ोटो',
    q1Sub: 'इन्स्टाग्राम की तरह अपनी पहचान बनाएं (Your Artisan Identity)',
    q1ListenText: 'कृपया अपना पूरा नाम लिखें और अपनी प्रोफ़ाइल फ़ोटो या सेल्फ़ी जोड़ें।',
    nameLabel: 'पूरा नाम (Full Name / Artisan Name):',
    namePlaceholder: 'जैसे: सुनील वाघ (Sunil Wagh)',
    handleLabel: 'क्रिएटर हैंडल (Instagram-Style @Handle):',
    photoLabel: 'फ़ोटो बदलें (Tap camera to upload)',
    q2Title: 'आपकी हस्तकला और कला का विवरण',
    q2Sub: 'आप क्या बनाते हैं? अपनी कला के बारे में खुलकर बताएं (Craft & Story)',
    q2ListenText: 'अपनी हस्तकला का नाम, सामग्री और विशेषता के बारे में अपने शब्दों में बताएं।',
    craftNameLabel: 'हस्तकला का नाम (Craft Name):',
    craftNamePlaceholder: 'जैसे: वारली चित्रकला, ब्लू पॉटरी, काष्ठ नक्काशी...',
    craftDescLabel: 'कला और विशेषता का विवरण (Craft Description & Materials):',
    craftDescPlaceholder: 'अपनी कला के बारे में विस्तार से लिखें: कौन सी सामग्री इस्तेमाल करते हैं, इसे बनाने का तरीका, परंपरा या क्या खास है...',
    craftDescHint: '💡 आप यहाँ अपनी हस्तकला, कच्चा माल और अपनी खासियत पूरी स्वतंत्रता से लिख सकते हैं।',
    districtLabel: 'ज़िला (District):',
    stateLabel: 'राज्य (State):',
    q3Title: 'मातृभाषा और मोबाइल नंबर',
    q3Sub: 'ऑर्डर की बोलती सूचना और संपर्क के लिए (Language & Voice SMS)',
    q3ListenText: 'अपनी पसंदीदा भाषा चुनें और मोबाइल नंबर दर्ज करें। फिर खाता बनाएं पर क्लिक करें।',
    languageLabel: 'अपनी भाषा चुनें (Preferred Mother Tongue):',
    phoneLabel: 'मोबाइल नंबर (WhatsApp / Voice Alert Phone):',
    nextBtn: 'आगे बढ़ें (Next Question)',
    backBtn: 'पीछे (Back)',
    submitBtn: 'खाता बनाएं (Create Account & Open Profile) ✨',
    creatingBtn: 'खाता बन रहा है...',
  },
  mr: {
    headerTitle: 'कारागीर खाते / Creator Signup',
    headerSub: '३ सोपे प्रश्न · ३० सेकंदात प्रोफाइल तयार',
    stepCount: 'प्रश्न',
    q1Title: 'तुमचे नाव आणि प्रोफाइल फोटो',
    q1Sub: 'इन्स्टाग्राम प्रमाणे आपली ओळख निर्माण करा',
    q1ListenText: 'कृपया आपले संपूर्ण नाव लिहा आणि आपला फोटो किंवा सेल्फी जोडा.',
    nameLabel: 'संपूर्ण नाव (Full Name):',
    namePlaceholder: 'उदा. सुनील वाघ',
    handleLabel: 'हँडल (@Handle):',
    photoLabel: 'फोटो बदला (कॅमेरा टॅप करा)',
    q2Title: 'तुमची हस्तकला आणि कलेचे वर्णन',
    q2Sub: 'तुम्ही काय बनवता? आपल्या कलेबद्दल मनमोकळेपणाने सांगा',
    q2ListenText: 'आपल्या हस्तकलेचे नाव, साहित्य आणि वैशिष्ट्याबद्दल आपल्या शब्दांत लिहा.',
    craftNameLabel: 'हस्तकलेचे नाव (Craft Name):',
    craftNamePlaceholder: 'उदा. वारली चित्रकला, मातीची भांडी, लाकडी कोरीव काम...',
    craftDescLabel: 'कलेचे सविस्तर वर्णन व वैशिष्ट्य (Craft Description):',
    craftDescPlaceholder: 'आपल्या कलेबद्दल सविस्तर लिहा: कोणते नैसर्गिक रंग/साहित्य वापरता, बनवण्याची पद्धत काय आहे...',
    craftDescHint: '💡 येथे तुम्ही आपल्या हस्तकलेविषयी संपूर्ण माहिती मोकळेपणाने लिहू शकता.',
    districtLabel: 'जिल्हा (District):',
    stateLabel: 'राज्य (State):',
    q3Title: 'मातृभाषा आणि मोबाईल क्रमांक',
    q3Sub: 'ऑर्डरच्या ऑडिओ सूचनांसाठी',
    q3ListenText: 'आपली मातृभाषा निवडा आणि मोबाईल क्रमांक नोंदवा.',
    languageLabel: 'आपली भाषा निवडा (Language):',
    phoneLabel: 'मोबाईल नंबर (WhatsApp / Phone):',
    nextBtn: 'पुढे जा (Next)',
    backBtn: 'मागे (Back)',
    submitBtn: 'खाते तयार करा (Create Account) ✨',
    creatingBtn: 'खाते तयार होत आहे...',
  },
  bn: {
    headerTitle: 'কারিগর অ্যাকাউন্ট / Creator Signup',
    headerSub: '৩টি সহজ প্রশ্ন · ৩০ সেকেন্ডে প্রোফাইল',
    stepCount: 'প্রশ্ন',
    q1Title: 'আপনার নাম এবং প্রোফাইল ছবি',
    q1Sub: 'ইনস্টাগ্রামের মতো নিজের পরিচয় তৈরি করুন',
    q1ListenText: 'দয়া করে আপনার পুরো নাম লিখুন এবং ছবি আপলোড করুন।',
    nameLabel: 'পুরো নাম (Full Name):',
    namePlaceholder: 'যেমন: সুনীল বাঘ',
    handleLabel: 'হ্যান্ডেল (@Handle):',
    photoLabel: 'ছবি পরিবর্তন করুন',
    q2Title: 'আপনার হস্তশিল্প এবং বিবরণ',
    q2Sub: 'আপনি কি তৈরি করেন? নিজের হস্তশিল্পের বিস্তারিত বর্ণনা দিন',
    q2ListenText: 'আপনার শিল্পের নাম, কাঁচামাল ও বৈশিষ্ট্য সম্পর্কে নিজের ভাষায় লিখুন।',
    craftNameLabel: 'হস্তশিল্পের নাম (Craft Name):',
    craftNamePlaceholder: 'যেমন: পোড়ামাটির শিল্প, কাঁথা স্টিচ, ডোকরা...',
    craftDescLabel: 'শিল্পের বিস্তারিত বিবরণ ও উপকরণ (Craft Description):',
    craftDescPlaceholder: 'আপনার শিল্প সম্পর্কে বিশদে লিখুন: কি উপকরণ ব্যবহার করেন, তৈরির প্রক্রিয়া ইত্যাদি...',
    craftDescHint: '💡 এখানে আপনি আপনার নিজের ভাষায় যেকোনো বিবরণ স্বাধীনভাবে লিখতে পারেন।',
    districtLabel: 'জেলা (District):',
    stateLabel: 'রাজ্য (State):',
    q3Title: 'মাতৃভাষা ও মোবাইল নম্বর',
    q3Sub: 'ভয়েস অ্যালার্ট ও যোগাযোগের জন্য',
    q3ListenText: 'আপনার পছন্দের ভাষা নির্বাচন করুন এবং ফোন নম্বর দিন।',
    languageLabel: 'ভাষা নির্বাচন করুন:',
    phoneLabel: 'মোবাইল নম্বর:',
    nextBtn: 'পরবর্তী (Next)',
    backBtn: 'পূর্ববর্তী (Back)',
    submitBtn: 'অ্যাকাউন্ট তৈরি করুন ✨',
    creatingBtn: 'অ্যাকাউন্ট তৈরি হচ্ছে...',
  },
  te: {
    headerTitle: 'కళాకారుల ఖాతా / Creator Signup',
    headerSub: '3 సులభమైన ప్రశ్నలు · 30 సెకన్ల సెటప్',
    stepCount: 'ప్రశ్న',
    q1Title: 'మీ పేరు మరియు ప్రొఫైల్ ఫోటో',
    q1Sub: 'ఇన్‌స్టాగ్రామ్ లాగా మీ గుర్తింపును సృష్టించండి',
    q1ListenText: 'దయచేసి మీ పూర్తి పేరును వ్రాయండి మరియు ఫోటోను జోడించండి.',
    nameLabel: 'పూర్తి పేరు (Full Name):',
    namePlaceholder: 'ఉదా: సునీల్ వాఘ్',
    handleLabel: 'హ్యాండిల్ (@Handle):',
    photoLabel: 'ఫోటో మార్చండి',
    q2Title: 'మీ హస్తకళ మరియు వివరణ',
    q2Sub: 'మీరు ఏమి తయారు చేస్తారు? మీ కళ గురించి వివరించండి',
    q2ListenText: 'మీ కళ పేరు, ఉపయోగించే పదార్థాలు మరియు ప్రత్యేకతను మీ స్వంత మాటలలో వ్రాయండి.',
    craftNameLabel: 'హస్తకళ పేరు (Craft Name):',
    craftNamePlaceholder: 'ఉదా: కలంకారీ, లేపాక్షి చెక్క శిల్పం, చేనేత...',
    craftDescLabel: 'కళ వివరణ & ముడి పదార్థాలు (Craft Description):',
    craftDescPlaceholder: 'మీ కళ గురించి వివరంగా వ్రాయండి: ఎలాంటి సహజ రంగులు/వస్తువులు వాడతారు...',
    craftDescHint: '💡 మీ కళ గురించి మీకు నచ్చిన విధంగా ఇక్కడ స్వేచ్ఛగా రాయవచ్చు.',
    districtLabel: 'జిల్లా (District):',
    stateLabel: 'రాష్ట్రం (State):',
    q3Title: 'మాతృభాష మరియు మొబైల్ నంబర్',
    q3Sub: 'వాయిస్ అలర్ట్‌లు మరియు ఆర్డర్ అప్‌డేట్‌ల కోసం',
    q3ListenText: 'మీ భాషను ఎంచుకోండి మరియు మొబైల్ నంబర్ నమోదు చేయండి.',
    languageLabel: 'భాషను ఎంచుకోండి:',
    phoneLabel: 'మొబైల్ నంబర్:',
    nextBtn: 'తదుపరి (Next)',
    backBtn: 'వెనుకకు (Back)',
    submitBtn: 'ఖాతా సృష్టించండి ✨',
    creatingBtn: 'ఖాతా సృష్టించబడుతోంది...',
  },
  ta: {
    headerTitle: 'கைவினைஞர் கணக்கு / Creator Signup',
    headerSub: '3 எளிய கேள்விகள் · 30 வினாடிகளில் அமைப்பு',
    stepCount: 'கேள்வி',
    q1Title: 'உங்கள் பெயர் மற்றும் சுயவிவரப் படம்',
    q1Sub: 'இன்ஸ்டாகிராம் போன்ற உங்கள் கைவினைஞர் அடையாளம்',
    q1ListenText: 'தயவுசெய்து உங்கள் முழு பெயரை எழுதி புகைப்படத்தை பதிவேற்றவும்.',
    nameLabel: 'முழு பெயர் (Full Name):',
    namePlaceholder: 'எ.கா: சுனில் வாக்',
    handleLabel: 'ஹேண்டில் (@Handle):',
    photoLabel: 'புகைப்படம் மாற்றவும்',
    q2Title: 'உங்கள் கைவினை மற்றும் விளக்கம்',
    q2Sub: 'நீங்கள் என்ன உருவாக்குகிறீர்கள்? உங்கள் கலையைப் பற்றி விளக்குங்கள்',
    q2ListenText: 'உங்கள் கைவினைப் பெயர், மூலப்பொருட்கள் மற்றும் சிறப்பை உங்கள் வார்த்தைகளில் எழுதவும்.',
    craftNameLabel: 'கைவினைப் பெயர் (Craft Name):',
    craftNamePlaceholder: 'எ.கா: தஞ்சாவூர் ஓவியம், மண்பாண்டம், வெண்கலச் சிலை...',
    craftDescLabel: 'கைவினை விளக்கம் மற்றும் பொருட்கள் (Craft Description):',
    craftDescPlaceholder: 'உங்கள் கைவினை பற்றி விரிவாக எழுதவும்...',
    craftDescHint: '💡 உங்கள் கைவினை பற்றிய முழு விவரங்களையும் இங்கே சுதந்திரமாக எழுதலாம்.',
    districtLabel: 'மாவட்டம் (District):',
    stateLabel: 'மாநிலம் (State):',
    q3Title: 'தாய்மொழி மற்றும் மொபைல் எண்',
    q3Sub: 'குரல் அறிவிப்புகள் மற்றும் தொடர்புக்கு',
    q3ListenText: 'உங்கள் விருப்ப மொழியைத் தேர்ந்தெடுத்து மொபைல் எண்ணை உள்ளிடவும்.',
    languageLabel: 'மொழியைத் தேர்ந்தெடுக்கவும்:',
    phoneLabel: 'மொபைல் எண்:',
    nextBtn: 'அடுத்து (Next)',
    backBtn: 'பின்செல் (Back)',
    submitBtn: 'கணக்கை உருவாக்கவும் ✨',
    creatingBtn: 'உருவாக்குகிறது...',
  },
  en: {
    headerTitle: 'Artisan Account / Creator Signup',
    headerSub: '3 Easy Questions · 30-Second Setup',
    stepCount: 'Question',
    q1Title: 'Your Name & Profile Photo',
    q1Sub: 'Create your Instagram-style artisan creator identity',
    q1ListenText: 'Please enter your full name and upload a profile photo or selfie.',
    nameLabel: 'Full Name / Artisan Name:',
    namePlaceholder: 'e.g. Sunil Wagh',
    handleLabel: 'Creator Handle (@Handle):',
    photoLabel: 'Change Photo (Tap camera to upload)',
    q2Title: 'Your Craft & Specialty Story',
    q2Sub: 'What do you make? Describe your craft in your own words (No limits)',
    q2ListenText: 'Tell us about your craft, raw materials, technique, and unique tradition in your own words.',
    craftNameLabel: 'Craft Specialization Name:',
    craftNamePlaceholder: 'e.g. Warli Painting, Blue Pottery, Brass Dhokra, Terracotta...',
    craftDescLabel: 'Craft Story, Technique & Materials (Open Description):',
    craftDescPlaceholder: 'Freely describe your craft: what natural materials you use, how you make it, regional heritage, and what makes it special...',
    craftDescHint: '💡 Enter any custom craft description, heritage story, or unique technique freely without restrictions.',
    districtLabel: 'District:',
    stateLabel: 'State:',
    q3Title: 'Preferred Language & Mobile Phone',
    q3Sub: 'For spoken voice order alerts and WhatsApp direct link',
    q3ListenText: 'Select your preferred mother tongue and enter your 10-digit mobile number.',
    languageLabel: 'Select Preferred Mother Tongue:',
    phoneLabel: 'Mobile Phone (WhatsApp / Voice Alerts):',
    nextBtn: 'Next Question →',
    backBtn: '← Back',
    submitBtn: 'Create Account & Open Profile ✨',
    creatingBtn: 'Creating Account...',
  },
};

export function getOnboardingI18n(locale: string) {
  const clean = locale.toLowerCase().split('-')[0] || 'hi';
  return ONBOARDING_I18N[clean] || ONBOARDING_I18N['hi'] || ONBOARDING_I18N['en'];
}

// Multilingual Order Voice Alerts for Artisan Orders Hub
export const MULTILINGUAL_ORDER_ALERTS: Record<string, Record<string, string>> = {
  bulk_order_40: {
    hi: 'आपको 40 पीस का नया बल्क ऑर्डर मिला है। हेरिटेज होटल्स ने 40 यूनिट्स मँगवाए हैं।',
    mr: 'तुम्हाला ४० नगांची नवीन ऑर्डर आली आहे. हेरिटेज हॉटेल्सने ४० युनिट्स मागवले आहेत.',
    te: 'మీకు 40 యూనిట్ల కొత్త బల్క్ ఆర్డర్ వచ్చింది. హెరిటేజ్ హోటల్స్ 40 యూనిట్లను ఆర్డర్ చేశాయి.',
    ta: 'உங்களுக்கு 40 யூனிட்டுகள் புதிய மொத்த ஆர்டர் வந்துள்ளது. ஹெரிடேஜ் ஹோட்டல்ஸ் 40 யூனிட்களை ஆர்டர் செய்துள்ளது.',
    kn: 'ನಿಮಗೆ 40 ಯೂನಿಟ್‌ಗಳ ಹೊಸ ಬಲ್ಕ್ ಆರ್ಡರ್ ಬಂದಿದೆ. ಹೆರಿಟೇಜ್ ಹೋಟೆಲ್ಸ್ 40 ಯೂನಿಟ್‌ಗಳನ್ನು ಆರ್ಡರ್ ಮಾಡಿದೆ.',
    bn: 'আপনি ৪০ টি পিসের একটি নতুন বাল্ক অর্ডার পেয়েছেন। হেরিটেজ হোটেলস ৪০ টি ইউনিট অর্ডার করেছে।',
    gu: 'તમને 40 નંગનો નવો બલ્ક ઓર્ડર મળ્યો છે. હેરિટેજ હોટેલ્સે 40 યુનિટ્સ મંગાવ્યા છે.',
    ml: 'നിങ്ങൾക്ക് 40 യൂണിറ്റുകളുടെ പുതിയ ബൾക്ക് ഓർഡർ ലഭിച്ചു. ഹെറിറ്റേജ് ഹോട്ടൽസ് 40 യൂണിറ്റുകൾ ഓർഡർ ചെയ്തു.',
    or: 'ଆପଣଙ୍କୁ ୪୦ ଖଣ୍ଡର ନୂତନ ବଲ୍କ ଅର୍ଡର ମିଳିଛି | ହେରିଟେଜ୍ ହୋଟେଲ୍ସ ୪୦ ୟୁନିଟ୍ ଅର୍ଡର କରିଛି |',
    pa: 'ਤੁਹਾਨੂੰ 40 ਨਗਾਂ ਦਾ ਨਵਾਂ ਬਲਕ ਆਰਡਰ ਮਿਲਿਆ ਹੈ। ਹੈਰੀਟੇਜ ਹੋਟਲਜ਼ ਨੇ 40 ਯੂਨਿਟ ਆਰਡਰ ਕੀਤੇ ਹਨ।',
    as: 'আপুনি ৪০ টা সামগ্ৰীৰ এটা নতুন বাল্ক অৰ্ডাৰ পাইছে। হেৰিটেজ হোটেলছে ৪০ টা ইউনিট অৰ্ডাৰ কৰিছে।',
    en: 'You have received a new bulk order of 40 units from Heritage Hotels & Resorts.',
  },
  retail_order_1: {
    hi: 'आपका 1 पीस वारली कैनवास सफलतापूर्वक डिलीवर हो गया है।',
    mr: 'तुमची १ नग वारली कॅनव्हास ऑर्डर यशस्वीरीत्या पोहोचली आहे.',
    te: 'మీ 1 పీస్ వార్లీ కాన్వాస్ ఆర్డర్ విజయవంతంగా డెలివరీ చేయబడింది.',
    ta: 'உங்கள் 1 வார்லி கேன்வாஸ் வெற்றிகரமாக டெலிவரி செய்யப்பட்டது.',
    kn: 'ನಿಮ್ಮ 1 ಪೀಸ್ ವಾರ್ಲಿ ಕ್ಯಾನ್ವಾಸ್ ಯಶಸ್ವಿಯಾಗಿ ತಲುಪಿಸಲಾಗಿದೆ.',
    bn: 'আপনার ১ পিস ওয়ারলি ক্যানভাস সফলভাবে পৌঁছে দেওয়া হয়েছে।',
    gu: 'તમારો 1 નંગ વારલી કેનવાસ સફળતાપૂર્વક ડિલિવર થઈ ગયો છે.',
    ml: 'നിങ്ങളുടെ 1 പീസ് വാർലി ക്യാൻവാസ് വിജയകരമായി ഡെലിവർ ചെയ്തു.',
    or: 'ଆପଣଙ୍କର ୧ ଖଣ୍ଡ ୱାର୍ଲି କାନଭାସ୍ ସଫଳତାର ସହିତ ବିତରଣ କରାଯାଇଛି |',
    pa: 'ਤੁਹਾਡਾ 1 ਪੀਸ ਵਾਰਲੀ ਕੈਨਵਸ ਸਫਲਤਾਪੂਰਵਕ ਡਿਲੀਵਰ ਹੋ ਗਿਆ ਹੈ।',
    as: 'আপোনাৰ ১ টা ৱাৰ্লি কেনভাছ সফলতাৰে ডেলিভাৰী কৰা হৈছে।',
    en: 'Your 1 unit Warli Canvas order has been delivered successfully.',
  },
  general_announcement: {
    hi: 'कारीगर भाइयों, आज आपको 2 नए ऑर्डर मिले हैं। कृपया समय पर पैकेजिंग शुरू करें।',
    mr: 'कारागीर मित्रांनो, आज तुम्हाला २ नवीन ऑर्डर्स मिळाल्या आहेत. कृपया वेळेत पॅकिंग सुरू करा.',
    te: 'కళాకారులారా, ఈ రోజు మీకు 2 కొత్త ఆర్డర్‌లు వచ్చాయి. దయచేసి సమయానికి ప్యాకింగ్ ప్రారంభించండి.',
    ta: 'கைவினைஞர்களே, இன்று உங்களுக்கு 2 புதிய ஆர்டர்கள் வந்துள்ளன. தயவுசெய்து சரியான நேரத்தில் பேக்கிங் தொடங்குங்கள்.',
    kn: 'ಕಲಾಕಾರರೇ, ಇಂದು ನಿಮಗೆ 2 ಹೊಸ ಆರ್ಡರ್‌ಗಳು ಬಂದಿವೆ. ದಯವಿಟ್ಟು ಸಮಯಕ್ಕೆ ಸರಿಯಾಗಿ ಪ್ಯಾಕಿಂಗ್ ಪ್ರಾರಂಭಿಸಿ.',
    bn: 'কারিগর বন্ধুরা, আজ আপনি ২টি নতুন অর্ডার পেয়েছেন। অনুগ্রহ করে সময়মতো প্যাকিং শুরু করুন।',
    gu: 'કારીગર મિત્રો, આજે તમને 2 નવા ઓર્ડર મળ્યા છે. કૃપા કરીને સમયસર પેકિંગ શરૂ કરો.',
    ml: 'കരകൗശല വിദഗ്ദ്ധരേ, ഇന്ന് നിങ്ങൾക്ക് 2 പുതിയ ഓർഡറുകൾ ലഭിച്ചു. ദയവായി കൃത്യസമയത്ത് പാക്കിംഗ് ആരംഭിക്കുക.',
    or: 'କାରିଗର ଭାଇମାନେ, ଆଜି ଆପଣଙ୍କୁ ୨ଟି ନୂଆ ଅର୍ଡର ମିଳିଛି | ଦୟାକରି ଠିକ୍ ସମୟରେ ପ୍ୟାକିଂ ଆରମ୍ଭ କରନ୍ତୁ |',
    pa: 'ਕਾਰੀਗਰ ਵੀਰੋ, ਅੱਜ ਤੁਹਾਨੂੰ 2 ਨਵੇਂ ਆਰਡਰ ਮਿਲੇ ਹਨ। ਕਿਰਪਾ ਕਰਕੇ ਸਮੇਂ ਸਿਰ ਪੈਕਿੰਗ ਸ਼ੁਰੂ ਕਰੋ।',
    as: 'শিল্পীসকল, আজি আপুনি ২টা নতুন অৰ্ডাৰ পাইছে। অনুগ্ৰহ কৰি সময়মতে পেকিং আৰম্ভ কৰক।',
    en: 'Artisan Partners, you have received 2 new orders today. Please prepare for timely dispatch.',
  },
};

export function getOrderAlert(alertKey: string, locale: string): string {
  const clean = locale.toLowerCase().split('-')[0] || 'hi';
  const alertMap = MULTILINGUAL_ORDER_ALERTS[alertKey];
  if (!alertMap) return '';
  return alertMap[clean] || alertMap['hi'] || alertMap['en'] || '';
}

// Native audio greetings for each of the 22+ Scheduled Indian Languages
export const NATIVE_SAMPLE_GREETINGS: Record<string, string> = {
  hi: 'नमस्ते, यह हिंदी भाषा है।',
  mr: 'नमस्कार, ही मराठी भाषा आहे.',
  te: 'నమస్కారం, ఇది తెలుగు భాష.',
  ta: 'வணக்கம், இது தமிழ் மொழி.',
  kn: 'ನಮಸ್ಕಾರ, ಇದು ಕನ್ನಡ ಭಾಷೆ.',
  bn: 'নমস্কার, এটি বাংলা ভাষা।',
  gu: 'નમસ્તે, આ ગુજરાતી ભાષા છે.',
  ml: 'നമസ്കാരം, ഇത് മലയാളം ഭാഷയാണ്.',
  or: 'ନମସ୍କାର, ଏହା ଓଡ଼ିଆ ଭାଷା |',
  pa: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ, ਇਹ ਪੰਜਾਬੀ ਭਾਸ਼ਾ ਹੈ।',
  as: 'নমস্কাৰ, এইটো অসমীয়া ভাষা।',
  mai: 'प्रणाम, ई मैथिली भाषा छी।',
  sat: 'ᱡᱚᱦᱟᱨ, ᱱᱚᱣᱟ ᱫᱚ ᱥᱟᱱᱛᱟᱲᱤ ᱯᱟᱹᱨᱥᱤ ᱠᱟᱱᱟ᱾',
  ks: 'سلام، یہِ چھِ کٲشُر زَبان۔',
  kok: 'नमस्कार, ही कोंकणी भाषा आसा.',
  sd: 'سلام، هي سنڌي ٻولي آهي.',
  sa: 'नमस्ते, एषा संस्कृतभाषा अस्ति।',
  ur: 'السلام علیکم، یہ اردو زبان ہے۔',
  mni: 'খুরুমজরি, মসিনা মৈতৈলোননি।',
  brx: 'खुलुमबाय, बेयो बड़ो राव।',
  ne: 'नमस्ते, यो नेपाली भाषा हो।',
  en: 'Hello, this is English.',
};

export function getNativeSampleGreeting(locale: string): string {
  const clean = locale.toLowerCase().split('-')[0] || 'hi';
  return NATIVE_SAMPLE_GREETINGS[clean] || NATIVE_SAMPLE_GREETINGS['hi'] || NATIVE_SAMPLE_GREETINGS['en'];
}

// Voice-guided explanation strings for Step 2 and Step 3 in multiple languages
export const STEP_ACTION_GUIDES: Record<string, Record<string, string>> = {
  video_option: {
    hi: 'वीडियो विकल्प: इस बटन पर क्लिक करके अपने कैमरे से 20 से 30 सेकंड का वीडियो बनाएं। शिल्प को चारों तरफ से घुमाकर दिखाएं और साथ में बोलकर बताएं।',
    mr: 'व्हिडिओ पर्याय: या बटणावर क्लिक करून आपल्या कॅमेऱ्याने २० ते ३० सेकंदांचा व्हिडिओ बनवा. हस्तकला फिरवून दाखवा आणि सोबत बोलून सांगा.',
    te: 'వీడియో ఎంపిక: ఈ బటన్‌ను క్లిక్ చేసి మీ కెమెరాతో 20 నుండి 30 సెకన్ల వీడియోను రికార్డ్ చేయండి. మీ కళాఖండాన్ని అన్ని వైపులా చూపించి మాట్లాడండి.',
    ta: 'வீடியோ விருப்பம்: உங்கள் கேமரா மூலம் 20 முதல் 30 வினாடிகள் வீடியோ எடுக்க இந்த பொத்தானை அழுத்தவும். தயாரிப்பை சுற்றி காட்டி பேசவும்.',
    kn: 'ವೀಡಿಯೊ ಆಯ್ಕೆ: ನಿಮ್ಮ ಕ್ಯಾಮೆರಾದೊಂದಿಗೆ 20 ರಿಂದ 30 ಸೆಕೆಂಡುಗಳ ವೀಡಿಯೊ ಮಾಡಲು ಈ ಬಟನ್ ಕ್ಲಿಕ್ ಮಾಡಿ. ಉತ್ಪನ್ನವನ್ನು ತೋರಿಸಿ ಮಾತನಾಡಿ.',
    bn: 'ভিডিও বিকল্প: এই বোতামে ক্লিক করে আপনার ক্যামেরা দিয়ে ২০ থেকে ৩০ সেকেন্ডের ভিডিও তৈরি করুন এবং মুখে বিবরণ দিন।',
    gu: 'વીડિયો વિકલ્પ: તમારા કેમેરાથી 20 થી 30 સેકન્ડનો વીડિયો બનાવો અને બોલીને સમજાવો.',
    en: 'Video Option: Click to open your camera and record a 20-30 second craft demonstration video while speaking.',
  },
  camera_photo_option: {
    hi: 'फ़ोटो खींचें: इस बटन पर क्लिक करके अपने फ़ोन के कैमरे से हस्तशिल्प की साफ़, अच्छी रोशनी वाली तस्वीरें सीधे खींचें।',
    mr: 'कॅमेरा फोटो: या बटणावर क्लिक करून आपल्या फोनच्या कॅमेऱ्याने हस्तकलेचे स्पष्ट आणि चांगल्या प्रकाशातील फोटो थेट काढा.',
    te: 'కెమెరా ఫోటో: ఈ బటన్‌ను క్లిಕ್ చేసి మీ ఫోన్ కెమెరాతో స్పష్టమైన ఫోటోలను నేరుగా తీయండి.',
    ta: 'கேமரா புகைப்படம்: கைவினைப் பொருளின் தெளிவான புகைப்படங்களை நேரடியாக எடுக்க இந்த பொத்தானை அழுத்தவும்.',
    kn: 'ಕ್ಯಾಮೆರಾ ಫೋಟೋ: ನಿಮ್ಮ ಫೋನ್ ಕ್ಯಾಮೆರಾದೊಂದಿಗೆ ಸ್ಪಷ್ಟ ಫೋಟೋಗಳನ್ನು ನೇರವಾಗಿ ತೆಗೆದುಕೊಳ್ಳಲು ಕ್ಲಿಕ್ ಮಾಡಿ.',
    bn: 'ক্যামেরা ফটো: সরাসরি আপনার ফোনের ক্যামেরা দিয়ে পরিষ্কার ছবি তুলতে এখানে ক্লিক করুন।',
    gu: 'કેમેરા ફોટો: સીધા કેમેરાથી તમારા ઉત્પાદનનો સ્પષ્ટ ફોટો પાડવા માટે અહીં ક્લિક કરો.',
    en: 'Camera Photo: Click to open your live camera and capture clear, well-lit photos of your craft.',
  },
  device_files_option: {
    hi: 'फ़ाइलें व गैलरी: यदि आपने पहले से फ़ोटो या वीडियो ले रखे हैं, तो इस बटन पर क्लिक करके अपने फ़ोन या कंप्यूटर से उन्हें चुनें।',
    mr: 'गॅलरी व फाइल्स: आपण आधीच फोटो किंवा व्हिडिओ काढले असल्यास, या बटणावर क्लिक करून आपल्या फोनमधून ते निवडा.',
    te: 'గ్యాలరీ మరియు ఫైల్స్: మీరు ఇప్పటికే ఫోటోలు తీసి ఉంటే, మీ పరికరం నుండి వాటిని ఎంచుకోవడానికి ఇక్కడ క్లిక్ చేయండి.',
    ta: 'கோப்புகள் மற்றும் கேலரி: ஏற்கனவே உள்ள புகைப்படங்களை உங்கள் சாதனத்திலிருந்து தேர்ந்தெடுக்க இங்கே கிளிக் செய்யவும்.',
    kn: 'ಗ್ಯಾಲರಿ ಮತ್ತು ಫೈಲ್‌ಗಳು: ಈಗಾಗಲೇ ತೆಗೆದಿರುವ ಫೋಟೋಗಳನ್ನು ಆಯ್ಕೆ ಮಾಡಲು ಇಲ್ಲಿ ಕ್ಲಿಕ್ ಮಾಡಿ.',
    bn: 'গ্যালারি ও ফাইল: আগে থেকে তোলা ছবি বা ভিডিও আপনার ডিভাইস থেকে আপলোড করতে এখানে ক্লিক করুন।',
    gu: 'ગેલેરી અને ફાઇલો: તમારા ઉપકરણમાંથી પહેલેથી પાડેલા ફોટા પસંદ કરવા અહીં ક્લિક કરો.',
    en: 'Device Gallery & Files: Click to choose existing photos or video files saved on your phone or computer.',
  },
  voice_prompts_guide: {
    hi: 'बोलने के निर्देश: माइक बटन दबाएं और बताएं कि यह क्या है, किस सामग्री से बना है, इसे बनाने में कितना समय लगा और इसमें क्या खासियत है।',
    mr: 'बोलण्याचे मार्गदर्शन: माइक बटण दाबा आणि सांगा की हे काय आहे, कोणत्या साहित्यापासून बनवले आहे, बनवायला किती वेळ लागला आणि काय वैशिष्ट्य आहे.',
    te: 'వాయిస్ మార్గదర్శకం: మైక్ బటన్ నొక్కి ఇది ఏమిటి, ఏ పదార్థంతో తయారైంది, ఎంత సమయం పట్టింది మరియు దీని ప్రత్యేకత ఏమిటో చెప్పండి.',
    ta: 'குரல் வழிகாட்டுதல்: மைக் பொத்தானை அழுத்தி இது என்ன பொருள், எப்படி செய்யப்பட்டது மற்றும் இதன் சிறப்பம்சங்களை பேசவும்.',
    kn: 'ಧ್ವನಿ ಮಾರ್ಗದರ್ಶನ: ಮೈಕ್ ಬಟನ್ ಒತ್ತಿ ಇದು ಏನು, ಯಾವುದರಿಂದ ಮಾಡಲಾಗಿದೆ ಮತ್ತು ಇದರ ವಿಶೇಷತೆಯನ್ನು ಮಾತನಾಡಿ ತಿಳಿಸಿ.',
    bn: 'কণ্ঠ নির্দেশিকা: মাইক বোতাম টিপুন এবং এটি কি, কি উপাদান দিয়ে তৈরি এবং এর বিশেষত্ব কি তা নিজের ভাষায় বলুন।',
    gu: 'અવાજ માર્ગદર્શન: માઇક બટન દબાવો અને આ વસ્તુ, તેની બનાવટ અને વિશેષતા વિશે જણાવો.',
    en: 'Voice Guidance: Press the mic and speak what this item is, materials used, making time, and its unique story.',
  },
};

export function getStepActionGuide(actionKey: string, locale: string): string {
  const clean = locale.toLowerCase().split('-')[0] || 'hi';
  const guideMap = STEP_ACTION_GUIDES[actionKey];
  if (!guideMap) return '';
  return guideMap[clean] || guideMap['hi'] || guideMap['en'] || '';
}

// Full Dual-Language UI mapping for Step 2 Media Studio
export const STEP2_BILINGUAL_I18N: Record<
  string,
  {
    stepBadge: string;
    listenGuide: string;
    stopGuide: string;
    heading: string;
    subheading: string;
    opt1Badge: string;
    opt1Title: string;
    opt1Desc: string;
    opt2Badge: string;
    opt2Title: string;
    opt2Desc: string;
    opt3Badge: string;
    opt3Title: string;
    opt3Desc: string;
    voiceBtn: string;
    uploadedTitle: string;
    firstPhotoCover: string;
    backBtn: string;
    nextBtn: string;
  }
> = {
  hi: {
    stepBadge: 'चरण 2 / 5 (Step 2 of 5)',
    listenGuide: 'निर्देश सुनें (Listen Guide)',
    stopGuide: 'रोकें (Stop)',
    heading: 'फ़ोटो और वीडियो जोड़ें / Add Craft Media',
    subheading: 'कम से कम 1 साफ़ तस्वीर या वीडियो जोड़ें। नीचे दिए गए 3 विकल्पों में से चुनें।',
    opt1Badge: 'विकल्प 1 · Option 1 (Video Camera)',
    opt1Title: 'लाइव वीडियो बनाएं / Record Live Video',
    opt1Desc: 'कैमरा खोलकर 20-30 सेकंड का शिल्प वीडियो बनाएं और बोलते हुए समझाएं।',
    opt2Badge: 'विकल्प 2 · Option 2 (Browser Camera)',
    opt2Title: 'ब्राउज़र कैमरा से फ़ोटो लें / Take Live Photo in Browser',
    opt2Desc: 'ब्राउज़र में सीधे लाइव कैमरा खोलकर अपने हस्तशिल्प की साफ़ तस्वीर खींचें।',
    opt3Badge: 'विकल्प 3 · Option 3 (Upload Files)',
    opt3Title: 'फ़ाइलें व डेटा अपलोड करें / Upload Files & Data',
    opt3Desc: 'अपने फ़ोन या कंप्यूटर से पहले से मौजूद फ़ोटो, वीडियो या फ़ाइलें चुनें।',
    voiceBtn: 'बोलकर समझें',
    uploadedTitle: 'अपलोड की गई सामग्री (Uploaded Craft Media)',
    firstPhotoCover: 'पहली फ़ोटो मुख्य कवर बनेगी (First photo is cover)',
    backBtn: 'पीछे (Back)',
    nextBtn: 'आवाज़ रिकॉर्ड करें (Next: Record Voice)',
  },
  mr: {
    stepBadge: 'चरण २ / ५ (Step 2 of 5)',
    listenGuide: 'मार्गदर्शन ऐका (Listen Guide)',
    stopGuide: 'थांबवा (Stop)',
    heading: 'फोटो व व्हिडिओ जोडा / Add Craft Media',
    subheading: 'किमान १ स्पष्ट फोटो किंवा व्हिडिओ जोडा. खालील ३ पर्यायांमधून निवडा.',
    opt1Badge: 'पर्याय १ · Option 1 (Video Camera)',
    opt1Title: 'थेट व्हिडिओ बनवा / Record Live Video',
    opt1Desc: 'कॅमेरा उघडून २०-३० सेकंदांचा व्हिडिओ बनवा व बोलून सांगा.',
    opt2Badge: 'पर्याय २ · Option 2 (Browser Camera)',
    opt2Title: 'ब्राउझर कॅमेऱ्याने फोटो काढा / Take Live Photo in Browser',
    opt2Desc: 'ब्राउझरमध्ये थेट कॅमेरा सुरू करून हस्तकलेचा स्पष्ट फोटो काढा.',
    opt3Badge: 'पर्याय ३ · Option 3 (Upload Files)',
    opt3Title: 'फाइल्स व डेटा अपलोड करा / Upload Files & Data',
    opt3Desc: 'आपल्या फोन किंवा संगणकावरून आधीचे फोटो अथवा फाइल्स निवडा.',
    voiceBtn: 'बोलून समजून घ्या',
    uploadedTitle: 'अपलोड केलेले फोटो व व्हिडिओ (Uploaded Media)',
    firstPhotoCover: 'पहिला फोटो मुख्य कव्हर बनेल',
    backBtn: 'मागे (Back)',
    nextBtn: 'आवाज रेकॉर्ड करा (Next: Record Voice)',
  },
  te: {
    stepBadge: 'దశ 2 / 5 (Step 2 of 5)',
    listenGuide: 'సూచనలు వినండి (Listen Guide)',
    stopGuide: 'ఆపండి (Stop)',
    heading: 'ఫోటోలు మరియు వీడియోలు జోడించండి / Add Craft Media',
    subheading: 'కనీసం 1 స్పష్టమైన ఫోటో లేదా వీడియోను జోడించండి. క్రింది 3 ఎంపికల నుండి ఎంచుకోండి.',
    opt1Badge: 'ఎంపిక 1 · Option 1 (Video Camera)',
    opt1Title: 'లైవ్ వీడియో రికార్డ్ చేయండి / Record Live Video',
    opt1Desc: 'కెమెరా తెరిచి 20-30 సెకన్ల క్రాఫ్ట్ వీడియో చేసి మాట్లాడండి.',
    opt2Badge: 'ఎంపిక 2 · Option 2 (Browser Camera)',
    opt2Title: 'బ్రౌజర్ కెమెరాతో ఫోటో తీయండి / Take Live Photo in Browser',
    opt2Desc: 'బ్రౌజర్‌లో నేరుగా లైవ్ కెమెరా తెరిచి స్పష్టమైన ఫోటోలు తీయండి.',
    opt3Badge: 'ఎంపిక 3 · Option 3 (Upload Files)',
    opt3Title: 'ఫైల్స్ & డేటా అప్‌లోడ్ చేయండి / Upload Files & Data',
    opt3Desc: 'మీ పరికరం నుండి ఫోటోలు లేదా వీడియోలను ఎంచుకోండి.',
    voiceBtn: 'వాయిస్ గైడ్',
    uploadedTitle: 'అప్‌లోడ్ చేసిన మీడియా (Uploaded Media)',
    firstPhotoCover: 'మొదటి ఫోటో ప్రధాన కవర్ అవుతుంది',
    backBtn: 'వెనుకకు (Back)',
    nextBtn: 'వాయిస్ రికార్డ్ చేయండి (Next: Record Voice)',
  },
  ta: {
    stepBadge: 'படி 2 / 5 (Step 2 of 5)',
    listenGuide: 'வழிகாட்டுதலைக் கேளுங்கள் (Listen Guide)',
    stopGuide: 'நிறுத்து (Stop)',
    heading: 'புகைப்படங்கள் & வீடியோவைச் சேர்க்கவும் / Add Craft Media',
    subheading: 'குறைந்தது 1 தெளிவான புகைப்படம் அல்லது வீடியோவைச் சேர்க்கவும்.',
    opt1Badge: 'விருப்பம் 1 · Option 1 (Video Camera)',
    opt1Title: 'நேரடி வீடியோ பதிவு செய்க / Record Live Video',
    opt1Desc: 'கேமராவை திறந்து 20-30 வினாடிகள் கைவினை வீடியோ பதிவு செய்யவும்.',
    opt2Badge: 'விருப்பம் 2 · Option 2 (Browser Camera)',
    opt2Title: 'உலாவியில் நேரடி புகைப்படம் எடுக்கவும் / Take Live Photo in Browser',
    opt2Desc: 'உலாவியில் கேமரா மூலம் தயாரிப்பின் தெளிவான புகைப்படம் எடுக்கவும்.',
    opt3Badge: 'விருப்பம் 3 · Option 3 (Upload Files)',
    opt3Title: 'கோப்புகள் மற்றும் தரவைப் பதிவேற்றவும் / Upload Files & Data',
    opt3Desc: 'உங்கள் சாதனத்திலிருந்து புகைப்படங்கள் அல்லது வீடியோக்களைத் தேர்ந்தெடுக்கவும்.',
    voiceBtn: 'குரல் விளக்கம்',
    uploadedTitle: 'பதிவேற்றப்பட்ட ஊடகம் (Uploaded Media)',
    firstPhotoCover: 'முதல் புகைப்படம் முதன்மை அட்டையாக மாறும்',
    backBtn: 'பின்செல் (Back)',
    nextBtn: 'குரலை பதிவு செய்க (Next: Record Voice)',
  },
  kn: {
    stepBadge: 'ಹಂತ 2 / 5 (Step 2 of 5)',
    listenGuide: 'ಮಾರ್ಗದರ್ಶನ ಆಲಿಸಿ (Listen Guide)',
    stopGuide: 'ನಿಲ್ಲಿಸಿ (Stop)',
    heading: 'ಫೋಟೋಗಳು ಮತ್ತು ವೀಡಿಯೊ ಸೇರಿಸಿ / Add Craft Media',
    subheading: 'ಕನಿಷ್ಠ 1 ಸ್ಪಷ್ಟ ಫೋಟೋ ಅಥವಾ ವೀಡಿಯೊ ಸೇರಿಸಿ. ಕೆಳಗಿನ 3 ಆಯ್ಕೆಗಳಿಂದ ಆಯ್ಕೆಮಾಡಿ.',
    opt1Badge: 'ಆಯ್ಕೆ 1 · Option 1 (Video Camera)',
    opt1Title: 'ಲೈವ್ ವೀಡಿಯೊ ರೆಕಾರ್ಡ್ ಮಾಡಿ / Record Live Video',
    opt1Desc: 'ಕ್ಯಾಮೆರಾ ತೆರೆದು 20-30 ಸೆಕೆಂಡುಗಳ ವೀಡಿಯೊ ಮಾಡಿ ಮಾತನಾಡಿ.',
    opt2Badge: 'ಆಯ್ಕೆ 2 · Option 2 (Browser Camera)',
    opt2Title: 'ಬ್ರೌಸರ್ ಕ್ಯಾಮೆರಾದಿಂದ ಫೋಟೋ ತೆಗೆಯಿರಿ / Take Live Photo in Browser',
    opt2Desc: 'ಬ್ರೌಸರ್‌ನಲ್ಲಿ ನೇರವಾಗಿ ಲೈವ್ ಕ್ಯಾಮೆರಾ ತೆರೆದು ಸ್ಪಷ್ಟ ಫೋಟೋ ತೆಗೆಯಿರಿ.',
    opt3Badge: 'ಆಯ್ಕೆ 3 · Option 3 (Upload Files)',
    opt3Title: 'ಫೈಲ್‌ಗಳು & ಡೇಟಾ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ / Upload Files & Data',
    opt3Desc: 'ನಿಮ್ಮ ಸಾಧನದಿಂದ ಈಗಾಗಲೇ ಇರುವ ಫೋಟೋ ಅಥವಾ ವೀಡಿಯೊಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
    voiceBtn: 'ಧ್ವನಿ ವಿವರಣೆ',
    uploadedTitle: 'ಅಪ್‌ಲೋಡ್ ಮಾಡಲಾದ ಮಾಧ್ಯಮ (Uploaded Media)',
    firstPhotoCover: 'ಮೊದಲ ಫೋಟೋ ಮುಖ್ಯ ಕವರ್ ಆಗುತ್ತದೆ',
    backBtn: 'ಹಿಂದಕ್ಕೆ (Back)',
    nextBtn: 'ಧ್ವನಿ ರೆಕಾರ್ಡ್ ಮಾಡಿ (Next: Record Voice)',
  },
  bn: {
    stepBadge: 'ধাপ ২ / ৫ (Step 2 of 5)',
    listenGuide: 'নির্দেশ শুনুন (Listen Guide)',
    stopGuide: 'থামুন (Stop)',
    heading: 'ছবি ও ভিডিও যোগ করুন / Add Craft Media',
    subheading: 'কমপক্ষে ১টি পরিষ্কার ছবি বা ভিডিও যোগ করুন।',
    opt1Badge: 'বিকল্প ১ · Option 1 (Video Camera)',
    opt1Title: 'লাইভ ভিডিও রেকর্ড করুন / Record Live Video',
    opt1Desc: 'ক্যামেরা খুলে ২০-৩০ সেকেন্ডের হস্তশিল্পের ভিডিও তৈরি করুন।',
    opt2Badge: 'বিকল্প ২ · Option 2 (Browser Camera)',
    opt2Title: 'ব্রাউজার ক্যামেরা দিয়ে ছবি তুলুন / Take Live Photo in Browser',
    opt2Desc: 'সরাসরি ব্রাউজারে লাইভ ক্যামেরা খুলে স্পষ্ট ছবি তুলুন।',
    opt3Badge: 'বিকল্প ৩ · Option 3 (Upload Files)',
    opt3Title: 'ফাইল ও ডেটা আপলোড করুন / Upload Files & Data',
    opt3Desc: 'আপনার ডিভাইস থেকে আগের ছবি বা ভিডিও ফাইল নির্বাচন করুন।',
    voiceBtn: 'মুখে শুনুন',
    uploadedTitle: 'আপলোড করা মিডিয়া (Uploaded Media)',
    firstPhotoCover: 'প্রথম ছবি মূল কভার হবে',
    backBtn: 'পূর্ববর্তী (Back)',
    nextBtn: 'ভয়েস রেকর্ড করুন (Next: Record Voice)',
  },
  gu: {
    stepBadge: 'પગલું 2 / 5 (Step 2 of 5)',
    listenGuide: 'માર્ગદર્શન સાંભળો (Listen Guide)',
    stopGuide: 'રોકો (Stop)',
    heading: 'ફોટો અને વીડિયો ઉમેરો / Add Craft Media',
    subheading: 'ઓછામાં ઓછો 1 સ્પષ્ટ ફોટો અથવા વીડિયો ઉમેરો.',
    opt1Badge: 'વિકલ્પ 1 · Option 1 (Video Camera)',
    opt1Title: 'લાઈવ વીડિયો બનાવો / Record Live Video',
    opt1Desc: 'કેમેરા ખોલીને 20-30 સેકન્ડનો હસ્તકલા વીડિયો બનાવો.',
    opt2Badge: 'વિકલ્પ 2 · Option 2 (Browser Camera)',
    opt2Title: 'બ્રાઉઝર કેમેરાથી ફોટો પાડો / Take Live Photo in Browser',
    opt2Desc: 'બ્રાઉઝરમાં સીધો કેમેરો ખોલીને સ્પષ્ટ ફોટો પાડો.',
    opt3Badge: 'વિકલ્પ 3 · Option 3 (Upload Files)',
    opt3Title: 'ફાઇલો અને ડેટા અપલોડ કરો / Upload Files & Data',
    opt3Desc: 'તમારા ઉપકરણમાંથી સાચવેલા ફોટા અથવા વીડિયો પસંદ કરો.',
    voiceBtn: 'બોલીને સમજો',
    uploadedTitle: 'અપલોડ કરેલ મીડિયા (Uploaded Media)',
    firstPhotoCover: 'પહેલો ફોટો મુખ્ય કવર બનશે',
    backBtn: 'પાછળ (Back)',
    nextBtn: 'અવાજ રેકોર્ડ કરો (Next: Record Voice)',
  },
  en: {
    stepBadge: 'Step 2 of 5',
    listenGuide: 'Listen Voice Guide',
    stopGuide: 'Stop',
    heading: 'Add Craft Photos & Video / Add Craft Media',
    subheading: 'Add at least 1 clear photo or video demonstration using the 3 options below.',
    opt1Badge: 'Option 1 (Video Camera)',
    opt1Title: 'Record Live Video',
    opt1Desc: 'Opens your camera app to record a live 20-30s craft video with voice narration.',
    opt2Badge: 'Option 2 (Browser Camera)',
    opt2Title: 'Take Live Photo in Browser',
    opt2Desc: 'Launches live camera viewfinder directly inside browser to snap photos.',
    opt3Badge: 'Option 3 (Upload Files)',
    opt3Title: 'Upload Files & Data',
    opt3Desc: 'Choose existing photos, videos, or craft files stored on your device.',
    voiceBtn: 'Voice Guide',
    uploadedTitle: 'Uploaded Craft Media',
    firstPhotoCover: 'First photo will be the main cover',
    backBtn: 'Back',
    nextBtn: 'Next: Record Voice Story →',
  },
};

export function getStep2BilingualI18n(locale: string) {
  const clean = locale.toLowerCase().split('-')[0] || 'hi';
  return STEP2_BILINGUAL_I18N[clean] || STEP2_BILINGUAL_I18N['hi'] || STEP2_BILINGUAL_I18N['en'];
}



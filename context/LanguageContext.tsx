
import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    home: "Home",
    inquiries: "Inquiries",
    post: "Post",
    saved: "Saved",
    profile: "Profile",
    search_placeholder: "Search or try AI...",
    search_placeholder_offline: "Search local rooms...",
    properties_found: "Properties Found",
    reset: "Reset",
    sort_by: "Sort By",
    price_range: "Price Range",
    apply_filters: "Apply Filters",
    all: "All",
    rating: "Rating",
    price_low: "Price: Low",
    price_high: "Price: High",
    post_listing: "Post Listing",
    property_details: "Property Details",
    listing_title: "Listing Title",
    location_placeholder: "Location (City, Area)",
    monthly_rent: "Monthly Rent",
    contact_info: "Contact Information",
    mobile_number: "Mobile Number",
    description: "Description",
    ai_generate: "AI Generate",
    amenities: "Amenities",
    upload_listing: "Upload Listing",
    save_locally: "Save Locally",
    privacy_controls: "Privacy Controls",
    language: "Language",
    guest_user: "Guest User",
    call_owner: "Call Owner",
    chat: "Chat",
    verified_owner: "Verified Owner",
    regard_msg: "Regarding",
    reply_now: "Reply Now",
    view_thread: "View Thread",
    no_saved: "No saved rooms yet",
    start_exploring: "Start Exploring",
    working_offline: "Working Offline - Some features limited",
    share_listing: "Share Listing",
    copy_link: "Copy Link",
    more_options: "More Options",
    edit_name: "Edit Name",
    save_name: "Save Name",
    welcome_back: "Welcome back",
    ad_blocker: "Smart Ad Blocker",
    ad_blocker_on: "Ad-Free Mode: Active",
    ad_blocker_off: "Showing All Listings",
    organic_only: "Organic Results Only",
    share_app: "Share MeraRoom",
    invite_friends: "Invite Friends",
    app_share_msg: "Find your perfect room in Pakistan with MeraRoom! 🏠 ✨",
    link_copied: "Link copied to clipboard!",
    github_deploy: "GitHub Deployment",
    github_user: "GitHub Username",
    generated_url: "Generated URL",
    deploy_ready: "Project is ready for GitHub upload!",
    copy_repo_info: "Copy Repo Metadata"
  },
  hi: {
    home: "होम",
    inquiries: "पूछताछ",
    post: "पोस्ट",
    saved: "पसंदीदा",
    profile: "प्रोफ़ाइल",
    search_placeholder: "खोजें या AI से पूछें...",
    search_placeholder_offline: "स्थानीय कमरे खोजें...",
    properties_found: "संपत्तियां मिलीं",
    reset: "रीसेट",
    sort_by: "क्रमबद्ध करें",
    price_range: "कीमत सीमा",
    apply_filters: "फिल्टर लागू करें",
    all: "सभी",
    rating: "रेटिंग",
    price_low: "कीमत: कम",
    price_high: "कीमत: अधिक",
    post_listing: "विज्ञापन डालें",
    property_details: "संपत्ति विवरण",
    listing_title: "विज्ञापन का शीर्षक",
    location_placeholder: "स्थान (शहर, क्षेत्र)",
    monthly_rent: "मासिक किराया",
    contact_info: "संपर्क जानकारी",
    mobile_number: "मोबाइल नंबर",
    description: "विवरण",
    ai_generate: "AI से लिखें",
    amenities: "सुविधाएं",
    upload_listing: "विज्ञापन अपलोड करें",
    save_locally: "लोकल सेव करें",
    privacy_controls: "गोपनीयता नियंत्रण",
    language: "भाषा (Language)",
    guest_user: "अतिथि उपयोगकर्ता",
    call_owner: "मालिक को कॉल करें",
    chat: "चैट करें",
    verified_owner: "सत्यापित मालिक",
    regard_msg: "के बारे में",
    reply_now: "अभी जवाब दें",
    view_thread: "बातचीत देखें",
    no_saved: "अभी तक कोई पसंदीदा नहीं",
    start_exploring: "खोजना शुरू करें",
    working_offline: "ऑफ़लाइन मोड - कुछ सुविधाएँ सीमित हैं",
    share_listing: "विज्ञापन साझा करें",
    copy_link: "लिंक कॉपी करें",
    more_options: "अधिक विकल्प",
    edit_name: "नाम बदलें",
    save_name: "सहेजें",
    welcome_back: "स्वागत है",
    ad_blocker: "स्मार्ट एड ब्लॉकर",
    ad_blocker_on: "विज्ञापन-मुक्त मोड: सक्रिय",
    ad_blocker_off: "सभी विज्ञापन दिखा रहे हैं",
    organic_only: "केवल ऑर्गेनिक परिणाम",
    share_app: "MeraRoom साझा करें",
    invite_friends: "दोस्तों को आमंत्रित करें",
    app_share_msg: "MeraRoom के साथ पाकिस्तान में अपना पसंदीदा कमरा खोजें! 🏠 ✨",
    link_copied: "लिंक कॉपी हो गया!",
    github_deploy: "गिटहब पर डालें",
    github_user: "गिटहब यूजरनेम",
    generated_url: "जेनरेट किया गया लिंक",
    deploy_ready: "प्रोजेक्ट गिटहब अपलोड के लिए तैयार है!",
    copy_repo_info: "रेपो डेटा कॉपी करें"
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('app_lang') as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('app_lang', lang);
  };

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};

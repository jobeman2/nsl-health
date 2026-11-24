export interface HealthCenter {
  id: string;
  nameAm: string;
  nameEn: string;
  woreda: string;
  type: 'PRIMARY_HC' | 'REFERRAL_HOSPITAL' | 'SPECIALTY_CLINIC';
  location: string;
  phone: string;
  cbhiDeskContact: string;
  openHours: string;
  coveredServices: string[];
  referralDestination: string;
}

export const NSL_FACILITIES: HealthCenter[] = [
  {
    id: 'hc-01',
    nameAm: 'ንፋስ ስልክ ጤና ጣቢያ',
    nameEn: 'Nifas Silk Health Center',
    woreda: 'Woreda 03 (ወረዳ 03)',
    type: 'PRIMARY_HC',
    location: 'Mekanisa, near St. Michael Church',
    phone: '011 442 1890',
    cbhiDeskContact: '0911 88 22 11 (Ato Girma)',
    openHours: '24/7 Emergency & OPD (8:30 AM - 5:30 PM)',
    coveredServices: ['OPD Adult & Pediatric', 'Maternity / Delivery', 'EPI Immunization', 'Pharmacy & Lab', 'TB/HIV Care', 'Dental'],
    referralDestination: 'ALERT Trauma Hospital (አለርት ሆስፒታል)',
  },
  {
    id: 'hc-02',
    nameAm: 'ጀሞ 1 ጤና ጣቢያ',
    nameEn: 'Jemo 1 Health Center',
    woreda: 'Woreda 09 (ወረዳ 09)',
    type: 'PRIMARY_HC',
    location: 'Jemo 1 Condominium, Gate 3',
    phone: '011 471 0932',
    cbhiDeskContact: '0922 45 67 89 (Sr. Tigist)',
    openHours: '24/7 Maternity & Emergency, OPD Mon-Sat',
    coveredServices: ['General OPD', 'Ultrasound Screening', 'Child Health', 'Chronic NCD Care (Diabetes/Hypertension)', 'Pharmacy'],
    referralDestination: 'Zewditu Memorial Hospital (ዘውዲቱ ሆስፒታል)',
  },
  {
    id: 'hc-03',
    nameAm: 'ጎፋ ማዞሪያ ጤና ጣቢያ',
    nameEn: 'Gofa Mazoria Health Center',
    woreda: 'Woreda 01 (ወረዳ 01)',
    type: 'PRIMARY_HC',
    location: 'Gofa Mazoria, Commercial Strip',
    phone: '011 440 2211',
    cbhiDeskContact: '0931 12 34 56 (W/ro Helen)',
    openHours: '8:30 AM - 5:30 PM (Emergency 24/7)',
    coveredServices: ['Primary Consultation', 'Family Planning', 'Laboratory', 'CBHI Direct Drug Dispensation'],
    referralDestination: 'Tirunesh Beijing General Hospital',
  },
  {
    id: 'hc-04',
    nameAm: 'ኃይሌ ጋርመንት ጤና ጣቢያ',
    nameEn: 'Haile Garment Health Center',
    woreda: 'Woreda 12 (ወረዳ 12)',
    type: 'PRIMARY_HC',
    location: 'Haile Garment, Industry Zone',
    phone: '011 471 8844',
    cbhiDeskContact: '0912 77 99 00 (Ato Belete)',
    openHours: '24 Hours',
    coveredServices: ['Emergency Trauma Care', 'Maternity', 'Inpatient Observation', 'Full CBHI Formulary Lab'],
    referralDestination: 'ALERT Specialized Hospital',
  },
  {
    id: 'hc-05',
    nameAm: 'ላፍቶ ጤና ጣቢያ',
    nameEn: 'Lafto Health Center',
    woreda: 'Woreda 05 (ወረዳ 05)',
    type: 'PRIMARY_HC',
    location: 'South West Lafto Area',
    phone: '011 443 0019',
    cbhiDeskContact: '0913 22 44 66 (Sr. Meseret)',
    openHours: '8:30 AM - 5:30 PM',
    coveredServices: ['General Medicine', 'Pediatrics', 'Antenatal Care', 'Standard Diagnostics'],
    referralDestination: 'St. Paul Millennium Medical College',
  },
  {
    id: 'hc-06',
    nameAm: 'አለርት ስፔሻላይዝድ ሆስፒታል (የሪፈራል ማዕከል)',
    nameEn: 'ALERT Specialized Hospital (Referral)',
    woreda: 'Woreda 04 (Liaison Partner)',
    type: 'REFERRAL_HOSPITAL',
    location: 'Zenebework / ALERT Hospital Road',
    phone: '011 321 1345',
    cbhiDeskContact: '011 321 8899 (CBHI Liaison Office)',
    openHours: '24/7 Tertiary Emergency & Inpatient',
    coveredServices: ['Complex Surgeries', 'Specialized Dermatology & Orthopedics', 'ICU Care', 'CT/MRI with CBHI Approval'],
    referralDestination: 'Direct Tertiary Center for NSL Subcity',
  },
];

export const COVERED_SERVICES_LIST = [
  {
    categoryAm: 'የተመላላሽ ታካሚ ህክምና (Outpatient OPD)',
    categoryEn: 'Outpatient Consultation & Diagnosis',
    coverage: '100% Free at Primary Health Center',
    details: 'General medical examination, pediatric triage, chronic illness follow-up (Diabetes, Hypertension, Asthma).',
    icon: 'medkit-outline',
  },
  {
    categoryAm: 'የወሊድ እና የህጻናት እንክብካቤ (Maternity & EPI)',
    categoryEn: 'Maternal, Neonatal & Child Care',
    coverage: '100% Covered (Zero Copay)',
    details: 'Antenatal care (ANC), skilled delivery, postnatal care (PNC), and comprehensive child immunizations.',
    icon: 'heart-outline',
  },
  {
    categoryAm: 'መሰረታዊ የመድሃኒት አቅርቦት (Essential Formulary)',
    categoryEn: 'Covered Pharmacy & Medications',
    coverage: '100% at Facility / CBHI Revolving Fund',
    details: 'All essential national medicines list including antibiotics, cardiovascular drugs, painkillers, and insulin.',
    icon: 'flask-outline',
  },
  {
    categoryAm: 'የላቦራቶሪ እና የምርመራ አገልግሎት (Lab Diagnostics)',
    categoryEn: 'Clinical Laboratory & Imaging',
    coverage: 'Covered with Clinic Doctor Referral',
    details: 'Complete Blood Count (CBC), urinalysis, stool exam, lipid panel, X-ray, and ultrasound examinations.',
    icon: 'analytics-outline',
  },
  {
    categoryAm: 'የሪፈራል እና የቀዶ ህክምና (Referral Hospitalization)',
    categoryEn: 'Inpatient & Surgical Hospitalization',
    coverage: 'Covered upon formal Health Center Referral slip',
    details: 'Hospital bed, emergency and elective surgical procedures at ALERT Hospital and Tirunesh Beijing.',
    icon: 'git-network-outline',
  },
];

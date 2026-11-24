import { create } from 'zustand';
import { CBHIMember, ClinicVisitVerification } from '@/services/api';

export type AppMode = 'citizen' | 'clinic_staff';

interface CBHIState {
  appMode: AppMode;
  setAppMode: (mode: AppMode) => void;

  member: CBHIMember;
  setMember: (member: CBHIMember) => void;
  selectDemoProfile: (type: 'active' | 'subsidized' | 'expired') => void;

  verificationHistory: ClinicVisitVerification[];
  recordVerification: (record: ClinicVisitVerification) => void;

  renewMembership: (paymentMethod: 'TELEBIRR' | 'CBE_BIRR') => Promise<boolean>;
  isRenewing: boolean;
}

const DEMO_MEMBERS: Record<'active' | 'subsidized' | 'expired', CBHIMember> = {
  active: {
    id: 'm-01',
    memberId: 'NSL-CBHI-2026-08492',
    fullNameAm: 'አበበች ታደሰ በቀለ',
    fullNameEn: 'Abebech Tadesse Bekele',
    gender: 'F',
    age: 36,
    phone: '0911 23 45 67',
    woreda: 'Woreda 03 (ወረዳ 03)',
    kebeleOrZone: 'Zone 02, Block 14',
    houseNo: '14/892',
    policyType: 'COMMUNITY',
    policyStatus: 'ACTIVE',
    validFrom: '2026-01-01',
    validUntil: '2026-12-31',
    contributionAmountETB: 750,
    lastPaymentRef: 'TB-894102948',
    lastPaymentDate: '2026-01-05',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
    assignedHealthCenter: {
      nameAm: 'ንፋስ ስልክ ጤና ጣቢያ',
      nameEn: 'Nifas Silk Health Center',
      woreda: '03',
      tier: 'Primary Health Center (መሰረታዊ ጤና ጣቢያ)',
      phone: '011 442 1890',
    },
    dependents: [
      {
        id: 'dep-1',
        nameAm: 'ሙሉጌታ ከበደ ወልዴ (ባለቤት)',
        nameEn: 'Mulugeta Kebede Wolde (Spouse)',
        relationship: 'SPOUSE',
        age: 39,
        gender: 'M',
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
      },
      {
        id: 'dep-2',
        nameAm: 'ኤልዳና ሙሉጌታ ከበደ (ልጅ)',
        nameEn: 'Eldana Mulugeta Kebede (Child)',
        relationship: 'CHILD',
        age: 9,
        gender: 'F',
        photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80',
      },
      {
        id: 'dep-3',
        nameAm: 'ናሆም ሙሉጌታ ከበደ (ልጅ)',
        nameEn: 'Nahom Mulugeta Kebede (Child)',
        relationship: 'CHILD',
        age: 5,
        gender: 'M',
        photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&q=80',
      },
    ],
  },
  subsidized: {
    id: 'm-02',
    memberId: 'NSL-CBHI-2026-01934',
    fullNameAm: 'ጫልቱ ገመቹ ቦሩ',
    fullNameEn: 'Chaltu Gemechu Boru',
    gender: 'F',
    age: 52,
    phone: '0922 98 76 54',
    woreda: 'Woreda 01 (ወረዳ 01)',
    kebeleOrZone: 'Zone 01, Indigent Support Cluster',
    houseNo: '01/45',
    policyType: 'INDIGENT_SUBSIDIZED',
    policyStatus: 'ACTIVE',
    validFrom: '2026-01-01',
    validUntil: '2026-12-31',
    contributionAmountETB: 0,
    lastPaymentRef: 'GOV-SUBSIDY-NSL-01',
    lastPaymentDate: '2026-01-01',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80',
    assignedHealthCenter: {
      nameAm: 'ጎፋ ማዞሪያ ጤና ጣቢያ',
      nameEn: 'Gofa Mazoria Health Center',
      woreda: '01',
      tier: 'Primary Health Center',
      phone: '011 440 2211',
    },
    dependents: [
      {
        id: 'dep-4',
        nameAm: 'ቶሎሳ ገመቹ (ጥገኛ)',
        nameEn: 'Tolosa Gemechu (Dependent)',
        relationship: 'PARENT_DEPENDENT',
        age: 74,
        gender: 'M',
      },
    ],
  },
  expired: {
    id: 'm-03',
    memberId: 'NSL-CBHI-2025-11029',
    fullNameAm: 'ዳዊት ዮሐንስ ተፈራ',
    fullNameEn: 'Dawit Yohannes Tefera',
    gender: 'M',
    age: 41,
    phone: '0933 11 22 33',
    woreda: 'Woreda 09 (ወረዳ 09 - ጀሞ)',
    kebeleOrZone: 'Zone 03',
    houseNo: 'Jemo 09/302',
    policyType: 'COMMUNITY',
    policyStatus: 'EXPIRED',
    validFrom: '2025-01-01',
    validUntil: '2025-12-31',
    contributionAmountETB: 750,
    lastPaymentRef: 'TB-7629104',
    lastPaymentDate: '2025-01-02',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
    assignedHealthCenter: {
      nameAm: 'ጀሞ ጤና ጣቢያ',
      nameEn: 'Jemo 1 Health Center',
      woreda: '09',
      tier: 'Primary Health Center',
      phone: '011 471 0932',
    },
    dependents: [
      {
        id: 'dep-5',
        nameAm: 'ሰላማዊት ታፈሰ (ባለቤት)',
        nameEn: 'Selamawit Tafesse (Spouse)',
        relationship: 'SPOUSE',
        age: 38,
        gender: 'F',
      },
    ],
  },
};

export const useCBHIStore = create<CBHIState>((set, get) => ({
  appMode: 'citizen',
  setAppMode: (mode) => set({ appMode: mode }),

  member: DEMO_MEMBERS.active,
  setMember: (member) => set({ member }),

  selectDemoProfile: (type) => {
    set({ member: DEMO_MEMBERS[type] });
  },

  verificationHistory: [
    {
      verificationId: 'VRF-98210',
      verifiedAt: '2026-11-23 10:14 AM',
      memberId: 'NSL-CBHI-2026-08492',
      memberName: 'አበበች ታደሰ በቀለ',
      clinicName: 'ንፋስ ስልክ ጤና ጣቢያ',
      woreda: '03',
      status: 'ELIGIBLE',
      triageNotes: 'OPD General Consultation, Copay: 0 ETB (CBHI 100% Covered)',
    },
    {
      verificationId: 'VRF-98188',
      verifiedAt: '2026-11-22 03:45 PM',
      memberId: 'NSL-CBHI-2026-01934',
      memberName: 'ጫልቱ ገመቹ ቦሩ',
      clinicName: 'ጎፋ ማዞሪያ ጤና ጣቢያ',
      woreda: '01',
      status: 'ELIGIBLE',
      triageNotes: 'Maternal Care & Pharmacy Refill, Subsidized Indigent Card',
    },
  ],

  recordVerification: (record) => {
    set((state) => ({
      verificationHistory: [record, ...state.verificationHistory],
    }));
  },

  isRenewing: false,
  renewMembership: async (paymentMethod) => {
    set({ isRenewing: true });
    // Simulate payment transaction with Telebirr / CBE Birr
    await new Promise((resolve) => setTimeout(resolve, 1400));
    set((state) => ({
      isRenewing: false,
      member: {
        ...state.member,
        policyStatus: 'ACTIVE',
        validUntil: '2026-12-31',
        lastPaymentRef: `${paymentMethod === 'TELEBIRR' ? 'TB' : 'CBE'}-${Date.now().toString().slice(-8)}`,
        lastPaymentDate: new Date().toISOString().split('T')[0],
      },
    }));
    return true;
  },
}));

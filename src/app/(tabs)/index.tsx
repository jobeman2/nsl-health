import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Palette, Fonts, MUNICIPAL_HEADER } from '@/constants/theme';
import { useCBHIStore } from '@/stores/cbhi-store';

export default function DigitalCardScreen() {
  const {
    member,
    selectDemoProfile,
    renewMembership,
    isRenewing,
  } = useCBHIStore();

  const [qrTimestamp, setQrTimestamp] = useState<number>(Date.now());
  const [showRenewalModal, setShowRenewalModal] = useState<boolean>(false);
  const [selectedDependent, setSelectedDependent] = useState<any | null>(null);

  // Dynamic rotating hash for anti-fraud QR code
  useEffect(() => {
    const timer = setInterval(() => {
      setQrTimestamp(Date.now());
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  const qrData = JSON.stringify({
    scheme: 'NSL-CBHI',
    memberId: member.memberId,
    name: member.fullNameEn,
    woreda: member.woreda,
    status: member.policyStatus,
    expires: member.validUntil,
    ts: qrTimestamp,
    sig: `NSL-SEAL-${member.memberId.slice(-4)}-${qrTimestamp.toString().slice(-4)}`,
  });

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=4&data=${encodeURIComponent(
    qrData
  )}`;

  const isSubsidized = member.policyType === 'INDIGENT_SUBSIDIZED';
  const isExpired = member.policyStatus === 'EXPIRED';

  const handleRenew = async (channel: 'TELEBIRR' | 'CBE_BIRR') => {
    try {
      await renewMembership(channel);
      setShowRenewalModal(false);
      Alert.alert(
        'የአባልነት ክፍያ ተከናውኗል!',
        `በ ${channel === 'TELEBIRR' ? 'ቴሌብር (telebirr)' : 'ሲቢኢ ብር (CBE Birr)'} በኩል የ 750 ብር ክፍያ ተረጋግጧል። አባልነትዎ እስከ ታህሳስ 2026 ታድሷል።`,
        [{ text: 'እሺ', style: 'default' }]
      );
    } catch {
      Alert.alert('ስህተት', 'ክፍያውን ማጠናቀቅ አልተቻለም። እባክዎ እንደገና ይሞክሩ።');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Top Municipal Subcity Branding */}
      <View style={styles.topBar}>
        <View style={styles.topBarLeft}>
          <View style={styles.flagBadge}>
            <View style={[styles.flagStrip, { backgroundColor: '#059669' }]} />
            <View style={[styles.flagStrip, { backgroundColor: '#FBBF24' }]} />
            <View style={[styles.flagStrip, { backgroundColor: '#DC2626' }]} />
          </View>
          <View>
            <Text style={styles.subcityAmText}>{MUNICIPAL_HEADER.subcityAm}</Text>
            <Text style={styles.officeEnText}>Health Office • CBHI Digital Card</Text>
          </View>
        </View>

        <View style={styles.offlinePill}>
          <Ionicons name="shield-checkmark" size={13} color="#10B981" />
          <Text style={styles.offlinePillText}>Offline Verified</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Quick Demo Switcher for Evaluation */}
        <View style={styles.demoSwitcher}>
          <Text style={styles.demoSwitcherLabel}>የአባልነት ሁኔታ ይምረጡ (Demo Persona):</Text>
          <View style={styles.demoRow}>
            <TouchableOpacity
              style={[
                styles.demoBtn,
                !isSubsidized && !isExpired && styles.demoBtnActive,
              ]}
              onPress={() => selectDemoProfile('active')}
            >
              <Text
                style={[
                  styles.demoBtnText,
                  !isSubsidized && !isExpired && styles.demoBtnTextActive,
                ]}
              >
                አክቲቭ (750 ብር)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.demoBtn,
                isSubsidized && styles.demoBtnActiveSubsidized,
              ]}
              onPress={() => selectDemoProfile('subsidized')}
            >
              <Text
                style={[
                  styles.demoBtnText,
                  isSubsidized && styles.demoBtnTextActiveSubsidized,
                ]}
              >
                100% ድጎማ (ደሃ)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.demoBtn, isExpired && styles.demoBtnActiveExpired]}
              onPress={() => selectDemoProfile('expired')}
            >
              <Text
                style={[
                  styles.demoBtnText,
                  isExpired && styles.demoBtnTextActiveExpired,
                ]}
              >
                ያለቀበት (Renew)
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* =========================================================================
            PRIMARY DIGITAL CBHI CARD
            ========================================================================= */}
        <View
          style={[
            styles.cardWrapper,
            isSubsidized && styles.cardWrapperSubsidized,
            isExpired && styles.cardWrapperExpired,
          ]}
        >
          {/* Card Top Header */}
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderTitleRow}>
              <Ionicons name="medical" size={20} color="#10B981" />
              <View style={{ marginLeft: 8 }}>
                <Text style={styles.cardHeaderTitleAm}>የማህበረሰብ አቀፍ ጤና መድህን</Text>
                <Text style={styles.cardHeaderTitleEn}>COMMUNITY BASED HEALTH INSURANCE</Text>
              </View>
            </View>

            {/* Status Badge */}
            <View
              style={[
                styles.statusBadge,
                isSubsidized && styles.statusBadgeSubsidized,
                isExpired && styles.statusBadgeExpired,
              ]}
            >
              <View
                style={[
                  styles.statusDot,
                  isSubsidized && { backgroundColor: '#D97706' },
                  isExpired && { backgroundColor: '#DC2626' },
                ]}
              />
              <Text
                style={[
                  styles.statusBadgeText,
                  isSubsidized && { color: '#B45309' },
                  isExpired && { color: '#DC2626' },
                ]}
              >
                {isExpired ? 'ያለቀበት (EXPIRED)' : isSubsidized ? '100% ድጎማ (SUBSIDIZED)' : 'ጸድቋል (ACTIVE)'}
              </Text>
            </View>
          </View>

          {/* Member Details & Photo */}
          <View style={styles.cardBody}>
            <Image source={{ uri: member.photoUrl }} style={styles.memberPhoto} />
            <View style={styles.memberDetails}>
              <Text style={styles.memberNameAm}>{member.fullNameAm}</Text>
              <Text style={styles.memberNameEn}>{member.fullNameEn}</Text>

              <View style={styles.idChip}>
                <Text style={styles.idChipLabel}>መታወቂያ / ID:</Text>
                <Text style={styles.idChipVal}>{member.memberId}</Text>
              </View>

              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>ወረዳ (Woreda):</Text>
                <Text style={styles.metaVal}>{member.woreda}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>አገልግሎት የሚያበቃበት:</Text>
                <Text style={[styles.metaVal, isExpired && { color: '#EF4444', fontWeight: '700' }]}>
                  {member.validUntil}
                </Text>
              </View>
            </View>
          </View>

          {/* Dynamic Anti-Fraud QR Code Section */}
          <View style={styles.qrSection}>
            <View style={styles.qrContainer}>
              <Image source={{ uri: qrImageUrl }} style={styles.qrImage} />
            </View>
            <View style={styles.qrInfo}>
              <View style={styles.dynamicRow}>
                <View style={styles.pulseDot} />
                <Text style={styles.qrSecurityLabel}>ፀረ-ማጭበርበር ቅጽበታዊ ኮድ (Anti-Fraud)</Text>
              </View>
              <Text style={styles.qrSecurityDesc}>
                በጤና ጣቢያው ትሪያጅ ካሜራ ሲነበብ የቤተሰብ አባላትና የክፍያ ታሪክ በቀጥታ ያረጋግጣል።
              </Text>
              <Text style={styles.qrTimestampText}>
                ሲስተም ማረጋገጫ: {new Date(qrTimestamp).toLocaleTimeString()} • 15s ራስ-ሰር እድሳት
              </Text>
            </View>
          </View>

          {/* Primary Assigned Health Center */}
          <View style={styles.clinicFooter}>
            <Ionicons name="location-sharp" size={16} color="#10B981" />
            <View style={{ flex: 1, marginLeft: 6 }}>
              <Text style={styles.clinicNameAm}>{member.assignedHealthCenter.nameAm}</Text>
              <Text style={styles.clinicDetails}>
                {member.assignedHealthCenter.tier} • ስልክ: {member.assignedHealthCenter.phone}
              </Text>
            </View>
          </View>
        </View>

        {/* Expired Warning Banner & 1-Click Renewal */}
        {isExpired && (
          <View style={styles.renewBanner}>
            <Ionicons name="alert-circle" size={24} color="#DC2626" />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.renewBannerTitle}>የጤና መድህን አባልነትዎ ጊዜ አልፎበታል!</Text>
              <Text style={styles.renewBannerSub}>
                ያለክፍያ ህክምና ለማግኘት አመታዊ መዋጮዎን በቴሌብር ወይም በሲቢኢ ብር ያድሱ።
              </Text>
            </View>
            <TouchableOpacity style={styles.renewBtn} onPress={() => setShowRenewalModal(true)}>
              <Text style={styles.renewBtnText}>አሁን እደስ</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* =========================================================================
            COVERED FAMILY DEPENDENTS
            ========================================================================= */}
        <View style={styles.sectionHeaderRow}>
          <View>
            <Text style={styles.sectionTitleAm}>የተመዘገቡ የቤተሰብ አባላት (ጥገኞች)</Text>
            <Text style={styles.sectionTitleEn}>Covered Household Dependents ({member.dependents.length})</Text>
          </View>
          <View style={styles.coveredAllPill}>
            <Ionicons name="checkmark-circle" size={14} color="#059669" />
            <Text style={styles.coveredAllText}>100% ነጻ ህክምና</Text>
          </View>
        </View>

        <View style={styles.dependentsList}>
          {member.dependents.map((dep) => (
            <TouchableOpacity
              key={dep.id}
              style={styles.depCard}
              onPress={() => setSelectedDependent(dep)}
              activeOpacity={0.8}
            >
              {dep.photoUrl ? (
                <Image source={{ uri: dep.photoUrl }} style={styles.depPhoto} />
              ) : (
                <View style={styles.depAvatarFallback}>
                  <Ionicons name="person" size={22} color="#0A5C36" />
                </View>
              )}
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.depNameAm}>{dep.nameAm}</Text>
                <Text style={styles.depNameEn}>{dep.nameEn}</Text>
                <Text style={styles.depMeta}>
                  እድሜ: {dep.age} ዓመት • ጾታ: {dep.gender === 'F' ? 'ሴት' : 'ወንድ'}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Benefits Quick Strip */}
        <View style={styles.benefitsStrip}>
          <View style={styles.benefitItem}>
            <Ionicons name="bandage-outline" size={22} color="#0A5C36" />
            <Text style={styles.benefitTitle}>የመድሃኒት ሽፋን</Text>
            <Text style={styles.benefitDesc}>ሙሉ በሙሉ ነፃ</Text>
          </View>
          <View style={styles.benefitDivider} />
          <View style={styles.benefitItem}>
            <Ionicons name="flask-outline" size={22} color="#0A5C36" />
            <Text style={styles.benefitTitle}>ላቦራቶሪ / ኤክስሬይ</Text>
            <Text style={styles.benefitDesc}>በሪፈራል የተሸፈነ</Text>
          </View>
          <View style={styles.benefitDivider} />
          <View style={styles.benefitItem}>
            <Ionicons name="bed-outline" size={22} color="#0A5C36" />
            <Text style={styles.benefitTitle}>የአልጋና የቀዶ ህክምና</Text>
            <Text style={styles.benefitDesc}>በአለርት ሆስፒታል</Text>
          </View>
        </View>
      </ScrollView>

      {/* =========================================================================
          RENEWAL MODAL (Telebirr / CBE Birr)
          ========================================================================= */}
      <Modal visible={showRenewalModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitleAm}>የጤና መድህን መዋጮ ማደሻ</Text>
                <Text style={styles.modalTitleEn}>Annual Contribution Renewal (2026/27)</Text>
              </View>
              <TouchableOpacity onPress={() => setShowRenewalModal(false)}>
                <Ionicons name="close-circle" size={26} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBillBox}>
              <Text style={styles.billLabel}>አመታዊ መዋጮ (ጠቅላላ ቤተሰብ):</Text>
              <Text style={styles.billAmount}>750.00 ETB</Text>
              <Text style={styles.billHousehold}>የንፋስ ስልክ ላፍቶ ወረዳ 03 ማህበረሰብ</Text>
            </View>

            {isRenewing ? (
              <View style={styles.renewingBox}>
                <ActivityIndicator size="large" color="#0A5C36" />
                <Text style={styles.renewingText}>ከክፍያ ጌትዌይ ጋር በመገናኘት ላይ ነው...</Text>
              </View>
            ) : (
              <View style={styles.paymentMethods}>
                <TouchableOpacity
                  style={styles.telebirrBtn}
                  onPress={() => handleRenew('TELEBIRR')}
                >
                  <View style={styles.telebirrLogoPill}>
                    <Text style={styles.telebirrLogoText}>telebirr</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.paymentMethodTitle}>በቴሌብር ይክፈሉ</Text>
                    <Text style={styles.paymentMethodSub}>1-Click Direct Merchant Pin</Text>
                  </View>
                  <Ionicons name="arrow-forward" size={18} color="#0284C7" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cbeBtn}
                  onPress={() => handleRenew('CBE_BIRR')}
                >
                  <View style={styles.cbeLogoPill}>
                    <Text style={styles.cbeLogoText}>CBE</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.paymentMethodTitle}>በሲቢኢ ብር (CBE Birr)</Text>
                    <Text style={styles.paymentMethodSub}>Commercial Bank of Ethiopia</Text>
                  </View>
                  <Ionicons name="arrow-forward" size={18} color="#854D0E" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* =========================================================================
          DEPENDENT DETAILS MODAL
          ========================================================================= */}
      <Modal visible={!!selectedDependent} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitleAm}>የጥገኛ መረጃ ዝርዝር</Text>
                <Text style={styles.modalTitleEn}>Household Beneficiary Card</Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedDependent(null)}>
                <Ionicons name="close-circle" size={26} color="#64748B" />
              </TouchableOpacity>
            </View>

            {selectedDependent && (
              <View style={styles.depModalBody}>
                {selectedDependent.photoUrl ? (
                  <Image source={{ uri: selectedDependent.photoUrl }} style={styles.depModalPhoto} />
                ) : (
                  <View style={[styles.depAvatarFallback, { width: 70, height: 70, borderRadius: 35 }]}>
                    <Ionicons name="person" size={36} color="#0A5C36" />
                  </View>
                )}
                <Text style={styles.depModalName}>{selectedDependent.nameAm}</Text>
                <Text style={styles.depModalNameEn}>{selectedDependent.nameEn}</Text>

                <View style={styles.depBadgeRow}>
                  <View style={styles.depPill}>
                    <Text style={styles.depPillText}>ዝምድና: {selectedDependent.relationship}</Text>
                  </View>
                  <View style={styles.depPill}>
                    <Text style={styles.depPillText}>እድሜ: {selectedDependent.age} ዓመት</Text>
                  </View>
                </View>

                <View style={styles.depCheckAlert}>
                  <Ionicons name="shield-checkmark" size={18} color="#059669" />
                  <Text style={styles.depCheckText}>
                    በዋናው አባል መታወቂያ ({member.memberId}) ስር በንፋስ ስልክ ጤና ጣቢያ ነፃ ህክምና እንዲያገኝ የተፈቀደለት ነው።
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flagBadge: {
    width: 14,
    height: 28,
    borderRadius: 3,
    overflow: 'hidden',
    marginRight: 10,
    justifyContent: 'space-between',
  },
  flagStrip: {
    flex: 1,
    width: '100%',
  },
  subcityAmText: {
    fontFamily: Fonts.bold,
    fontSize: 13,
    color: '#0F172A',
  },
  officeEnText: {
    fontFamily: Fonts.regular,
    fontSize: 11,
    color: '#64748B',
  },
  offlinePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    gap: 4,
  },
  offlinePillText: {
    fontFamily: Fonts.medium,
    fontSize: 10,
    color: '#047857',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 36,
  },
  demoSwitcher: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  demoSwitcherLabel: {
    fontFamily: Fonts.medium,
    fontSize: 11,
    color: '#64748B',
    marginBottom: 6,
  },
  demoRow: {
    flexDirection: 'row',
    gap: 6,
  },
  demoBtn: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  demoBtnActive: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  demoBtnActiveSubsidized: {
    backgroundColor: '#FEF3C7',
    borderColor: '#D97706',
  },
  demoBtnActiveExpired: {
    backgroundColor: '#FEE2E2',
    borderColor: '#DC2626',
  },
  demoBtnText: {
    fontFamily: Fonts.medium,
    fontSize: 10,
    color: '#475569',
  },
  demoBtnTextActive: {
    color: '#047857',
    fontWeight: '700',
  },
  demoBtnTextActiveSubsidized: {
    color: '#B45309',
    fontWeight: '700',
  },
  demoBtnTextActiveExpired: {
    color: '#B91C1C',
    fontWeight: '700',
  },
  cardWrapper: {
    backgroundColor: '#052E16',
    borderRadius: 18,
    padding: 18,
    shadowColor: '#0A5C36',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1.5,
    borderColor: '#10B981',
    marginBottom: 16,
  },
  cardWrapperSubsidized: {
    backgroundColor: '#3B2F04',
    borderColor: '#F59E0B',
  },
  cardWrapperExpired: {
    backgroundColor: '#3F1212',
    borderColor: '#EF4444',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.15)',
    paddingBottom: 12,
    marginBottom: 14,
  },
  cardHeaderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardHeaderTitleAm: {
    fontFamily: Fonts.bold,
    fontSize: 12,
    color: '#FFFFFF',
  },
  cardHeaderTitleEn: {
    fontFamily: Fonts.regular,
    fontSize: 8.5,
    color: '#A7F3D0',
    letterSpacing: 0.5,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 5,
  },
  statusBadgeSubsidized: {
    backgroundColor: '#FEF3C7',
  },
  statusBadgeExpired: {
    backgroundColor: '#FEE2E2',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  statusBadgeText: {
    fontFamily: Fonts.bold,
    fontSize: 10,
    color: '#047857',
  },
  cardBody: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  memberPhoto: {
    width: 76,
    height: 86,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    backgroundColor: '#CBD5E1',
  },
  memberDetails: {
    flex: 1,
    marginLeft: 14,
  },
  memberNameAm: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: '#FFFFFF',
  },
  memberNameEn: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: '#CBD5E1',
    marginBottom: 6,
  },
  idChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 6,
    alignSelf: 'flex-start',
  },
  idChipLabel: {
    fontFamily: Fonts.regular,
    fontSize: 10,
    color: '#A7F3D0',
    marginRight: 4,
  },
  idChipVal: {
    fontFamily: Fonts.bold,
    fontSize: 11,
    color: '#FFFFFF',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  metaLabel: {
    fontFamily: Fonts.regular,
    fontSize: 10.5,
    color: '#94A3B8',
  },
  metaVal: {
    fontFamily: Fonts.medium,
    fontSize: 11,
    color: '#F1F5F9',
  },
  qrSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
  },
  qrContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 4,
  },
  qrImage: {
    width: 82,
    height: 82,
  },
  qrInfo: {
    flex: 1,
    marginLeft: 12,
  },
  dynamicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 5,
  },
  qrSecurityLabel: {
    fontFamily: Fonts.bold,
    fontSize: 10,
    color: '#A7F3D0',
  },
  qrSecurityDesc: {
    fontFamily: Fonts.regular,
    fontSize: 9.5,
    color: '#E2E8F0',
    lineHeight: 13,
  },
  qrTimestampText: {
    fontFamily: Fonts.regular,
    fontSize: 8.5,
    color: '#94A3B8',
    marginTop: 4,
  },
  clinicFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    padding: 8,
    borderRadius: 8,
  },
  clinicNameAm: {
    fontFamily: Fonts.bold,
    fontSize: 12,
    color: '#FFFFFF',
  },
  clinicDetails: {
    fontFamily: Fonts.regular,
    fontSize: 10,
    color: '#CBD5E1',
  },
  renewBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  renewBannerTitle: {
    fontFamily: Fonts.bold,
    fontSize: 12,
    color: '#991B1B',
  },
  renewBannerSub: {
    fontFamily: Fonts.regular,
    fontSize: 10,
    color: '#7F1D1D',
    marginTop: 2,
  },
  renewBtn: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  renewBtnText: {
    fontFamily: Fonts.bold,
    fontSize: 11,
    color: '#FFFFFF',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 6,
  },
  sectionTitleAm: {
    fontFamily: Fonts.bold,
    fontSize: 15,
    color: '#0F172A',
  },
  sectionTitleEn: {
    fontFamily: Fonts.regular,
    fontSize: 11,
    color: '#64748B',
  },
  coveredAllPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 4,
  },
  coveredAllText: {
    fontFamily: Fonts.medium,
    fontSize: 10,
    color: '#047857',
  },
  dependentsList: {
    gap: 8,
    marginBottom: 18,
  },
  depCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  depPhoto: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E2E8F0',
  },
  depAvatarFallback: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  depNameAm: {
    fontFamily: Fonts.bold,
    fontSize: 13,
    color: '#0F172A',
  },
  depNameEn: {
    fontFamily: Fonts.regular,
    fontSize: 11,
    color: '#64748B',
  },
  depMeta: {
    fontFamily: Fonts.regular,
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },
  benefitsStrip: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  benefitItem: {
    flex: 1,
    alignItems: 'center',
    textAlign: 'center',
  },
  benefitTitle: {
    fontFamily: Fonts.bold,
    fontSize: 11,
    color: '#0F172A',
    marginTop: 6,
    textAlign: 'center',
  },
  benefitDesc: {
    fontFamily: Fonts.regular,
    fontSize: 9.5,
    color: '#10B981',
    marginTop: 2,
    textAlign: 'center',
  },
  benefitDivider: {
    width: 1,
    height: 36,
    backgroundColor: '#E2E8F0',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 36,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitleAm: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: '#0F172A',
  },
  modalTitleEn: {
    fontFamily: Fonts.regular,
    fontSize: 11,
    color: '#64748B',
  },
  modalBillBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 18,
  },
  billLabel: {
    fontFamily: Fonts.regular,
    fontSize: 11,
    color: '#64748B',
  },
  billAmount: {
    fontFamily: Fonts.bold,
    fontSize: 28,
    color: '#0A5C36',
    marginVertical: 4,
  },
  billHousehold: {
    fontFamily: Fonts.medium,
    fontSize: 11,
    color: '#0F172A',
  },
  paymentMethods: {
    gap: 10,
  },
  telebirrBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    borderRadius: 12,
    padding: 12,
  },
  telebirrLogoPill: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
  },
  telebirrLogoText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 11,
  },
  paymentMethodTitle: {
    fontFamily: Fonts.bold,
    fontSize: 13,
    color: '#0F172A',
  },
  paymentMethodSub: {
    fontFamily: Fonts.regular,
    fontSize: 10.5,
    color: '#64748B',
  },
  cbeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEFCE8',
    borderWidth: 1,
    borderColor: '#FEF08A',
    borderRadius: 12,
    padding: 12,
  },
  cbeLogoPill: {
    backgroundColor: '#854D0E',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
  },
  cbeLogoText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 11,
  },
  renewingBox: {
    paddingVertical: 28,
    alignItems: 'center',
  },
  renewingText: {
    fontFamily: Fonts.medium,
    fontSize: 12,
    color: '#0A5C36',
    marginTop: 10,
  },
  depModalBody: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  depModalPhoto: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 2,
    borderColor: '#10B981',
    marginBottom: 8,
  },
  depModalName: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: '#0F172A',
  },
  depModalNameEn: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: '#64748B',
    marginBottom: 10,
  },
  depBadgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  depPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  depPillText: {
    fontFamily: Fonts.medium,
    fontSize: 11,
    color: '#334155',
  },
  depCheckAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 10,
    padding: 10,
    gap: 8,
  },
  depCheckText: {
    flex: 1,
    fontFamily: Fonts.regular,
    fontSize: 11,
    color: '#065F46',
    lineHeight: 16,
  },
});

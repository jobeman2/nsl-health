import React, { useState } from 'react';
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
import { Fonts, Palette, MUNICIPAL_HEADER } from '@/constants/theme';
import { useCBHIStore } from '@/stores/cbhi-store';

export default function DigitalCardScreen() {
  const { member, renewMembership, isRenewing } = useCBHIStore();
  const [showRenewalModal, setShowRenewalModal] = useState<boolean>(false);
  const [selectedDependent, setSelectedDependent] = useState<any | null>(null);

  const qrData = JSON.stringify({
    scheme: 'NSL-CBHI',
    memberId: member.memberId,
    name: member.fullNameEn,
    woreda: member.woreda,
    status: member.policyStatus,
    expires: member.validUntil,
  });

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=6&data=${encodeURIComponent(
    qrData
  )}`;

  const isExpired = member.policyStatus === 'EXPIRED';
  const isSubsidized = member.policyType === 'INDIGENT_SUBSIDIZED';

  const handleRenew = async (channel: 'TELEBIRR' | 'CBE_BIRR') => {
    try {
      await renewMembership(channel);
      setShowRenewalModal(false);
      Alert.alert(
        'የአባልነት ክፍያ ተከናውኗል',
        `በ ${channel === 'TELEBIRR' ? 'ቴሌብር (telebirr)' : 'ሲቢኢ ብር (CBE Birr)'} በኩል 750.00 ብር ተከፍሏል። አባልነትዎ እስከ ታህሳስ 2026 ታድሷል።`,
        [{ text: 'እሺ' }]
      );
    } catch {
      Alert.alert('ስህተት', 'ክፍያውን ማጠናቀቅ አልተቻለም። እባክዎ እንደገና ይሞክሩ።');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Official Municipal Header */}
      <View style={styles.topBar}>
        <View style={styles.topBarLeft}>
          <View style={styles.logoBadge}>
            <Ionicons name="shield-checkmark" size={18} color="#FFFFFF" />
          </View>
          <View>
            <Text style={styles.subcityText}>{MUNICIPAL_HEADER.subcityAm}</Text>
            <Text style={styles.officeText}>የጤና ጽ/ቤት • የማህበረሰብ አቀፍ ጤና መድህን</Text>
          </View>
        </View>

        <View style={styles.statusPill}>
          <View style={[styles.statusDot, isExpired && { backgroundColor: '#DC2626' }]} />
          <Text style={[styles.statusPillText, isExpired && { color: '#DC2626' }]}>
            {isExpired ? 'ያለቀበት' : isSubsidized ? 'ድጎማ' : 'ጸድቋል'}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* =========================================================================
            MODERN ROYAL BLUE CBHI DIGITAL CARD
            ========================================================================= */}
        <View style={[styles.cardWrapper, isExpired && styles.cardWrapperExpired]}>
          {/* Card Top Title Row */}
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <Text style={styles.cardHeaderSub}>ETHIOPIAN COMMUNITY HEALTH INSURANCE</Text>
              <Text style={styles.cardHeaderTitle}>ዲጂታል የጤና መድህን ካርድ</Text>
            </View>
            <View style={styles.nationalEmblemBox}>
              <Ionicons name="medkit" size={20} color="#BFDBFE" />
            </View>
          </View>

          {/* Member Photo & Primary Information */}
          <View style={styles.cardBody}>
            <Image source={{ uri: member.photoUrl }} style={styles.memberPhoto} />
            <View style={styles.memberInfo}>
              <Text style={styles.memberNameAm}>{member.fullNameAm}</Text>
              <Text style={styles.memberNameEn}>{member.fullNameEn}</Text>

              <View style={styles.idChip}>
                <Text style={styles.idChipLabel}>ID:</Text>
                <Text style={styles.idChipVal}>{member.memberId}</Text>
              </View>

              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>ወረዳ:</Text>
                <Text style={styles.metaVal}>{member.woreda}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>የሚያበቃበት ቀን:</Text>
                <Text style={[styles.metaVal, isExpired && { color: '#FCA5A5' }]}>
                  {member.validUntil}
                </Text>
              </View>
            </View>
          </View>

          {/* QR Code Verification Section */}
          <View style={styles.qrSection}>
            <View style={styles.qrContainer}>
              <Image source={{ uri: qrImageUrl }} style={styles.qrImage} />
            </View>
            <View style={styles.qrTextCol}>
              <Text style={styles.qrTitle}>የጤና ጣቢያ ፈጣን ማረጋገጫ</Text>
              <Text style={styles.qrSubtitle}>
                በጤና ጣቢያው ትሪያጅ ወይም ፋርማሲ ሲቀርብ የታካሚውን ህጋዊ የአባልነት መረጃ በቀጥታ ያረጋግጣል።
              </Text>
              <View style={styles.verifiedRow}>
                <Ionicons name="checkmark-circle" size={14} color="#60A5FA" />
                <Text style={styles.verifiedText}>Nifas Silk Lafto CBHI Certified</Text>
              </View>
            </View>
          </View>

          {/* Primary Assigned Health Center */}
          <View style={styles.clinicFooter}>
            <Ionicons name="location" size={16} color="#93C5FD" />
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={styles.clinicName}>{member.assignedHealthCenter.nameAm}</Text>
              <Text style={styles.clinicContact}>
                {member.assignedHealthCenter.tier} • {member.assignedHealthCenter.phone}
              </Text>
            </View>
          </View>
        </View>

        {/* Expired Action Banner */}
        {isExpired && (
          <View style={styles.renewBanner}>
            <Ionicons name="alert-circle" size={24} color="#DC2626" />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.renewBannerTitle}>የአባልነት ጊዜ አልፎበታል</Text>
              <Text style={styles.renewBannerSub}>
                ያለክፍያ ህክምና ለማግኘት አመታዊ መዋጮዎን በቴሌብር ወይም በሲቢኢ ብር ያድሱ።
              </Text>
            </View>
            <TouchableOpacity style={styles.renewBtn} onPress={() => setShowRenewalModal(true)}>
              <Text style={styles.renewBtnText}>እደስ</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Quick Actions Row */}
        <View style={styles.actionGrid}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => setShowRenewalModal(true)}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIconBox, { backgroundColor: '#EFF6FF' }]}>
              <Ionicons name="wallet-outline" size={20} color="#1D4ED8" />
            </View>
            <Text style={styles.actionTitle}>መዋጮ ክፍያ</Text>
            <Text style={styles.actionSub}>Telebirr / CBE</Text>
          </TouchableOpacity>

          <View style={styles.actionCard}>
            <View style={[styles.actionIconBox, { backgroundColor: '#F0FDF4' }]}>
              <Ionicons name="medical-outline" size={20} color="#059669" />
            </View>
            <Text style={styles.actionTitle}>የህክምና ሽፋን</Text>
            <Text style={styles.actionSub}>100% ነፃ ሽፋን</Text>
          </View>

          <View style={styles.actionCard}>
            <View style={[styles.actionIconBox, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="document-text-outline" size={20} color="#D97706" />
            </View>
            <Text style={styles.actionTitle}>ፖሊሲ ሁኔታ</Text>
            <Text style={styles.actionSub}>{member.policyStatus}</Text>
          </View>
        </View>

        {/* =========================================================================
            COVERED FAMILY DEPENDENTS
            ========================================================================= */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>የተመዘገቡ የቤተሰብ አባላት</Text>
            <Text style={styles.sectionSubtitle}>
              በዚህ ካርድ ስር የተካተቱ ጥገኞች ({member.dependents.length})
            </Text>
          </View>
          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>{member.dependents.length} ጥገኞች</Text>
          </View>
        </View>

        <View style={styles.dependentsList}>
          {member.dependents.map((dep) => (
            <TouchableOpacity
              key={dep.id}
              style={styles.depCard}
              onPress={() => setSelectedDependent(dep)}
              activeOpacity={0.7}
            >
              {dep.photoUrl ? (
                <Image source={{ uri: dep.photoUrl }} style={styles.depPhoto} />
              ) : (
                <View style={styles.depFallback}>
                  <Ionicons name="person" size={20} color="#1D4ED8" />
                </View>
              )}
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.depName}>{dep.nameAm}</Text>
                <Text style={styles.depNameEn}>{dep.nameEn}</Text>
                <Text style={styles.depInfo}>
                  እድሜ: {dep.age} ዓመት • ጾታ: {dep.gender === 'F' ? 'ሴት' : 'ወንድ'}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
            </TouchableOpacity>
          ))}
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
                <Text style={styles.modalTitle}>አመታዊ የጤና መድህን መዋጮ</Text>
                <Text style={styles.modalSub}>Annual CBHI Contribution Renewal</Text>
              </View>
              <TouchableOpacity onPress={() => setShowRenewalModal(false)}>
                <Ionicons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBillBox}>
              <Text style={styles.billLabel}>አመታዊ የመዋጮ መጠን:</Text>
              <Text style={styles.billAmount}>750.00 ETB</Text>
              <Text style={styles.billHousehold}>ለሙሉ ቤተሰብ የ 1 ዓመት የጤና ሽፋን</Text>
            </View>

            {isRenewing ? (
              <View style={styles.loadingBox}>
                <ActivityIndicator size="large" color="#1D4ED8" />
                <Text style={styles.loadingText}>ክፍያው በመረጋገጥ ላይ ነው...</Text>
              </View>
            ) : (
              <View style={styles.paymentMethods}>
                <TouchableOpacity
                  style={styles.paymentMethodBtn}
                  onPress={() => handleRenew('TELEBIRR')}
                >
                  <View style={[styles.channelLogo, { backgroundColor: '#0284C7' }]}>
                    <Text style={styles.channelText}>telebirr</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.paymentMethodName}>በቴሌብር ይክፈሉ</Text>
                    <Text style={styles.paymentMethodSub}>ፈጣን ቀጥታ ክፍያ</Text>
                  </View>
                  <Ionicons name="arrow-forward" size={18} color="#1D4ED8" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.paymentMethodBtn}
                  onPress={() => handleRenew('CBE_BIRR')}
                >
                  <View style={[styles.channelLogo, { backgroundColor: '#854D0E' }]}>
                    <Text style={styles.channelText}>CBE</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.paymentMethodName}>በሲቢኢ ብር (CBE Birr)</Text>
                    <Text style={styles.paymentMethodSub}>የኢትዮጵያ ንግድ ባንክ</Text>
                  </View>
                  <Ionicons name="arrow-forward" size={18} color="#1D4ED8" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* =========================================================================
          DEPENDENT MODAL
          ========================================================================= */}
      <Modal visible={!!selectedDependent} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>የጥገኛ መረጃ</Text>
                <Text style={styles.modalSub}>Family Beneficiary</Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedDependent(null)}>
                <Ionicons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            {selectedDependent && (
              <View style={styles.depModalContent}>
                {selectedDependent.photoUrl ? (
                  <Image source={{ uri: selectedDependent.photoUrl }} style={styles.depModalPhoto} />
                ) : (
                  <View style={styles.depModalFallback}>
                    <Ionicons name="person" size={32} color="#1D4ED8" />
                  </View>
                )}
                <Text style={styles.depModalName}>{selectedDependent.nameAm}</Text>
                <Text style={styles.depModalNameEn}>{selectedDependent.nameEn}</Text>

                <View style={styles.depModalPills}>
                  <View style={styles.depModalPill}>
                    <Text style={styles.depModalPillText}>ዝምድና: {selectedDependent.relationship}</Text>
                  </View>
                  <View style={styles.depModalPill}>
                    <Text style={styles.depModalPillText}>እድሜ: {selectedDependent.age} ዓመት</Text>
                  </View>
                </View>

                <View style={styles.depConfirmNotice}>
                  <Ionicons name="shield-checkmark" size={18} color="#1D4ED8" />
                  <Text style={styles.depConfirmText}>
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
  logoBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#1D4ED8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  subcityText: {
    fontFamily: Fonts.bold,
    fontSize: 13,
    color: '#0F172A',
  },
  officeText: {
    fontFamily: Fonts.regular,
    fontSize: 11,
    color: '#64748B',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    gap: 5,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2563EB',
  },
  statusPillText: {
    fontFamily: Fonts.medium,
    fontSize: 11,
    color: '#1D4ED8',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 36,
  },
  cardWrapper: {
    backgroundColor: '#1E3A8A', // Deep Royal Navy Blue
    borderRadius: 18,
    padding: 18,
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#3B82F6',
    marginBottom: 16,
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
    paddingBottom: 10,
    marginBottom: 14,
  },
  cardHeaderLeft: {
    flex: 1,
  },
  cardHeaderSub: {
    fontFamily: Fonts.regular,
    fontSize: 9,
    color: '#BFDBFE',
    letterSpacing: 0.5,
  },
  cardHeaderTitle: {
    fontFamily: Fonts.bold,
    fontSize: 13,
    color: '#FFFFFF',
    marginTop: 2,
  },
  nationalEmblemBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
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
  memberInfo: {
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
    color: '#DBEAFE',
    marginBottom: 6,
  },
  idChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 6,
    alignSelf: 'flex-start',
  },
  idChipLabel: {
    fontFamily: Fonts.regular,
    fontSize: 10,
    color: '#BFDBFE',
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
    color: '#93C5FD',
  },
  metaVal: {
    fontFamily: Fonts.medium,
    fontSize: 11,
    color: '#FFFFFF',
  },
  qrSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.22)',
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
    width: 78,
    height: 78,
  },
  qrTextCol: {
    flex: 1,
    marginLeft: 12,
  },
  qrTitle: {
    fontFamily: Fonts.bold,
    fontSize: 11,
    color: '#FFFFFF',
  },
  qrSubtitle: {
    fontFamily: Fonts.regular,
    fontSize: 9.5,
    color: '#DBEAFE',
    lineHeight: 13,
    marginTop: 2,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    gap: 4,
  },
  verifiedText: {
    fontFamily: Fonts.medium,
    fontSize: 9,
    color: '#93C5FD',
  },
  clinicFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    padding: 8,
    borderRadius: 8,
  },
  clinicName: {
    fontFamily: Fonts.bold,
    fontSize: 12,
    color: '#FFFFFF',
  },
  clinicContact: {
    fontFamily: Fonts.regular,
    fontSize: 10,
    color: '#BFDBFE',
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
  actionGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  actionIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  actionTitle: {
    fontFamily: Fonts.bold,
    fontSize: 11,
    color: '#0F172A',
  },
  actionSub: {
    fontFamily: Fonts.regular,
    fontSize: 10,
    color: '#64748B',
    marginTop: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: Fonts.bold,
    fontSize: 15,
    color: '#0F172A',
  },
  sectionSubtitle: {
    fontFamily: Fonts.regular,
    fontSize: 11,
    color: '#64748B',
  },
  countBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  countBadgeText: {
    fontFamily: Fonts.bold,
    fontSize: 10.5,
    color: '#1D4ED8',
  },
  dependentsList: {
    gap: 10,
  },
  depCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  depPhoto: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E2E8F0',
  },
  depFallback: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  depName: {
    fontFamily: Fonts.bold,
    fontSize: 13,
    color: '#0F172A',
  },
  depNameEn: {
    fontFamily: Fonts.regular,
    fontSize: 11,
    color: '#64748B',
  },
  depInfo: {
    fontFamily: Fonts.regular,
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
  modalTitle: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: '#0F172A',
  },
  modalSub: {
    fontFamily: Fonts.regular,
    fontSize: 11,
    color: '#64748B',
  },
  modalBillBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 16,
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
    color: '#1D4ED8',
    marginVertical: 4,
  },
  billHousehold: {
    fontFamily: Fonts.medium,
    fontSize: 11,
    color: '#334155',
  },
  loadingBox: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: Fonts.medium,
    fontSize: 12,
    color: '#1D4ED8',
    marginTop: 8,
  },
  paymentMethods: {
    gap: 10,
  },
  paymentMethodBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 12,
  },
  channelLogo: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
  },
  channelText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 11,
  },
  paymentMethodName: {
    fontFamily: Fonts.bold,
    fontSize: 13,
    color: '#0F172A',
  },
  paymentMethodSub: {
    fontFamily: Fonts.regular,
    fontSize: 10.5,
    color: '#64748B',
  },
  depModalContent: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  depModalPhoto: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 2,
    borderColor: '#1D4ED8',
    marginBottom: 8,
  },
  depModalFallback: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
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
  depModalPills: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  depModalPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  depModalPillText: {
    fontFamily: Fonts.medium,
    fontSize: 11,
    color: '#334155',
  },
  depConfirmNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 10,
    padding: 10,
    gap: 8,
  },
  depConfirmText: {
    flex: 1,
    fontFamily: Fonts.regular,
    fontSize: 11,
    color: '#1E40AF',
    lineHeight: 16,
  },
});

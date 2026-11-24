import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Fonts, Palette } from '@/constants/theme';
import { NSL_FACILITIES, COVERED_SERVICES_LIST, HealthCenter } from '@/constants/facilities';

export default function ServicesScreen() {
  const [activeTab, setActiveTab] = useState<'facilities' | 'benefits'>('facilities');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredFacilities = NSL_FACILITIES.filter((f) => {
    const q = searchQuery.toLowerCase();
    return (
      f.nameAm.toLowerCase().includes(q) ||
      f.nameEn.toLowerCase().includes(q) ||
      f.woreda.toLowerCase().includes(q) ||
      f.location.toLowerCase().includes(q)
    );
  });

  const handleCall = (phoneNumber: string) => {
    const cleanNumber = phoneNumber.replace(/[^0-9+]/g, '');
    Linking.openURL(`tel:${cleanNumber}`).catch(() => {});
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <View style={styles.iconBox}>
            <Ionicons name="business" size={20} color="#1D4ED8" />
          </View>
          <View>
            <Text style={styles.headerTitleAm}>የጤና ጣቢያዎችና የአገልግሎት ሽፋን</Text>
            <Text style={styles.headerTitleEn}>Participating Facilities & Formulary</Text>
          </View>
        </View>

        {/* Tab Switcher */}
        <View style={styles.segmentContainer}>
          <TouchableOpacity
            style={[styles.segmentBtn, activeTab === 'facilities' && styles.segmentBtnActive]}
            onPress={() => setActiveTab('facilities')}
          >
            <Text
              style={[
                styles.segmentText,
                activeTab === 'facilities' && styles.segmentTextActive,
              ]}
            >
              ጤና ጣቢያዎች ({NSL_FACILITIES.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.segmentBtn, activeTab === 'benefits' && styles.segmentBtnActive]}
            onPress={() => setActiveTab('benefits')}
          >
            <Text
              style={[
                styles.segmentText,
                activeTab === 'benefits' && styles.segmentTextActive,
              ]}
            >
              የህክምና ሽፋን
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {activeTab === 'facilities' ? (
          <>
            {/* Search Input */}
            <View style={styles.searchRow}>
              <Ionicons name="search" size={18} color="#94A3B8" />
              <TextInput
                style={styles.searchInput}
                placeholder="ጤና ጣቢያ፣ ወረዳ ወይም አድራሻ ይፈልጉ..."
                placeholderTextColor="#94A3B8"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={18} color="#94A3B8" />
                </TouchableOpacity>
              )}
            </View>

            {/* Facilities List */}
            <View style={styles.facilityList}>
              {filteredFacilities.map((facility: HealthCenter) => (
                <View key={facility.id} style={styles.facilityCard}>
                  <View style={styles.facilityHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.facilityNameAm}>{facility.nameAm}</Text>
                      <Text style={styles.facilityNameEn}>{facility.nameEn}</Text>
                      <View style={styles.woredaBadge}>
                        <Ionicons name="location" size={12} color="#1D4ED8" />
                        <Text style={styles.woredaText}>{facility.woreda}</Text>
                      </View>
                    </View>

                    <TouchableOpacity
                      style={styles.callDeskBtn}
                      onPress={() => handleCall(facility.phone)}
                    >
                      <Ionicons name="call" size={15} color="#FFFFFF" />
                      <Text style={styles.callDeskBtnText}>ደውል</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.facilityDetailBox}>
                    <View style={styles.detailRow}>
                      <Ionicons name="navigate-outline" size={14} color="#64748B" />
                      <Text style={styles.detailText}>{facility.location}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Ionicons name="time-outline" size={14} color="#64748B" />
                      <Text style={styles.detailText}>{facility.openHours}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Ionicons name="person-outline" size={14} color="#1D4ED8" />
                      <Text style={styles.detailTextHighlight}>
                        CBHI ዴስክ: {facility.cbhiDeskContact}
                      </Text>
                    </View>
                  </View>

                  {/* Covered Services Pills */}
                  <View style={styles.servicesPillWrap}>
                    {facility.coveredServices.map((srv, idx) => (
                      <View key={idx} style={styles.servicePill}>
                        <Text style={styles.servicePillText}>{srv}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Referral Hospital Line */}
                  <View style={styles.referralFooter}>
                    <Ionicons name="arrow-redo" size={13} color="#1D4ED8" />
                    <Text style={styles.referralText}>
                      የሪፈራል ማዕከል:{' '}
                      <Text style={{ fontWeight: '700', color: '#1D4ED8' }}>
                        {facility.referralDestination}
                      </Text>
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        ) : (
          /* Benefits & Formulary Tab */
          <View style={styles.benefitsContainer}>
            <View style={styles.benefitNoticeBox}>
              <Ionicons name="shield-checkmark" size={24} color="#1D4ED8" />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.benefitNoticeTitle}>
                  የንፋስ ስልክ ላፍቶ ማህበረሰብ አቀፍ ጤና መድህን ጥቅማጥቅሞች
                </Text>
                <Text style={styles.benefitNoticeSub}>
                  በቀበሌዎ ወይም በወረዳዎ የተመዘገቡ አባላት እና ጥገኛ ቤተሰቦቻቸው ያለምንም የኪስ ክፍያ የሚያገኟቸው አገልግሎቶች።
                </Text>
              </View>
            </View>

            {COVERED_SERVICES_LIST.map((item, index) => (
              <View key={index} style={styles.benefitCard}>
                <View style={styles.benefitCardHeader}>
                  <View style={styles.benefitIconBox}>
                    <Ionicons name={item.icon as any} size={22} color="#1D4ED8" />
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.benefitCardAm}>{item.categoryAm}</Text>
                    <Text style={styles.benefitCardEn}>{item.categoryEn}</Text>
                  </View>
                </View>

                <View style={styles.coveragePill}>
                  <Ionicons name="checkmark-done" size={14} color="#1D4ED8" />
                  <Text style={styles.coveragePillText}>{item.coverage}</Text>
                </View>

                <Text style={styles.benefitCardDesc}>{item.details}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  headerTitleAm: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: '#0F172A',
  },
  headerTitleEn: {
    fontFamily: Fonts.regular,
    fontSize: 10.5,
    color: '#64748B',
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    padding: 3,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: 8,
  },
  segmentBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  segmentText: {
    fontFamily: Fonts.medium,
    fontSize: 11,
    color: '#64748B',
  },
  segmentTextActive: {
    color: '#1D4ED8',
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    fontSize: 12.5,
    color: '#0F172A',
    fontFamily: Fonts.regular,
  },
  facilityList: {
    gap: 12,
  },
  facilityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  facilityHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  facilityNameAm: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: '#0F172A',
  },
  facilityNameEn: {
    fontFamily: Fonts.regular,
    fontSize: 11,
    color: '#64748B',
  },
  woredaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
    gap: 3,
  },
  woredaText: {
    fontFamily: Fonts.medium,
    fontSize: 11,
    color: '#1D4ED8',
  },
  callDeskBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1D4ED8',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    gap: 5,
  },
  callDeskBtnText: {
    fontFamily: Fonts.bold,
    fontSize: 11,
    color: '#FFFFFF',
  },
  facilityDetailBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
    gap: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontFamily: Fonts.regular,
    fontSize: 11,
    color: '#475569',
  },
  detailTextHighlight: {
    fontFamily: Fonts.medium,
    fontSize: 11,
    color: '#1D4ED8',
  },
  servicesPillWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  servicePill: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  servicePillText: {
    fontFamily: Fonts.regular,
    fontSize: 9.5,
    color: '#1E40AF',
  },
  referralFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 8,
    gap: 6,
  },
  referralText: {
    fontFamily: Fonts.regular,
    fontSize: 11,
    color: '#64748B',
  },
  benefitsContainer: {
    gap: 12,
  },
  benefitNoticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 14,
    padding: 12,
    marginBottom: 6,
  },
  benefitNoticeTitle: {
    fontFamily: Fonts.bold,
    fontSize: 12,
    color: '#1E40AF',
  },
  benefitNoticeSub: {
    fontFamily: Fonts.regular,
    fontSize: 10.5,
    color: '#1D4ED8',
    marginTop: 2,
    lineHeight: 14,
  },
  benefitCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  benefitCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  benefitIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitCardAm: {
    fontFamily: Fonts.bold,
    fontSize: 13,
    color: '#0F172A',
  },
  benefitCardEn: {
    fontFamily: Fonts.regular,
    fontSize: 10.5,
    color: '#64748B',
  },
  coveragePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
    marginBottom: 8,
  },
  coveragePillText: {
    fontFamily: Fonts.bold,
    fontSize: 10.5,
    color: '#1D4ED8',
  },
  benefitCardDesc: {
    fontFamily: Fonts.regular,
    fontSize: 11,
    color: '#475569',
    lineHeight: 16,
  },
});

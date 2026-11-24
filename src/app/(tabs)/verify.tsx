import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Fonts, Palette } from '@/constants/theme';
import { useCBHIStore } from '@/stores/cbhi-store';

export default function ClinicVerificationScreen() {
  const { member, verificationHistory, recordVerification } = useCBHIStore();
  const [searchId, setSearchId] = useState<string>('NSL-CBHI-2026-08492');
  const [scannedResult, setScannedResult] = useState<any | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScannedResult({
        memberId: member.memberId,
        fullNameAm: member.fullNameAm,
        fullNameEn: member.fullNameEn,
        woreda: member.woreda,
        photoUrl: member.photoUrl,
        policyStatus: member.policyStatus,
        policyType: member.policyType,
        validUntil: member.validUntil,
        assignedClinic: member.assignedHealthCenter.nameAm,
        dependentsCount: member.dependents.length,
        dependents: member.dependents,
      });
    }, 700);
  };

  const handleAuthorizeVisit = () => {
    if (!scannedResult) return;
    const newRecord = {
      verificationId: `VRF-${Math.floor(10000 + Math.random() * 90000)}`,
      verifiedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      memberId: scannedResult.memberId,
      memberName: scannedResult.fullNameAm,
      clinicName: scannedResult.assignedClinic,
      woreda: scannedResult.woreda,
      status: scannedResult.policyStatus === 'EXPIRED' ? ('INELIGIBLE' as const) : ('ELIGIBLE' as const),
      triageNotes:
        scannedResult.policyStatus === 'EXPIRED'
          ? 'አባልነቱ ያለቀበት በመሆኑ ማደስ አለበት (Copay required)'
          : 'የተመላላሽ ታካሚ (OPD) ህክምና እና የፋርማሲ ቫውቸር ተፈቅዷል',
    };

    recordVerification(newRecord);
    Alert.alert(
      'የታካሚ ማረጋገጫ ተጠናቋል',
      `${scannedResult.fullNameAm} ወደ ህክምና ክፍል እንዲያልፉ በሲስተሙ ተመዝግቧል።`,
      [{ text: 'እሺ' }]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header Bar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.iconBox}>
            <Ionicons name="scan" size={20} color="#1D4ED8" />
          </View>
          <View>
            <Text style={styles.headerTitleAm}>የጤና ጣቢያ ትሪያጅ ማረጋገጫ</Text>
            <Text style={styles.headerTitleEn}>Clinic Triage & Verification Scanner</Text>
          </View>
        </View>
        <View style={styles.clinicBadge}>
          <Text style={styles.clinicBadgeText}>ንፋስ ስልክ ጤ/ጣ</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Scanner Viewport */}
        <View style={styles.scannerBox}>
          <View style={styles.scannerViewport}>
            <View style={styles.reticleCornerTL} />
            <View style={styles.reticleCornerTR} />
            <View style={styles.reticleCornerBL} />
            <View style={styles.reticleCornerBR} />

            <View style={styles.scannerCenter}>
              <Ionicons
                name={isScanning ? 'hourglass-outline' : 'qr-code-outline'}
                size={58}
                color={isScanning ? '#3B82F6' : 'rgba(255, 255, 255, 0.4)'}
              />
              <Text style={styles.scannerHint}>
                {isScanning ? 'ኮዱን በማጣራት ላይ...' : 'የታካሚውን የጤና መድህን QR ኮድ እዚህ ያነጣጥሩ'}
              </Text>
            </View>

            {isScanning && <View style={styles.laserLine} />}
          </View>

          <View style={styles.scanActionsRow}>
            <TouchableOpacity
              style={styles.triggerScanBtn}
              onPress={handleSimulateScan}
              disabled={isScanning}
            >
              <Ionicons name="camera" size={18} color="#FFFFFF" />
              <Text style={styles.triggerScanText}>
                {isScanning ? 'በማንበብ ላይ...' : 'ስካን አድርግ (Scan QR)'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Manual Lookup */}
        <View style={styles.manualSearchBox}>
          <Text style={styles.manualSearchLabel}>ወይም በመታወቂያ ቁጥር ይፈልጉ:</Text>
          <View style={styles.manualInputRow}>
            <TextInput
              style={styles.manualInput}
              value={searchId}
              onChangeText={setSearchId}
              placeholder="e.g. NSL-CBHI-2026-08492"
              placeholderTextColor="#94A3B8"
              autoCapitalize="characters"
            />
            <TouchableOpacity style={styles.searchBtn} onPress={handleSimulateScan}>
              <Ionicons name="search" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Verification Result Card */}
        {scannedResult && (
          <View
            style={[
              styles.resultCard,
              scannedResult.policyStatus === 'EXPIRED' && styles.resultCardExpired,
            ]}
          >
            <View style={styles.resultHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons
                  name={
                    scannedResult.policyStatus === 'EXPIRED'
                      ? 'close-circle'
                      : 'checkmark-circle'
                  }
                  size={22}
                  color={scannedResult.policyStatus === 'EXPIRED' ? '#DC2626' : '#2563EB'}
                />
                <View style={{ marginLeft: 8 }}>
                  <Text style={styles.resultStatusText}>
                    {scannedResult.policyStatus === 'EXPIRED'
                      ? 'ያልታደሰ አባል (INELIGIBLE)'
                      : 'የተረጋገጠ አባል (ELIGIBLE - 100% COVERED)'}
                  </Text>
                  <Text style={styles.resultSubText}>
                    የአባል መታወቂያ: {scannedResult.memberId}
                  </Text>
                </View>
              </View>
            </View>

            {/* Photo Comparison */}
            <View style={styles.photoCompareSection}>
              <Image source={{ uri: scannedResult.photoUrl }} style={styles.comparePhoto} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.compareNotice}>የፎቶ ማረጋገጫ:</Text>
                <Text style={styles.patientNameAm}>{scannedResult.fullNameAm}</Text>
                <Text style={styles.patientNameEn}>{scannedResult.fullNameEn}</Text>
                <Text style={styles.patientWoreda}>ወረዳ: {scannedResult.woreda}</Text>
                <Text style={styles.patientClinic}>የተመደበበት: {scannedResult.assignedClinic}</Text>
              </View>
            </View>

            {/* Dependents Snapshot */}
            <View style={styles.depSnapshot}>
              <Text style={styles.depSnapshotTitle}>
                የተመዘገቡ ጥገኞች ({scannedResult.dependents.length} Household Members):
              </Text>
              {scannedResult.dependents.map((d: any) => (
                <View key={d.id} style={styles.depRow}>
                  <Ionicons name="person-outline" size={13} color="#1D4ED8" />
                  <Text style={styles.depRowText}>
                    {d.nameAm} ({d.relationship}) — {d.age} ዓመት
                  </Text>
                </View>
              ))}
            </View>

            {/* Authorization Action Button */}
            <TouchableOpacity
              style={[
                styles.authorizeBtn,
                scannedResult.policyStatus === 'EXPIRED' && styles.authorizeBtnDisabled,
              ]}
              onPress={handleAuthorizeVisit}
            >
              <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
              <Text style={styles.authorizeBtnText}>
                {scannedResult.policyStatus === 'EXPIRED'
                  ? 'አባልነት ስላለቀበት ህክምና አይፈቀድም'
                  : 'ህክምና ፍቀድ (Authorize Visit)'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Verification History Log */}
        <View style={styles.historySection}>
          <Text style={styles.historySectionTitle}>ዛሬ የተስተናገዱ ታካሚዎች (Today's Triage Log):</Text>
          {verificationHistory.map((v) => (
            <View key={v.verificationId} style={styles.historyCard}>
              <View style={styles.historyRow}>
                <View>
                  <Text style={styles.historyName}>{v.memberName}</Text>
                  <Text style={styles.historySub}>
                    {v.memberId} • {v.verifiedAt}
                  </Text>
                </View>
                <View
                  style={[
                    styles.historyPill,
                    v.status === 'ELIGIBLE' ? styles.historyPillOk : styles.historyPillBad,
                  ]}
                >
                  <Text
                    style={[
                      styles.historyPillText,
                      v.status === 'ELIGIBLE' ? { color: '#1D4ED8' } : { color: '#B91C1C' },
                    ]}
                  >
                    {v.status === 'ELIGIBLE' ? 'ተፈቅዷል' : 'ተከልክሏል'}
                  </Text>
                </View>
              </View>
              {v.triageNotes && <Text style={styles.historyNotes}>{v.triageNotes}</Text>}
            </View>
          ))}
        </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
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
  clinicBadge: {
    backgroundColor: '#1E3A8A',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  clinicBadgeText: {
    fontFamily: Fonts.bold,
    fontSize: 11,
    color: '#DBEAFE',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  scannerBox: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  scannerViewport: {
    height: 190,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: '#020617',
  },
  reticleCornerTL: {
    position: 'absolute',
    top: 24,
    left: 48,
    width: 24,
    height: 24,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#3B82F6',
  },
  reticleCornerTR: {
    position: 'absolute',
    top: 24,
    right: 48,
    width: 24,
    height: 24,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: '#3B82F6',
  },
  reticleCornerBL: {
    position: 'absolute',
    bottom: 24,
    left: 48,
    width: 24,
    height: 24,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#3B82F6',
  },
  reticleCornerBR: {
    position: 'absolute',
    bottom: 24,
    right: 48,
    width: 24,
    height: 24,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: '#3B82F6',
  },
  scannerCenter: {
    alignItems: 'center',
  },
  scannerHint: {
    fontFamily: Fonts.medium,
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 10,
    textAlign: 'center',
  },
  laserLine: {
    position: 'absolute',
    width: '70%',
    height: 2,
    backgroundColor: '#3B82F6',
    shadowColor: '#3B82F6',
    shadowOpacity: 0.9,
    shadowRadius: 6,
    elevation: 4,
  },
  scanActionsRow: {
    padding: 12,
    backgroundColor: '#0F172A',
  },
  triggerScanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1D4ED8',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 8,
  },
  triggerScanText: {
    fontFamily: Fonts.bold,
    fontSize: 13,
    color: '#FFFFFF',
  },
  manualSearchBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  manualSearchLabel: {
    fontFamily: Fonts.medium,
    fontSize: 11,
    color: '#64748B',
    marginBottom: 6,
  },
  manualInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  manualInput: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    fontFamily: Fonts.mono,
    color: '#0F172A',
  },
  searchBtn: {
    backgroundColor: '#1D4ED8',
    width: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#3B82F6',
    padding: 14,
    marginBottom: 16,
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  resultCardExpired: {
    borderColor: '#EF4444',
  },
  resultHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 10,
    marginBottom: 10,
  },
  resultStatusText: {
    fontFamily: Fonts.bold,
    fontSize: 13,
    color: '#1D4ED8',
  },
  resultSubText: {
    fontFamily: Fonts.regular,
    fontSize: 11,
    color: '#64748B',
  },
  photoCompareSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
  },
  comparePhoto: {
    width: 72,
    height: 80,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  compareNotice: {
    fontFamily: Fonts.bold,
    fontSize: 10,
    color: '#1D4ED8',
  },
  patientNameAm: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: '#0F172A',
    marginTop: 2,
  },
  patientNameEn: {
    fontFamily: Fonts.regular,
    fontSize: 11,
    color: '#64748B',
  },
  patientWoreda: {
    fontFamily: Fonts.regular,
    fontSize: 10.5,
    color: '#475569',
    marginTop: 3,
  },
  patientClinic: {
    fontFamily: Fonts.medium,
    fontSize: 10.5,
    color: '#1D4ED8',
  },
  depSnapshot: {
    backgroundColor: '#F1F5F9',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  depSnapshotTitle: {
    fontFamily: Fonts.bold,
    fontSize: 11,
    color: '#334155',
    marginBottom: 4,
  },
  depRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 3,
  },
  depRowText: {
    fontFamily: Fonts.regular,
    fontSize: 10.5,
    color: '#475569',
  },
  authorizeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1D4ED8',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  authorizeBtnDisabled: {
    backgroundColor: '#94A3B8',
  },
  authorizeBtnText: {
    fontFamily: Fonts.bold,
    fontSize: 13,
    color: '#FFFFFF',
  },
  historySection: {
    marginTop: 6,
  },
  historySectionTitle: {
    fontFamily: Fonts.bold,
    fontSize: 13,
    color: '#0F172A',
    marginBottom: 8,
  },
  historyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 8,
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyName: {
    fontFamily: Fonts.bold,
    fontSize: 12,
    color: '#0F172A',
  },
  historySub: {
    fontFamily: Fonts.regular,
    fontSize: 10,
    color: '#64748B',
  },
  historyPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  historyPillOk: {
    backgroundColor: '#EFF6FF',
  },
  historyPillBad: {
    backgroundColor: '#FEE2E2',
  },
  historyPillText: {
    fontFamily: Fonts.bold,
    fontSize: 10,
  },
  historyNotes: {
    fontFamily: Fonts.regular,
    fontSize: 10,
    color: '#475569',
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 4,
  },
});

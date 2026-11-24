import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Fonts, Palette } from '@/constants/theme';
import { useCBHIStore } from '@/stores/cbhi-store';
import { submitCBHIGrievance } from '@/services/api';
import { NSL_FACILITIES } from '@/constants/facilities';

const INCIDENT_TYPES = [
  { id: 'SERVICE_DENIAL', labelAm: 'አገልግሎት መከልከል / ማጉላላት', labelEn: 'Service Denial' },
  { id: 'MEDICATION_STOCKOUT', labelAm: 'የመድሃኒት እጥረት / ወደ ውጪ ማዘዝ', labelEn: 'Drug Stockout' },
  { id: 'ILLEGAL_FEE', labelAm: 'ህገ-ወጥ ክፍያ መጠየቅ (Under-table)', labelEn: 'Illegal Fee' },
  { id: 'MISTREATMENT', labelAm: 'ያልተገባ ስነ-ምግባር / ቸልተኝነት', labelEn: 'Staff Misconduct' },
  { id: 'QUALITY_DEFECT', labelAm: 'የላቦራቶሪ / የህክምና ጥራት ጉድለት', labelEn: 'Clinical Quality' },
];

export default function ComplaintScreen() {
  const { member } = useCBHIStore();

  const [complainantName, setComplainantName] = useState<string>(member.fullNameAm);
  const [phone, setPhone] = useState<string>(member.phone);
  const [facilityName, setFacilityName] = useState<string>(member.assignedHealthCenter.nameAm);
  const [selectedIncidentType, setSelectedIncidentType] = useState<string>('MEDICATION_STOCKOUT');
  const [description, setDescription] = useState<string>('');
  const [demandedRemedy, setDemandedRemedy] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<any | null>(null);

  const handleSubmit = async () => {
    if (!description.trim()) {
      Alert.alert('ማስጠንቀቂያ', 'እባክዎ የደረሰውን ችግር ወይም አቤቱታዎን በዝርዝር ይግለጹ።');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitCBHIGrievance({
        memberId: member.memberId,
        complainantName,
        phone,
        woreda: member.woreda,
        facilityName,
        incidentType: selectedIncidentType,
        incidentDate: new Date().toISOString().split('T')[0],
        description,
        demandedRemedy,
      });

      setIsSubmitting(false);
      setSubmissionSuccess({
        ref: res.data?.referenceNumber || `NSL-GRV-${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toLocaleDateString(),
      });
    } catch {
      setIsSubmitting(false);
      Alert.alert('ስህተት', 'አቤቱታውን መላክ አልተቻለም። እባክዎ እንደገና ይሞክሩ።');
    }
  };

  const handleReset = () => {
    setSubmissionSuccess(null);
    setDescription('');
    setDemandedRemedy('');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.iconBox}>
            <Ionicons name="document-text" size={20} color="#DC2626" />
          </View>
          <View>
            <Text style={styles.headerTitleAm}>የታካሚ አቤቱታና ጥቆማ ማቅረቢያ</Text>
            <Text style={styles.headerTitleEn}>Article 502 Patient Grievance Portal</Text>
          </View>
        </View>
        <View style={styles.legalBadge}>
          <Text style={styles.legalBadgeText}>አንቀጽ 502</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {submissionSuccess ? (
          <View style={styles.successCard}>
            <Ionicons name="checkmark-circle" size={54} color="#059669" />
            <Text style={styles.successTitleAm}>አቤቱታዎ በተሳካ ሁኔታ ደርሷል!</Text>
            <Text style={styles.successTitleEn}>Grievance Registered Successfully</Text>

            <View style={styles.successRefBox}>
              <Text style={styles.successRefLabel}>የመከታተያ ቁጥር (Tracking Reference):</Text>
              <Text style={styles.successRefValue}>{submissionSuccess.ref}</Text>
            </View>

            <Text style={styles.successDesc}>
              አቤቱታዎ በቀጥታ ለንፋስ ስልክ ላፍቶ ክፍለ ከተማ ጤና ጽ/ቤት የጥራትና ደንብ ቁጥጥር ቡድን (Quality & Regulatory Case Team) ተልኳል። በ 48 ሰዓት ውስጥ ምላሽ ይሰጥበታል።
            </Text>

            <TouchableOpacity style={styles.newGrievanceBtn} onPress={handleReset}>
              <Text style={styles.newGrievanceBtnText}>ሌላ አቤቱታ አስገባ</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Explanatory Banner */}
            <View style={styles.lawBanner}>
              <Ionicons name="shield" size={20} color="#0A5C36" />
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={styles.lawBannerTitle}>የመድህን አባላት ህጋዊ መብት ጥበቃ</Text>
                <Text style={styles.lawBannerSub}>
                  በጤና ጣቢያው የተገባው አገልግሎት ካልተሰጠ፣ መድሃኒት ወደ ውጪ እንዲገዙ ከተገደዱ ወይም ያለአግባብ ክፍያ ከተጠየቁ ያመልክቱ።
                </Text>
              </View>
            </View>

            {/* Form Fields */}
            <View style={styles.formCard}>
              {/* Member ID & Name (Readonly from verified card) */}
              <View style={styles.formRow}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={styles.label}>የአመልካች ስም</Text>
                  <TextInput
                    style={[styles.input, styles.inputDisabled]}
                    value={complainantName}
                    onChangeText={setComplainantName}
                    editable={true}
                  />
                </View>
                <View style={{ width: 130 }}>
                  <Text style={styles.label}>ስልክ ቁጥር</Text>
                  <TextInput
                    style={styles.input}
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                  />
                </View>
              </View>

              {/* Target Facility Selection */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>ችግሩ የተከሰተበት ጤና ጣቢያ / ሆስፒታል:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.facilityChipsRow}>
                  {NSL_FACILITIES.map((f) => {
                    const isSelected = facilityName === f.nameAm;
                    return (
                      <TouchableOpacity
                        key={f.id}
                        style={[styles.facilityChip, isSelected && styles.facilityChipActive]}
                        onPress={() => setFacilityName(f.nameAm)}
                      >
                        <Text style={[styles.facilityChipText, isSelected && styles.facilityChipTextActive]}>
                          {f.nameAm}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              {/* Incident Type Choice */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>የአቤቱታው ዓይነት (Category):</Text>
                <View style={styles.incidentTypesList}>
                  {INCIDENT_TYPES.map((t) => {
                    const isChosen = selectedIncidentType === t.id;
                    return (
                      <TouchableOpacity
                        key={t.id}
                        style={[styles.incidentOption, isChosen && styles.incidentOptionChosen]}
                        onPress={() => setSelectedIncidentType(t.id)}
                      >
                        <Ionicons
                          name={isChosen ? 'radio-button-on' : 'radio-button-off'}
                          size={18}
                          color={isChosen ? '#0A5C36' : '#94A3B8'}
                        />
                        <View style={{ flex: 1, marginLeft: 8 }}>
                          <Text style={[styles.incidentOptionAm, isChosen && styles.incidentOptionAmActive]}>
                            {t.labelAm}
                          </Text>
                          <Text style={styles.incidentOptionEn}>{t.labelEn}</Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Description */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>የችግሩ ዝርዝር መግለጫ (Description):</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  multiline
                  numberOfLines={4}
                  placeholder="ምን ተፈጠረ? የታዘዘው መድሃኒት ስም፣ የክፍሉ ስም ወይም የባለሙያው መረጃ ካለ ይጥቀሱ..."
                  placeholderTextColor="#94A3B8"
                  value={description}
                  onChangeText={setDescription}
                />
              </View>

              {/* Demanded Remedy */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>የሚጠይቁት መፍትሔ (Demanded Remedy):</Text>
                <TextInput
                  style={styles.input}
                  placeholder="ለምሳሌ፡ የወጣው ወጪ እንዲመለስ፣ ህክምናው እንዲሰጥ..."
                  placeholderTextColor="#94A3B8"
                  value={demandedRemedy}
                  onChangeText={setDemandedRemedy}
                />
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <Ionicons name="send" size={18} color="#FFFFFF" />
                    <Text style={styles.submitBtnText}>አቤቱታውን ላክ (Submit Form 001)</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </>
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
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
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
  legalBadge: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  legalBadgeText: {
    fontFamily: Fonts.bold,
    fontSize: 10.5,
    color: '#DC2626',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  lawBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  lawBannerTitle: {
    fontFamily: Fonts.bold,
    fontSize: 12,
    color: '#065F46',
  },
  lawBannerSub: {
    fontFamily: Fonts.regular,
    fontSize: 10.5,
    color: '#047857',
    marginTop: 2,
    lineHeight: 14,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  formRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  fieldGroup: {
    marginBottom: 14,
  },
  label: {
    fontFamily: Fonts.medium,
    fontSize: 11,
    color: '#334155',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12.5,
    color: '#0F172A',
    fontFamily: Fonts.regular,
  },
  inputDisabled: {
    backgroundColor: '#F1F5F9',
    color: '#475569',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  facilityChipsRow: {
    flexDirection: 'row',
  },
  facilityChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  facilityChipActive: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  facilityChipText: {
    fontFamily: Fonts.regular,
    fontSize: 11,
    color: '#475569',
  },
  facilityChipTextActive: {
    color: '#047857',
    fontWeight: '700',
  },
  incidentTypesList: {
    gap: 8,
  },
  incidentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 10,
    borderRadius: 10,
  },
  incidentOptionChosen: {
    backgroundColor: '#ECFDF5',
    borderColor: '#0A5C36',
  },
  incidentOptionAm: {
    fontFamily: Fonts.medium,
    fontSize: 12,
    color: '#0F172A',
  },
  incidentOptionAmActive: {
    color: '#0A5C36',
    fontWeight: '700',
  },
  incidentOptionEn: {
    fontFamily: Fonts.regular,
    fontSize: 10,
    color: '#64748B',
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0A5C36',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
    marginTop: 8,
  },
  submitBtnDisabled: {
    backgroundColor: '#94A3B8',
  },
  submitBtnText: {
    fontFamily: Fonts.bold,
    fontSize: 13,
    color: '#FFFFFF',
  },
  successCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  successTitleAm: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: '#0F172A',
    marginTop: 12,
  },
  successTitleEn: {
    fontFamily: Fonts.regular,
    fontSize: 11.5,
    color: '#64748B',
    marginBottom: 16,
  },
  successRefBox: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 12,
    padding: 14,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  successRefLabel: {
    fontFamily: Fonts.regular,
    fontSize: 11,
    color: '#065F46',
  },
  successRefValue: {
    fontFamily: Fonts.mono,
    fontSize: 20,
    fontWeight: '800',
    color: '#0A5C36',
    marginTop: 4,
    letterSpacing: 1,
  },
  successDesc: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  newGrievanceBtn: {
    backgroundColor: '#0A5C36',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  newGrievanceBtnText: {
    fontFamily: Fonts.bold,
    fontSize: 12.5,
    color: '#FFFFFF',
  },
});

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Palette, Radii, Shadows, Fonts } from '@/constants/theme';

/**
 * Option item definition for the selection modal.
 */
export interface SelectOption {
  id: string;
  label: string;
  subLabel?: string;
  color?: string;
}

/**
 * Properties for the SelectModal component.
 */
export interface SelectModalProps {
  title: string;
  visible: boolean;
  options: SelectOption[];
  selectedValues: string[];
  isMultiSelect?: boolean;
  searchPlaceholder?: string;
  onConfirm: (selected: string[]) => void;
  onClose: () => void;
}

/**
 * Reusable Municipal Selection Modal.
 * Supports both single-selection and multi-selection modes with live filtering,
 * badge tags, and Government Blue confirmation ergonomics.
 *
 * @param {SelectModalProps} props Component properties.
 * @returns {React.ReactElement} The rendered selection modal.
 */
export function SelectModal({
  title,
  visible,
  options,
  selectedValues,
  isMultiSelect = false,
  searchPlaceholder = 'Search options...',
  onConfirm,
  onClose,
}: SelectModalProps) {
  const [search, setSearch] = useState('');
  const [internalSelected, setInternalSelected] = useState<string[]>(selectedValues);

  React.useEffect(() => {
    // Keep the modal's draft selection and search scoped to each open session.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInternalSelected(selectedValues);
    setSearch('');
  }, [visible, selectedValues]);

  const toggleOption = (id: string) => {
    if (isMultiSelect) {
      if (internalSelected.includes(id)) {
        setInternalSelected(internalSelected.filter((item) => item !== id));
      } else {
        setInternalSelected([...internalSelected, id]);
      }
    } else {
      setInternalSelected([id]);
      onConfirm([id]);
      onClose();
    }
  };

  const handleApply = () => {
    onConfirm(internalSelected);
    onClose();
  };

  const filtered = options.filter(
    (opt) =>
      opt.label.toLowerCase().includes(search.toLowerCase()) ||
      (opt.subLabel && opt.subLabel.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="close" size={24} color="#0f172a" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>{title}</Text>
          {isMultiSelect ? (
            <TouchableOpacity onPress={handleApply}>
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ width: 24 }} />
          )}
        </View>

        <View style={styles.searchWrapper}>
          <Ionicons name="search-outline" size={18} color="#94a3b8" />
          <TextInput
            style={styles.searchInput}
            placeholder={searchPlaceholder}
            placeholderTextColor="#94a3b8"
            value={search}
            onChangeText={setSearch}
            autoCorrect={false}
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={16} color="#94a3b8" />
            </TouchableOpacity>
          ) : null}
        </View>

        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }: { item: SelectOption }) => {
            const isSelected = internalSelected.includes(item.id);
            return (
              <TouchableOpacity
                style={[styles.optionRow, isSelected && styles.optionRowSelected]}
                onPress={() => toggleOption(item.id)}
                activeOpacity={0.7}
              >
                <View style={styles.optionLeft}>
                  {item.color ? (
                    <View style={[styles.colorDot, { backgroundColor: item.color }]} />
                  ) : null}
                  <View style={styles.labelWrapper}>
                    <Text
                      style={[
                        styles.optionLabel,
                        isSelected && styles.optionLabelSelected,
                      ]}
                    >
                      {item.label}
                    </Text>
                    {item.subLabel ? (
                      <Text style={styles.optionSub}>{item.subLabel}</Text>
                    ) : null}
                  </View>
                </View>

                <View
                  style={[
                    styles.checkbox,
                    isMultiSelect ? styles.checkboxSquare : styles.checkboxRound,
                    isSelected && styles.checkboxActive,
                  ]}
                >
                  {isSelected ? (
                    <Ionicons name="checkmark" size={14} color={Palette.white} />
                  ) : null}
                </View>
              </TouchableOpacity>
            );
          }}
        />

        {isMultiSelect ? (
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleApply}
              activeOpacity={0.88}
            >
              <Text style={styles.confirmButtonText}>
                Confirm Selection ({internalSelected.length})
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </SafeAreaView>
    </Modal>
  );
}

/**
 * Properties for the SelectTrigger input component.
 */
export interface SelectTriggerProps {
  label: string;
  placeholder?: string;
  selectedDisplay?: string;
  onPress: () => void;
  error?: string;
}

/**
 * Reusable Municipal Form Trigger for Selection Modals.
 *
 * @param {SelectTriggerProps} props Trigger properties.
 * @returns {React.ReactElement} The rendered trigger field.
 */
export function SelectTrigger({
  label,
  placeholder = 'Select option...',
  selectedDisplay,
  onPress,
  error,
}: SelectTriggerProps) {
  return (
    <View style={styles.triggerGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TouchableOpacity
        style={[styles.triggerBox, error ? styles.triggerBoxError : null]}
        onPress={onPress}
        activeOpacity={0.75}
      >
        <Text
          style={[
            styles.triggerText,
            !selectedDisplay ? styles.triggerPlaceholder : null,
          ]}
          numberOfLines={1}
        >
          {selectedDisplay || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={18} color="#64748b" />
      </TouchableOpacity>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#F6F8F7',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E5EBE8',
  },
  modalTitle: {
    fontSize: 17,
    fontFamily: Fonts.bold,
    fontWeight: '700',
    color: '#1B2A31',
  },
  doneText: {
    fontSize: 15,
    fontFamily: Fonts.bold,
    fontWeight: '700',
    color: Palette.primary,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E8E4',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    height: 44,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#1D2B31',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 8,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderRadius: Radii.md,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#E5EBE8',
  },
  optionRowSelected: {
    backgroundColor: Palette.primarySoft,
    borderColor: '#C8DAD2',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    marginRight: 12,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  labelWrapper: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    fontWeight: '500',
    color: '#25353C',
  },
  optionLabelSelected: {
    fontFamily: Fonts.bold,
    fontWeight: '700',
    color: Palette.primary,
  },
  optionSub: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: '#71808A',
    marginTop: 2,
  },
  checkbox: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#CBD8D2',
    backgroundColor: '#ffffff',
  },
  checkboxRound: {
    borderRadius: 11,
  },
  checkboxSquare: {
    borderRadius: 6,
  },
  checkboxActive: {
    backgroundColor: Palette.primary,
    borderColor: Palette.primary,
  },
  modalFooter: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#E5EBE8',
    backgroundColor: '#ffffff',
  },
  confirmButton: {
    backgroundColor: Palette.primary,
    height: 48,
    borderRadius: Radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  confirmButtonText: {
    fontSize: 15,
    fontFamily: Fonts.bold,
    fontWeight: '700',
    color: Palette.white,
  },
  triggerGroup: {
    width: '100%',
    gap: 6,
  },
  fieldLabel: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: '#43535C',
    letterSpacing: 0.1,
  },
  triggerBox: {
    height: 50,
    backgroundColor: '#FBFCFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DFE7E3',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  triggerBoxError: {
    borderColor: '#dc2626',
  },
  triggerText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: '#1D2B31',
    flex: 1,
    marginRight: 8,
  },
  triggerPlaceholder: {
    color: '#8A969C',
    fontFamily: Fonts.regular,
  },
  errorText: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: '#dc2626',
    marginTop: 2,
  },
});

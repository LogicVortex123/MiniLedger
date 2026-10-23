import { StatusBar, StyleSheet } from 'react-native';

// App colours in one place.
export const colors = {
  primary: '#4F46E5',
  primaryDark: '#312E81',
  primaryLight: '#EEF2FF',
  background: '#F5F6FA',
  card: '#FFFFFF',
  text: '#111827',
  muted: '#6B7280',
  placeholder: '#9CA3AF',
  border: '#E5E7EB',
  red: '#DC2626',
  redLight: '#FEF2F2',
  green: '#16A34A',
  greenLight: '#F0FDF4',
  white: '#FFFFFF',
};

// Space at the top so content doesn't sit under the phone's status bar.
// Android reports its status bar height; on iOS we use a safe fixed value.
const TOP_SPACE = (StatusBar.currentHeight ?? 50) + 8;

// A soft shadow, reused by cards and buttons.
const shadow = {
  elevation: 3, // Android
  shadowColor: '#000', // iOS
  shadowOpacity: 0.08,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 2 },
};

export const styles = StyleSheet.create({
  // ---------- Layout ----------
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: TOP_SPACE,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    ...shadow,
  },

  // ---------- Text ----------
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.text,
  },
  greeting: {
    fontSize: 14,
    color: colors.muted,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  cardSubtitle: {
    fontSize: 14,
    color: colors.muted,
    marginTop: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.muted,
    marginBottom: 8,
    marginTop: 20,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  hint: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 6,
  },
  error: {
    color: colors.red,
    backgroundColor: colors.redLight,
    borderWidth: 1,
    borderColor: '#FECACA',
    padding: 12,
    borderRadius: 12,
    marginTop: 16,
    fontSize: 14,
    overflow: 'hidden',
  },
  linkText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '600',
  },

  // ---------- Inputs and buttons ----------
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 16,
    color: colors.text,
  },
  inputWithPrefix: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
  },
  inputPrefix: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.muted,
    marginRight: 8,
  },
  inputInner: {
    flex: 1,
    paddingVertical: 13,
    fontSize: 16,
    color: colors.text,
  },
  otpInput: {
    fontSize: 26,
    fontWeight: 'bold',
    letterSpacing: 10,
    textAlign: 'center',
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 24,
    ...shadow,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  pillButton: {
    backgroundColor: colors.primaryLight,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  pillButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 36,
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: colors.primary,
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  fabText: {
    color: colors.white,
    fontSize: 34,
    lineHeight: 36,
    fontWeight: '300',
  },

  // ---------- Login ----------
  loginContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    ...shadow,
  },
  logoText: {
    color: colors.white,
    fontSize: 36,
    fontWeight: 'bold',
  },
  appName: {
    fontSize: 30,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginTop: 16,
  },
  tagline: {
    fontSize: 15,
    color: colors.muted,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 32,
  },
  stepText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.primary,
    letterSpacing: 1,
    marginBottom: 6,
  },
  infoBox: {
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
  },
  infoText: {
    color: colors.primaryDark,
    fontSize: 13,
    lineHeight: 18,
  },

  // ---------- Summary card ----------
  summaryCard: {
    backgroundColor: colors.primaryDark,
    borderRadius: 24,
    padding: 22,
    marginBottom: 24,
    ...shadow,
  },
  summaryLabel: {
    color: '#C7D2FE',
    fontSize: 13,
    fontWeight: '600',
  },
  summaryBig: {
    color: colors.white,
    fontSize: 36,
    fontWeight: 'bold',
    marginTop: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  statLabel: {
    color: '#C7D2FE',
    fontSize: 12,
  },
  statValue: {
    color: colors.white,
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 4,
  },
  statValueOverdue: {
    color: '#FCA5A5',
  },

  // ---------- Loan list ----------
  list: {
    paddingHorizontal: 16,
    paddingBottom: 120, // room so the + button doesn't cover the last row
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  sectionCount: {
    fontSize: 13,
    color: colors.muted,
  },
  loanCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    ...shadow,
  },
  loanCardOverdue: {
    backgroundColor: colors.redLight,
    borderLeftColor: colors.red,
  },
  loanCardRepaid: {
    borderLeftColor: colors.green,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  thumbnail: {
    width: 46,
    height: 46,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: colors.border,
  },
  loanInfo: {
    flex: 1,
    marginRight: 8,
  },
  loanName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  loanDue: {
    fontSize: 13,
    color: colors.muted,
    marginTop: 3,
  },
  loanDueOverdue: {
    color: colors.red,
    fontWeight: '600',
  },
  loanRight: {
    alignItems: 'flex-end',
  },
  loanAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  loanAmountRepaid: {
    color: colors.muted,
    textDecorationLine: 'line-through',
  },
  badge: {
    borderRadius: 10,
    paddingVertical: 3,
    paddingHorizontal: 8,
    marginTop: 6,
    overflow: 'hidden',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  badgeOverdue: {
    backgroundColor: colors.red,
    color: colors.white,
  },
  badgeRepaid: {
    backgroundColor: colors.greenLight,
    color: colors.green,
  },
  repayButton: {
    backgroundColor: colors.green,
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginTop: 6,
  },
  repayButtonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },

  // ---------- Empty and loading states ----------
  emptyBox: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyIconText: {
    fontSize: 32,
    color: colors.primary,
    fontWeight: 'bold',
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.text,
  },
  emptyText: {
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
    marginTop: 6,
  },

  // ---------- Add entry ----------
  form: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backArrow: {
    fontSize: 28,
    color: colors.primary,
    marginRight: 4,
    lineHeight: 30,
  },
  receiptBox: {
    borderWidth: 2,
    borderColor: '#C7D2FE',
    borderStyle: 'dashed',
    borderRadius: 14,
    backgroundColor: colors.primaryLight,
    paddingVertical: 24,
    alignItems: 'center',
  },
  receiptBoxIcon: {
    fontSize: 28,
    color: colors.primary,
    fontWeight: 'bold',
  },
  receiptBoxText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '600',
    marginTop: 4,
  },
  receiptPreview: {
    width: '100%',
    height: 200,
    borderRadius: 14,
    backgroundColor: colors.border,
  },
  receiptActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  removeText: {
    color: colors.red,
    fontSize: 15,
    fontWeight: '600',
  },
});

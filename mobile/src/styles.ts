import { StatusBar, StyleSheet } from 'react-native';

// App colours in one place.
export const colors = {
  primary: '#6D4AFF',
  primaryDark: '#1E1B4B',
  primaryLight: '#EFEBFF',
  onDark: '#C4BCFF', // soft text on the dark background
  background: '#F3F4F9',
  card: '#FFFFFF',
  text: '#0F172A',
  muted: '#64748B',
  placeholder: '#A0AEC0',
  border: '#E2E8F0',
  red: '#E11D48',
  redLight: '#FFF1F2',
  green: '#059669',
  greenLight: '#ECFDF5',
  white: '#FFFFFF',
};

// Background and letter colours for the friends' avatars.
// Each friend always gets the same pair (see avatarColor in HomeScreen).
export const avatarColors = [
  { bg: '#EFEBFF', fg: '#6D4AFF' },
  { bg: '#E0F2FE', fg: '#0284C7' },
  { bg: '#FCE7F3', fg: '#DB2777' },
  { bg: '#FEF3C7', fg: '#B45309' },
  { bg: '#DCFCE7', fg: '#15803D' },
];

// Space at the top so content doesn't sit under the phone's status bar.
// Android reports its status bar height; on iOS we use a safe fixed value.
const TOP_SPACE = (StatusBar.currentHeight ?? 50) + 8;

// A soft shadow, reused by cards and buttons.
const shadow = {
  elevation: 3, // Android
  shadowColor: '#0F172A', // iOS
  shadowOpacity: 0.06,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 4 },
};

// A coloured glow under the main buttons.
const primaryShadow = {
  elevation: 6,
  shadowColor: colors.primary,
  shadowOpacity: 0.35,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 6 },
};

export const styles = StyleSheet.create({
  // ---------- Layout ----------
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  darkScreen: {
    flex: 1,
    backgroundColor: colors.primaryDark,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 22,
    ...shadow,
  },

  // ---------- Dark header with decorative circles ----------
  hero: {
    backgroundColor: colors.primaryDark,
    paddingTop: TOP_SPACE + 8,
    paddingHorizontal: 20,
    paddingBottom: 28,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden', // keeps the circles inside the rounded corners
  },
  // Plain coloured circles behind the content, for a bit of depth.
  circle: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: colors.primary,
    opacity: 0.35,
  },
  circleLarge: {
    width: 260,
    height: 260,
    top: -90,
    right: -80,
  },
  circleSmall: {
    width: 160,
    height: 160,
    bottom: -70,
    left: -50,
    opacity: 0.2,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroGreeting: {
    fontSize: 14,
    color: colors.onDark,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.white,
    marginTop: 2,
  },
  heroSubtitle: {
    fontSize: 14,
    color: colors.onDark,
    marginTop: 4,
  },
  ghostButton: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  ghostButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },

  // ---------- Summary (inside the home header) ----------
  summaryLabel: {
    color: colors.onDark,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 28,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  summaryBig: {
    color: colors.white,
    fontSize: 40,
    fontWeight: 'bold',
    marginTop: 4,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginTop: 16,
    overflow: 'hidden',
  },
  progressFill: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#34D399',
  },
  progressText: {
    color: colors.onDark,
    fontSize: 12,
    marginTop: 8,
  },
  statRow: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  statLabel: {
    color: colors.onDark,
    fontSize: 12,
  },
  statValue: {
    color: colors.white,
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 4,
  },
  statValueOverdue: {
    color: '#FDA4AF',
  },

  // ---------- Text ----------
  cardTitle: {
    fontSize: 21,
    fontWeight: 'bold',
    color: colors.text,
  },
  cardSubtitle: {
    fontSize: 14,
    color: colors.muted,
    marginTop: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.muted,
    marginBottom: 8,
    marginTop: 20,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
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
    borderColor: '#FECDD3',
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
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.text,
  },
  inputWithPrefix: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 16,
  },
  inputPrefix: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    marginRight: 10,
  },
  inputInner: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.text,
  },
  otpInput: {
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 12,
    textAlign: 'center',
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
    ...primaryShadow,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.3,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 32,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 22,
    ...primaryShadow,
  },
  fabIcon: {
    color: colors.white,
    fontSize: 22,
    fontWeight: 'bold',
    marginRight: 6,
    lineHeight: 24,
  },
  fabText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },

  // ---------- Login ----------
  loginContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    paddingTop: TOP_SPACE + 16,
  },
  logo: {
    width: 76,
    height: 76,
    borderRadius: 24,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    ...primaryShadow,
  },
  logoText: {
    color: colors.primary,
    fontSize: 38,
    fontWeight: 'bold',
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
    marginTop: 18,
  },
  tagline: {
    fontSize: 15,
    color: colors.onDark,
    textAlign: 'center',
    marginTop: 6,
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 18,
    marginBottom: 28,
  },
  featureChip: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  featureChipText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  stepText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.primary,
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  demoBox: {
    backgroundColor: colors.primaryLight,
    borderWidth: 1.5,
    borderColor: '#D9D0FF',
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 14,
    marginTop: 16,
    alignItems: 'center',
  },
  demoLabel: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1.2,
  },
  demoOtp: {
    color: colors.primaryDark,
    fontSize: 30,
    fontWeight: 'bold',
    letterSpacing: 8,
    marginTop: 4,
  },
  demoHint: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
  },

  // ---------- Loan list ----------
  list: {
    paddingBottom: 120, // room so the Add button doesn't cover the last card
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 12,
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
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'transparent',
    ...shadow,
  },
  loanCardOverdue: {
    backgroundColor: colors.redLight,
    borderColor: '#FECDD3',
  },
  loanCardRepaid: {
    backgroundColor: colors.greenLight,
    borderColor: '#A7F3D0',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 19,
    fontWeight: 'bold',
  },
  thumbnail: {
    width: 48,
    height: 48,
    borderRadius: 16,
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
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.text,
  },
  loanAmountRepaid: {
    color: colors.muted,
    textDecorationLine: 'line-through',
  },
  badge: {
    borderRadius: 8,
    paddingVertical: 3,
    paddingHorizontal: 8,
    marginTop: 6,
    overflow: 'hidden',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.8,
  },
  badgePending: {
    backgroundColor: colors.primaryLight,
    color: colors.primary,
  },
  badgeOverdue: {
    backgroundColor: colors.red,
    color: colors.white,
  },
  badgeRepaid: {
    backgroundColor: colors.greenLight,
    color: colors.green,
  },
  // Bottom strip of an unpaid card: due date on the left, "Mark repaid" on the right.
  loanFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    marginTop: 14,
    paddingTop: 12,
  },
  loanFooterText: {
    fontSize: 13,
    color: colors.muted,
  },
  repayButton: {
    backgroundColor: colors.greenLight,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 12,
    paddingVertical: 7,
    paddingHorizontal: 14,
  },
  repayButtonText: {
    color: colors.green,
    fontSize: 13,
    fontWeight: 'bold',
  },

  // ---------- Empty and loading states ----------
  emptyBox: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 28,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  emptyIconText: {
    fontSize: 36,
    color: colors.primary,
    fontWeight: 'bold',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  emptyText: {
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
  },

  // ---------- Add entry ----------
  form: {
    paddingBottom: 40,
  },
  formHero: {
    paddingBottom: 60, // the form card overlaps this space
  },
  backCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  backArrow: {
    fontSize: 30,
    color: colors.white,
    lineHeight: 32,
    marginTop: -3,
  },
  formCard: {
    marginHorizontal: 16,
    marginTop: -40,
  },
  receiptBox: {
    borderWidth: 1.5,
    borderColor: '#D9D0FF',
    borderStyle: 'dashed',
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
    paddingVertical: 22,
    alignItems: 'center',
  },
  receiptBoxIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    color: colors.white,
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 44,
    overflow: 'hidden',
  },
  receiptBoxText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '600',
    marginTop: 10,
  },
  receiptBoxHint: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 2,
  },
  receiptPreview: {
    width: '100%',
    height: 200,
    borderRadius: 16,
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

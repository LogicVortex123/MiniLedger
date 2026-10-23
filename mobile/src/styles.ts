import { StatusBar, StyleSheet } from 'react-native';

// App colours in one place.
export const colors = {
  primary: '#4F46E5',
  background: '#F3F4F6',
  card: '#FFFFFF',
  text: '#111827',
  muted: '#6B7280',
  border: '#E5E7EB',
  red: '#DC2626',
  redLight: '#FEE2E2',
  green: '#16A34A',
  greenLight: '#DCFCE7',
};

// Space at the top so content doesn't sit under the phone's status bar.
// Android reports its status bar height; on iOS we use a safe fixed value.
const TOP_SPACE = (StatusBar.currentHeight ?? 50) + 12;

export const styles = StyleSheet.create({
  // ---------- Layout ----------
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: TOP_SPACE,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  form: {
    padding: 20,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // ---------- Text ----------
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: colors.muted,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
    marginTop: 16,
  },
  hint: {
    fontSize: 13,
    color: colors.muted,
    marginTop: 8,
  },
  error: {
    color: colors.red,
    backgroundColor: colors.redLight,
    padding: 10,
    borderRadius: 8,
    marginTop: 16,
    overflow: 'hidden',
  },
  emptyText: {
    textAlign: 'center',
    color: colors.muted,
    marginTop: 40,
    fontSize: 15,
  },

  // ---------- Inputs and buttons ----------
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '600',
  },
  linkText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 40,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  fabText: {
    color: '#FFFFFF',
    fontSize: 32,
    lineHeight: 34,
  },

  // ---------- Summary card ----------
  summaryCard: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  summaryLabel: {
    color: '#C7D2FE',
    fontSize: 13,
  },
  summaryBig: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 2,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 2,
  },
  summaryOverdue: {
    color: '#FCA5A5',
  },

  // ---------- Loan list ----------
  list: {
    paddingHorizontal: 16,
    paddingBottom: 120, // room so the + button doesn't cover the last row
  },
  loanCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderLeftWidth: 5,
    borderLeftColor: colors.border,
  },
  loanCardOverdue: {
    backgroundColor: colors.redLight,
    borderLeftColor: colors.red,
  },
  loanCardRepaid: {
    backgroundColor: colors.greenLight,
    borderLeftColor: colors.green,
  },
  loanInfo: {
    flex: 1,
  },
  loanName: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
  },
  loanDate: {
    fontSize: 13,
    color: colors.muted,
    marginTop: 2,
  },
  loanAmount: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'right',
  },
  badgeOverdue: {
    color: colors.red,
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 4,
  },
  badgeRepaid: {
    color: colors.green,
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 4,
  },
  repayButton: {
    backgroundColor: colors.green,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginTop: 8,
  },
  repayButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  thumbnail: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: colors.border,
  },

  // ---------- Receipt preview (add screen) ----------
  receiptPreview: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginTop: 12,
    backgroundColor: colors.border,
  },
});

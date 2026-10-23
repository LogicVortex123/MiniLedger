import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { API_URL, Loan, Summary, request } from '../api';
import { colors, styles } from '../styles';

type Props = {
  onAddPress: () => void;
  onLogout: () => void;
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// 1500.5 -> "₹1,500.5" (Indian digit grouping)
function formatMoney(amount: number) {
  return '₹' + amount.toLocaleString('en-IN', { maximumFractionDigits: 2 });
}

// '2026-01-10' -> '10 Jan 2026'. Works on the text directly, so there are no timezone surprises.
function formatDate(date: string) {
  const [year, month, day] = date.split('-');
  return `${Number(day)} ${MONTHS[Number(month) - 1]} ${year}`;
}

// Whole days from today until the due date (negative = in the past).
function daysUntil(date: string) {
  const [year, month, day] = date.split('-').map(Number);
  const now = new Date();
  const due = Date.UTC(year, month - 1, day);
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((due - today) / (24 * 60 * 60 * 1000));
}

// Friendly text under the friend's name, e.g. "Due in 5 days".
function dueText(loan: Loan) {
  if (loan.isRepaid) return `Was due ${formatDate(loan.dueDate)}`;

  const days = daysUntil(loan.dueDate);
  if (loan.isOverdue) return `Overdue by ${-days} day${days === -1 ? '' : 's'}`;
  if (days <= 0) return 'Due today';
  if (days === 1) return 'Due tomorrow';
  return `Due in ${days} days · ${formatDate(loan.dueDate)}`;
}

export default function HomeScreen({ onAddPress, onLogout }: Props) {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  // Loads the list and the summary at the same time.
  // useCallback keeps the same function between renders, so useEffect runs it only once.
  const loadData = useCallback(async () => {
    try {
      const [loansData, summaryData] = await Promise.all([
        request<Loan[]>('/api/loans'),
        request<Summary>('/api/loans/summary'),
      ]);
      setLoans(loansData);
      setSummary(summaryData);
      setError('');
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleRefresh() {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }

  function handleRepay(loan: Loan) {
    Alert.alert('Mark as repaid?', `${loan.friendName} paid back ${formatMoney(loan.amount)}`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Yes, repaid',
        onPress: async () => {
          try {
            await request(`/api/loans/${loan.id}/repay`, { method: 'PATCH' });
            await loadData();
          } catch (e) {
            Alert.alert('Could not update', (e as Error).message);
          }
        },
      },
    ]);
  }

  function renderLoan({ item }: { item: Loan }) {
    return (
      <View
        style={[
          styles.loanCard,
          item.isOverdue && styles.loanCardOverdue,
          item.isRepaid && styles.loanCardRepaid,
        ]}
      >
        {/* Receipt photo if there is one, otherwise the friend's first letter */}
        {item.receiptUrl ? (
          <Image source={{ uri: API_URL + item.receiptUrl }} style={styles.thumbnail} />
        ) : (
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{item.friendName.charAt(0).toUpperCase()}</Text>
          </View>
        )}

        <View style={styles.loanInfo}>
          <Text style={styles.loanName} numberOfLines={1}>
            {item.friendName}
          </Text>
          <Text style={[styles.loanDue, item.isOverdue && styles.loanDueOverdue]}>{dueText(item)}</Text>
        </View>

        <View style={styles.loanRight}>
          <Text style={[styles.loanAmount, item.isRepaid && styles.loanAmountRepaid]}>
            {formatMoney(item.amount)}
          </Text>
          {item.isOverdue ? <Text style={[styles.badge, styles.badgeOverdue]}>OVERDUE</Text> : null}
          {item.isRepaid ? <Text style={[styles.badge, styles.badgeRepaid]}>REPAID</Text> : null}
          {!item.isRepaid ? (
            <TouchableOpacity style={styles.repayButton} onPress={() => handleRepay(item)}>
              <Text style={styles.repayButtonText}>Repaid</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  }

  // Shown above the list: any error, the summary card, then the "Entries" heading.
  const listHeader = (
    <View>
      {error ? <Text style={[styles.error, { marginTop: 0, marginBottom: 16 }]}>{error}</Text> : null}

      {summary ? (
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Outstanding</Text>
          <Text style={styles.summaryBig}>{formatMoney(summary.outstanding)}</Text>

          <View style={styles.summaryRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Total lent</Text>
              <Text style={styles.statValue}>{formatMoney(summary.totalLent)}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Repaid</Text>
              <Text style={styles.statValue}>{formatMoney(summary.totalRepaid)}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Overdue</Text>
              <Text style={[styles.statValue, summary.overdueAmount > 0 && styles.statValueOverdue]}>
                {formatMoney(summary.overdueAmount)}
              </Text>
            </View>
          </View>
        </View>
      ) : null}

      {loans.length > 0 ? (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Entries</Text>
          <Text style={styles.sectionCount}>
            {loans.length} {loans.length === 1 ? 'entry' : 'entries'}
          </Text>
        </View>
      ) : null}
    </View>
  );

  const emptyState = (
    <View style={styles.emptyBox}>
      <View style={styles.emptyIcon}>
        <Text style={styles.emptyIconText}>₹</Text>
      </View>
      <Text style={styles.emptyTitle}>No entries yet</Text>
      <Text style={styles.emptyText}>Tap the + button to record money you lent to a friend.</Text>
    </View>
  );

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back</Text>
          <Text style={styles.title}>MiniLedger</Text>
        </View>
        <TouchableOpacity style={styles.pillButton} onPress={onLogout}>
          <Text style={styles.pillButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 60 }} />
      ) : (
        <FlatList
          data={loans}
          keyExtractor={(loan) => String(loan.id)}
          renderItem={renderLoan}
          ListHeaderComponent={listHeader}
          ListEmptyComponent={emptyState}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[colors.primary]} />
          }
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={onAddPress}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

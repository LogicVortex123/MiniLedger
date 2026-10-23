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

// 1500.5 -> "₹1,500.50" (Indian digit grouping)
function formatMoney(amount: number) {
  return '₹' + amount.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
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
        <View style={styles.row}>
          {item.receiptUrl ? (
            <Image source={{ uri: API_URL + item.receiptUrl }} style={styles.thumbnail} />
          ) : null}

          <View style={styles.loanInfo}>
            <Text style={styles.loanName}>{item.friendName}</Text>
            <Text style={styles.loanDate}>Due {item.dueDate}</Text>
            {item.isOverdue ? <Text style={styles.badgeOverdue}>OVERDUE</Text> : null}
            {item.isRepaid ? <Text style={styles.badgeRepaid}>REPAID</Text> : null}
          </View>

          <View>
            <Text style={[styles.loanAmount, item.isOverdue && { color: colors.red }]}>
              {formatMoney(item.amount)}
            </Text>
            {!item.isRepaid ? (
              <TouchableOpacity style={styles.repayButton} onPress={() => handleRepay(item)}>
                <Text style={styles.repayButtonText}>Repaid</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </View>
    );
  }

  // Shown above the list: any error, then the summary card.
  const listHeader = (
    <View>
      {error ? <Text style={[styles.error, { marginTop: 0, marginBottom: 12 }]}>{error}</Text> : null}

      {summary ? (
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Outstanding</Text>
          <Text style={styles.summaryBig}>{formatMoney(summary.outstanding)}</Text>
          <View style={styles.summaryRow}>
            <View>
              <Text style={styles.summaryLabel}>Total lent</Text>
              <Text style={styles.summaryValue}>{formatMoney(summary.totalLent)}</Text>
            </View>
            <View>
              <Text style={styles.summaryLabel}>Repaid</Text>
              <Text style={styles.summaryValue}>{formatMoney(summary.totalRepaid)}</Text>
            </View>
            <View>
              <Text style={styles.summaryLabel}>Overdue</Text>
              <Text style={[styles.summaryValue, summary.overdueAmount > 0 && styles.summaryOverdue]}>
                {formatMoney(summary.overdueAmount)}
              </Text>
            </View>
          </View>
        </View>
      ) : null}
    </View>
  );

  return (
    <View style={styles.screen}>
      <View style={styles.topBar}>
        <Text style={styles.title}>MiniLedger</Text>
        <TouchableOpacity onPress={onLogout}>
          <Text style={styles.linkText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={loans}
          keyExtractor={(loan) => String(loan.id)}
          renderItem={renderLoan}
          ListHeaderComponent={listHeader}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No entries yet. Tap + to add your first one.</Text>
          }
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={onAddPress}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

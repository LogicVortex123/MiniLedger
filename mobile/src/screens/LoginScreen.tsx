import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { request } from '../api';
import { styles } from '../styles';

type Props = {
  onLogin: (token: string) => void;
};

// Two steps: first enter the phone number, then the 6-digit OTP.
export default function LoginScreen({ onLogin }: Props) {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSendOtp() {
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError('Enter a valid 10-digit mobile number');
      return;
    }

    setError('');
    setLoading(true);
    try {
      await request('/api/auth/request-otp', {
        method: 'POST',
        body: JSON.stringify({ phone }),
      });
      setStep('otp');
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp() {
    if (!/^\d{6}$/.test(otp)) {
      setError('OTP must be 6 digits');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const data = await request<{ token: string }>('/api/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ phone, otp }),
      });
      onLogin(data.token);
    } catch (e) {
      setError((e as Error).message);
      setLoading(false);
    }
  }

  function handleChangeNumber() {
    setStep('phone');
    setOtp('');
    setError('');
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.centered}>
        <Text style={styles.appTitle}>MiniLedger</Text>
        <Text style={styles.subtitle}>Keep track of money you lend to friends</Text>

        {step === 'phone' ? (
          <>
            <Text style={styles.label}>Mobile number</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="9876543210"
              keyboardType="number-pad"
              maxLength={10}
              autoFocus
            />
          </>
        ) : (
          <>
            <Text style={styles.label}>Enter the OTP sent to {phone}</Text>
            <TextInput
              style={styles.input}
              value={otp}
              onChangeText={setOtp}
              placeholder="6-digit OTP"
              keyboardType="number-pad"
              maxLength={6}
              autoFocus
            />
            <Text style={styles.hint}>Demo: the OTP is printed in the backend terminal.</Text>
          </>
        )}

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={step === 'phone' ? handleSendOtp : handleVerifyOtp}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>{step === 'phone' ? 'Send OTP' : 'Verify & Log in'}</Text>
          )}
        </TouchableOpacity>

        {step === 'otp' ? (
          <TouchableOpacity onPress={handleChangeNumber} style={{ marginTop: 16, alignItems: 'center' }}>
            <Text style={styles.linkText}>Change number</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </KeyboardAvoidingView>
  );
}

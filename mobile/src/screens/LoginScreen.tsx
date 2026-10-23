import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { request } from '../api';
import { colors, styles } from '../styles';

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
      setOtp('');
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
      <ScrollView contentContainerStyle={styles.loginContent} keyboardShouldPersistTaps="handled">
        {/* App logo and name */}
        <View style={styles.logo}>
          <Text style={styles.logoText}>₹</Text>
        </View>
        <Text style={styles.appName}>MiniLedger</Text>
        <Text style={styles.tagline}>Never forget who owes you money</Text>

        <View style={styles.card}>
          {step === 'phone' ? (
            <>
              <Text style={styles.stepText}>STEP 1 OF 2</Text>
              <Text style={styles.cardTitle}>Log in with your phone</Text>
              <Text style={styles.cardSubtitle}>We'll send you a one-time password.</Text>

              <Text style={styles.label}>Mobile number</Text>
              <View style={styles.inputWithPrefix}>
                <Text style={styles.inputPrefix}>+91</Text>
                <TextInput
                  style={styles.inputInner}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="98765 43210"
                  placeholderTextColor={colors.placeholder}
                  keyboardType="number-pad"
                  maxLength={10}
                  autoFocus
                />
              </View>
            </>
          ) : (
            <>
              <Text style={styles.stepText}>STEP 2 OF 2</Text>
              <Text style={styles.cardTitle}>Enter the OTP</Text>
              <Text style={styles.cardSubtitle}>Sent to +91 {phone}</Text>

              <Text style={styles.label}>6-digit code</Text>
              <TextInput
                style={[styles.input, styles.otpInput]}
                value={otp}
                onChangeText={setOtp}
                placeholder="••••••"
                placeholderTextColor={colors.placeholder}
                keyboardType="number-pad"
                maxLength={6}
                autoFocus
              />

              <View style={styles.infoBox}>
                <Text style={styles.infoText}>
                  Demo mode: the OTP is printed in the backend terminal. Use the newest one.
                </Text>
              </View>
            </>
          )}

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={step === 'phone' ? handleSendOtp : handleVerifyOtp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.buttonText}>{step === 'phone' ? 'Send OTP' : 'Verify & Log in'}</Text>
            )}
          </TouchableOpacity>

          {step === 'otp' ? (
            <View style={[styles.row, { justifyContent: 'space-between', marginTop: 18 }]}>
              <TouchableOpacity onPress={handleChangeNumber}>
                <Text style={styles.linkText}>Change number</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSendOtp} disabled={loading}>
                <Text style={styles.linkText}>Resend OTP</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Loan, request } from '../api';
import { styles } from '../styles';

type Props = {
  onSaved: () => void;
  onCancel: () => void;
};

export default function AddEntryScreen({ onSaved, onCancel }: Props) {
  const [friendName, setFriendName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [photo, setPhoto] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Android back button: go back to the list instead of closing the app.
  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      onCancel();
      return true; // true = "we handled it"
    });
    return () => subscription.remove();
  }, [onCancel]);

  async function pickPhoto() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.5, // smaller file, faster upload (server limit is 5 MB)
    });
    if (!result.canceled) {
      setPhoto(result.assets[0]);
    }
  }

  // Returns an error message, or null if everything is valid.
  // The server checks again, but checking here gives instant feedback.
  function validate(): string | null {
    if (!friendName.trim()) {
      return "Enter your friend's name";
    }
    const value = Number(amount);
    if (!amount || isNaN(value) || value <= 0) {
      return 'Enter an amount greater than 0';
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) {
      return 'Enter the due date as YYYY-MM-DD';
    }
    return null;
  }

  async function handleSave() {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    // FormData lets us send the text fields and the photo in one request.
    const formData = new FormData();
    formData.append('friendName', friendName.trim());
    formData.append('amount', amount);
    formData.append('dueDate', dueDate);
    if (photo) {
      // In React Native, a file is sent as { uri, name, type }.
      // TypeScript only knows the browser's FormData (which expects a Blob), hence the cast.
      const file = {
        uri: photo.uri,
        name: photo.fileName ?? 'receipt.jpg',
        type: photo.mimeType ?? 'image/jpeg',
      };
      formData.append('receipt', file as unknown as Blob);
    }

    setError('');
    setSaving(true);
    try {
      await request<Loan>('/api/loans', { method: 'POST', body: formData });
      onSaved();
    } catch (e) {
      setError((e as Error).message);
      setSaving(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.topBar}>
        <Text style={styles.title}>New entry</Text>
        <TouchableOpacity onPress={onCancel}>
          <Text style={styles.linkText}>Cancel</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
        <Text style={[styles.label, { marginTop: 0 }]}>Friend's name</Text>
        <TextInput
          style={styles.input}
          value={friendName}
          onChangeText={setFriendName}
          placeholder="e.g. Rahul"
          maxLength={100}
        />

        <Text style={styles.label}>Amount (₹)</Text>
        <TextInput
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          placeholder="e.g. 1500"
          keyboardType="decimal-pad"
        />

        <Text style={styles.label}>Due date</Text>
        <TextInput
          style={styles.input}
          value={dueDate}
          onChangeText={setDueDate}
          placeholder="YYYY-MM-DD"
          keyboardType="numbers-and-punctuation"
          maxLength={10}
        />

        <Text style={styles.label}>Receipt photo (optional)</Text>
        <TouchableOpacity style={styles.secondaryButton} onPress={pickPhoto}>
          <Text style={styles.secondaryButtonText}>{photo ? 'Change photo' : 'Choose photo'}</Text>
        </TouchableOpacity>
        {photo ? (
          <>
            <Image source={{ uri: photo.uri }} style={styles.receiptPreview} resizeMode="cover" />
            <TouchableOpacity onPress={() => setPhoto(null)} style={{ marginTop: 8, alignItems: 'center' }}>
              <Text style={styles.linkText}>Remove photo</Text>
            </TouchableOpacity>
          </>
        ) : null}

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.button, saving && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Save entry</Text>}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const RatingProduct = ({ route }) => {
  const { productID, accountID } = route.params; // Pass accountID dynamically
  const [ratingValue, setRatingValue] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const handleSubmit = async () => {
    if (ratingValue === 0) {
      Alert.alert('Thông báo', 'Vui lòng chọn số sao để đánh giá!');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://14.225.220.108:2602/rating/create-rating', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productID,
          accountID,
          ratingValue,
          reviewComment,
        }),
      });

      const data = await response.json();

      if (data.isSuccess) {
        Alert.alert('Thành công', 'Cảm ơn bạn đã đánh giá sản phẩm!');
        navigation.goBack(); // Go back to the previous screen
      } else {
        throw new Error(data.messages || 'Không thể gửi đánh giá');
      }
    } catch (error) {
      Alert.alert('Lỗi', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đánh Giá Sản Phẩm</Text>

      <View style={styles.ratingContainer}>
        <Text style={styles.label}>Gửi đánh giá của bạn!</Text>
        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => setRatingValue(star)}
            >
              <Text style={styles.star}>{star <= ratingValue ? '⭐' : '☆'}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TextInput
        style={styles.commentInput}
        placeholder="Bạn có muốn viết gì về sản phẩm này không?"
        multiline
        value={reviewComment}
        onChangeText={setReviewComment}
        maxLength={150}
      />
      <Text style={styles.charCount}>{reviewComment.length}/150 ký tự</Text>

      <TouchableOpacity
        style={[styles.submitButton, loading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.submitText}>{loading ? 'Đang gửi...' : 'Đánh giá'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  ratingContainer: { alignItems: 'center', marginBottom: 16 },
  label: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  starsContainer: { flexDirection: 'row' },
  star: { fontSize: 32, marginHorizontal: 4, color: '#FFD700' },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 8,
  },
  charCount: { textAlign: 'right', fontSize: 12, color: '#666' },
  submitButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  submitText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  buttonDisabled: { backgroundColor: '#aaa' },
});

export default RatingProduct;

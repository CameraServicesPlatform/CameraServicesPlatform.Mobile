import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Button,
  Alert,
  Modal,
  Image,
  TouchableOpacity,
} from 'react-native';

// ======= THAY ĐỔI: Dùng expo-image-picker =======
import * as ImagePicker from 'expo-image-picker';

const ORDER_STATUS_DETAILS = {
  0: { text: "Chờ xử lý", color: "blue" },
  1: { text: "Sản phẩm sẵn sàng được giao", color: "green" },
  2: { text: "Hoàn thành", color: "yellow" },
  3: { text: "Đã nhận sản phẩm", color: "purple" },
  4: { text: "Đã giao hàng", color: "cyan" },
  5: { text: "Thanh toán thất bại", color: "cyan" },
  6: { text: "Đang hủy", color: "lime" },
  7: { text: "Đã hủy thành công", color: "red" },
  8: { text: "Đã Thanh toán", color: "orange" },
  9: { text: "Hoàn tiền đang chờ xử lý", color: "pink" },
  10: { text: "Hoàn tiền thành công", color: "brown" },
  11: { text: "Hoàn trả tiền đặt cọc", color: "gold" },
  12: { text: "Gia hạn", color: "violet" },
};

const ORDER_TYPE_DETAILS = {
  0: "Mua",
  1: "Thuê",
};

const OrderDetail = ({ route, navigation }) => {
  const {
    orderID,
    rentalStartDate,
    rentalEndDate,
    returnDate,
    orderStatus,
    orderType,
    deliveriesMethod,
    rentalStartDateRaw,
  } = route.params || {};

  const [orderDetails, setOrderDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  // State cho phần Upload ảnh
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(
          `http://14.225.220.108:2602/orderDetail/get-order-details/${orderID}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);

        }
        const data = await response.json();
        if (data.isSuccess && data.result) {
          setOrderDetails(data.result);
          console.log(orderID)
        } else {
          console.error('Dữ liệu trả về không hợp lệ:', data.messages);
        }
      } catch (error) {
        console.error('Lỗi khi gọi API:', error);
      } finally {
        setLoading(false);
      }
    };

    if (orderID) {
      fetchOrderDetails();
    }
  }, [orderID]);

  const reloadOrderDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://14.225.220.108:2602/orderDetail/get-order-details/${orderID}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.isSuccess && data.result) {
        setOrderDetails(data.result);
      } else {
        console.error('Dữ liệu trả về không hợp lệ:', data.messages);
      }
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
    } finally {
      setLoading(false);
    }
  };

  // ====== HÀM CHỌN ẢNH BẰNG expo-image-picker ======
  const pickImage = async () => {
    try {
      // Hỏi quyền truy cập ảnh nếu chưa có
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Thông báo', 'Bạn cần cho phép truy cập thư viện ảnh!');
        return;
      }

      // Mở thư viện ảnh
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      // Kiểm tra user có hủy chọn ảnh hay không
      if (!result.canceled && result.assets?.length > 0) {
        setSelectedImage(result.assets[0]); // Lấy asset đầu tiên
      }
    } catch (error) {
      console.error('Lỗi pickImage:', error);
    }
  };

  // ====== HÀM XÁC NHẬN TRẢ HÀNG (GỬI ẢNH LÊN SERVER) ======
  const handleConfirmReturn = async () => {
    // Kiểm tra đã chọn ảnh chưa
    if (!selectedImage) {
      Alert.alert('Thông báo', 'Vui lòng chọn ảnh để tiếp tục!');
      return;
    }

    try {
      // Tạo form data
      const formData = new FormData();
      // orderID dạng text
      formData.append('orderID', orderID.toString());

      // Append file
      formData.append('image', {
        uri: selectedImage.uri,
        name: 'product_image.jpg', // Hoặc tuỳ ý
        type: 'image/jpeg',
      });

      // Gửi request 1: upload ảnh
      const response = await fetch(
        'http://14.225.220.108:2602/order/add-img-product-after',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        }
      );

      if (response.ok) {
        // Request 1 thành công -> Gửi request 2 (cập nhật trạng thái)
        const updateUrl = `http://14.225.220.108:2602/order/update-order-status-pending-refund/${orderID}`;
        const response2 = await fetch(updateUrl, {
          method: 'PUT',
        });

        if (response2.ok) {
          // Thành công cả 2
          Alert.alert(
            'Thành công',
            'Đã gửi ảnh sản phẩm trả hàng và cập nhật trạng thái hoàn tiền!'
          );
          setModalVisible(false);
          setSelectedImage(null);
          reloadOrderDetails();
        } else {
          throw new Error('Không thể cập nhật trạng thái hoàn tiền.');
        }
      } else {
        throw new Error('Không thể gửi ảnh trả hàng.');
      }
    } catch (error) {
      console.error('Lỗi:', error);
      Alert.alert('Lỗi', error.message || 'Có lỗi xảy ra.');
    }
  };


  // Khi nhấn nút "Trả hàng"
  const handleReturn = () => {
    setModalVisible(true);
  };

  // Render từng chi tiết đơn hàng
  const renderOrderDetailItem = ({ item }) => {
    const {
      productName,
      productPrice,
      productPriceTotal,
      discount,
      periodRental,
      productQuality,
      product,
    } = item;

    // Nút "Đến nhận"
    const handlePickup = async () => {
      try {
        const response = await fetch(
          `http://14.225.220.108:2602/order/update-order-status-placed/${orderID}`,
          {
            method: 'PUT',
          }
        );
        if (response.ok) {
          Alert.alert('Thành công', 'Trạng thái đã được cập nhật thành công.');
          reloadOrderDetails();
        } else {
          throw new Error('Cập nhật trạng thái thất bại.');
        }
      } catch (error) {
        console.error('Lỗi:', error);
        Alert.alert('Lỗi', 'Không thể cập nhật trạng thái.');
      }
    };

    // Nút "Gia hạn"
    const handleExtend = () => {
      navigation.navigate('OrderExtend', {
        orderID,
        rentalStartDate,
        rentalEndDate,
        returnDate,
        orderStatus,
        orderType,
        deliveriesMethod,
        product,
        rentalStartDateRaw,
      });
    };

    return (
      <View style={styles.detailContainer}>
        <Text style={styles.productName}>{productName}</Text>
        {product?.productDescription ? (
          <Text style={styles.description}>{product.productDescription}</Text>
        ) : null}

        <Text style={styles.infoText}>
          <Text style={styles.label}>Chất lượng: </Text>
          {productQuality || 'N/A'}
        </Text>

        {orderType === 1 && rentalStartDate && (
          <Text style={styles.infoText}>
            <Text style={styles.label}>Giá cọc: </Text>
            {product.depositProduct.toLocaleString()} VND
          </Text>
        )}
        {orderType === 0 && rentalStartDate && (
          <Text style={styles.infoText}>
            <Text style={styles.label}>Giá mua: </Text>
            {productPrice?.toLocaleString()} VND
          </Text>
        )}
        <Text style={styles.infoText}>
          <Text style={styles.label}>Thành tiền: </Text>
          {productPriceTotal?.toLocaleString()} VND
        </Text>

        {!!discount && discount > 0 && (
          <Text style={styles.infoText}>
            <Text style={styles.label}>Giảm giá: </Text>
            {discount} VND
          </Text>
        )}

        {orderStatus !== undefined && (
          <Text
            style={[
              styles.statusText,
              { color: ORDER_STATUS_DETAILS[orderStatus]?.color },
            ]}
          >
            <Text style={styles.label}>Trạng thái đơn hàng: </Text>
            {ORDER_STATUS_DETAILS[orderStatus]?.text || 'Không xác định'}
          </Text>
        )}

        {orderType !== undefined && (
          <Text style={styles.infoText}>
            <Text style={styles.label}>Loại đơn hàng: </Text>
            {ORDER_TYPE_DETAILS[orderType] || 'Không xác định'}
          </Text>
        )}

        {orderType === 1 && rentalStartDate && (
          <Text style={styles.infoText}>
            <Text style={styles.label}>Ngày thuê: </Text>
            {rentalStartDate}
          </Text>
        )}

        {orderType === 1 && rentalEndDate && (
          <Text style={styles.infoText}>
            <Text style={styles.label}>Ngày hết hạn thuê: </Text>
            {rentalEndDate}
          </Text>
        )}

        {orderType === 1 && returnDate && (
          <Text style={styles.infoText}>
            <Text style={styles.label}>Ngày trả thiết bị: </Text>
            {returnDate}
          </Text>
        )}


        {/* Nút "Đến nhận" */}
        {orderStatus === 1 && deliveriesMethod === 0 && (
          <Button title="Đến nhận" onPress={handlePickup} />
        )}

        {/* Nút "Trả hàng" => mở Modal */}
        {orderStatus === 3 && orderType === 0 && (
          <Button title="Trả hàng" onPress={handleReturn} />
        )}

        {/* Nút "Gia hạn" */}
        {orderStatus === 3 && orderType === 1 && (
          <Button title="Gia hạn" onPress={handleExtend} />
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2e86de" />
        <Text style={styles.loadingText}>Đang tải chi tiết đơn hàng...</Text>
      </View>
    );
  }

  if (!orderDetails || orderDetails.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Không có chi tiết nào cho đơn hàng này.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chi tiết đơn hàng</Text>
      <FlatList
        data={orderDetails}
        keyExtractor={(item) => item.orderDetailsID}
        renderItem={renderOrderDetailItem}
        contentContainerStyle={styles.listContainer}
      />

      {/* MODAL HIỂN THỊ KHI TRẢ HÀNG */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Tạo yêu cầu trả hàng</Text>

            {/* Nút chọn ảnh */}
            <Button title="Chọn ảnh" onPress={pickImage} />

            {/* Hiển thị ảnh đã chọn (nếu có) */}
            {selectedImage && (
              <Image
                source={{ uri: selectedImage.uri }}
                style={styles.previewImage}
              />
            )}

            {/* Hai nút Hủy / Trả */}
            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: 'gray' }]}
                onPress={() => {
                  setModalVisible(false);
                  setSelectedImage(null);
                }}
              >
                <Text style={styles.modalButtonText}>Hủy</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: 'tomato' }]}
                onPress={handleConfirmReturn}
              >
                <Text style={styles.modalButtonText}>Trả</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* KẾT THÚC MODAL */}
    </View>
  );
};

export default OrderDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'red',
    marginTop: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    marginHorizontal: 20,
    marginBottom: 10,
    color: '#333',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  detailContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
    color: '#2c3e50',
  },
  description: {
    fontSize: 14,
    marginBottom: 10,
    color: '#555',
  },
  infoText: {
    fontSize: 15,
    marginBottom: 6,
    color: '#333',
  },
  label: {
    fontWeight: 'bold',
    color: '#000',
  },
  statusText: {
    fontSize: 15,
    marginBottom: 6,
  },
  // ===== STYLES CHO MODAL =====
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  previewImage: {
    width: 100,
    height: 100,
    marginVertical: 10,
    alignSelf: 'center',
    borderRadius: 6,
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
  },
  modalButton: {
    borderRadius: 6,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

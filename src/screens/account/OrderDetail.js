import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Button,
  Alert,
} from 'react-native';

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
const OrderDetail = ({ route, navigation  }) => {
  const { orderID, rentalStartDate, rentalEndDate, returnDate, orderStatus, orderType, deliveriesMethod, rentalStartDateRaw } = route.params || {};
  const [orderDetails, setOrderDetails] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Render từng chi tiết đơn hàng
  const renderOrderDetailItem = ({ item }) => {
    const {
      productName,
      productPrice,
      productPriceTotal,
      discount,
      periodRental,
      productQuality,
      product // Bên trong có productDescription, depositProduct...
    } = item;
  
    // Ép kiểu periodRental nếu có
    let periodRentalDisplay = null;
    if (periodRental) {
      periodRentalDisplay = new Date(periodRental).toLocaleString();
    }

    const handlePickup = async () => {
      try {
        const response = await fetch(`http://14.225.220.108:2602/order/update-order-status-placed/${orderID}`, {
          method: 'PUT',
        });
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

    const handleReturn = async () => {
      const returnDate = new Date().toISOString();
      const body = {
        orderID,
        returnDate,
        condition: "",
      };

      try {
        const response = await fetch('http://14.225.220.108:2602/returnDetail/create-return-for-member', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });
        if (response.ok) {
          Alert.alert('Thành công', 'Đã tạo yêu cầu trả hàng thành công.');
          reloadOrderDetails();
        } else {
          throw new Error('Tạo yêu cầu trả hàng thất bại.');
        }
      } catch (error) {
        console.error('Lỗi:', error);
        Alert.alert('Lỗi', 'Không thể tạo yêu cầu trả hàng.');
      }
    };

    const handleExtend = () => {
      // Điều hướng sang trang OrderExtend
      navigation.navigate('OrderExtend', {
        // Truyền các tham số (params) cần thiết
        orderID,
        rentalStartDate,
        rentalEndDate,
        returnDate,
        orderStatus,
        orderType,
        deliveriesMethod,
        product,
        rentalStartDateRaw
      });
    };

    return (
      <View style={styles.detailContainer}>
        {/* Tên sản phẩm */}
        <Text style={styles.productName}>{productName}</Text>

        {/* Mô tả sản phẩm (nếu có) */}
        {product?.productDescription ? (
          <Text style={styles.description}>{product.productDescription}</Text>
        ) : null}

        {/* Hiển thị chất lượng sản phẩm */}
        <Text style={styles.infoText}>
          <Text style={styles.label}>Chất lượng: </Text>
          {productQuality || 'N/A'}
        </Text>

        {/* Deposit (tiền cọc) nếu có */}
        {product?.depositProduct ? (
          <Text style={styles.infoText}>
            <Text style={styles.label}>Giá cọc: </Text>
            {product.depositProduct.toLocaleString()} VND
          </Text>
        ) : null}

        {/* Giá của từng sản phẩm */}
        <Text style={styles.infoText}>
          <Text style={styles.label}>Giá thuê/mua: </Text>
          {productPrice?.toLocaleString()} VND
        </Text>

        {/* Tổng tiền sản phẩm (sau khi nhân số lượng, discount, v.v...) */}
        <Text style={styles.infoText}>
          <Text style={styles.label}>Thành tiền: </Text>
          {productPriceTotal?.toLocaleString()} VND
        </Text>

        {/* Discount (nếu có) */}
        {!!discount && discount > 0 && (
          <Text style={styles.infoText}>
            <Text style={styles.label}>Giảm giá: </Text>
            {discount} VND
          </Text>
        )}

        {orderStatus !== undefined && (
          <Text style={[styles.statusText, { color: ORDER_STATUS_DETAILS[orderStatus]?.color }]}
          >
            <Text style={styles.label}>Trạng thái đơn hàng: </Text>
            {ORDER_STATUS_DETAILS[orderStatus]?.text || "Không xác định"}
          </Text>
        )}
        {orderType !== undefined && (
        <Text style={styles.infoText}>
          <Text style={styles.label}>Loại đơn hàng: </Text>
          {ORDER_TYPE_DETAILS[orderType] || "Không xác định"}
        </Text>
        )}

        {/* Ngày thuê (nếu có) */}
        {rentalStartDate && (
          <Text style={styles.infoText}>
            <Text style={styles.label}>Ngày thuê: </Text>
            {rentalStartDate}
          </Text>
        )}

        {/* Ngày hết hạn thuê (nếu có) */}
        {rentalEndDate && (
          <Text style={styles.infoText}>
            <Text style={styles.label}>Ngày hết hạn thuê: </Text>
            {rentalEndDate}
          </Text>
        )}

        {/* Ngày trả thiết bị (nếu có) */}
        {returnDate && (
          <Text style={styles.infoText}>
            <Text style={styles.label}>Ngày trả thiết bị: </Text>
            {returnDate}
          </Text>
        )}

        {/* Thêm nút chức năng */}
        {orderStatus === 1 && deliveriesMethod === 0 && (
          <Button title="Đến nhận" onPress={handlePickup} />
        )}
        {orderStatus === 3 && orderType === 0 && (
          <Button title="Trả hàng" onPress={handleReturn} />
        )}
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
});

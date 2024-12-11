import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import icon trái tim
import ProductCard from '../../components/SaleProductCard';
import ProductDetailModal from '../../components/SaleProductDetailModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SaleProducts = ({ navigation }) => {
    const [filter, setFilter] = useState('');
    const [pageSize, setPageSize] = useState(10);
    const [pageIndex, setPageIndex] = useState(1);
    const [products, setProducts] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [favorites, setFavorites] = useState([]); // Danh sách sản phẩm yêu thích
    const [selectedProduct, setSelectedProduct] = useState(null); // Sản phẩm được chọn
    const [isModalVisible, setIsModalVisible] = useState(false); // Hiển thị modal

    // Gọi API để lấy tổng số sản phẩm
    const fetchTotalProducts = async () => {
        const apiUrl = `http://14.225.220.108:2602/product/get-all-product`;
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            if (data.isSuccess) {
                const filteredProducts = data.result.filter((product) => product.status === 0); // Lọc sản phẩm với status = 0
                setTotalCount(filteredProducts.length); // Tổng số sản phẩm
                setTotalPages(Math.ceil(filteredProducts.length / pageSize)); // Tính tổng số trang
                setProducts(filteredProducts.slice(0, pageSize)); // Hiển thị trang đầu
            }
        } catch (error) {
            console.error('Error fetching total products:', error);
        }
    };
    
    // Gọi API để lấy sản phẩm cho trang hiện tại
    const fetchProducts = async () => {
        const apiUrl = `http://14.225.220.108:2602/product/get-all-product`;
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            if (data.isSuccess) {
                const filteredProducts = data.result.filter((product) => product.status === 0); // Lọc sản phẩm với status = 0
                const paginatedProducts = filteredProducts.slice((pageIndex - 1) * pageSize, pageIndex * pageSize); // Phân trang
                setProducts(paginatedProducts || []);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };
    

    const addFavorite = async (item) => {
        const accountID = await AsyncStorage.getItem('accountId');
        if (!accountID) {
            Alert.alert('Lỗi', 'Không tìm thấy thông tin tài khoản.');
            return;
        }
    
        const payload = {
            accountID: accountID,
            productID: item.productID,
        };
    
        try {
            const response = await fetch('http://14.225.220.108:2602/wishlist/create-wishlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
    
            const data = await response.json();
            if (data.isSuccess) {
                Alert.alert('Thành công', 'Đã thêm vào danh sách yêu thích.');
                setFavorites((prevFavorites) => [...prevFavorites, item]);
                navigation.navigate('Favorites', { reload: true }); // Thông báo SettingsScreen reload
            } else {
                Alert.alert('Cảm ơn bạn', 'Đây là sản phẩm yêu thích');
            }
        } catch (error) {
            console.error('Error adding to favorites:', error);
            Alert.alert('Lỗi', 'Đã xảy ra lỗi khi thêm vào danh sách yêu thích.');
        }
    };
    

    useEffect(() => {
        fetchTotalProducts();
    }, []);

    useEffect(() => {
        if (totalCount > 0) {
            fetchProducts();
        }
    }, [pageIndex, pageSize]);

    const showProductDetail = (item) => {
        setSelectedProduct(item);
        setIsModalVisible(true);
    };

    const renderPagination = () => {
        const pages = [];
        const maxPageButtons = 3; // Hiển thị tối đa 3 số trang
        const startPage = Math.max(1, pageIndex - Math.floor(maxPageButtons / 2));
        const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <Button
                    key={i}
                    title={String(i)}
                    onPress={() => setPageIndex(i)}
                    color={i === pageIndex ? 'blue' : 'gray'}
                />
            );
        }

        return (
            <View style={styles.pagination}>
                <Button
                    title="First"
                    onPress={() => setPageIndex(1)}
                    disabled={pageIndex === 1}
                />
                <Button
                    title="Back"
                    onPress={() => setPageIndex(pageIndex - 1)}
                    disabled={pageIndex === 1}
                />
                {pages}
                <Button
                    title="Next"
                    onPress={() => setPageIndex(pageIndex + 1)}
                    disabled={pageIndex === totalPages}
                />
                <Button
                    title="Last"
                    onPress={() => setPageIndex(totalPages)}
                    disabled={pageIndex === totalPages}
                />
            </View>
        );
    };

    const renderProduct = ({ item }) => (
        <ProductCard
            item={item}
            isFavorite={favorites.some((fav) => fav.productID === item.productID)}
            onToggleFavorite={() => addFavorite(item)}
        />
    );

    return (
        <View style={styles.container}>
            {/* Thanh tìm kiếm */}
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Nhập từ khóa tìm kiếm..."
                    value={filter}
                    onChangeText={setFilter}
                />
                <TouchableOpacity style={styles.searchButton} onPress={() => fetchProducts()}>
                    <Ionicons name="search" size={20} color="white" />
                </TouchableOpacity>
            </View>

            {/* Ô nhập pageSize */}
            <View style={styles.pageSizeContainer}>
                <TextInput
                    style={styles.pageSizeInput}
                    placeholder="Page size"
                    value={String(pageSize)}
                    keyboardType="numeric"
                    onChangeText={(text) => setPageSize(Number(text))}
                />
                <TouchableOpacity style={styles.setButton} onPress={() => fetchProducts()}>
                    <Text style={styles.setButtonText}>Set</Text>
                </TouchableOpacity>
            </View>

            {/* Danh sách sản phẩm */}
            <FlatList
                data={products}
                keyExtractor={(item) => item.productID}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => showProductDetail(item)}>
                        <ProductCard
                            item={item}
                            isFavorite={favorites.some((fav) => fav.productID === item.productID)}
                            onToggleFavorite={() => addFavorite(item)}
                        />
                    </TouchableOpacity>
                )}
            />

            {/* Hiển thị modal */}
            <ProductDetailModal
                visible={isModalVisible}
                item={selectedProduct}
                onClose={() => setIsModalVisible(false)}
            />

            {/* Thanh phân trang */}
            {renderPagination()}

            {/* Nút chuyển đến danh sách yêu thích */}
            <TouchableOpacity
                style={styles.favoritesButton}
                onPress={() => navigation.navigate('Favorites', { favorites })}
            >
                <Ionicons name="heart" size={24} color="white" />
            </TouchableOpacity>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    searchInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginRight: 10,
        backgroundColor: '#f9f9f9',
    },
    searchButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#007bff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pageSizeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    pageSizeInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 10,
        marginRight: 10,
        maxWidth: 100,
        backgroundColor: '#f9f9f9',
        textAlign: 'center',
    },
    setButton: {
        height: 40,
        borderRadius: 20,
        backgroundColor: '#007bff',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    setButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    favoritesButton: {
        position: 'absolute',
        bottom: 60,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#007bff',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
});


export default SaleProducts;

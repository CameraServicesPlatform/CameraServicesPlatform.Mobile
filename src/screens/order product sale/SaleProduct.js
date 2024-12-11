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
    const [allProducts, setAllProducts] = useState([]);
    const [products, setProducts] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [favorites, setFavorites] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const fetchAllProducts = async (currentFilter) => {
        let apiUrl = `http://14.225.220.108:2602/product/get-all-product`;
        if (currentFilter && currentFilter.trim() !== '') {
            // Nếu API hỗ trợ filter by name, bạn có thể thêm query string filter
            // Nếu không, logic filter sẽ phải thực hiện ở client
            apiUrl = `http://14.225.220.108:2602/product/get-product-by-name?filter=${encodeURIComponent(currentFilter)}`;
        }

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            if (data.isSuccess) {
                let fullProducts = data.result || [];
                // Lọc status = 0
                fullProducts = fullProducts.filter((product) => product.status === 0);

                setAllProducts(fullProducts);
                setTotalCount(fullProducts.length);
                setTotalPages(Math.ceil(fullProducts.length / pageSize));
                setPageIndex(1);
            } else {
                setAllProducts([]);
                setTotalCount(0);
                setTotalPages(1);
                setPageIndex(1);
            }
        } catch (error) {
            console.error('Error fetching all products:', error);
        }
    };

    const updatePageProducts = () => {
        const start = (pageIndex - 1) * pageSize;
        const end = start + pageSize;
        const currentPageProducts = allProducts.slice(start, end);
        setProducts(currentPageProducts);
    };

    useEffect(() => {
        updatePageProducts();
        setTotalPages(Math.ceil(totalCount / pageSize));
    }, [pageIndex, pageSize, allProducts, totalCount]);

    // Mỗi khi filter thay đổi, fetch lại tất cả sản phẩm
    useEffect(() => {
        fetchAllProducts(filter);
    }, [filter]);

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
                navigation.navigate('Favorites', { reload: true });
            } else {
                Alert.alert('Cảm ơn bạn', 'Đây là sản phẩm yêu thích');
            }
        } catch (error) {
            console.error('Error adding to favorites:', error);
            Alert.alert('Lỗi', 'Đã xảy ra lỗi khi thêm vào danh sách yêu thích.');
        }
    };

    const showProductDetail = (item) => {
        setSelectedProduct(item);
        setIsModalVisible(true);
    };

    const renderPagination = () => {
        if (totalPages <= 1) return null;

        const pages = [];
        const maxPageButtons = 3;
        const startPage = Math.max(1, pageIndex - Math.floor(maxPageButtons / 2));
        const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

        // Nếu startPage > 1 thì hiển thị trang 1 và ...
        if (startPage > 1) {
            pages.push(
                <Button
                    key="1"
                    title="1"
                    onPress={() => setPageIndex(1)}
                    color={pageIndex === 1 ? 'blue' : 'gray'}
                />
            );
            if (startPage > 2) {
                pages.push(
                    <Text key="dots-start" style={styles.paginationDots}>
                        ...
                    </Text>
                );
            }
        }

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

        // Nếu endPage < totalPages thì hiển thị ... và trang cuối
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pages.push(
                    <Text key="dots-end" style={styles.paginationDots}>
                        ...
                    </Text>
                );
            }
            pages.push(
                <Button
                    key={totalPages}
                    title={String(totalPages)}
                    onPress={() => setPageIndex(totalPages)}
                    color={pageIndex === totalPages ? 'blue' : 'gray'}
                />
            );
        }

        return (
            <View style={styles.paginationContainer}>
                <View style={styles.pagination}>
                    <TouchableOpacity
                        style={[styles.navButton, pageIndex === 1 && styles.navButtonDisabled]}
                        onPress={() => setPageIndex(1)}
                        disabled={pageIndex === 1}
                    >
                        <Text style={styles.navButtonText}>{'<<<'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.navButton, pageIndex === 1 && styles.navButtonDisabled]}
                        onPress={() => setPageIndex(pageIndex - 1)}
                        disabled={pageIndex === 1}
                    >
                        <Text style={styles.navButtonText}>{'<'}</Text>
                    </TouchableOpacity>

                    {pages}

                    <TouchableOpacity
                        style={[styles.navButton, pageIndex === totalPages && styles.navButtonDisabled]}
                        onPress={() => setPageIndex(pageIndex + 1)}
                        disabled={pageIndex === totalPages}
                    >
                        <Text style={styles.navButtonText}>{'>'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.navButton, pageIndex === totalPages && styles.navButtonDisabled]}
                        onPress={() => setPageIndex(totalPages)}
                        disabled={pageIndex === totalPages}
                    >
                        <Text style={styles.navButtonText}>{'>>>'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

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
                <TouchableOpacity style={styles.searchButton} onPress={() => fetchAllProducts(filter)}>
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
                    onChangeText={(text) => {
                        const newSize = Number(text) || 10;
                        setPageSize(newSize);
                        setPageIndex(1);
                    }}
                />
                <TouchableOpacity style={styles.setButton} onPress={() => {
                    setTotalPages(Math.ceil(totalCount / pageSize));
                    updatePageProducts();
                }}>
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
    paginationContainer: {
        marginTop: 20,
    },
    pagination: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
    },
    paginationDots: {
        fontSize: 16,
        color: 'gray',
        paddingHorizontal: 5,
        textAlignVertical: 'center',
        alignSelf: 'center',
    },
    navButton: {
        marginHorizontal: 4,
        padding: 8,
        borderRadius: 20,
        backgroundColor: '#007bff',
    },
    navButtonDisabled: {
        backgroundColor: '#ccc',
    },
    navButtonText: {
        color: 'white',
        fontWeight: 'bold',
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

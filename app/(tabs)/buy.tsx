import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LogOut, Star } from 'lucide-react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { Toast } from '@/components/Toast';
import { Item, SnapserManager } from '@/services/SnapserManager';

// Mock shoe images from Pexels
// const shoeImages = [
//   'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400',
//   'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=400',
//   'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=400',
//   'https://images.pexels.com/photos/2563077/pexels-photo-2563077.jpeg?auto=compress&cs=tinysrgb&w=400',
//   'https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg?auto=compress&cs=tinysrgb&w=400',
//   'https://images.pexels.com/photos/1240892/pexels-photo-1240892.jpeg?auto=compress&cs=tinysrgb&w=400',
// ];

export default function BuyScreen() {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' as 'success' | 'error' });
  const { logout } = useAuth();
  const { addItem, cartItems, loadCart } = useCart();
  const [items, setItems] = useState<Item[]>([]);
  const user = SnapserManager.getCurrentUser();

  const loadItems = async () => {
    try {
      const fetchedItems = await SnapserManager.getItems();
      setItems(fetchedItems);
    } catch (error) {
      setToast({ visible: true, message: 'Failed to load items', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
    //loadCart();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    loadItems();
    loadCart();
    setRefreshing(false);
  };

  const handleLogout = async () => {
    try {
      await SnapserManager.logout();
      logout();
      router.replace('/(auth)/login');
    } catch (error) {
      setToast({ visible: true, message: 'Logout failed', type: 'error' });
    }
  };

  const handleAddToCart = async (item: Item) => {
    try {
      if(!user || !user.id) {
        router.replace('/(auth)/login');
        return;
      }
      //await SnapserManager.addToCart(item);
      addItem(item);
      setToast({ visible: true, message: `${item.displayName} added to cart!`, type: 'success' });
    } catch (error) {
      setToast({ visible: true, message: 'Failed to add item to cart', type: 'error' });
    }
  };

  const renderItem = ({ item, index }: { item: Item; index: number }) => {
    const firstImage =
      item.metadata &&
      typeof item.metadata === "object" &&
      "images" in item.metadata &&
      Array.isArray((item.metadata as any).images) &&
      typeof (item.metadata as any).images[0] === "string"
        ? ((item.metadata as any).images[0] as string)
        : undefined;

      const rating =
        item.metadata &&
        typeof item.metadata === "object" &&
        "rating" in item.metadata
          ? String((item.metadata as any).rating)
          : "0";

      const priceVal =
        item.metadata &&
        typeof item.metadata === "object" &&
        "price" in item.metadata
          ? Number((item.metadata as any).price)
          : 10000;

    return (
      <View style={styles.itemCard}>
        {firstImage && (
        <Image
          source={{ uri: firstImage }}
          style={styles.itemImage}
          resizeMode="cover"
        />
        )}
        <View style={styles.itemInfo}>
          <Text style={styles.itemTitle}>{item.displayName}</Text>
          <Text style={styles.itemDescription} numberOfLines={2}>
            {item.description}
          </Text>
          <View style={styles.itemMeta}>
            <View style={styles.rating}>
              <Star size={16} color="#FFD700" fill="#FFD700" />
              <Text style={styles.ratingText}>{rating}</Text>
            </View>
            <Text style={styles.price}>${priceVal}</Text>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => handleAddToCart(item)}
          >
            <Text style={styles.addButtonText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6900" />
          <Text style={styles.loadingText}>Loading shoes...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Toast
        message={toast.message}
        visible={toast.visible}
        onHide={() => setToast({ ...toast, visible: false })}
        type={toast.type}
      />

      <View style={styles.header}>
        <Text style={styles.brand}>SNEAKR</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <LogOut size={24} color="#666666" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.name}
        numColumns={2}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.row}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No shoes available</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  brand: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  logoutButton: {
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666666',
  },
  grid: {
    padding: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
  itemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 16,
    width: '48%',
  },
  itemImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  itemInfo: {
    padding: 12,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
    lineHeight: 18,
  },
  itemMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  addButton: {
    backgroundColor: '#000000',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    color: '#666666',
    textAlign: 'center',
  },
});
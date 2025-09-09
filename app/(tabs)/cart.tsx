import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Trash2 } from 'lucide-react-native';
import { Toast } from '@/components/Toast';
import { router } from 'expo-router';
import { Cart, Item, Profile, SnapserManager } from '@/services/SnapserManager';
import { useCart } from '@/contexts/CartContext';

// Mock shoe images from Pexels (same as buy screen)
const shoeImages = [
  'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/2563077/pexels-photo-2563077.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/1240892/pexels-photo-1240892.jpeg?auto=compress&cs=tinysrgb&w=400',
];

export default function CartScreen() {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' as 'success' | 'error' });
  const { cartItems, removeItem, clearCart, getTotal } = useCart();
  const [profile, setProfile] = useState<Profile | null>(null);
  const user = SnapserManager.getCurrentUser();

  const loadProfile = async () => {
      try {
        const userProfile = await SnapserManager.getUserProfile();
        if(!userProfile) {
          return
        }
        setProfile(userProfile);
      } catch (error) {
      } finally {
      }
    };

  useEffect(() => {
    //Check for auth
    if(!user || !user.id) {
      router.replace('/(auth)/login');
      return;
    }
    loadProfile();
  }, []);

  const handleRemoveItem = async (item: Item) => {
    setLoading(true);
    try {
      removeItem(item);
      //removeItem(item.id);
      setToast({ visible: true, message: `${item.displayName} removed from cart`, type: 'success' });
    } catch (error) {
      setToast({ visible: true, message: 'Failed to remove item', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    if(!profile || !profile.address) {
      setToast({ visible: true, message: 'Please add a valid address so we know where to ship your Sneakers.', type: 'error' });
      return
    }
    setLoading(true);
    try {
      //await SnapserManager.resetCart();
      setToast({ visible: true, message: 'Order placed successfully!', type: 'success' });
      clearCart();
    } catch (error) {
      setToast({ visible: true, message: 'Checkout failed', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const getImageIndex = (itemId: string) => {
    return parseInt(itemId) % shoeImages.length;
  };

  const renderCartItem = ({ item }: { item: Item }) => {
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
      <View style={styles.cartItem}>
        {firstImage && (
          <Image
            source={{ uri: firstImage }}
            style={styles.itemImage}
            resizeMode="cover"
          />
        )}
        <View style={styles.itemDetails}>
          <Text style={styles.itemTitle}>{item.displayName}</Text>
          <Text style={styles.itemDescription} numberOfLines={2}>
            {item.description}
          </Text>
          <Text style={styles.itemPrice}>${priceVal}</Text>
        </View>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveItem(item)}
          disabled={loading}
        >
          <Trash2 size={20} color="#FF4444" />
        </TouchableOpacity>
      </View>
    )
  };

  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Toast
          message={toast.message}
          visible={toast.visible}
          onHide={() => setToast({ ...toast, visible: false })}
          type={toast.type}
        />
        <View style={styles.header}>
          <Text style={styles.title}>Your Cart</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyText}>Add some sneakers to get started!</Text>
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
        <Text style={styles.title}>Your Cart</Text>
        <Text style={styles.itemCount}>{cartItems.length} item{cartItems.length !== 1 ? 's' : ''}</Text>
      </View>

      <FlatList
        data={cartItems}
        renderItem={renderCartItem}
        keyExtractor={(item, index) => `${item.displayName}-${index}`}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalAmount}>${getTotal().toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          style={[styles.checkoutButton, loading && styles.checkoutButtonDisabled]}
          onPress={handleCheckout}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.checkoutButtonText}>Checkout</Text>
          )}
        </TouchableOpacity>
      </View>
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
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  itemCount: {
    fontSize: 16,
    color: '#666666',
  },
  list: {
    padding: 16,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 16,
    padding: 12,
    alignItems: 'center',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
    marginRight: 12,
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
  itemPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  removeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FFF5F5',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    backgroundColor: '#FFFFFF',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  checkoutButton: {
    backgroundColor: '#FF6900',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
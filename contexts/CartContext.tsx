import { Item, SnapserManager } from '@/services/SnapserManager';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type CartContextType = {
  cartItems: Item[];
  loadCart: () => void;
  addItem: (item: Item) => void;
  removeItem: (itemToRemove: Item) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<Item[]>([]);

  useEffect(() => {
    loadCart();
  }, []);

  // const loadItems = async () => {
  //   SnapserManager.getItems().then((fetchedItems) => {
  //     setItems(fetchedItems);
  //   });
  // }

  const loadCart = async () => {
    SnapserManager.getCart().then((cart) => {
      setCartItems(cart.items);
    });
  };

  const addItem = async (item: Item) => {
    setCartItems(prev => [...prev, item]);
    await SnapserManager.addToCart(item);
  };

  const removeItem = async (itemToRemove: Item) => {
    setCartItems(prev => prev.filter(item => item.name !== itemToRemove.name));
    await SnapserManager.removeFromCart(itemToRemove);
  };

  const clearCart = async() => {
    setCartItems([]);
    await SnapserManager.resetCart();
  };

  const getTotal = () => {
    let total = 0;
    if (!cartItems) return total;
    for(const item of cartItems) {
      const priceVal =
        item.metadata &&
        typeof item.metadata === "object" &&
        "price" in item.metadata
          ? Number((item.metadata as any).price)
          : 10000;
      total += priceVal;
    }
    return total;
  };

  const getItemCount = () => {
    return cartItems.length;
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      loadCart,
      addItem,
      removeItem,
      clearCart,
      getTotal,
      getItemCount
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
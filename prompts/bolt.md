# Project: AirBnb

**Goal:** Build a simple, e-commerce app to sell shoes. Think Nike mobile app to sell shoes.
**Scope:** Expo mobile app. No real backend—wire all data calls to typed stubs in `SnapserManager.ts`.

## Summary
- The app should have three tabs: items, cart and profile
- This app will hit a backend to get items to sell
- The item will have a title, description, image and a price. Put them in a 2 column grid on mobile
- User can add items to a cart. The cart gives a summary of the total and has a Checkout button
- There should also be a profile tab where user can add their address, first name and last name.

## Key Features
1. **Auth (mocked UI only)**
   - Username/password sign up and login pages.
   - After login, redirect to `/buy` (Buy itmes).

2. **Profile Page**
   - Route: `/user`
   - Shows text boxed where they can update: first_name, last_name, address and phone number

3. **Cart**
   - Route: `/cart`
   - Shows the items the user has added to the cart
   - Show the total

## Data Types (use exactly)
```ts
export type Item = {
  id: string;
  title: string;
  description: string;
  price: number;
  rating: number;
};

export type Cart = {
  items: Item[];
};

export type Profile = {
  last_name: string;
  first_name: string;
  address: string;
  phone: string;
}
```

## Routing
- `/login`, `/signup`
- `/buy`
- `/cart`
- `/user` (profile)

## UI Requirements
- Minimal layout with top nav (brand left, auth right).
- Empty states + toast feedback where applicable

## `SnapserManager.ts` (stubs only)
Create `src/services/SnapserManager.ts` with **empty functions** (TODO comments). No real network calls.

```ts
// src/services/SnapserManager.ts
export type Item = {
  id: string;
  title: string;
  description: string;
  price: number;
  rating: number;
};

export type Cart = {
  items: Item[];
};

export type Profile = {
  last_name: string;
  first_name: string;
  address: string;
  phone: string;
}

export class SnapserManager {
  // TODO: wire to real backend auth later
  async login(username: string, password: string): Promise<{ userId: string }> {
    // TODO implement
    throw new Error("TODO");
  }

  async signup(username: string, password: string): Promise<{ userId: string }> {
    // TODO implement
    throw new Error("TODO");
  }

  async logout(): Promise<boolean> {
    // TODO implement
    throw new Error("TODO");
  }

  // JSON blob getters (later will fetch from backend)
  async getItems(): Promise<Item[]> {
    // TODO implement
    throw new Error("TODO");
  }

  async getCart(): Promise<Cart> {
    // TODO implement
    throw new Error("TODO");
  }

  async resetCart(): Promise<boolean> {
    // TODO implement
    throw new Error("TODO");
  }

  async getUserProfile(): Promise<boolean> = {
    // TODO implement
    throw new Error("TODO");
  }

  async updateUserProfile(): Promise<Profile> = {
    // TODO implement
    throw new Error("TODO");
  }

}
```

## Non-Goals
- No real backend, DB, or external auth provider.
- No server actions or API routes beyond what’s needed to support the demo.

## Acceptance Criteria
- CRUD buttons call the corresponding `SnapserManager` stub functions (calls are visible in code; UI shows toasts).
- All routes compile and run with `npm run dev`.
- Two basic tests pass:
  1. Profile page is only visible if user is logged in
  2. Puzzle page is only visible if user is logged in
```

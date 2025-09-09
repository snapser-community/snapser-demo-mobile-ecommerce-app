import { AuthLogoutRequest, AuthServiceApi, AuthUsernamePasswordLoginOperationRequest, AuthUsernamePasswordLoginRequest, AuthUsernamePasswordLoginResponse, InventoryCatalogItem, InventoryGetItemsRequest, InventoryGetItemsResponse, InventoryServiceApi, ProfilesGetProfileRequest, ProfilesGetProfileResponse, ProfilesServiceApi, ProfilesUpsertProfileRequest, ReplaceJsonBlobRequest, StorageGetJsonBlobRequest, StorageGetJsonBlobRequestAccessTypeEnum, StorageGetJsonBlobResponse, StorageReplaceJsonBlobRequest, StorageReplaceJsonBlobResponse, StorageServiceApi, UpsertProfileRequest } from "@/snapser-sdk";

export type Item = InventoryCatalogItem;

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
  private static authApi = new AuthServiceApi();
  private static inventoryApi =  new InventoryServiceApi();
  private static profilesApi = new ProfilesServiceApi();
  private static storageApi = new StorageServiceApi();

  private static currentUserId: string | null = null;
  private static sessionToken: string | null = null;
  private static currentUserName: string | null = null;
  // TODO: wire to real backend auth later
  static async login(username: string, password: string): Promise<{ userId: string } | null> {
    //TODO: Implement
    throw new Error("Not implemented");
  }

  static async signup(username: string, password: string): Promise<{ userId: string } | null> {
    //TODO: Implement
    throw new Error("Not implemented");
  }

  static getCurrentUserId(): string | null {
    //TODO: Implement
    throw new Error("Not implemented");
  }

  static getCurrentUser(): { id: string | null; username: string | null } {
    //TODO: Implement
    throw new Error("Not implemented");
  }

  static async logout(): Promise<boolean> {
    //TODO: Implement
    throw new Error("Not implemented");
  }

  // JSON blob getters (later will fetch from backend)
  static async getItems(): Promise<Item[]> {
    //TODO: Implement
    throw new Error("Not implemented");
  }

  static async getCart(): Promise<Cart> {
    //TODO: Implement
    throw new Error("Not implemented");
  }

  static async addToCart(item: Item): Promise<boolean> {
    //TODO: Implement
    throw new Error("Not implemented");
  }

  static async removeFromCart(item: Item): Promise<boolean> {
    //TODO: Implement
    throw new Error("Not implemented");
  }

  static async resetCart(): Promise<boolean> {
    //TODO: Implement
    throw new Error("Not implemented");
  }

  static async getUserProfile(): Promise<Profile | null> {
    //TODO: Implement
    throw new Error("Not implemented");
  }

  static async updateUserProfile(profile: Profile): Promise<boolean> {
    //TODO: Implement
    throw new Error("Not implemented");
  }
}

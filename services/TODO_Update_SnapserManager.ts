// import { AuthLogoutRequest, AuthServiceApi, AuthUsernamePasswordLoginOperationRequest, AuthUsernamePasswordLoginRequest, AuthUsernamePasswordLoginResponse, InventoryCatalogItem, InventoryGetItemsRequest, InventoryGetItemsResponse, InventoryServiceApi, ProfilesGetProfileRequest, ProfilesGetProfileResponse, ProfilesServiceApi, ProfilesUpsertProfileRequest, ReplaceJsonBlobRequest, StorageGetJsonBlobRequest, StorageGetJsonBlobRequestAccessTypeEnum, StorageGetJsonBlobResponse, StorageReplaceJsonBlobRequest, StorageReplaceJsonBlobResponse, StorageServiceApi, UpsertProfileRequest } from "@/snapser-sdk";

// export type Item = InventoryCatalogItem;

// export type Cart = {
//   items: Item[];
// };

// export type Profile = {
//   last_name: string;
//   first_name: string;
//   address: string;
//   phone: string;
// }

// export class SnapserManager {
//   private static authApi = new AuthServiceApi();
//   private static inventoryApi =  new InventoryServiceApi();
//   private static profilesApi = new ProfilesServiceApi();
//   private static storageApi = new StorageServiceApi();

//   private static currentUserId: string | null = null;
//   private static sessionToken: string | null = null;
//   private static currentUserName: string | null = null;
//   // TODO: wire to real backend auth later
//   static async login(username: string, password: string): Promise<{ userId: string } | null> {
//     try {
//       const loginBody: AuthUsernamePasswordLoginRequest = {
//         username: username,
//         password: password,
//         createUser: false,
//       };

//       const request: AuthUsernamePasswordLoginOperationRequest = {
//         body: loginBody
//       };

//       const response: AuthUsernamePasswordLoginResponse = await this.authApi.authUsernamePasswordLogin(request);

//       if (response.user) {
//         //Save to local storage or memory
//         localStorage.setItem('sessionToken', response.user.sessionToken || '');
//         localStorage.setItem('currentUserId', response.user.id || '');
//         localStorage.setItem('currentUserName', username);
//         this.sessionToken = response.user.sessionToken || null;
//         this.currentUserId = response.user.id || null;
//         this.currentUserName = username;
//         return {
//           userId: response.user.id || '',
//         };
//       }
//       throw new Error("Invalid credentials");
//     } catch (error) {
//       console.error('Login failed:', error);
//       return null;
//     }
//   }

//   static async signup(username: string, password: string): Promise<{ userId: string } | null> {
//     try {
//       const loginBody: AuthUsernamePasswordLoginRequest = {
//         username: username,
//         password: password,
//         createUser: true,
//       };

//       const request: AuthUsernamePasswordLoginOperationRequest = {
//         body: loginBody
//       };

//       const response: AuthUsernamePasswordLoginResponse = await this.authApi.authUsernamePasswordLogin(request);

//       if (response.user) {
//         localStorage.setItem('sessionToken', response.user.sessionToken || '');
//         localStorage.setItem('currentUserId', response.user.id || '');
//         localStorage.setItem('currentUserName', username);
//         this.currentUserId = response.user.id || null;
//         this.sessionToken = response.user.sessionToken || null;
//         this.currentUserName = username;
//         return {
//           userId: response.user.id || '',
//         };
//       }
//       throw new Error("Invalid credentials");
//     } catch (error) {
//       console.error('Login failed:', error);
//       return null;
//     }
//   }

//   static getCurrentUserId(): string | null {
//     if (!this.currentUserId) {
//       this.currentUserId = localStorage.getItem('currentUserId');
//     }
//     if (!this.sessionToken) {
//       this.sessionToken = localStorage.getItem('sessionToken');
//     }
//     if (!this.currentUserName) {
//       this.currentUserName = localStorage.getItem('currentUserName');
//     }
//     return this.currentUserId;
//   }

//   static getCurrentUser(): { id: string | null; username: string | null } {
//     if (!this.currentUserId) {
//       this.currentUserId = localStorage.getItem('currentUserId');
//     }
//     if (!this.sessionToken) {
//       this.sessionToken = localStorage.getItem('sessionToken');
//     }
//     if (!this.currentUserName) {
//       this.currentUserName = localStorage.getItem('currentUserName');
//     }
//     return {
//       id: this.currentUserId,
//       username: this.currentUserName,
//     };
//   }

//   static async logout(): Promise<boolean> {
//     const authLogoutRequestData: AuthLogoutRequest = {
//       token: this.sessionToken || '',
//       token2: this.sessionToken || '',
//     };
//     await this.authApi.authLogout(authLogoutRequestData);
//     this.sessionToken = null;
//     this.currentUserId = null;
//     this.currentUserName = null;
//     localStorage.removeItem('sessionToken');
//     localStorage.removeItem('currentUserId');
//     localStorage.removeItem('currentUserName');
//     return true
//   }

//   // JSON blob getters (later will fetch from backend)
//   static async getItems(): Promise<Item[]> {
//     if(!this.sessionToken || !this.currentUserId) {
//       return []
//     }
//     const getItemsRequest: InventoryGetItemsRequest = {
//       token: this.sessionToken || '',
//       limit: 50,
//       offset: 0,
//     }
//     const itemsResponse: InventoryGetItemsResponse = await this.inventoryApi.inventoryGetItems(getItemsRequest);
//     return itemsResponse.items || [];
//   }

//   static async getCart(): Promise<Cart> {
//     if(!this.sessionToken || !this.currentUserId) {
//       return { items: [] };
//     }
//     try{
//       const getStorageBlobRequest: StorageGetJsonBlobRequest = {
//         ownerId: this.currentUserId || '',
//         token: this.sessionToken || '',
//         jsonBlobKey: 'cart',
//         accessType: StorageGetJsonBlobRequestAccessTypeEnum.Private,
//       }

//       const getBlobResponse: StorageGetJsonBlobResponse = await this.storageApi.storageGetJsonBlob(getStorageBlobRequest)
//       // TODO implement
//       await new Promise(resolve => setTimeout(resolve, 500));
//       let finalItems: Item[] = [];
//       if (getBlobResponse.value && 'items' in getBlobResponse.value) {
//         finalItems = getBlobResponse.value.items as Item[];
//       }
//       return { items: finalItems || [] };
//     } catch (error) {
//       console.error('Error fetching cart:', error);
//       return { items: [] };
//     }
//   }

//   static async addToCart(item: Item): Promise<boolean> {
//     if(!this.sessionToken || !this.currentUserId) {
//       return false;
//     }
//     try {
//       const cart = await SnapserManager.getCart();
//       cart.items.push(item);

//       const newCart: ReplaceJsonBlobRequest = {
//         create: true,
//         value: {
//           items: cart.items
//         },
//       }
//       const replaceBlobRequest: StorageReplaceJsonBlobRequest = {
//         ownerId: this.currentUserId || '',
//         token: this.sessionToken || '',
//         jsonBlobKey: 'cart',
//         accessType: StorageGetJsonBlobRequestAccessTypeEnum.Private,
//         body: newCart,
//       }
//       await this.storageApi.storageReplaceJsonBlob(replaceBlobRequest)
//       return true;
//     } catch (error) {
//       console.error('Error adding to cart:', error);
//       return false;
//     }
//   }

//   static async removeFromCart(item: Item): Promise<boolean> {
//     if(!this.sessionToken || !this.currentUserId) {
//       return false;
//     }
//     try {
//       const cart = await SnapserManager.getCart();
//       cart.items = cart.items.filter(i => i.name !== item.name);
//       const newCart: ReplaceJsonBlobRequest = {
//         create: true,
//         value: {
//           items: cart.items
//         },
//       }
//       const replaceBlobRequest: StorageReplaceJsonBlobRequest = {
//         ownerId: this.currentUserId || '',
//         token: this.sessionToken || '',
//         jsonBlobKey: 'cart',
//         accessType: StorageGetJsonBlobRequestAccessTypeEnum.Private,
//         body: newCart,
//       }
//       await this.storageApi.storageReplaceJsonBlob(replaceBlobRequest)
//       return true;
//     } catch (error) {
//       console.error('Error removing from cart:', error);
//       return false;
//     }
//   }

//   static async resetCart(): Promise<boolean> {
//     if(!this.sessionToken || !this.currentUserId) {
//       return false;
//     }
//     try {
//       const newCart: ReplaceJsonBlobRequest = {
//         create: true,
//         value: {
//           items: []
//         },
//       }
//       const replaceBlobRequest: StorageReplaceJsonBlobRequest = {
//         ownerId: this.currentUserId || '',
//         token: this.sessionToken || '',
//         jsonBlobKey: 'cart',
//         accessType: StorageGetJsonBlobRequestAccessTypeEnum.Private,
//         body: newCart,
//       }
//       await this.storageApi.storageReplaceJsonBlob(replaceBlobRequest)
//       return true;
//     } catch (error) {
//       console.error('Error resetting cart:', error);
//       return false;
//     }
//   }

//   static async getUserProfile(): Promise<Profile | null> {
//     if(!this.sessionToken || !this.currentUserId) {
//       return null;
//     }
//     try {
//       const getProfileRequest: ProfilesGetProfileRequest = {
//         token: this.sessionToken || '',
//         userId: this.currentUserId || '',
//       }
//       const currentProfile: ProfilesGetProfileResponse = await this.profilesApi.profilesGetProfile(getProfileRequest)
//       let userProfile: Profile = {
//         first_name: '',
//         last_name: '',
//         address: '',
//         phone: ''
//       };
//       if (currentProfile.profile) {
//         userProfile = {
//           first_name: 'first_name' in currentProfile.profile ? currentProfile.profile.first_name as string || '' : '',
//           last_name: 'last_name' in currentProfile.profile ? currentProfile.profile.last_name as string || '' : '',
//           address: 'address' in currentProfile.profile ? currentProfile.profile.address as string || '' : '',
//           phone: 'phone' in currentProfile.profile ? currentProfile.profile.phone as string || '' : ''
//         }
//       }
//       // TODO implement
//       return userProfile
//     } catch (error) {
//       console.error('Error fetching profile:', error);
//       return {
//         first_name: '',
//         last_name: '',
//         address: '',
//         phone: ''
//       };
//     }
//   }

//   static async updateUserProfile(profile: Profile): Promise<boolean> {
//     if(!this.sessionToken || !this.currentUserId) {
//       return false;
//     }
//     try {
//       const upsertProfileRequestData: UpsertProfileRequest = {
//         profile: profile
//       }
//       const upsertProfileRequest: ProfilesUpsertProfileRequest = {
//         token: this.sessionToken || '',
//         userId: this.currentUserId || '',
//         body: upsertProfileRequestData
//       }
//       await this.profilesApi.profilesUpsertProfile(upsertProfileRequest)
//       return true;
//     } catch (error) {
//       console.error('Error updating profile:', error);
//       return false;
//     }
//   }
// }

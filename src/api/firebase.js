import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import {
  set,
  get,
  getDatabase,
  ref,
  child,
  update,
  remove,
} from "firebase/database";
import { v4 as uuid } from "uuid";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
};

const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();
const database = getDatabase(app);
export const authService = getAuth();

const auth = getAuth();
export const db = getDatabase(app);

export async function login() {
  return signInWithPopup(auth, provider).catch(console.error);
}

export function logout() {
  auth.signOut().catch(console.error);
}

export function onUserStateChange(callback) {
  // 1. 사용자가 있는 경우 (로그인 한 경우)
  onAuthStateChanged(auth, async (user) => {
    // 로그인 정보가 변경될 때마다 실행
    const updatedUser = user && (await adminUser(user));
    callback(updatedUser);
  });
}

async function adminUser(user) {
  return get(ref(database, "admins")) //
    .then((snapshot) => {
      if (snapshot.exists()) {
        const admins = snapshot.val();
        const isAdmin = admins.includes(user?.uid);
        return { ...user, isAdmin };
      }
      return user;
    });
}

export function addNewProduct(product, image) {
  const id = uuid();
  set(ref(database, `products/${id}`), {
    ...product,
    id,
    price: parseInt(product.price),
    img_url: image,
    sizes: product.sizes.split(","),
  });
}

export async function setAddToCart(userId, item) {
  const cartRef = ref(database, `/cart/${userId}/${item.id}`);
  try {
    const snapshot = await get(cartRef);
    if (snapshot.exists()) {
      const existingItem = snapshot.val();
      const updatedQuantity = existingItem.quantity + item.quantity;
      updateCartQuantity(userId, item.id, updatedQuantity);
    } else {
      await set(cartRef, item);
    }
  } catch (error) {
    console.error();
  }
}

export async function updateCartQuantity(userId, id, quantity) {
  try {
    const cartItemRef = ref(db, `cart/${userId}/${id}`);
    await update(cartItemRef, { quantity });
    console.log("Cart quantity updated successfully");
  } catch (error) {
    console.error("Error updating cart quantity:", error);
  }
}

export async function deleteCartItem(id) {
  try {
    const cartItemRef = id ? ref(db, `cart/${id}`) : ref(db, "cart");
    await remove(cartItemRef);
  } catch (error) {
    console.error("Error deleting cart item: ", error);
  }
}

export async function getCart(userId) {
  const dbRef = ref(db);
  try {
    const snapshot = await get(child(dbRef, `/cart/${userId}`));
    if (snapshot.exists()) {
      const carts = snapshot.val();
      return Object.values(carts);
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function getProducts() {
  const dbRef = ref(db);
  try {
    const snapshot = await get(child(dbRef, "/products"));
    if (snapshot.exists()) {
      const products = snapshot.val();
      return Object.values(products);
    } else {
      console.log("No data available");
      return [];
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

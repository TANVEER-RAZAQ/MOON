import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import { storefrontApi } from './services/storefront-api';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    [storefrontApi.reducerPath]: storefrontApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(storefrontApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

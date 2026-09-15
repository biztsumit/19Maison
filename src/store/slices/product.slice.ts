import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ProductService } from '@/api/services/product.service';
import type { Product, ProductListParams } from '@/types';

interface ProductState {
  featured: Product[];
  latest: Product[];
  collectorsEdition: Product[];
  searchResults: Product[];
  selectedProduct: Product | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  featured: [],
  latest: [],
  collectorsEdition: [],
  searchResults: [],
  selectedProduct: null,
  isLoading: false,
  error: null,
};

export const fetchFeaturedThunk = createAsyncThunk('products/featured', async () => {
  return ProductService.getFeatured();
});

export const fetchLatestThunk = createAsyncThunk('products/latest', async () => {
  return ProductService.getLatest();
});

export const fetchCollectorsEditionThunk = createAsyncThunk('products/collectors', async () => {
  return ProductService.getCollectorsEdition();
});

export const fetchProductThunk = createAsyncThunk('products/detail', async (id: string) => {
  return ProductService.getProduct(id);
});

export const searchProductsThunk = createAsyncThunk(
  'products/search',
  async (params: ProductListParams) => {
    const res = await ProductService.getProducts(params);
    return res.products;
  },
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearSelectedProduct(state) {
      state.selectedProduct = null;
    },
    clearSearchResults(state) {
      state.searchResults = [];
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchFeaturedThunk.pending, state => { state.isLoading = true; })
      .addCase(fetchFeaturedThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.featured = action.payload;
      })
      .addCase(fetchLatestThunk.fulfilled, (state, action) => {
        state.latest = action.payload;
      })
      .addCase(fetchCollectorsEditionThunk.fulfilled, (state, action) => {
        state.collectorsEdition = action.payload;
      })
      .addCase(fetchProductThunk.fulfilled, (state, action) => {
        state.selectedProduct = action.payload;
      })
      .addCase(searchProductsThunk.fulfilled, (state, action) => {
        state.searchResults = action.payload;
      })
      .addMatcher(
        action => action.type.startsWith('products/') && action.type.endsWith('/rejected'),
        (state, action: { error: { message?: string } }) => {
          state.isLoading = false;
          state.error = action.error.message ?? 'Failed to load products';
        },
      );
  },
});

export const { clearSelectedProduct, clearSearchResults } = productSlice.actions;
export default productSlice.reducer;

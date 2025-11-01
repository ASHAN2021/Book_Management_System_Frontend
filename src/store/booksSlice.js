import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  books: [],
  currentBook: null,
  loading: false,
  error: null,
  searchQuery: '',
  operationLoading: false,
  operationSuccess: false,
  // Pagination state
  currentPage: 1,
  totalPages: 1,
  totalCount: 0,
  pageSize: 10,
  hasNextPage: false,
  hasPreviousPage: false,
};

export const fetchBooks = createAsyncThunk(
  'books/fetchBooks',
  async ({ apolloClient, search = '', page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const { GET_BOOKS, SEARCH_BOOKS } = await import('@/lib/queries');
      const { data } = await apolloClient.query({
        query: search ? SEARCH_BOOKS : GET_BOOKS,
        variables: search ? { search, page, limit } : { page, limit },
        fetchPolicy: 'network-only',
      });
      return search ? data.searchBooks : data.books;
    } catch (error) {
      const message = error.graphQLErrors?.[0]?.message || error.message || 'Failed to fetch books';
      return rejectWithValue(message);
    }
  }
);

export const fetchBookById = createAsyncThunk(
  'books/fetchBookById',
  async ({ apolloClient, id }, { rejectWithValue }) => {
    try {
      const { GET_BOOK } = await import('@/lib/queries');
      const { data } = await apolloClient.query({
        query: GET_BOOK,
        variables: { id },
        fetchPolicy: 'network-only',
      });
      return data.book;
    } catch (error) {
      const message = error.graphQLErrors?.[0]?.message || error.message || 'Failed to fetch book';
      return rejectWithValue(message);
    }
  }
);

export const createBook = createAsyncThunk(
  'books/createBook',
  async ({ apolloClient, bookData }, { rejectWithValue }) => {
    try {
      const { ADD_BOOK } = await import('@/lib/queries');
      const { data } = await apolloClient.mutate({
        mutation: ADD_BOOK,
        variables: {
          input: {
            title: bookData.title,
            author: bookData.author,
            publishedYear: Number(bookData.publishedYear),
            genre: bookData.genre,
          },
        },
      });
      return data.createBook;
    } catch (error) {
      const message = error.graphQLErrors?.[0]?.message || error.message || 'Failed to create book';
      return rejectWithValue(message);
    }
  }
);

export const updateBookById = createAsyncThunk(
  'books/updateBookById',
  async ({ apolloClient, id, bookData }, { rejectWithValue }) => {
    try {
      const { UPDATE_BOOK } = await import('@/lib/queries');
      const { data } = await apolloClient.mutate({
        mutation: UPDATE_BOOK,
        variables: {
          id,
          input: {
            title: bookData.title,
            author: bookData.author,
            publishedYear: Number(bookData.publishedYear),
            genre: bookData.genre,
          },
        },
      });
      return data.updateBook;
    } catch (error) {
      const message = error.graphQLErrors?.[0]?.message || error.message || 'Failed to update book';
      return rejectWithValue(message);
    }
  }
);

export const deleteBookById = createAsyncThunk(
  'books/deleteBookById',
  async ({ apolloClient, id }, { rejectWithValue }) => {
    try {
      const { DELETE_BOOK } = await import('@/lib/queries');
      await apolloClient.mutate({
        mutation: DELETE_BOOK,
        variables: { id },
      });
      return id;
    } catch (error) {
      const message = error.graphQLErrors?.[0]?.message || error.message || 'Failed to delete book';
      return rejectWithValue(message);
    }
  }
);

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
      state.currentPage = 1;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearOperationSuccess: (state) => {
      state.operationSuccess = false;
    },
    clearBooks: (state) => {
      state.books = [];
      state.currentBook = null;
      state.searchQuery = '';
      state.error = null;
      state.operationSuccess = false;
      state.currentPage = 1;
      state.totalPages = 1;
      state.totalCount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.books) {
          state.books = action.payload.books;
          state.totalCount = action.payload.totalCount || 0;
          state.totalPages = action.payload.totalPages || 1;
          state.currentPage = action.payload.currentPage || 1;
          state.hasNextPage = action.payload.hasNextPage || false;
          state.hasPreviousPage = action.payload.hasPreviousPage || false;
        } else {
          state.books = action.payload;
        }
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Book By ID
    builder
      .addCase(fetchBookById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBook = action.payload;
      })
      .addCase(fetchBookById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create Book
    builder
      .addCase(createBook.pending, (state) => {
        state.operationLoading = true;
        state.error = null;
        state.operationSuccess = false;
      })
      .addCase(createBook.fulfilled, (state, action) => {
        state.operationLoading = false;
        state.books.push(action.payload);
        state.operationSuccess = true;
      })
      .addCase(createBook.rejected, (state, action) => {
        state.operationLoading = false;
        state.error = action.payload;
        state.operationSuccess = false;
      });

    // Update Book
    builder
      .addCase(updateBookById.pending, (state) => {
        state.operationLoading = true;
        state.error = null;
        state.operationSuccess = false;
      })
      .addCase(updateBookById.fulfilled, (state, action) => {
        state.operationLoading = false;
        const index = state.books.findIndex(book => book.id === action.payload.id);
        if (index !== -1) {
          state.books[index] = action.payload;
        }
        if (state.currentBook?.id === action.payload.id) {
          state.currentBook = action.payload;
        }
        state.operationSuccess = true;
      })
      .addCase(updateBookById.rejected, (state, action) => {
        state.operationLoading = false;
        state.error = action.payload;
        state.operationSuccess = false;
      });

    // Delete Book
    builder
      .addCase(deleteBookById.pending, (state) => {
        state.operationLoading = true;
        state.error = null;
        state.operationSuccess = false;
      })
      .addCase(deleteBookById.fulfilled, (state, action) => {
        state.operationLoading = false;
        state.books = state.books.filter(book => book.id !== action.payload);
        if (state.currentBook?.id === action.payload) {
          state.currentBook = null;
        }
        state.operationSuccess = true;
      })
      .addCase(deleteBookById.rejected, (state, action) => {
        state.operationLoading = false;
        state.error = action.payload;
        state.operationSuccess = false;
      });
  },
});

export const {
  setSearchQuery,
  setCurrentPage,
  setPageSize,
  clearError,
  clearOperationSuccess,
  clearBooks,
} = booksSlice.actions;

export default booksSlice.reducer;

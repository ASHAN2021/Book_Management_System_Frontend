'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApolloClient } from '@apollo/client/react';
import {
  Container, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, TextField, Button, CircularProgress, Alert,
} from '@mui/material';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { initializeAuth } from '@/store/authSlice';
import { fetchBooks, setSearchQuery, setCurrentPage, setPageSize, clearError } from '@/store/booksSlice';
import styles from './booksList.module.css';

export default function BooksList() {
  const router = useRouter();
  const dispatch = useDispatch();
  const apolloClient = useApolloClient();
  
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const { 
    books, 
    searchQuery, 
    loading, 
    error,
    currentPage,
    totalPages,
    totalCount,
    pageSize,
    hasNextPage,
    hasPreviousPage
  } = useSelector((state) => state.books);
  
  const [isSearching, setIsSearching] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    dispatch(initializeAuth());
  }, [dispatch]);

  useEffect(() => {
    if (isClient && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isClient, isAuthenticated, router]);

  useEffect(() => {

    if (isClient && isAuthenticated) {
      dispatch(clearError());
      dispatch(fetchBooks({ 
        apolloClient, 
        search: isSearching ? searchQuery : '',
        page: currentPage,
        limit: pageSize
      }));
    }
  }, [isClient, isAuthenticated, isSearching, searchQuery, currentPage, pageSize, dispatch, apolloClient]);


  if (!isClient) {
    return (
      <Container maxWidth="lg" className={styles.clientLoading}>
        <CircularProgress />
      </Container>
    );
  }


  if (!isAuthenticated) {
    return null;
  }

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setIsSearching(true);
      dispatch(setCurrentPage(1));
    } else {
      setIsSearching(false);
    }
  };

  const handleClearSearch = () => {
    dispatch(setSearchQuery(''));
    setIsSearching(false);
    dispatch(setCurrentPage(1));
  };

  const handlePageChange = (newPage) => {
    dispatch(setCurrentPage(newPage));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageSizeChange = (event) => {
    dispatch(setPageSize(Number(event.target.value)));
  };

  return (
    <Container maxWidth="lg" className={styles.container}>
      <div className={styles.searchSection}>
        <TextField
          fullWidth
          label="Search title / author / genre"
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          className={styles.searchField}
        />
        <Button 
          variant="contained" 
          color="primary"
          size="large"
          onClick={handleSearch}
          className={styles.searchButton}
        >
          Search
        </Button>
        {isSearching && (
          <Button
            variant="outlined"
            color="primary"
            size="large"
            onClick={handleClearSearch}
            className={styles.clearButton}
          >
            Clear
          </Button>
        )}
      </div>


      {loading && (
        <div className={styles.loading}>
          <CircularProgress />
        </div>
      )}


      {error && (
        <Alert severity="error" className={styles.error}>
          {error}
        </Alert>
      )}


      <TableContainer component={Paper} className={styles.tableContainer}>
        <Table>
          <TableHead className={styles.tableHead}>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Year</TableCell>
              <TableCell>Genre</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className={styles.tableBody}>
            {books.map((b) => (
              <TableRow key={b.id}>
                <TableCell>{b.title}</TableCell>
                <TableCell>{b.author}</TableCell>
                <TableCell>{b.publishedYear}</TableCell>
                <TableCell>{b.genre}</TableCell>
                <TableCell>
                  <div className={styles.actionLinks}>
                    <Link href={`/books/${b.id}`} className={styles.actionLink}>
                      View
                    </Link>
                    <span className={styles.linkSeparator}>|</span>
                    <Link href={`/books/edit/${b.id}`} className={styles.actionLink}>
                      Edit
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>


      {/* Pagination Controls */}
      {!loading && books.length > 0 && (
        <div className={styles.paginationContainer}>
          <div className={styles.paginationInfo}>
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} books
          </div>

          <div className={styles.paginationControls}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!hasPreviousPage || loading}
              className={styles.pageButton}
            >
              Previous
            </Button>

            <div className={styles.pageNumbers}>
              {[...Array(totalPages)].map((_, index) => {
                const pageNum = index + 1;
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                ) {
                  return (
                    <Button
                      key={pageNum}
                      variant={pageNum === currentPage ? 'contained' : 'outlined'}
                      color="primary"
                      onClick={() => handlePageChange(pageNum)}
                      disabled={loading}
                      className={pageNum === currentPage ? styles.activePageButton : styles.pageButton}
                    >
                      {pageNum}
                    </Button>
                  );
                } else if (
                  pageNum === currentPage - 2 ||
                  pageNum === currentPage + 2
                ) {
                  return <span key={pageNum} className={styles.pageEllipsis}>...</span>;
                }
                return null;
              })}
            </div>

            <Button
              variant="outlined"
              color="primary"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!hasNextPage || loading}
              className={styles.pageButton}
            >
              Next
            </Button>
          </div>

          <div className={styles.pageSizeSelector}>
            <label htmlFor="pageSize">Items per page:</label>
            <select 
              id="pageSize"
              value={pageSize} 
              onChange={handlePageSizeChange}
              className={styles.pageSizeSelect}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>
      )}

      <Button
        variant="contained"
        color="primary"
        size="large"
        href="/books/add"
        className={styles.addButton}
      >
        Add New Book
      </Button>
    </Container>
  );
}
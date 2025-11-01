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
import { fetchBooks, setSearchQuery, clearError } from '@/store/booksSlice';
import styles from './booksList.module.css';

export default function BooksList() {
  const router = useRouter();
  const dispatch = useDispatch();
  const apolloClient = useApolloClient();
  
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const { books, searchQuery, loading, error } = useSelector((state) => state.books);
  
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
      dispatch(fetchBooks({ apolloClient, search: isSearching ? searchQuery : '' }));
    }
  }, [isClient, isAuthenticated, isSearching, searchQuery, dispatch, apolloClient]);


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
    } else {
      setIsSearching(false);
    }
  };

  const handleClearSearch = () => {
    dispatch(setSearchQuery(''));
    setIsSearching(false);
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
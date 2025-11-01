'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useApolloClient } from '@apollo/client/react';
import { Container, Paper, Typography, Chip, Button, CircularProgress, Alert } from '@mui/material';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBookById, deleteBookById, clearOperationSuccess, clearError } from '@/store/booksSlice';
import styles from './bookDetail.module.css';

export default function BookDetail() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const apolloClient = useApolloClient();
  
  const { currentBook, loading, operationLoading, error, operationSuccess } = useSelector((state) => state.books);

  useEffect(() => {
    dispatch(clearError());
    dispatch(clearOperationSuccess());
    
    dispatch(fetchBookById({ apolloClient, id }));
  }, [dispatch, apolloClient, id]);

  useEffect(() => {
    if (operationSuccess) {
      router.push('/books');
    }
  }, [operationSuccess, router]);

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this book?')) {
      dispatch(deleteBookById({ apolloClient, id }));
    }
  };

  if (loading) return (
    <Container maxWidth="md" className={styles.loading}>
      <CircularProgress />
    </Container>
  );
  
  if (error) return (
    <Container maxWidth="md" className={styles.container}>
      <Alert severity="error" className={styles.error}>{error}</Alert>
    </Container>
  );

  if (!currentBook) return null;

  const book = currentBook;

  return (
    <Container maxWidth="md" className={styles.container}>
      <Paper elevation={3} className={styles.paper}>
        <Typography variant="h3" component="h1" className={styles.title}>
          {book.title}
        </Typography>

        <Typography variant="h6" className={styles.authorInfo}>
          by <strong>{book.author}</strong> • Published in {book.publishedYear}
        </Typography>

        <Chip label={book.genre} color="primary" className={styles.genreChip} />

        <div className={styles.buttonGroup}>
          <Link href={`/books/edit/${id}`} style={{ textDecoration: 'none' }}>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              className={styles.button}
            >
              Edit Book
            </Button>
          </Link>
          
          <Button 
            variant="contained" 
            color="error" 
            size="large"
            onClick={handleDelete}
            disabled={operationLoading}
            className={styles.button}
          >
            {operationLoading ? 'Deleting...' : 'Delete Book'}
          </Button>
          
          <Button 
            variant="outlined" 
            color="primary"
            size="large"
            onClick={() => router.back()}
            className={styles.button}
          >
            Back to List
          </Button>
        </div>
      </Paper>
    </Container>
  );
}
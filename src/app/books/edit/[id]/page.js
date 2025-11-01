'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useApolloClient } from '@apollo/client/react';
import {
  Container, Paper, TextField, Button, Typography, Alert, CircularProgress,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBookById, updateBookById, clearOperationSuccess, clearError } from '@/store/booksSlice';
import styles from './editBook.module.css';

export default function EditBook() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const apolloClient = useApolloClient();
  
  const { currentBook, loading, operationLoading, error, operationSuccess } = useSelector((state) => state.books);

  const [form, setForm] = useState({
    title: '',
    author: '',
    publishedYear: '',
    genre: '',
  });

  useEffect(() => {
    dispatch(clearError());
    dispatch(clearOperationSuccess());
    

    dispatch(fetchBookById({ apolloClient, id }));
  }, [dispatch, apolloClient, id]);

  useEffect(() => {
    if (currentBook) {
      setForm({
        title: currentBook.title,
        author: currentBook.author,
        publishedYear: String(currentBook.publishedYear),
        genre: currentBook.genre,
      });
    }
  }, [currentBook]);

  useEffect(() => {
    if (operationSuccess) {
      router.push('/books');
    }
  }, [operationSuccess, router]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateBookById({ apolloClient, id, bookData: form }));
  };

  if (loading) return (
    <Container maxWidth="sm" className={styles.loading}>
      <CircularProgress />
    </Container>
  );

  return (
    <Container maxWidth="sm" className={styles.container}>
      <Paper elevation={3} className={styles.paper}>
        <Typography variant="h4" component="h1" className={styles.title}>
          Edit Book
        </Typography>

        <form onSubmit={handleSubmit} className={styles.form}>
          <TextField 
            fullWidth 
            label="Title" 
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className={styles.textField}
            required 
          />
          <TextField 
            fullWidth 
            label="Author" 
            value={form.author}
            onChange={(e) => setForm({ ...form, author: e.target.value })}
            className={styles.textField}
            required 
          />
          <TextField 
            fullWidth 
            label="Published Year" 
            type="number" 
            value={form.publishedYear}
            onChange={(e) => setForm({ ...form, publishedYear: e.target.value })}
            className={styles.textField}
            required 
          />
          <TextField 
            fullWidth 
            label="Genre" 
            value={form.genre}
            onChange={(e) => setForm({ ...form, genre: e.target.value })}
            className={styles.textField}
            required 
          />

          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            size="large"
            fullWidth 
            disabled={operationLoading}
            className={styles.submitButton}
          >
            {operationLoading ? (
              <CircularProgress size={24} className={styles.loadingSpinner} />
            ) : (
              'Save Changes'
            )}
          </Button>

          {error && (
            <Alert severity="error" className={styles.error}>
              {error}
            </Alert>
          )}
        </form>
      </Paper>
    </Container>
  );
}
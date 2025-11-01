'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApolloClient } from '@apollo/client/react';
import {
  Container, Paper, TextField, Button, Typography, Alert, CircularProgress,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { createBook, clearOperationSuccess, clearError } from '@/store/booksSlice';
import styles from './addBook.module.css';

export default function AddBook() {
  const router = useRouter();
  const dispatch = useDispatch();
  const apolloClient = useApolloClient();
  
  const { operationLoading, error, operationSuccess } = useSelector((state) => state.books);
  
  const [form, setForm] = useState({
    title: '',
    author: '',
    publishedYear: '',
    genre: '',
  });

  useEffect(() => {
    dispatch(clearError());
    dispatch(clearOperationSuccess());
  }, [dispatch]);

  useEffect(() => {
    if (operationSuccess) {
      router.push('/books');
    }
  }, [operationSuccess, router]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createBook({ apolloClient, bookData: form }));
  };

  return (
    <Container maxWidth="sm" className={styles.container}>
      <Paper elevation={3} className={styles.paper}>
        <Typography variant="h4" component="h1" className={styles.title}>
          Add New Book
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
              'Add Book'
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
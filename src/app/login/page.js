'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApolloClient } from '@apollo/client/react';
import {
  Container, Paper, TextField, Button, Typography, Alert,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '@/store/authSlice';
import styles from './login.module.css';

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const apolloClient = useApolloClient();
  

  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
  

  const [credentials, setCredentials] = useState({ username: '', password: '' });


  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);


  useEffect(() => {
    if (isAuthenticated) {
      router.push('/books');
    }
  }, [isAuthenticated, router]);


  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({
      apolloClient,
      username: credentials.username,
      password: credentials.password,
    }));
  };

  return (
    <Container maxWidth="xs" className={styles.container}>
      <Paper elevation={3} className={styles.paper}>
        <Typography variant="h4" component="h1" className={styles.title}>
          🔐 Login
        </Typography>

        <form onSubmit={handleSubmit} className={styles.form}>
          <TextField
            fullWidth
            label="Username"
            value={credentials.username}
            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
            className={styles.textField}
            required
            autoComplete="username"
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            className={styles.textField}
            required
            autoComplete="current-password"
          />
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            size="large"
            fullWidth 
            disabled={loading}
            className={styles.submitButton}
          >
            {loading ? 'Logging in…' : 'Login'}
          </Button>
          {error && (
            <Alert severity="error" className={styles.error}>
              {error}
            </Alert>
          )}
        </form>

        <div className={styles.divider}>or</div>

        <Button 
          href="/register" 
          fullWidth
          className={styles.registerButton}
        >
          Create an account
        </Button>
      </Paper>
    </Container>
  );
}
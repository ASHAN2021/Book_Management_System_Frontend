'use client';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useApolloClient } from '@apollo/client/react';
import { useSelector, useDispatch } from 'react-redux';
import { logout as logoutAction, initializeAuth } from '@/store/authSlice';
import { clearBooks } from '@/store/booksSlice';
import styles from './Layout.module.css';

export default function Layout({ children }) {
  const router = useRouter();
  const client = useApolloClient();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Initialize auth state from localStorage on mount
    dispatch(initializeAuth());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logoutAction());
    dispatch(clearBooks());
    client.clearStore();
    router.push('/');
  };

  return (
    <>
      <AppBar position="static" className={styles.appBar}>
        <Toolbar className={styles.toolbar}>
          <Typography variant="h6" component="div" className={styles.logo}>
            <Link href="/" className={styles.logoLink}>
              📚 Book Library
            </Link>
          </Typography>

          <Button 
            color="inherit" 
            href="/books"
            className={styles.navButton}
          >
            Books
          </Button>

          {mounted && (
            <>
              {isAuthenticated ? (
                <>
                  <Button 
                    color="inherit" 
                    href="/books/add"
                    className={styles.navButton}
                  >
                    Add Book
                  </Button>
                  <Button 
                    color="inherit" 
                    onClick={handleLogout}
                    className={styles.logoutButton}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    color="inherit" 
                    href="/login"
                    className={styles.navButton}
                  >
                    Login
                  </Button>
                  <Button 
                    color="inherit" 
                    href="/register"
                    className={styles.navButton}
                  >
                    Register
                  </Button>
                </>
              )}
            </>
          )}
        </Toolbar>
      </AppBar>

      <main className={styles.main}>{children}</main>
    </>
  );
}
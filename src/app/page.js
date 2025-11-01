import { Container, Typography, List, ListItem, ListItemText, Paper } from '@mui/material';
import styles from './home.module.css';

export default function Home() {
  const features = [
    { icon: '🔍', text: 'Browse & search books' },
    { icon: '📖', text: 'View detailed book info' },
    { icon: '➕', text: 'Add new books' },
    { icon: '✏️', text: 'Edit existing books' },
    { icon: '🔐', text: 'Secure login / registration' },
  ];

  return (
    <Container maxWidth="md" className={styles.container}>
      <Paper elevation={3} className={styles.paper}>
        <Typography variant="h2" component="h1" className={styles.mainTitle}>
          Welcome to Book Library
        </Typography>
        <Typography variant="h5" component="h2" className={styles.subtitle}>
          Manage your collection with ease!
        </Typography>

        <List className={styles.featuresList}>
          {features.map((feature, i) => (
            <ListItem key={i} className={styles.listItem}>
              <span className={styles.featureIcon}>{feature.icon}</span>
              <ListItemText 
                primary={feature.text}
                className={styles.listItemText}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
}
import styles from './Footer.module.scss';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.column}>
            <h3>Flour & Fantasies Bakery</h3>
            <p>Handcrafted with love,  baked to perfection.</p>
          </div>
          
          <div className={styles.column}>
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/menu">Menu</a></li>
              <li><a href="/about">About Us</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>
          
          <div className={styles.column}>
            <h4>Contact</h4>
            <p>Email: hello@flourandfantasies.com</p>
            <p>Phone: (555) 123-4567</p>
          </div>
        </div>
        
        <div className={styles.copyright}>
          <p>&copy; 2024 Flour & Fantasies Bakery. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
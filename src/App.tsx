import logo from './logo.svg';
import styles from './App.module.scss';
import Button from 'react-bootstrap/Button';

export default function App () {
  return (
    <div className={ styles.scope }>
      <Button>Click!</Button>
    </div>
  );
}

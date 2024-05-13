import { getStorage } from 'firebase/storage';
import { initializeApp } from 'firebase/app';

// Cấu hình Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDeIsfjXgm7rxdcW5sYjifh7-cFTtvzfN0",
  authDomain: "gnosis-reactjs.firebaseapp.com",
  projectId: "gnosis-reactjs",
  storageBucket: "gnosis-reactjs.appspot.com",
  messagingSenderId: "1053304152744",
  appId: "1:1053304152744:web:ac42287e9686be7381d89d",
  measurementId: "G-TL8S27343R"
};

const app = initializeApp(firebaseConfig);
export const imagedb = getStorage(app);


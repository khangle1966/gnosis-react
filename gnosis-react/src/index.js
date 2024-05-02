import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux'; // Nhập Provider từ react-redux
import store from './redux/store'; // Đảm bảo rằng bạn đã nhập store từ đúng đường dẫn
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}> {/* Sử dụng Provider để bao bọc App và GoogleOAuthProvider */}
    <GoogleOAuthProvider clientId="840218405895-07abtcjiasttgjuidc5rdjt5nlh667d4.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

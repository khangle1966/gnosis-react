// App.js
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/LoginPage/LoginPage'; // Thay đổi đường dẫn tương ứng với cấu trúc dự án của bạn
import Home from './pages/HomePage/HomePage'; // Tạo một file HomePage.js tương tự như LoginPage.js
import Welcome from './pages/Welcome/Welcome'; // Tạo một file HomePage.js tương tự như LoginPage.js
import store from './redux/store';
function App() {
  return (
    <Provider store={store} >
      < Router >
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/welcome" element={<Welcome />} />
          {/* Chuyển hướng tự động người dùng đến trang đăng nhập nếu họ truy cập đường dẫn '/' */}
          <Route path="/" element={<Navigate replace to="/welcome" />} />
          {/* Thêm các đường dẫn khác tại đây nếu cần */}
        </Routes>
      </Router >
    </Provider>

  );
}

export default App;

// App.js
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/LoginPage/LoginPage'; // Thay đổi đường dẫn tương ứng với cấu trúc dự án của bạn
<<<<<<< HEAD
import Home from './pages/HomePage/HomePage'; // Tạo một file HomePage.js tương tự như LoginPage.js
import Welcome from './pages/Welcome/Welcome'; // Tạo một file HomePage.js tương tự như LoginPage.js
import Register from './pages/Register/register'
=======
import Welcome from './pages/Welcome/Welcome'; // Tạo một file HomePage.js tương tự như LoginPage.js
import Register from './pages/Register/register'
import Layout from "./pages/layout/Layout"
import BrowseCoursePage from './pages/layout/BrowseCoursePage/BrowseCoursePage'
import CourseDetailPage from './pages/layout/BrowseCoursePage/component/CourseDetailPage/CourseDetailPage'
>>>>>>> 916cca0 (a)
import store from './redux/store';
function App() {
  return (
    <Provider store={store} >
      < Router >
        <Routes>
          <Route path="/login" element={<Login />} />
<<<<<<< HEAD
          <Route path="/home" element={<Home />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/register" element={<Register />} />
=======
          <Route path="/welcome" element={<Welcome />} />

          <Route path="/register" element={<Register />} />

          <Route path="/" element={<Layout />}>
            <Route path="browsecourse" element={<BrowseCoursePage />} />
            <Route path="course/:courseId" element={<CourseDetailPage />} />
            <Route path="/" element={<Navigate replace to="/welcome" />} />
          </Route>
>>>>>>> 916cca0 (a)
          {/* Chuyển hướng tự động người dùng đến trang đăng nhập nếu họ truy cập đường dẫn '/' */}
          <Route path="/" element={<Navigate replace to="/welcome" />} />
          {/* Thêm các đường dẫn khác tại đây nếu cần */}
        </Routes>
      </Router >
    </Provider>

  );
}

export default App;

// App.js
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/LoginPage/LoginPage'; // Thay đổi đường dẫn tương ứng với cấu trúc dự án của bạn
import Welcome from './pages/Welcome/Welcome'; // Tạo một file HomePage.js tương tự như LoginPage.js
import Register from './pages/Register/register'
import CreateProfilePage from './pages/CreateProfilePage/createprofilepage'
import Layout from "./pages/layout/Layout"
import LayoutNologin from "./pages/layout/LayoutNologin"

import BrowseCoursePage from './pages/layout/BrowseCoursePage/BrowseCoursePage'
import CourseDetailPage from './pages/layout/BrowseCoursePage/component/CourseDetailPage/CourseDetailPage'
import store from './redux/store';
import ProfilePage from './pages/layout/ProfilePage/ProfilePage';
import CartPage from './pages/layout/Cart/cart';
import InstructorsPage from './pages/layout/InstructorsPage/InstructorsPage';
import HomePage from './pages/layout/HomePage/Homepage';
import LessonPage from './pages/layout/BrowseCoursePage/component/LessonPage/LessonPage';
import PaymentPage from './pages/layout/Cart/component/payment';
import BrowseCourseNoLoginPage from './pages/layout/BrowseCourseNoLoginPage/BrowseCourseNoLoginPage';
import CourseDetailPageNologin from './pages/layout/BrowseCourseNoLoginPage/component/CourseDetailPageNologin/CourseDetailPageNologin';
function App() {
  return (
    <Provider store={store} >
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate replace to="/welcome" />} />
            <Route path="/browsecourse" element={<BrowseCoursePage />} />
            <Route path="/home" element={<HomePage />} />

            <Route path="course/:courseId" element={<CourseDetailPage />} />
            <Route path="/profile" element={< ProfilePage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/instructor" element={<InstructorsPage />} />
            <Route path="/payment" element={<PaymentPage />} />

          </Route>
          <Route path="/" element={<LayoutNologin />}>


            <Route path="/browsecoursenologin" element={<BrowseCourseNoLoginPage />} />
            <Route path="/coursedetailpagenologin/:courseId" element={<CourseDetailPageNologin />} />


          </Route>


          <Route path="/login" element={<Login />} />
          <Route path="course/:courseId/lesson/:lessonId" element={<LessonPage />} />

          <Route path="/welcome" element={<Welcome />} />


          <Route path="/register" element={<Register />} />
          <Route path="/createprofile" element={<CreateProfilePage />} />
        </Routes>
      </Router>
    </Provider>

  );
}

export default App;

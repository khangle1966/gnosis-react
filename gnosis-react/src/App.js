import React from 'react';
import { Provider } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/LoginPage/LoginPage';
import Welcome from './pages/Welcome/Welcome';
import Register from './pages/Register/register';
import CreateProfilePage from './pages/CreateProfilePage/createprofilepage';
import Layout from "./pages/layout/Layout";
import LayoutNologin from "./pages/layout/LayoutNologin";
import Adminlayout from './pages/AdminPage/Adminlayout';
import BrowseCoursePage from './pages/layout/BrowseCoursePage/BrowseCoursePage';
import CourseDetailPage from './pages/layout/BrowseCoursePage/component/CourseDetailPage/CourseDetailPage';
import store from './redux/store';
import ProfilePage from './pages/layout/ProfilePage/ProfilePage';
import CartPage from './pages/layout/Cart/cart';
import InstructorsPage from './pages/layout/InstructorsPage/InstructorsPage';
import HomePage from './pages/layout/HomePage/Homepage';
import LessonPage from './pages/layout/BrowseCoursePage/component/LessonPage/LessonPage';
import BrowseCourseNoLoginPage from './pages/layout/BrowseCourseNoLoginPage/BrowseCourseNoLoginPage';
import CourseDetailPageNologin from './pages/layout/BrowseCourseNoLoginPage/component/CourseDetailPageNologin/CourseDetailPageNologin';
import AdminPage from './pages/AdminPage/AdminPage';
import Admin_InstructorSalary from './pages/AdminPage/component/InstructorSalary/Admin_InstructorSalary';
import UserManagementPage from './pages/AdminPage/component/UserManagementPage/UserManagementPage';
import AddUserPage from './pages/AdminPage/component/UserManagementPage/AddUserPage/AddUserPage';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import ProfileInstructorPage from './pages/layout/ProfileInstructorPage/ProfileInstructorPage'
function App() {
  return (
    <Provider store={store}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate replace to="/welcome" />} />
              <Route path="/browsecourse" element={<BrowseCoursePage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="course/:courseId" element={<CourseDetailPage />} />
              <Route path="/profile" element={< ProfilePage />} />
              <Route path='/profileinstructor/:id' element={<ProfileInstructorPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/instructor" element={<InstructorsPage />} />
            </Route>
            <Route path="/" element={<LayoutNologin />}>
              <Route path="/browsecoursenologin" element={<BrowseCourseNoLoginPage />} />
              <Route path="/coursedetailpagenologin/:courseId" element={<CourseDetailPageNologin />} />
            </Route>
            <Route path="/" element={<Adminlayout />}>
              <Route path="/admin" element={<Navigate replace to="/admin/dashboard" />} />
              <Route path="/admin/dashboard" element={<AdminPage />} />
              <Route path="/admin/user-list" element={<UserManagementPage />} />
              <Route path="/admin/add-user" element={<AddUserPage />} />
              <Route path="/admin/instructor-salary" element={<Admin_InstructorSalary />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="course/:courseId/lesson/:lessonId" element={<LessonPage />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/register" element={<Register />} />
            <Route path="/createprofile" element={<CreateProfilePage />} />
          </Routes>
        </Router>
      </LocalizationProvider>
    </Provider>
  );
}

export default App;

import React from 'react'
import { Routes, Route } from 'react-router-dom'
import NotFound from './routers/NotFound'
import HomePage from './users/members/pages/HomePage'
import Catalog from './users/members/pages/Catalog'
import Bookmarks from './users/members/pages/Bookmarks'
import Cart from './users/members/pages/Cart'
import Profile from './users/members/pages/Profile'
import Dashboard from './users/admin/pages/Dashboard'
import AddBook from './users/admin/pages/AddBook'
import Inventory from './users/admin/pages/Inventory'
import Announcement from './users/admin/pages/Announcement'
import Sales from './users/admin/pages/Sales'
import Staff from './users/admin/pages/Staff'
import Orders from './users/admin/pages/Orders'
import StaffHome from './users/staff/pages/StaffHome'
import ViewOrders from './users/staff/pages/ViewOrders'
import Login from './users/members/pages/Login'
import Register from './users/members/pages/Register'
import StaffLogin from './users/staff/pages/StaffLogin'
import AdminAuth from './users/admin/pages/AdminAuth'
import BookDetailPage from './users/members/pages/BookDetailPage'
import ProductPage from './users/members/pages/Catalog'
function App() {

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/catalog" element={<ProductPage />} />
      <Route path="/book/:bookId" element={ <BookDetailPage/>} />
      <Route path="/bookmarks" element={<Bookmarks />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/profile" element={<Profile />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />

      <Route path="/admin" element={<AdminAuth />} />
      <Route path="/admin/dashboard" element={<Dashboard/>} />
      <Route path="/admin/add-book" element={<AddBook/>} />
      <Route path="/admin/inventory" element={<Inventory/>} />
      <Route path="/admin/settings/announcements" element={<Announcement/>} />
      <Route path="/admin/settings/sales" element={<Sales/>} />
      <Route path="/admin/staff" element={<Staff />} />
      <Route path='/admin/orders' element={<Orders />} />

      <Route path="/staff" element={<StaffLogin />} />
      <Route path="/staff/home" element={<StaffHome />} />
      <Route path="/staff/order" element={<ViewOrders />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import MainLayout from "./components/layout/MainLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import PostDetails from "./pages/PostDetails";
import Write from "./pages/Write";
import Profile from "./pages/Profile";
import Library from "./pages/Library";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route element={<MainLayout />}>
            <Route path='/' element={<Home />} />
            <Route path='/posts/:slug' element={<PostDetails />} />
            <Route path='/write' element={<Write />} />
            <Route path='/u/:username' element={<Profile />} />
            <Route path='/bookmarks' element={<Library />} />
          </Route>

          {/* Redirect any unknown routes to home */}
          <Route path='*' element={<Navigate to='/' />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

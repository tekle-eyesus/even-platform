import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import PostDetails from "./pages/PostDetails";
import Write from "./pages/Write";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/posts/:slug' element={<PostDetails />} />
          {/* Fallback route */}
          <Route path='*' element={<Navigate to='/' replace />} />
          <Route path='/write' element={<Write />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

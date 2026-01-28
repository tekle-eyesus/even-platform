import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className='min-h-screen flex flex-col'>
        {/* Navbar will go here */}
        <main className='container mx-auto px-4 py-8'>
          <Routes>
            <Route
              path='/'
              element={
                <h1 className='text-3xl font-bold text-primary'>
                  Welcome to EVEN
                </h1>
              }
            />
            <Route path='/login' element={<h2>Login Page</h2>} />
          </Routes>
        </main>
        {/* Footer will go here */}
      </div>
    </Router>
  );
}

export default App;

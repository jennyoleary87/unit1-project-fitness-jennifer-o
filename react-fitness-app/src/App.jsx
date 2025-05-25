import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from './components/dashboard';
import IntervalTimer from './components/timer';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/home';

function App() {

  return (
    <>
      <div>
        <Router>
          <div>
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/timer" element={<IntervalTimer />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </div>
    </>
  );
}

export default App;


{/* <>
      <BrowserRouter>
        <div>
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/timer" element={<IntervalTimer />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </> */}
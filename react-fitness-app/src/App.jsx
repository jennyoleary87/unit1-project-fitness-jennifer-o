import './App.css'
import { HashRouter, Routes, Route } from "react-router-dom";
import Dashboard from './components/dashboard';
import IntervalTimer from './components/timer';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/home';
import History from './components/history';
import About from './components/about';

function App() {

  return (
    <>
      <HashRouter>
        <div>
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/timer" element={<IntervalTimer />} />
              <Route path="/history" element={<History />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </HashRouter>
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
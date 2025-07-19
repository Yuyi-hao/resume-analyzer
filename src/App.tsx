import {Route, Routes} from "react-router-dom";
import './App.css'
import HomePage from "./pages/home/HomePage";
import Auth from "./pages/auth/Auth";
import { usePuterStore } from "./lib/puter";
import { useEffect } from "react";
import UploadPage from "./pages/upload/UploadPage";

function App() {
  const {init} = usePuterStore();
  useEffect(() => {
    init();
  }, [init]);

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </>
  )
}

export default App

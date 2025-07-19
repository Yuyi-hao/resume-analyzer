import {Route, Routes} from "react-router-dom";
import './App.css'
import HomePage from "./pages/home/HomePage";
import Auth from "./pages/home/auth/Auth";
import { usePuterStore } from "./lib/puter";
import { useEffect } from "react";

function App() {
  const {init} = usePuterStore();
  useEffect(() => {
    init();
  }, [init]);

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </>
  )
}

export default App

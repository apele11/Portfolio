import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./home/page";
import About from "./about/page";
import Playground from "./playground/page";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/playground" element={<Playground />} />
      </Routes>
    </BrowserRouter>
  )
}

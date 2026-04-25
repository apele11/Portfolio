import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./home/page";
import About from "./about/page";
import Playground from "./playground/page";
import ProjectPage from "./projects/page";
import Admin from "./components/Admin";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/playground" element={<Playground />} />
        <Route path="/projects/:projectId" element={<ProjectPage />} />
        {import.meta.env.DEV && (
          <Route path="/admin" element={<Admin onClose={() => window.history.back()} />} />
        )}
      </Routes>
    </BrowserRouter>
  )
}

import { Routes, Route } from "react-router-dom";
import Nav from "@/components/Nav";
import About from "@/pages/About";
import Topics from "@/pages/Topics";
import { Analytics } from "@vercel/analytics/react";

export default function App() {
    return (
        <>
            <Nav />
            <Routes>
                <Route path="/" element={<About />} />
                <Route path="/topics" element={<Topics />} />
            </Routes>
            <Analytics />
        </>
    );
}

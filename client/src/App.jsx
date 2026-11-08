import React from "react";
import { Route, Routes } from "react-router-dom";

import Layout from './components/Layout'
import Home from "./pages/Home";
import AboutMe from "./pages/AboutMe";
import Projects from "./pages/Projects";
import Education from "./pages/Education";
import Services from "./pages/Services";
import ContactMe from "./pages/ContactMe";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
    return (
        <div>
            <Layout />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<AboutMe />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/education" element={<Education />} />
                <Route path="/services" element={<Services />} />
                <Route path="/contact" element={<ContactMe />} />

                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />

                <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
        </div>
    );
}

export default App;
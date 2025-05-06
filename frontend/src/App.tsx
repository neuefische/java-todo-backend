import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css'
import Home from "./components/Home.tsx";
import Details from "./components/Details.tsx";


export default function App() {

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/todo/:id" element={<Details />} />
            </Routes>
        </Router>
    );
}


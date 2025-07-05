import { Routes } from "react-router-dom";
import Private from "./private.jsx";
import Public from "./public.jsx";
import React from 'react'

export default function AppRoutes() {
  return (
    <Routes>
        { Private }
        { Public }
    </Routes>
  )
}

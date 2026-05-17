import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
window.React = React;
window.createRoot = createRoot;
window.BrowserRouter = BrowserRouter; // Правильно: НЕ объект!
window.useLocation = useLocation;
window.Routes = Routes;
window.Route = Route;
window.Navigate = Navigate;
window.toast = toast;
window.Toaster = Toaster;
window.Link = Link;

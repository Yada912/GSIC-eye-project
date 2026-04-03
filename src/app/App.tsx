/**
 * EyeCare Companion - Eye Health Awareness Web App
 * 
 * A comprehensive mobile-first web application for eye health awareness and information.
 * 
 * Key Features:
 * ✓ Eye Scanner - Camera/upload-based AI eye health analysis
 * ✓ Professional Chat - Connect with eye care professionals
 * ✓ AI Chatbot - Get instant answers about eye health
 * ✓ Health Guide - 8-step guide for healthy eyes with progress tracking
 * ✓ Glossary - Comprehensive database of eye conditions
 * ✓ Account Management - Profile and chat history management
 * 
 * Design:
 * - iOS-inspired interface with frosted glass (glassmorphism)
 * - Light blue color theme optimized for eye health
 * - Mobile-first, responsive design
 * - Optimized for slow connections and low-end devices
 * 
 * Technical:
 * - React Router for navigation with lazy loading
 * - LocalStorage for data persistence
 * - No backend required (all data stored client-side)
 * - Free to use, no payment features
 */

import { RouterProvider } from 'react-router';
import { router } from './routes';

export default function App() {
  return <RouterProvider router={router} />;
}

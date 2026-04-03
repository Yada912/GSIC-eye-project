import { createBrowserRouter } from "react-router";
import { lazy, Suspense, ComponentType } from "react";
import { Layout } from "./components/Layout";
import { Loading } from "./components/Loading";

/**
 * EyeCare Companion Routes
 *
 * A comprehensive eye health mobile web app with:
 * - Eye Scanner: AI-powered analysis of eye health
 * - Professional Chat: Connect with eye care experts (requires auth)
 * - AI Chatbot: Get instant answers about eye health (requires auth)
 * - Health Guide: 8-step guide for maintaining healthy eyes
 * - Glossary: Learn about common eye conditions
 * - Account: Manage profile and chat history
 * - Login: Authentication for chat features
 *
 * All pages are lazy-loaded for optimal performance on slow connections.
 */

// Retry helper for failed lazy loads (useful for network issues or stale cache)
function retryLazyLoad<T>(
  importFn: () => Promise<T>,
  retriesLeft = 3,
  interval = 1000
): Promise<T> {
  return importFn().catch((error) => {
    if (retriesLeft === 0) {
      // If all retries failed, reload the page to clear cache
      console.error("Failed to load module after retries:", error);
      if (error.message?.includes("Failed to fetch")) {
        window.location.reload();
      }
      throw error;
    }

    // Wait and retry
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(retryLazyLoad(importFn, retriesLeft - 1, interval));
      }, interval);
    });
  });
}

// Lazy load pages for better performance with retry logic
const Home = lazy(() => retryLazyLoad(() => import("./pages/Home").then(m => ({ default: m.Home }))));
const EyeScanner = lazy(() => retryLazyLoad(() => import("./pages/EyeScanner").then(m => ({ default: m.EyeScanner }))));
const ProfessionalChat = lazy(() => retryLazyLoad(() => import("./pages/ProfessionalChat").then(m => ({ default: m.ProfessionalChat }))));
const Chatbot = lazy(() => retryLazyLoad(() => import("./pages/Chatbot").then(m => ({ default: m.Chatbot }))));
const HealthGuide = lazy(() => retryLazyLoad(() => import("./pages/HealthGuide").then(m => ({ default: m.HealthGuide }))));
const Glossary = lazy(() => retryLazyLoad(() => import("./pages/Glossary").then(m => ({ default: m.Glossary }))));
const Account = lazy(() => retryLazyLoad(() => import("./pages/Account").then(m => ({ default: m.Account }))));
const Login = lazy(() => retryLazyLoad(() => import("./pages/Login").then(m => ({ default: m.Login }))));
const NotFound = lazy(() => retryLazyLoad(() => import("./pages/NotFound").then(m => ({ default: m.NotFound }))));

// Wrapper component with Suspense
function LazyPage({ Component }: { Component: ComponentType }) {
  return (
    <Suspense fallback={<Loading />}>
      <Component />
    </Suspense>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, element: <LazyPage Component={Home} /> },
      { path: "scanner", element: <LazyPage Component={EyeScanner} /> },
      { path: "professional", element: <LazyPage Component={ProfessionalChat} /> },
      { path: "chatbot", element: <LazyPage Component={Chatbot} /> },
      { path: "guide", element: <LazyPage Component={HealthGuide} /> },
      { path: "glossary", element: <LazyPage Component={Glossary} /> },
      { path: "account", element: <LazyPage Component={Account} /> },
      { path: "login", element: <LazyPage Component={Login} /> },
      { path: "*", element: <LazyPage Component={NotFound} /> },
    ],
  },
]);
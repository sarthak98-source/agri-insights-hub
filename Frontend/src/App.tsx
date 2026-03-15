import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  ClerkLoaded,
  ClerkLoading,
} from "@clerk/clerk-react";

import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Inventory from "./pages/Inventory";
import Alerts from "./pages/Alerts";
import Weather from "./pages/Weather";
import DemandPrediction from "./pages/DemandPrediction";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Landing Page */}
          <Route
            path="/"
            element={
              <>
                <SignedIn>
                  <Navigate to="/dashboard" replace />
                </SignedIn>
                <SignedOut>
                  <Index />
                </SignedOut>
              </>
            }
          />

          {/* Public About Page */}
          <Route
            path="/about"
            element={
              <>
                <SignedIn>
                  <Navigate to="/dashboard" replace />
                </SignedIn>
                <SignedOut>
                  <About />
                </SignedOut>
              </>
            }
          />

          {/* Protected: Dashboard */}
          <Route
            path="/dashboard"
            element={
              <>
                <ClerkLoading>
                  <LoadingScreen />
                </ClerkLoading>
                <ClerkLoaded>
                  <SignedIn>
                    <Dashboard />
                  </SignedIn>
                  <SignedOut>
                    <Navigate to="/" replace />
                  </SignedOut>
                </ClerkLoaded>
              </>
            }
          />

          {/* Protected: Inventory */}
          <Route
            path="/inventory"
            element={
              <>
                <ClerkLoading>
                  <LoadingScreen />
                </ClerkLoading>
                <ClerkLoaded>
                  <SignedIn>
                    <Inventory />
                  </SignedIn>
                  <SignedOut>
                    <Navigate to="/" replace />
                  </SignedOut>
                </ClerkLoaded>
              </>
            }
          />

          {/* Protected: Alerts */}
          <Route
            path="/alerts"
            element={
              <>
                <ClerkLoading>
                  <LoadingScreen />
                </ClerkLoading>
                <ClerkLoaded>
                  <SignedIn>
                    <Alerts />
                  </SignedIn>
                  <SignedOut>
                    <Navigate to="/" replace />
                  </SignedOut>
                </ClerkLoaded>
              </>
            }
          />

          {/* Protected: Weather */}
          <Route
            path="/weather"
            element={
              <>
                <ClerkLoading>
                  <LoadingScreen />
                </ClerkLoading>
                <ClerkLoaded>
                  <SignedIn>
                    <Weather />
                  </SignedIn>
                  <SignedOut>
                    <Navigate to="/" replace />
                  </SignedOut>
                </ClerkLoaded>
              </>
            }
          />

          {/* ✅ Protected: Demand Prediction */}
          <Route
            path="/demand-prediction"
            element={
              <>
                <ClerkLoading>
                  <LoadingScreen />
                </ClerkLoading>
                <ClerkLoaded>
                  <SignedIn>
                    <DemandPrediction />
                  </SignedIn>
                  <SignedOut>
                    <Navigate to="/" replace />
                  </SignedOut>
                </ClerkLoaded>
              </>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

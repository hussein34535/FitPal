import { useState } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/Navbar";
import { getProfile } from "@/lib/user-store";
import Index from "./pages/Index.tsx";
import FoodPage from "./pages/FoodPage.tsx";
import ExercisePage from "./pages/ExercisePage.tsx";
import WaterPage from "./pages/WaterPage.tsx";
import FastingPage from "./pages/FastingPage.tsx";
import MealPlansPage from "./pages/MealPlansPage.tsx";
import ReportsPage from "./pages/ReportsPage.tsx";
import CoachPage from "./pages/CoachPage.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => {
  const [hasProfile, setHasProfile] = useState(!!getProfile());

  const handleReset = () => setHasProfile(false);
  const handleComplete = () => setHasProfile(true);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {hasProfile && <Navbar onReset={handleReset} />}
          <Routes>
            <Route path="/" element={<Index key={String(hasProfile)} />} />
            <Route path="/food" element={<FoodPage />} />
            <Route path="/exercise" element={<ExercisePage />} />
            <Route path="/water" element={<WaterPage />} />
            <Route path="/fasting" element={<FastingPage />} />
            <Route path="/meals" element={<MealPlansPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/coach" element={<CoachPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

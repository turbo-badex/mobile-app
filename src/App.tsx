
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ManualEntryPage from "./pages/ManualEntryPage";
import PickupLinesPage from "./pages/PickupLinesPage";
import RizzLinesPage from "./pages/RizzLinesPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/upload" element={<Navigate to="/" />} /> {/* Redirect to home */}
          <Route path="/manual" element={<ManualEntryPage />} />
          <Route path="/pickup-lines" element={<PickupLinesPage />} />
          <Route path="/rizz-lines" element={<RizzLinesPage />} />
          <Route path="/chat" element={<NotFound />} />
          <Route path="/explore" element={<NotFound />} />
          <Route path="/settings" element={<NotFound />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

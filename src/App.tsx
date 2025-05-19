
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import Layout from "./components/layout/Layout";
import Index from "./pages/Home";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AllGroups from "./pages/AllGroups";
import CreateGroup from "./pages/CreateGroup";
import MyGroups from "./pages/MyGroups";
import GroupDetails from "./pages/GroupDetails";
import UpdateGroup from "./pages/UpdateGroup";
import { ProtectedRoute } from "./components/ui/custom/ProtectedRoute";

const App = () => {
  // Create QueryClient inside the component function
  const queryClient = new QueryClient();
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<Index />} />
                  <Route path="/groups" element={<AllGroups />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/create-group" element={
                    <ProtectedRoute>
                      <CreateGroup />
                    </ProtectedRoute>
                  } />
                  <Route path="/my-groups" element={
                    <ProtectedRoute>
                      <MyGroups />
                    </ProtectedRoute>
                  } />
                  <Route path="/group/:id" element={
                    <ProtectedRoute>
                      <GroupDetails />
                    </ProtectedRoute>
                  } />
                  <Route path="/update-group/:id" element={
                    <ProtectedRoute>
                      <UpdateGroup />
                    </ProtectedRoute>
                  } />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { SidebarProvider } from "./context/sidebarContext";
import { MealProvider } from "./context/mealContext";
import { UserProvider } from "./context/userContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <SidebarProvider>
    <MealProvider>
      <UserProvider>
        <App />
      </UserProvider>
    </MealProvider>
  </SidebarProvider>
);

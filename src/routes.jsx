import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from "@tanstack/react-router";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import CarParts from "./pages/CarParts";

// Layout principal
const rootRoute = createRootRoute({
  component: function RootLayout() {
    return (
      <>
        <Navbar />
        <section style={{ padding: "1rem" }}>
          <Outlet />
        </section>
        <Footer />
      </>
    );
  },
});

// Ruta Home
const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

// Ruta CarParts
const carPartsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/carparts",
  component: CarParts,
});

// Árbol de rutas
const routeTree = rootRoute.addChildren([
  homeRoute,
  carPartsRoute,
]);

// Crear router
export const router = createRouter({
  routeTree,
});
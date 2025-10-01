import { useContext } from "react";
import { RouterContext } from "../contexts/RouterContext";

export const useRouter = () => {
  const context = useContext(RouterContext);
  if (!context) throw new Error("useRouter deve ser usado dentro de RouterProvider");
  return context;
};
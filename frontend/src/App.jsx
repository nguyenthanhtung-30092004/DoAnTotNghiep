import "./App.css";
import { RouterProvider } from "react-router";
import router from "./route/routing";

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AviationEmissionsCalculator from "@/template/calculate.tsx";
import EmmsDanLabs from "@/template/Landing.tsx";
const router = createBrowserRouter([
  {path:'aviation-emission', element: <AviationEmissionsCalculator />},
  {path: '*', element: <EmmsDanLabs />}
])

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App

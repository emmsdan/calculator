import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AviationEmissionsCalculator from "@/template/calculate.tsx";
import {IframePage} from "@/template/iframe.tsx";
const router = createBrowserRouter([
  {path:'aviation-emission', element: <AviationEmissionsCalculator />},
  {path: '*', element: <IframePage url={'https://emmsdan.com.ng'} />}
])

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App

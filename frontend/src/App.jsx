import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserLayout from './components/Layout/UserLayout';

const App = () => {
  return (
    <BrowserRouter>
      <UserLayout />
    </BrowserRouter>
  )
}
export default App; 
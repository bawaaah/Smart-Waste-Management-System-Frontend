import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./Home";
import PaymentDetails from "./PaymentManagement/PaymentDetails";
import PaymentGateway from "./PaymentManagement/PaymentGateway";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>

          {/* Home */}
          <Route path="/" element={<Home/>}></Route>

          {/* Payment */}
          <Route path="/PaymentDetails" element={<PaymentDetails/>}></Route>
          <Route path="/PaymentGateway" element={<PaymentGateway/>}></Route>
          
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

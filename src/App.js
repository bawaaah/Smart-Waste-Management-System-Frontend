import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./Home";
import PaymentDetails from "./PaymentManagement/PaymentDetails";
import PaymentGateway from "./PaymentManagement/PaymentGateway";
import SchedulePayment from "./PaymentManagement/SchedulePayment";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>

          {/* Home */}
          <Route path="/" element={<Home/>}></Route>

          {/* Payment */}
          <Route path="/PaymentDetails" element={<PaymentDetails userID={'670fb1c9283b226b21a52da0'}/>}></Route>
          <Route path="/PaymentGateway" element={<PaymentGateway/>}></Route>
          <Route path="/SchedulePayment" element={<SchedulePayment deviceId={'PAP-1728988754534'} userId={'670fb1c9283b226b21a52da0'}/>}></Route>
          
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

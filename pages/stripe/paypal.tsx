import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import Checkout from "./checkout";

const initialOptions = {
  "clientId": "ARYIpCFcle5-AsY68dUx2lwqdVoMleinw6RTU4eTpXkDMVSDflPUPjuXz2-99w2Ti9vGKevDphBjEm7B",
  currency: "EUR",
  intent: "capture",
};

function App() {
  return (
    <PayPalScriptProvider options={initialOptions}>
        <Checkout/>
    </PayPalScriptProvider>
  );
}

export default App;
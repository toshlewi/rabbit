import {
  PayPalScriptProvider,
  PayPalButtons,
} from "@paypal/react-paypal-js";

const PayPalButton = ({amount, onSuccess, onError}) => {
  return (
      <PayPalScriptProvider 
      options={{ 
        "client-id": 
            "AdhjjGA2dP-KikkML32wI-FzCAsuWWVanBzAPjr59rUHTLp1Tn5Cud8Zm1_m2_suTdA7UMmdhiG-7spx" }}>
        <PayPalButtons 
            style={{ layout: "vertical" }}
            createOrder={(data, actions) => {
            return actions.order.create({
                purchase_units: [{amount: {value: amount} }]
            });
        }}
        onApprove={(data, actions) => {
          return actions.order.capture().then(onSuccess) 
        }}
        onError={onError} />
      </PayPalScriptProvider>
  )
  
};

export default PayPalButton

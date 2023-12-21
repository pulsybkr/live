import React, { useEffect, useState } from "react";
// import './Checkout.css';
import {
  PayPalButtons,
  PayPalScriptProvider,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import Swal from "sweetalert2";
import { useRouter } from "next/router";

const link_ticked = "http://localhost:8080/live/create-tikss-livepaypal";

const initialOptions = {
  clientId:
    "AVgGcFT4K6OPxn_cknjXagLBYYtmd-SbxUtsCNcCIwAtmeoYVQVq58nUfJYLdgkUfjbx4uHXOceXZCZM",
  currency: "EUR",
  intent: "capture",
};

const Checkout = (props: any) => {
  const [{ options, isPending }, dispatch] = usePayPalScriptReducer();
  const [username, setUsername] = useState("");
  const [eventID, setEventID] = useState("");

  useEffect(() => {
    // Chargez les données asynchrones ici et mettez à jour les états
    setUsername(props.username);
    setEventID(props.eventID);
  }, []);

  const [currency, setCurrency] = useState(options.currency);
  const router = useRouter();

  const onCurrencyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    setCurrency(value);
    dispatch({
      type: "resetOptions",
      value: {
        ...options,
        currency: value,
      },
    });
  };

  const onCreateOrder = (data: any, actions: any) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: "8.99",
          },
        },
      ],
    });
  };

  const onApproveOrder = (data: any, actions: any) => {
    return actions.order.capture().then(async (details: any) => {
      const name = details.payer.name.given_name;

      const postData = {
        id: details.id,
        username,
        eventID,
        status: details.status,
        date: details.update_time,
        payer: details.payer,
      };

      console.log(postData);

      try {
        const response = await fetch(link_ticked, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        });

        const data = await response.json();

        if (response.ok) {
          Swal.fire({
            title: "Transaction Réussie",
            text: "Vous allez recevoir une confirmation par SMS ou par e-mail. Vous pouvez accéder au live.",
            icon: "success",
            confirmButtonText: "OK",
          }).then((result) => {
            if (result.isConfirmed) {
              router.push("/dashboard");
              router.reload();
            }
          });
        } else {
          Swal.fire(
            "Erreur",
            `Erreur, veuillez contacter le service client.`,
            "error"
          );
          console.error("Error during API call:", data.error);
        }
      } catch (error) {
        Swal.fire(
          "Erreur",
          `Erreur, veuillez contacter le service client.`,
          "error"
        );
        console.error("Error during API call:", error);
      }

      //   router.push("/dashboard");
      //   Swal.fire(
      //     "Transaction Reussi",
      //     `Vous allez recevoir votre confirmation par mail ou sms`,
      //     "success"
      //   );
      //   alert(`Transaction completed by ${name}`);
    });
  };

  return (
    <div className="checkout">
      {isPending ? (
        <p>LOADING...</p>
      ) : (
        <>
          <select value={currency} onChange={onCurrencyChange}>
            <option value="USD">💵 USD</option>
            <option value="EUR">💶 Euro</option>
          </select>
          <PayPalButtons
            style={{ layout: "vertical" }}
            createOrder={(data, actions) => onCreateOrder(data, actions)}
            onApprove={(data, actions) => onApproveOrder(data, actions)}
          />
        </>
      )}
    </div>
  );
};

const ProviderWrapper = (props: any) => {
  const [username, setUsername] = useState("");
  const [eventID, setEventID] = useState("");

  useEffect(() => {
    // Chargez les données asynchrones ici et mettez à jour les états
    setUsername(props.username);
    setEventID(props.eventID);
  }, []);

  return (
    <PayPalScriptProvider options={initialOptions}>
      <Checkout username={username} eventID={eventID} />
    </PayPalScriptProvider>
  );
};

export default ProviderWrapper;

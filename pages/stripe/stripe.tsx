import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { useRouter } from "next/router";

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const link_get_session =
  "http://localhost:8080/live/get-session-live";

if (!stripePublishableKey) {
  throw new Error(
    "La clé Stripe n'est pas définie dans les variables d'environnement."
  );
}

interface postData {
  id_event: any;
  price: any;
  type: any;
  id_product: any;
  quantit: any;
  name: any;
  mail: any;
  phone: any;
}

const stripePromise = loadStripe(stripePublishableKey);

export default function StipePaiement() {
  const [clientSecret, setClientSecret] = useState("");
  const router = useRouter();
  const [id_event, setId_event] = useState("");
  const [type, setType] = useState("");
  const [id_product, setId_product] = useState("");
  const [username, setUsername] = useState(0);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [price, setPrice] = useState("");

  const { id } = router.query;

  // Effect 1: Chargement des données depuis le serveur
  useEffect(() => {
    const fetchData = async () => {
      try {
        const post = {
          session_id: id,
        };

        const response = await fetch(link_get_session, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(post),
        });

        const data = await response.json();

        // console.log(data)

        setId_product(data.session.id_product);
        setName(data.session.name);
        setId_event(data.session.id_event);
        setPhone(data.session.number);
        setEmail(data.session.email);
        setUsername(data.session.username);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]); // Dépendance ajoutée pour déclencher l'effet lorsque l'ID change

  // Effect 2: Création de la session de paiement
  useEffect(() => {
    const createPaymentSession = async () => {
      try {
        const postData= {
          id_event,
          id_product,
          name,
          mail: email,
          phone,
          username
        };

        // console.log(postData);

        const response = await fetch("/api/checkout-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        });

        const responseData = await response.json();

        setClientSecret(responseData.clientSecret);
      } catch (error) {
        console.error("Error creating payment session:", error);
      }
    };

    createPaymentSession();
  }, [id_event, id_product, username, name, email, phone]);

  return (
    <div id="checkout">
      {clientSecret && (
        <EmbeddedCheckoutProvider
          stripe={stripePromise}
          options={{ clientSecret }}
        >
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      )}
    </div>
  );
}

import type { NextApiRequest, NextApiResponse } from "next";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const linksession = "http://localhost:8080/live/create-session-live";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id_event = req.body.id_event;
  const id_product = req.body.id_product;
  const name = req.body.name;
  const mail = req.body.mail;
  const phone = req.body.phone;
  const username = req.body.username;


  switch (req.method) {
    case "POST":
      try {
        // Create Checkout Sessions from body params.
        const session = await stripe.checkout.sessions.create({
          ui_mode: "embedded",
          line_items: [
            {
              // Provide the exact Price ID of the product you want to sell
              price: id_product,
              quantity: "1",
            },
          ],
          phone_number_collection: {
            enabled: true,
          },
          mode: "payment",
          return_url: `${req.headers.origin}/stripe/return?session_id={CHECKOUT_SESSION_ID}`,
          automatic_tax: { enabled: true },
        });

        // ajout de la session dans la base de donnée

        // console.log(session)

        const postData = {
          session_id: session.id,
          id_event,
          statut: session.status,
          id_product: session.status,
          name,
          username,
          email: mail,
          number: phone,
        };

        fetch(linksession, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        }).then((res) => res.json());

        res.send({ clientSecret: session.client_secret });
      } catch (err: any) {
        res.status(err.statusCode || 500).json(err.message);
      }
      break;

    case "GET":
      try {
        const session = await stripe.checkout.sessions.retrieve(
          req.query.session_id
        );

        res.send({
          status: session.status,
          id_event
        });
      } catch (err: any) {
        res.status(err.statusCode || 500).json(err.message);
      }
      break; // Ajouter break ici

    default:
      if (req.method) {
        res.setHeader("Allow", req.method);
      }
      res.status(405).end("Method Not Allowed");
  }
}

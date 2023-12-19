import React, { useEffect, useRef, useState } from "react";
import { redirect } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import styles from "@/styles/Shop.module.css";
import Swal from "sweetalert2";
import router, { useRouter } from "next/router";

const link_get_session =
  "https://corded-gear-347117.oa.r.appspot.com/live/get-session-live";
const link_ticked = "http://localhost:8080/live/create-tikss-liveohlepoulet";
const isexist = "http://localhost:8080/live/isreadyexistlive";

const Return = () => {
  const router = useRouter();

  const [status, setStatus] = useState(null);
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [session_id, setSession_id] = useState<string | null>("");
  const [id_event, setId_event] = useState("");

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get("session_id");

    // Fetch status of checkout session
    fetch(`/api/checkout-session?session_id=${sessionId}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setStatus(data.status);
      });

    setSession_id(sessionId);

    // Fetch additional data using session ID
    const postData = {
      session_id: sessionId,
    };

    fetch(link_get_session, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.session) {
          setName(data.session.name);
          setId_event(data.session.id_event);
          setPhone(data.session.number);
          setEmail(data.session.email);
          setUsername(data.session.username);
        }
      });
  }, []);

  useEffect(() => {
    handleFetchLinkTickedexist(username, id_event);

    if (status === "complete") {
      const postData = {
        phone,
        email,
        username,
        eventID: id_event,
        session_id,
        name,
      };

      const handleFetchLinkTicked = async () => {
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
      };

      handleFetchLinkTicked();
    }
  }, [status, phone, email, username, session_id, name, id_event, router]);

  return <section id="success"></section>;
};

export default Return;


const handleFetchLinkTickedexist = async (username: string, id_event: string) => {
  try {
    console.log("username :" + username);
    console.log("id_event :" + id_event);


    const response = await fetch(isexist, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        id_event
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log(data);
      if (data.bool) {
        router.push("/dashboard");
        Swal.fire(
          "Transaction terminé",
          `Vous allez recevoir votre confirmation par mail ou sms`,
          "success"
        );
      }
    } else {
      Swal.fire(
        "Erreur",
        `Erreur veuillez contacter le service client`,
        "error"
      );
      console.error("Error during API call:", data.error);
    }
  } catch (error) {
    Swal.fire("Erreur", `Erreur veuillez contacter le service client`, "error");
    console.error("Error during API call:", error);
  }
};
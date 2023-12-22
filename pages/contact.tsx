import styles from "/styles/Org.module.css";
const WhatsAppButton = styled.a`
  display: inline-block;
  background-color: #25d366;
  color: black;
  padding: 10px 15px;
  border-radius: 5px;
  text-decoration: none;
  font-weight: bold;
  margin-bottom: 50px;
`;

const WhatsAppIcon = styled.img`
  width: 20px;
  margin-right: 5px;
`;

// import Heade from './composant/head'
import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import { useForm, ValidationError } from "@formspree/react";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import styled from "styled-components";

export default function Contact() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const router = useRouter();

  const phone = "+242064325255";

  const [state, handleSubmit] = useForm("xzbllbbg");
  if (state.succeeded) {
    Swal.fire({
      title: "Envoyé",
      text: "Message envoyé avec succès!",
      icon: "success",
      confirmButtonText: "Ok",
    }).then((result) => {
      router.reload();
    });

    // Swal.fire(
    //   'Envoyé',
    //   'Message envoyé avec succès!',
    //   'success'
    // )
  }

  return (
    <>
      {/* main */}
      <main className={styles.main}>
        <header>
          <div
            className={styles.logo}
            onClick={() => {
              router.push("/");
            }}
          >
            <img src="/logo.png" alt="logo tikss" />
          </div>
          <ul>
            <li
              onClick={() => {
                router.push("/auth/signup");
              }}
            >
              s'inscrire
            </li>
            <li
              onClick={() => {
                router.push("/auth/login");
              }}
              className={styles.live}
            >
              Live
            </li>
            <li
              onClick={() => {
                router.push("/contact");
              }}
            >
              service client
            </li>
          </ul>
        </header>

        <form style={{ marginTop: "150px" }} onSubmit={handleSubmit}>
          <h2 style={{ marginBottom: "50px", fontSize: "3rem" }}>
            Contactez-nous
          </h2>

          <h2 style={{ marginBottom: "15px", fontSize: "1.5rem" }}>Wathsapp</h2>

          <div className={styles.wathsapp}>
            <WhatsAppButton
              href={`https://wa.me/${phone}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon src="/whatsapp-icon.png" alt="WhatsApp Icon" />
              +242064325255 sur WhatsApp
            </WhatsAppButton>
          </div>

          <h2 style={{ marginBottom: "15px", fontSize: "1.5rem" }}>
            Formulaire de contact
          </h2>

          <input
            type="text"
            name="firstName"
            placeholder="Nom"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            name="email"
            placeholder="E-mail"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="text"
            name="phoneNumber"
            placeholder="Numero de telephone"
            value={phoneNumber}
            required
            onChange={(e) => setPhoneNumber(e.target.value)}
          />

          <textarea
            name="message"
            id="message"
            value={message}
            cols={30}
            rows={10}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message"
            required
          ></textarea>

          <input type="submit" value="Envoyé" className={styles.submit} />
        </form>
      </main>
    </>
  );
}

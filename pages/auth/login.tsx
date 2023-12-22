// pages/signup.tsx
import styles from "../../styles/auth.module.css";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import PhoneInput from "react-phone-input-2";
import Swal from "sweetalert2";

const apilink = process.env.NEXT_PUBLIC_API_LINK;

const linkget = `${apilink}/live/getuserdatalive`;
const link = `${apilink}/live/login`;
const linklogout = `${apilink}/live/logout`;

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const event = "lmb0h191rp37uh";
  const router = useRouter();

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const response = await fetch(linkget, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (response.ok) {
          Swal.fire("Deja connecter", data.message, "success");
          router.push("/dashboard"); // Rediriger vers la page
        }
      } catch (error) {
        console.error(error);
        // Gérer l'erreur
      }
    };

    checkUserStatus();
  }, []);

  const handleSignup = async (e: any) => {
    e.preventDefault();

    try {
      const response = await fetch(link, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: email,
          password,
          event,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // console.log(data);
        Swal.fire("Success", data.message, "success");
        router.push("/dashboard");
      } else {
        console.error(response);
        Swal.fire("Erreur", data.message, "error");
        // Gérer l'erreur de la requête
      }
    } catch (error) {
      console.error(error);
      // Gérer l'erreur
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(linklogout, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log(data);
        // router.push('/orgs/dashboard');
      } else {
        console.error(response);
        Swal.fire("Erreur", data.message, "error");
        // Gérer l'erreur de la requête
      }
    } catch (error) {
      console.error(error);
      // Gérer l'erreur
    }
  };

  const handleInputChange = (e: any) => {
    const inputValue = e.target.value;

    // Utilisez une expression régulière pour vérifier si le texte ne contient que des chiffres et des lettres
    const isValidInput = /^[a-zA-Z0-9]*$/.test(inputValue);

    if (isValidInput || inputValue === "") {
      // Mettez à jour le state uniquement si l'entrée est valide ou si elle est vide
      setEmail(inputValue);
    }
  };

  return (
    <main className={styles.main}>
      <span
        onClick={() => {
          router.push("/");
        }}
        className={styles.retour}
      >
        retour
      </span>
      <h1>Connection</h1>
      <form>
        <div className={styles.element}>
          <label>Nom d'utilisateur :</label>
          <input
            type="text"
            value={email}
            onChange={handleInputChange}

            // placeholder="jean45"
          />
        </div>

        <div className={styles.element}>
          <label>Mot de passe:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className={styles.bouton} type="button" onClick={handleSignup}>
          Se connecter
        </button>
      </form>
      <p>Si vous n'avez pas un compte</p>
      <span
        className={styles.boutonlog}
        onClick={() => {
          router.push("/auth/signup");
        }}
      >
        Cree un compte
      </span>
      <p>
        <span onClick={handleLogout}>Logout</span>
      </p>
    </main>
  );
};

export default Signup;

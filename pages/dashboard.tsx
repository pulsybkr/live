import styles from "../styles/dashboard.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import PhoneInput from "react-phone-input-2";
import { v4 as uuidv4 } from "uuid";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import ProviderWrapper from "./stripe/checkout";
const isexist = "https://corded-gear-347117.oa.r.appspot.com/live/isreadyexistlive";
const link = "https://corded-gear-347117.oa.r.appspot.com//live/getuserdatalive";
const linklogout = "https://corded-gear-347117.oa.r.appspot.com/live/logout";
const linksession = "https://corded-gear-347117.oa.r.appspot.com/live/create-session-live";

export default function Dashboard() {
  const [event, setEvent] = useState("");
  const [prenom, setPrenom] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  const [elementVisible, setElementVisible] = useState(false);
  const [elementcarte, setElementCarte] = useState(false);
  const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(false);
  const [phoneTel, setPhoneTel] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phonecarte, setPhonecarte] = useState("");
  const [reseau, setReseau] = useState("");
  const [transactionEnCours, setTransactionEnCours] = useState(false);
  const momo = false;
  const airtel = true;
  // Ajoutez une propriété pour l'ID de l'événement
  const [idEvent, setIdEvent] = useState("");
  const [islogacces, setIslogacces] = useState(false);

  const router = useRouter();
  const price = "500";
  const id_product = "price_1OJ1VwEOKP9YSKkD8crga2TB";
  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const response = await fetch(link, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (response.ok) {
          // console.log(data);
          setPrenom(data.data.firstName);
          setUsername(data.data.username);
          // Mettez à jour la propriété idEvent au lieu de event
          setIdEvent(data.data.idEvent);
        } else {
          Swal.fire("Erreur", data.message, "error");
          router.push("/auth/login");
        }
      } catch (error) {
        console.error(error);
      }
    };

    checkUserStatus();
  }, []);

  useEffect(() => {
    const isExist = async () => {
      try {
        const response = await fetch(isexist, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          if (data.bool) {
            // router.push("/dashboard");
            setIslogacces(true);
          }
        } else {
          // Gérer les erreurs ici
          console.error("Erreur lors de l'appel API isexist :", data.error);
        }
      } catch (error) {
        // Gérer les erreurs liées à la requête ici
        console.error("Erreur lors de l'appel API isexist :", error);
      }
    };

    // Appeler la fonction isExist
    isExist();
  }, [username]);

  const handleLogout = async () => {
    try {
      const response = await fetch(linklogout, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // Utilisez idEvent au lieu de event ici aussi
          event: idEvent,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire("Déconnecté !", data.message, "success");
        router.push("/");
      } else {
        console.error(response);
        Swal.fire("Erreur", data.message, "error");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const hideElement = () => {
    setElementVisible(false);
    setElementCarte(false);
  };

  const goCarte = () => {
    setElementVisible(false);
    setElementCarte(true);
  };

  const goMobile = () => {
    setElementCarte(false);
    setElementVisible(true);
  };

  function phone(num: any) {
    let numb = num.split("242");

    if (numb.length > 1) {
      if (numb[1].length > 1) {
        if (numb[1].startsWith("06")) {
          if (momo) {
            setReseau("mtn");
          } else {
            setElementVisible(false);
            Swal.fire(
              "Erreur",
              `Cet evement n'accepte pas ce mode de paiement`,
              "error"
            );
          }
        } else if (numb[1].startsWith("05")) {
          if (airtel) {
            setReseau("airtel");
          } else {
            setElementVisible(false);
            Swal.fire(
              "Erreur",
              `Cet evement n'accepte pas ce mode de paiement`,
              "error"
            ).then((result) => {
              if (result.isConfirmed) {
                setElementVisible(false);
              }
              router.reload();
            });
          }
        } else {
          setElementVisible(false);
          Swal.fire(
            "Erreur",
            `Cet evement n'accepte pas ce mode de paiement`,
            "error"
          ).then((result) => {
            if (result.isConfirmed) {
              setElementVisible(false);
            }
            router.reload();
          });
        }
      }

      if (numb[1].length > 8 && numb[1].length < 10) {
        setIsValidPhoneNumber(true);
        setPhoneTel(numb[1]);
      }
    }
  }

  function getNetworkImage(network: string): string {
    if (network === "mtn") {
      return "/logo/mtn.jpg";
    } else if (network === "airtel") {
      return "/logo/airtel.jpg";
    } else {
      return "";
    }
  }

  const showElement = () => {
    if (transactionEnCours) {
      setElementVisible(false);
      Swal.fire(
        "Transaction en cours",
        "Confirmer la transaction ne recharger pas la page et ne changer pas de page",
        "warning"
      );
    } else {
      if (islogacces) {
        // setElementVisible(false);
        Swal.fire(
          "Achat deja valider",
          "Vous avez deja valider un achat, si vous n'arrivez pas a accedez au live contacter le service client",
          "warning"
        );
      } else {
        setElementVisible(true);
      }
    }
  };

  const showLive = () => {
    if (islogacces) {
      // setElementVisible(false);
      router.push("/live");
      // Swal.fire(
      //   "En direct bientot",
      //   "Le live n'a pas encore commencer !",
      //   "success"
      // );
    } else {
      Swal.fire("Acces refusez", "Achetez un acces pour le live.", "warning");
    }
  };

  useEffect(() => {
    if (phoneNumber.length === 5) {
      console.log("C'est bon");
      phone(phoneNumber);
    }
  }, [phoneNumber]);

  const networkImage = getNetworkImage(reseau);
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    hideElement();

    Swal.fire(
      "Transaction en cours",
      "Confirmer la transaction ne recharger pas la page et ne changer pas de page",
      "warning"
    );
  };

  const handleSubmitCarte = async (e: any) => {
    e.preventDefault();
    hideElement();

    Swal.fire(
      "Redirection",
      "vous allez etre rediger vers la page de paiement",
      "warning"
    );

    const transID = uuidv4().substr(0, 14);

    const postData = {
      session_id: transID,
      id_event: idEvent,
      id_product,
      name,
      username,
      email: email,
      number: phonecarte,
    };

    // console.log(postData)

    fetch(linksession, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    }).then((res) => res.json());

    router.push(`/stripe/stripe?id=${transID}`);
  };

  // paypal truc 

  const initialOptions = {
    "clientId": "AVgGcFT4K6OPxn_cknjXagLBYYtmd-SbxUtsCNcCIwAtmeoYVQVq58nUfJYLdgkUfjbx4uHXOceXZCZM",
    currency: "EUR",
    intent: "capture",
  };

  return (
    <>
      <main className={styles.main}>
        {/* contenaire */}
        <section className={styles.contain}>
          <header>
            <div className={styles.logo} onClick={() => {
                router.push("/");
              }}>
              <img src="/logo.png" alt="logo tikss" />
            </div>
            <ul>
              <li onClick={handleLogout}>Déconnexion</li>
            </ul>
          </header>
          <section className={styles.texte}>
            <h1>
              DIESEL GUCCI <br />
              <span
                onClick={() => {
                  router.push("/auth/login");
                }}
              >
                live
              </span>
            </h1>
            <section>
              <button onClick={showElement}>Achetez l'accès</button>
              <button onClick={showLive}>Voir le live</button>
            </section>
            <h2>
              GRAND CONCERT <span>#CorrectionProMax</span>
            </h2>
          </section>
        </section>
        {/* paiement mobile */}
        <section
          className={styles.paiment}
          style={{ display: elementVisible ? "flex" : "none" }}
        >
          <form onSubmit={handleSubmit}>
            <h2>Paiement mobile</h2>
            <div onClick={hideElement} className={styles.close}>
              <img src="/illustration/close.png" alt="bouton ferme" />
            </div>

            <div className={styles.element}>
              <label htmlFor="name">
                Nom et Prenom <span>*</span>
              </label>
              <input
                type="text"
                required
                name="name"
                id="name"
                placeholder="Prenom"
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </div>

            <div className={styles.element}>
              <label htmlFor="phone">
                Numero MTN ou Airtel <span>*</span>
              </label>
              <PhoneInput
                country="cg"
                enableSearch={false}
                disableDropdown
                inputProps={{
                  name: "phoneNumber",
                  required: true,
                  autoFocus: true,
                }}
                value={phoneNumber}
                masks={{ cg: ".. ... .. .." }}
                onChange={(value, country, event) => {
                  setPhoneNumber(value);
                }}
              />
            </div>

            <div className={styles.logoreseau}>
              {/* Afficher l'image si `networkImage` n'est pas une chaîne de caractères vide */}
              {networkImage && (
                <div>
                  <label>Vous allez payer avec : </label>
                  <img src={networkImage} alt="Logo réseau" />
                </div>
              )}
            </div>

            <div className={styles.total}>
              <p>Total à payer :</p>
              <h4>{price} FCFA</h4>
            </div>

            <input
              className={styles.button}
              type="submit"
              value="Confirmer la commande"
              disabled={!isValidPhoneNumber || isFormSubmitted}
            />
            <br />
            <div onClick={goCarte} className={styles.carte}>
              Payer par Carte ou Paypal
            </div>
          </form>
        </section>

        {/* paiment par carte */}
        { elementcarte && 
          <section
          className={styles.paiment}
          style={{ display: elementcarte ? "flex" : "none" }}
        >
          
            <ProviderWrapper 
            username={username}
            eventID={idEvent}
            />
          
          {/* <form onSubmit={handleSubmitCarte}>
            <h2>Veuillez rentree vos informations</h2>
            <div onClick={hideElement} className={styles.close}>
              <img src="/illustration/close.png" alt="bouton ferme" />
            </div>

            <div className={styles.element}>
              <label htmlFor="name">
                Nom et Prenom <span>*</span>
              </label>
              <input
                type="text"
                required
                name="name"
                id="name"
                placeholder="Prenom"
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </div>

            <div className={styles.element}>
              <PhoneInput
                country="fr"
                enableSearch={false}
                inputProps={{
                  name: "phonecarte",
                  required: true,
                  autoFocus: true,
                }}
                value={phonecarte}
                onChange={(value, country, event) => {
                  setPhonecarte(value);
                }}
              />
            </div>
            <div className={styles.element}>
              <label htmlFor="email">
                Adresse e-mail <span>*</span>
              </label>
              <input
                type="email"
                required
                name="email"
                id="email"
                placeholder="example@example.com"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>
            <div className={styles.total}>
              <p>Total à payer HT:</p>
              <h4>{5} €</h4>
            </div>
            <div style={{ marginBottom: "20px" }}>
              Le prix TTC peut varié selon le pays ou vous trouver <br />{" "}
            </div>

            <input
              className={styles.button}
              type="submit"
              value="Confirmer la commande"
              // disabled={!isValidPhoneNumber || isFormSubmitted}
            />

            <div onClick={goMobile} className={styles.carte}>
              Paiement Mobile {""}
            </div>
          </form> */}
        </section>
        }
      </main>
    </>
  );
}

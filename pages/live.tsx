import styles from "../styles/dashboard.module.css";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Swal from "sweetalert2";

const apilink = process.env.NEXT_PUBLIC_API_LINK;
const linklive = process.env.NEXT_PUBLIC_LINK_LIVE;

const isexist = `${apilink}/live/isreadyexistlive`;
const link = `${apilink}/live/getuserdatalive`;


export default function Dashboard() {
  const [username, setUsername] = useState("");
  const [idEvent, setIdEvent] = useState("");
  const [islogacces, setIslogacces] = useState(false);
  const [prenom, setPrenom] = useState("");
  const router = useRouter();


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

  // console.log(linklive)

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
          console.log(data);
          console.log(username);
  
          if (data.bool) {
            setIslogacces(true);
          } else {
            Swal.fire(
              "Accès Refusé",
              "Achetez l'accès pour accéder à cette page. Si le problème persiste, veuillez contacter le service client.",
              "error"
            );
            router.push("/dashboard");
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
  
    // Vérifier si username a changé avant d'appeler la fonction isExist
    if (username) {
      isExist();
    }
  }, [username, islogacces, router]);
  
  
  // console.log(username);
  const handleLogout = async () => {
    router.push("/dashboard");
  };
  return (
    <>
      <main className={styles.main}>
        <section className={styles.contain}>
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
              <li onClick={handleLogout}>retour</li>
            </ul>
          </header>

          { islogacces && 
            <section
            className={styles.livestream}
            style={{ display: islogacces ? "flex" : "none" }}
          >
            <iframe
              src={linklive}
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              allowFullScreen={true}
            ></iframe>
          </section>
          }
        </section>
      </main>
    </>
  );
}

import styles from "../styles/dashboard.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Swal from "sweetalert2";

// const apilink = process.env.NEXT_PUBLIC_API_LINK;
const apilink = "http://localhost:8080/authLive";

const link = `${apilink}/liveAdmin/getAdmin`;
const linklogout = `${apilink}/liveAdmin/logout`;
const getAlluser = `${apilink}/liveAdmin/getAllUser`;

export default function DashboardAdmin() {
  const [name, setName] = useState("");
  const [userData, setUserData] = useState<any>({});

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
          console.log(data);
          // Mettez à jour la propriété idEvent au lieu de event
        } else {
          console.log(data);
          Swal.fire("Erreur", data.message, "error");
          router.push("/admin/connection");
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
        const response = await fetch(getAlluser, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (response.ok) {
          console.log(data);
          setUserData(data.data);
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
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch(linklogout, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
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

  const totalUsers = Object.keys(userData).length;

  return (
    <>
      <main className={styles.main}>
        {/* contenaire */}
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
              <li onClick={handleLogout}>Déconnexion</li>
              <li
                onClick={() => {
                  router.push("/contact");
                }}
              >
                service client
              </li>
            </ul>
          </header>
          <section>
            <div className={styles.container}>
              <h1>Données Utilisateurs</h1>
              <p>Total d'utilisateurs inscrits: {totalUsers}</p>

              <div className={styles.columnLabels}>
                <div>Nom</div>
                <div>Utilisateur</div>
                <div>État</div>
                <div>ID</div>
              </div>
              {Object.keys(userData).map((userId) => {
                const user = userData[userId];

                return (
                  <div key={userId} className={styles.userRow}>
                    <div>{user.firstName}</div>
                    <div>{user.username}</div>
                    <div
                      className={
                        user.isconnected
                          ? styles.connected
                          : styles.disconnected
                      }
                    ></div>
                    <div className={styles.id}>{userId}</div>
                  </div>
                );
              })}
            </div>
          </section>
        </section>

        {/* paiement mobile */}
      </main>
    </>
  );
}

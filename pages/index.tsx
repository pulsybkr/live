import Image from "next/image";
import styles from "../styles/page.module.css";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  return (
    <main className={styles.main}>
      <section className={styles.contain}>
        <header>
          <div className={styles.logo}>
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
        <section className={styles.texte}>
          <h1>
            DIESEL GUCCI{" "}
            <span
              onClick={() => {
                router.push("/auth/login");
              }}
            >
              live
            </span>
          </h1>
          <h2>
            GRAND CONCERT <span>#CorrectionProMax</span>
          </h2>
        </section>
      </section>
    </main>
  );
}

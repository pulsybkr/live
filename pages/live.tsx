import styles from "../styles/dashboard.module.css";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import YouTube, { YouTubeProps } from "react-youtube";
import screenfull from "screenfull";

const isexist = "http://localhost:8080/live/isreadyexistlive";
const link = "http://localhost:8080/live/getuserdatalive";
const linklogout = "http://localhost:8080/live/logout";
const linksession = "http://localhost:8080/live/create-session-live";

export default function Dashboard() {
  const [prenom, setPrenom] = useState("");

  const [username, setUsername] = useState("");

  // Ajoutez une propriété pour l'ID de l'événement
  const [idEvent, setIdEvent] = useState("");
  const [is, setIs] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false); // Ajout de l'état pour suivre l'état de la lecture

  const youtubePlayerRef = useRef(null);
  const onPlayerReady: YouTubeProps["onReady"] = (event) => {
    youtubePlayerRef.current = event.target;
    event.target.pauseVideo();
  };

  const toggleVideo = () => {
    if (youtubePlayerRef.current) {
      if (isPlaying) {
        youtubePlayerRef.current.pauseVideo();
      } else {
        youtubePlayerRef.current.playVideo();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const changeVolume = (direction: any) => {
    if (youtubePlayerRef.current) {
      const currentVolume = youtubePlayerRef.current.getVolume();
      const newVolume =
        direction === "up" ? currentVolume + 10 : currentVolume - 10;
      youtubePlayerRef.current.setVolume(Math.max(0, Math.min(100, newVolume)));
    }
  };

  const seekVideo = (direction: any) => {
    if (youtubePlayerRef.current) {
      const currentTime = youtubePlayerRef.current.getCurrentTime();
      const duration = youtubePlayerRef.current.getDuration();
      let newTime;

      if (direction === "forward") {
        newTime = currentTime + 10;
      } else {
        newTime = currentTime - 10;
      }

      youtubePlayerRef.current.seekTo(Math.max(0, Math.min(duration, newTime)));
    }
  };

  const toggleFullScreen = () => {
    const player: any = youtubePlayerRef.current;

    if (player) {
      // Use the YouTube API method to toggle fullscreen
      if (isFullScreen) {
        player.setSize("640", "390");
        player.playVideo();
        // player.exitFullscreen();
      } else {
        player.playVideo();
        player.setSize(window.innerWidth, window.innerHeight - 50);
      }

      setIsFullScreen(!isFullScreen);
    }
  };

  useEffect(() => {
    // Listen for changes in the fullscreen state
    const onFullscreenChange = () => {
      setIsFullScreen(document.fullscreenElement !== null);
    };

    // Add the event listener
    document.addEventListener("fullscreenchange", onFullscreenChange);

    // Remove the event listener when the component is unmounted
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
    };
  }, []);

  const opts: YouTubeProps["opts"] = {
    height: "390",
    width: "640",
    playerVars: {
      autoplay: 1,
      controls: 1,
      modestbranding: 0,
      showinfo: 0,
    },
  };

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

        // console.log(data);

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
  }, [router, link]);

  // console.log(username);

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

        console.log(data);

        if (response.ok) {
          if (data.bool) {
            setIs(true);
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
  }, [username, router, isexist]);

  useEffect(() => {
    if (!is) {
      // router.push("/dashboard");
      // Swal.fire(
      //   "Acces refusé !",
      //   "Vous n'avez pas les acces pour accedez a cette page, si c'est une erreur contacter le service client",
      //   "error"
      // );
    }
  }, [is, router]);
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

  return (
    <>
      <main className={styles.main}>
        {/* contenaire */}
        <section className={styles.contain}>
          <header>
            <div className={styles.logo}>
              <img src="/logo.png" alt="logo tikss" />
            </div>

            <ul>
              <li onClick={handleLogout}>Déconnexion</li>
            </ul>
          </header>
          <section className={styles.lecteur}>
            <YouTube
              videoId="knA3H9hI7gM"
              opts={opts}
              onReady={onPlayerReady}
            />
            {/* Bouton pour démarrer/pauser la vidéo */}
            <button onClick={toggleVideo}>
              {isPlaying ? "Pause" : "Démarrer la vidéo"}
            </button>
            <button onClick={() => changeVolume("down")}>
              Baisser le volume
            </button>
            <button onClick={() => changeVolume("up")}>
              Augmenter le volume
            </button>
            <button onClick={() => seekVideo("backward")}>
              Reculer de 10 secondes
            </button>
            <button onClick={() => seekVideo("forward")}>
              Avancer de 10 secondes
            </button>
            {/* Bouton pour mettre en plein écran */}
            <button onClick={toggleFullScreen}>
              {isFullScreen
                ? "Quitter le plein écran"
                : "Mettre en plein écran"}
            </button>
          </section>
        </section>
      </main>
    </>
  );
}

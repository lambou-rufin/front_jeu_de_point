import React from "react";
import "./About.css";

const About: React.FC = () => {
  return (
    <section className="one box">
      <h1 className="first">
        Jeu de Points :<br />
        Deux joueurs jouent à une partie sur un plateau de jeu en matrice. Le
        premier joueur peut définir un score maximal et une limite de temps pour
        la réflexion. Le second joueur doit confirmer les paramètres avant de
        commencer la partie. Le but est d'aligner 5 points pour marquer un
        point. Le premier à atteindre le score maximal gagne la partie. La durée
        de chaque tour est contrôlée pour garantir des parties dynamiques et
        équilibrées.
      </h1>
    </section>
  );
};

export default About;

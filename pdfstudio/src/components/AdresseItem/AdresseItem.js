import React, { useState } from "react";
import "./AdresseItem.css";

const AdresseItem = ({ onAdresseChange }) => {
  const [adresseSexe, setAdresseSexe] = useState("");
  const [adressePrenom, setAdressePrenom] = useState("");
  const [adresseNom, setAdresseNom] = useState("");
  const [adresseValeur, setAdresseValeur] = useState("");
  const [adresseCodePostal, setAdresseCodePostal] = useState("");
  const [adresseVille, setAdresseVille] = useState("");
  const [adressePays, setAdressePays] = useState("");
  const [adresseX, setAdresseX] = useState("");
  const [adresseY, setAdresseY] = useState("");

  const handleAdresseSexe = (event) => {
    const sexe = event.target.value;
    setAdresseSexe(sexe);
    onAdresseChange({
      adresseSexe: sexe,
      adressePrenom,
      adresseNom,
      adresseValeur,
      adresseCodePostal,
      adresseVille,
      adressePays,
      adresseX,
      adresseY,
    });
  };

  const handleAdressePrenom = (event) => {
    const prenom = event.target.value;
    setAdressePrenom(prenom);
    onAdresseChange({
      adresseSexe,
      adressePrenom: prenom,
      adresseNom,
      adresseValeur,
      adresseCodePostal,
      adresseVille,
      adressePays,
      adresseX,
      adresseY,
    });
  };

  const handleAdresseNom = (event) => {
    const nom = event.target.value;
    setAdresseNom(nom);
    onAdresseChange({
      adresseSexe,
      adressePrenom,
      adresseNom: nom,
      adresseValeur,
      adresseCodePostal,
      adresseVille,
      adressePays,
      adresseX,
      adresseY,
    });
  };

  const handleAdresseValeur = (event) => {
    const valeur = event.target.value;
    setAdresseValeur(valeur);
    onAdresseChange({
      adresseSexe,
      adressePrenom,
      adresseNom,
      adresseValeur: valeur,
      adresseCodePostal,
      adresseVille,
      adressePays,
      adresseX,
      adresseY,
    });
  };

  const handleAdresseCP = (event) => {
    const cp = event.target.value;
    setAdresseCodePostal(cp);
    onAdresseChange({
      adresseSexe,
      adressePrenom,
      adresseNom,
      adresseValeur,
      adresseCodePostal: cp,
      adresseVille,
      adressePays,
      adresseX,
      adresseY,
    });
  };

  const handleAdresseVille = (event) => {
    const ville = event.target.value;
    setAdresseVille(ville);
    onAdresseChange({
      adresseSexe,
      adressePrenom,
      adresseNom,
      adresseValeur,
      adresseCodePostal,
      adresseVille: ville,
      adressePays,
      adresseX,
      adresseY,
    });
  };

  const handleAdressePays = (event) => {
    const pays = event.target.value;
    setAdressePays(pays);
    onAdresseChange({
      adresseSexe,
      adressePrenom,
      adresseNom,
      adresseValeur,
      adresseCodePostal,
      adresseVille,
      adressePays: pays,
      adresseX,
      adresseY,
    });
  };

  const handleAdresseX = (event) => {
    const x = event.target.value;
    setAdresseX(x);
    onAdresseChange({
      adresseSexe,
      adressePrenom,
      adresseNom,
      adresseValeur,
      adresseCodePostal,
      adresseVille,
      adressePays,
      adresseX: x,
      adresseY,
    });
  };

  const handleAdresseY = (event) => {
    const y = event.target.value;
    setAdresseY(y);
    onAdresseChange({
      adresseSexe,
      adressePrenom,
      adresseNom,
      adresseValeur,
      adresseCodePostal,
      adresseVille,
      adressePays,
      adresseX,
      adresseY: y,
    });
  };

  return (
    <div className="adresseItem">
      <div className="nameAndSexe">
        <div className="sexe">
          <div>
            <input
              className="inputRadio"
              type="radio"
              id="M"
              name="Sexe"
              value="Monsieur"
              onChange={handleAdresseSexe}
            />
            <label for="huey">Monsieur</label>
          </div>
          <div>
            <input
              className="inputRadio"
              type="radio"
              id="F"
              name="Sexe"
              value="Madame"
              onChange={handleAdresseSexe}
            />
            <label for="huey">Madame</label>
          </div>
        </div>
        <input
          className="inputText"
          type="text"
          placeholder="Prénom"
          onChange={handleAdressePrenom}
        />
        <input
          className="inputText"
          type="text"
          placeholder="Nom"
          onChange={handleAdresseNom}
        />
        <div className="blankSpace"></div>
        <input
          className="inputPosition"
          type="number"
          placeholder="Position X"
          onChange={handleAdresseX}
        />
        <input
          className="inputPosition"
          type="number"
          placeholder="Position Y"
          onChange={handleAdresseY}
        />
      </div>
      <div className="column">
        <input
          className="inputText"
          type="text"
          placeholder="Adresse"
          onChange={handleAdresseValeur}
        />
        <input
          className="inputText"
          type="number"
          placeholder="Code postal"
          onChange={handleAdresseCP}
        />
      </div>
      <div className="column">
        <input
          className="inputText"
          type="text"
          placeholder="Ville"
          onChange={handleAdresseVille}
        />
        <input
          className="inputText"
          type="text"
          placeholder="Pays"
          onChange={handleAdressePays}
        />
      </div>
    </div>
  );
};

export default AdresseItem;

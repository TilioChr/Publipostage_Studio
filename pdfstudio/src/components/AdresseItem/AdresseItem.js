import React, { useState } from "react";
import "./AdresseItem.css";

const AdresseItem = ({
  onAdresseChange,
  csvColumn,
  uniqueKey,
  onDelete,
  adresseStructureImport,
  adresseXImport,
  adresseYImport,
  adresseSizeImport,
  adresse1Import,
  adresse2Import,
  adresse3Import,
  adresse4Import,
  adresse5Import,
  adresse6Import,
}) => {
  const localStorageKey = `adresseItem_${uniqueKey}`;
  const [adresseStructure, setAdresseStructure] = useState(() => {
    const storedAdresseStructure = localStorage.getItem(
      `${localStorageKey}_structure`
    );
    return (
      storedAdresseStructure ||
      adresseStructureImport ||
      "1 - 2 | 3 | 4 | 5 - 6"
    );
  });
  const [adresseX, setAdresseX] = useState(() => {
    const storedAdresseX = localStorage.getItem(`${localStorageKey}_x`);
    return parseInt(storedAdresseX) || adresseXImport || 0;
  });
  const [adresseY, setAdresseY] = useState(() => {
    const storedAdresseY = localStorage.getItem(`${localStorageKey}_y`);
    return parseInt(storedAdresseY) || adresseYImport || 0;
  });
  const [adresseSize, setAdresseSize] = useState(() => {
    const storedAdresseSize = localStorage.getItem(`${localStorageKey}_size`);
    return parseInt(storedAdresseSize) || adresseSizeImport || 11;
  });
  const [adresse1, setAdresse1] = useState(() => {
    const storedAdresse1 = localStorage.getItem(`${localStorageKey}_1`);
    return storedAdresse1 || adresse1Import || "";
  });
  const [adresse2, setAdresse2] = useState(() => {
    const storedAdresse2 = localStorage.getItem(`${localStorageKey}_2`);
    return storedAdresse2 || adresse2Import || "";
  });
  const [adresse3, setAdresse3] = useState(() => {
    const storedAdresse3 = localStorage.getItem(`${localStorageKey}_3`);
    return storedAdresse3 || adresse3Import || "";
  });
  const [adresse4, setAdresse4] = useState(() => {
    const storedAdresse4 = localStorage.getItem(`${localStorageKey}_4`);
    return storedAdresse4 || adresse4Import || "";
  });
  const [adresse5, setAdresse5] = useState(() => {
    const storedAdresse5 = localStorage.getItem(`${localStorageKey}_5`);
    return storedAdresse5 || adresse5Import || "";
  });
  const [adresse6, setAdresse6] = useState(() => {
    const storedAdresse6 = localStorage.getItem(`${localStorageKey}_6`);
    return storedAdresse6 || adresse6Import || "";
  });
  const [showParameters, setShowParameters] = useState(() => {
    const storedShowParameters = localStorage.getItem(
      `${localStorageKey}_showParameters`
    );
    return storedShowParameters ? JSON.parse(storedShowParameters) : true;
  });

  const handleAdresseStructure = (event) => {
    const Structure = event.target.value;
    setAdresseStructure(Structure);
    onAdresseChange({
      adresseStructure: Structure,
      adresseX,
      adresseY,
      adresseSize,
      adresse1,
      adresse2,
      adresse3,
      adresse4,
      adresse5,
      adresse6,
    });
    localStorage.setItem(`${localStorageKey}_structure`, Structure);
  };

  const handleAdresseX = (event) => {
    const x = event.target.value;
    setAdresseX(x);
    onAdresseChange({
      adresseStructure,
      adresseX: x,
      adresseY,
      adresseSize,
      adresse1,
      adresse2,
      adresse3,
      adresse4,
      adresse5,
      adresse6,
    });
    localStorage.setItem(`${localStorageKey}_x`, x);
  };

  const handleAdresseY = (event) => {
    const y = event.target.value;
    setAdresseY(y);
    onAdresseChange({
      adresseStructure,
      adresseX,
      adresseY: y,
      adresseSize,
      adresse1,
      adresse2,
      adresse3,
      adresse4,
      adresse5,
      adresse6,
    });
    localStorage.setItem(`${localStorageKey}_y`, y);
  };

  const handleAdresseSize = (event) => {
    const size = event.target.value;
    setAdresseSize(size);
    console.log(size);
    onAdresseChange({
      adresseStructure,
      adresseX,
      adresseY,
      adresseSize: size,
      adresse1,
      adresse2,
      adresse3,
      adresse4,
      adresse5,
      adresse6,
    });
    localStorage.setItem(`${localStorageKey}_size`, size);
  };

  const handleAdresse1 = (event) => {
    const adresse = event.target.value;
    setAdresse1(adresse);
    onAdresseChange({
      adresseStructure,
      adresseX,
      adresseY,
      adresseSize,
      adresse1: adresse,
      adresse2,
      adresse3,
      adresse4,
      adresse5,
      adresse6,
    });
    localStorage.setItem(`${localStorageKey}_1`, adresse);
  };

  const handleAdresse2 = (event) => {
    const adresse = event.target.value;
    setAdresse2(adresse);
    onAdresseChange({
      adresseStructure,
      adresseX,
      adresseY,
      adresseSize,
      adresse1,
      adresse2: adresse,
      adresse3,
      adresse4,
      adresse5,
      adresse6,
    });
    localStorage.setItem(`${localStorageKey}_2`, adresse);
  };

  const handleAdresse3 = (event) => {
    const adresse = event.target.value;
    setAdresse3(adresse);
    onAdresseChange({
      adresseStructure,
      adresseX,
      adresseY,
      adresseSize,
      adresse1,
      adresse2,
      adresse3: adresse,
      adresse4,
      adresse5,
      adresse6,
    });
    localStorage.setItem(`${localStorageKey}_3`, adresse);
  };

  const handleAdresse4 = (event) => {
    const adresse = event.target.value;
    setAdresse4(adresse);
    onAdresseChange({
      adresseStructure,
      adresseX,
      adresseY,
      adresseSize,
      adresse1,
      adresse2,
      adresse3,
      adresse4: adresse,
      adresse5,
      adresse6,
    });
    localStorage.setItem(`${localStorageKey}_4`, adresse);
  };

  const handleAdresse5 = (event) => {
    const adresse = event.target.value;
    setAdresse5(adresse);
    onAdresseChange({
      adresseStructure,
      adresseX,
      adresseY,
      adresseSize,
      adresse1,
      adresse2,
      adresse3,
      adresse4,
      adresse5: adresse,
      adresse6,
    });
    localStorage.setItem(`${localStorageKey}_5`, adresse);
  };

  const handleAdresse6 = (event) => {
    const adresse = event.target.value;
    setAdresse6(adresse);
    onAdresseChange({
      adresseStructure,
      adresseX,
      adresseY,
      adresseSize,
      adresse1,
      adresse2,
      adresse3,
      adresse4,
      adresse5,
      adresse6: adresse,
    });
    localStorage.setItem(`${localStorageKey}_6`, adresse);
  };

  const handleDelete = () => {
    onDelete(uniqueKey);
  }; // Fonction pour supprimer l'element

  const toggleParametersVisibility = () => {
    const newShowParameters = !showParameters;
    setShowParameters(newShowParameters);
    localStorage.setItem(
      `${localStorageKey}_showParameters`,
      JSON.stringify(newShowParameters)
    );
  }; // Fonction pour afficher ou cacher les paramètres

  return (
    <div className="adresseItem">
      <div className="top">
        <div
          className="hidden-show-button"
          onClick={toggleParametersVisibility}
        >
          {showParameters ? (
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="m0 0h24v24h-24z" fill="#fff" opacity="0" />
              <g fill="#231f20">
                <path d="m21.87 11.5c-.64-1.11-4.16-6.68-10.14-6.5-5.53.14-8.73 5-9.6 6.5a1 1 0 0 0 0 1c.63 1.09 4 6.5 9.89 6.5h.25c5.53-.14 8.74-5 9.6-6.5a1 1 0 0 0 0-1zm-9.65 5.5c-4.31.1-7.12-3.59-8-5 1-1.61 3.61-4.9 7.61-5 4.29-.11 7.11 3.59 8 5-1.03 1.61-3.61 4.9-7.61 5z" />
                <path d="m12 8.5a3.5 3.5 0 1 0 3.5 3.5 3.5 3.5 0 0 0 -3.5-3.5zm0 5a1.5 1.5 0 1 1 1.5-1.5 1.5 1.5 0 0 1 -1.5 1.5z" />
              </g>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="m0 0h24v24h-24z" fill="#fff" opacity="0" />
              <g fill="#231f20">
                <path d="m4.71 3.29a1 1 0 0 0 -1.42 1.42l5.63 5.63a3.5 3.5 0 0 0 4.74 4.74l5.63 5.63a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42zm7.29 10.21a1.5 1.5 0 0 1 -1.5-1.5s0-.05 0-.07l1.56 1.56z" />
                <path d="m12.22 17c-4.3.1-7.12-3.59-8-5a13.7 13.7 0 0 1 2.24-2.72l-1.46-1.41a15.89 15.89 0 0 0 -2.87 3.63 1 1 0 0 0 0 1c.63 1.09 4 6.5 9.89 6.5h.25a9.48 9.48 0 0 0 3.23-.67l-1.58-1.58a7.74 7.74 0 0 1 -1.7.25z" />
                <path d="m21.87 11.5c-.64-1.11-4.17-6.68-10.14-6.5a9.48 9.48 0 0 0 -3.23.67l1.58 1.58a7.74 7.74 0 0 1 1.7-.25c4.29-.11 7.11 3.59 8 5a13.7 13.7 0 0 1 -2.29 2.72l1.51 1.41a15.89 15.89 0 0 0 2.91-3.63 1 1 0 0 0 -.04-1z" />
              </g>
            </svg>
          )}
        </div>
        <div className="delete-button" onClick={handleDelete}>
          <svg
            viewBox="0 0 512 512"
            width="512"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="m289.94 256 95-95a24 24 0 0 0 -33.94-34l-95 95-95-95a24 24 0 0 0 -34 34l95 95-95 95a24 24 0 1 0 34 34l95-95 95 95a24 24 0 0 0 34-34z" />
          </svg>
        </div>
      </div>
      <div className="adresse-item-content">
        {/* taille de la police */}
        <div className="adresse-line">
          <label>Taille</label>
          <input
            type="number"
            defaultValue={adresseSize}
            onChange={handleAdresseSize}
          />
        </div>

        <div className="position">
          <label>Position</label>
          <input
            type="number"
            defaultValue={adresseX}
            placeholder="X"
            onChange={handleAdresseX}
          />
          <input
            type="number"
            defaultValue={adresseY}
            placeholder="Y"
            onChange={handleAdresseY}
          />
        </div>

        {/* regroupement des champs */}
        <div className="adresse-line">
          <label>Structure</label>
          <input
            defaultValue={adresseStructure}
            onChange={handleAdresseStructure}
          ></input>
        </div>

        <div className={`adresse${showParameters ? "-visible" : "-hidden"}`}>
          <div className="separator">
            <span>————————————————</span>
          </div>

          {/* adresse 1 */}
          <div className="adresse-line">
            <label>Element 1</label>
            <select
              onChange={handleAdresse1}
              defaultValue={adresse1}
              value={adresse1}
            >
              <option></option>
              {csvColumn &&
                csvColumn[0] &&
                csvColumn[0].map((option) => <option>{option}</option>)}
            </select>
          </div>

          {/* adresse 2 */}
          <div className="adresse-line">
            <label>Element 2</label>
            <select onChange={handleAdresse2} defaultValue={adresse2}>
              <option></option>
              {csvColumn &&
                csvColumn[0] &&
                csvColumn[0].map((option) => <option>{option}</option>)}
            </select>
          </div>

          {/* adresse 3 */}
          <div className="adresse-line">
            <label>Element 3</label>
            <select onChange={handleAdresse3} defaultValue={adresse3}>
              <option></option>
              {csvColumn &&
                csvColumn[0] &&
                csvColumn[0].map((option) => <option>{option}</option>)}
            </select>
          </div>

          {/* adresse 4 */}
          <div className="adresse-line">
            <label>Element 4</label>
            <select onChange={handleAdresse4} defaultValue={adresse4}>
              <option></option>
              {csvColumn &&
                csvColumn[0] &&
                csvColumn[0].map((option) => <option>{option}</option>)}
            </select>
          </div>

          {/* adresse 5 */}
          <div className="adresse-line">
            <label>Element 5</label>
            <select onChange={handleAdresse5} defaultValue={adresse5}>
              <option></option>
              {csvColumn &&
                csvColumn[0] &&
                csvColumn[0].map((option) => <option>{option}</option>)}
            </select>
          </div>

          {/* adresse 6 */}
          <div className="adresse-line">
            <label>Element 6</label>
            <select onChange={handleAdresse6} defaultValue={adresse6}>
              <option></option>
              {csvColumn &&
                csvColumn[0] &&
                csvColumn[0].map((option) => <option>{option}</option>)}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdresseItem;

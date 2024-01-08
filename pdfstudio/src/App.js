import "./App.css";
import React, { useState, useEffect } from "react";
import ButtonCustom from "./components/ButtonCustom/ButtonCustom.js";
import ImageItem from "./components/ImageItem/ImageItem";
import FileUploadForm from "./components/FileUploadForm/FileUploadForm";
import BarcodeItem from "./components/BarcodeItem/BarcodeItem";
import TextItem from "./components/TextItem/TextItem";
import AdresseItem from "./components/AdresseItem/AdresseItem";
import Papa from "papaparse";
import axios from "axios";
import JsBarcode from "jsbarcode";
import Modal from "./components/Modal/Modal";
import ProjectItem from "./components/ProjectItem/ProjectItem.js";
import * as PDFJS from "pdfjs-dist/webpack";
const QRCode = require("qrcode");

function App() {
  //#region STATES
  const [imageInfos, setImageInfos] = useState([]); //tableau des informations images
  const [textInfos, setTextInfos] = useState([]); //tableau des informations textes
  const [barcodeInfos, setBarcodeInfos] = useState([]); //tableau des informations barcodes
  const [adresseInfos, setAdresseInfos] = useState([]); //tableau des informations adresses

  const [imageItems, setImageItems] = useState([]); //tableau des items images
  const [textItems, setTextItems] = useState([]); //tableau des items textes
  const [barcodeItems, setBarcodeItems] = useState([]); //tableau des items barcodes
  const [adresseItems, setAdresseItems] = useState([]); //tableau des items adresses
  const [projectItems, setProjectItems] = useState([]); //tableau des items projets

  const [csvLength, setCsvLength] = useState(1); //Nombre de lignes du fichier csv
  const [csvColumn] = useState([]); //Nom des premieres colonnes du fichier csv
  const [csvData, setCsvData] = useState([]); //Données du fichier csv
  const [dataFileName, setDataFileName] = useState(""); //Nom du fichier csv
  const [pdfFileName, setPdfFileName] = useState(""); //Nom du fichier pdf
  const [isLoading, setIsLoading] = useState(false); //Etat de chargement de la generation du pdf
  const [pdfUrl, setPdfUrl] = useState(""); //URL du pdf généré
  const [pdfBlob, setPdfBlob] = useState(""); //PDF généré
  const [selectedElementType, setSelectedElementType] = useState(null); //Type d'élément sélectionné
  const [windowSelect, setWindowSelect] = useState("composition"); //Etat de la fenetre de composition
  const [showModal, setShowModal] = useState(false); //Etat de la fenetre de composition
  //#endregion STATES

  const handleRefreshDashboard = async () => {
    const response = await axios.get("http://localhost:3001/dashboard");
    setProjectItems(response.data);
    console.log("projectItems: ", response.data);
  };

  const handleCSVFileSelect = (CSVFile) => {
    console.log("CSV file selected:", CSVFile);
    setDataFileName(CSVFile.name);
    console.log("dataFileName: ", dataFileName);
    Papa.parse(CSVFile, {
      complete: function (results) {
        csvColumn.push(results.data[0]);
        console.log("csvColumn: ", csvColumn);
        setCsvLength(results.data.length);
      },
    });

    //collecting the data from the csv file and storing it in the csvData array
    Papa.parse(CSVFile, {
      complete: function (results) {
        console.log("Finished:", results.data);
        setCsvData(results.data);
      },
    });
  }; //parsing du csv à sa selection pour les nom de column dans textItem

  const handlePDFFileSelect = (pdfFile) => {
    setPdfFileName(pdfFile);
  }; //parsing du pdf à sa selection

  useEffect(() => {
    handleRefreshDashboard();
    const handleBeforeUnload = async () => {
      await axios.post("http://localhost:3001/unload", {
        message: "unload",
      });
      localStorage.clear();
      console.log("/!/ local storage cleared /!/");
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [csvData, csvLength]); // mise à jour de csvLength et csvData

  // Genere via Impress
  const handleRunExecutable = async () => {
    const response = await axios.get("http://localhost:3001/deleteContent"); //reset du dff
    console.log("INFO reset dff: ", response.data);

    const urlBackend = "http://localhost:3001/completDFF"; //chemin vers la fonction backend

    //add text
    for (let i = 0; i < textInfos.length; i++) {
      const element = textInfos[i];
      if (element.textValeur) {
        if (element.textValeur.includes("|")) {
          element.textValeur = element.textValeur.replace(
            /\|([^|]*)\|/g,
            '<xsl:value-of select="$1"/>'
          );
        }
        if (element.textValeur.includes("&eacute;")) {
          element.textValeur = element.textValeur.replace(/&eacute;/g, "é");
        }
      }
      const formatElement =
        '<div style="position:absolute;top:' +
        element.textY +
        "mm;left:" +
        element.textX +
        "mm;width:" +
        element.textLargeur +
        'mm">' +
        element.textValeur +
        "</div>";
      const textJson = { type: "text", message: formatElement };
      const response = await axios.post(urlBackend, textJson);
      console.log("INFO texte : ", response.data);
    }

    //add image
    for (let i = 0; i < imageInfos.length; i++) {
      const element = imageInfos[i];
      const response = await axios.post(urlBackend, {
        type: "image",
        image: element.imagePreview,
        imageX: element.imageX,
        imageY: element.imageY,
        imageSize: element.imageSize,
      });
      console.log("INFO image : ", response.data);
    }

    //add barcode
    for (let i = 0; i < barcodeInfos.length; i++) {
      const element = barcodeInfos[i];
      if (element.barcodeType === "QR Code") {
        //Si c'est un QRCODE
        const qrCodeCanvas = document.createElement("canvas");
        await QRCode.toCanvas(qrCodeCanvas, element.barcodeValeur);
        const qrCodePreview = qrCodeCanvas.toDataURL();
        const response = await axios.post(urlBackend, {
          type: "barcode",
          barcode: qrCodePreview,
          barcodeX: element.barcodeX,
          barcodeY: element.barcodeY,
          barcodeSizeX: element.barcodeSizeX,
          barcodeSizeY: element.barcodeSizeY,
        });
        console.log("INFO : ", response.data);
      } else {
        // Si c'est un code-barres
        const barcodeCanvas = document.createElement("canvas"); // Crée un canvas
        JsBarcode(barcodeCanvas, element.barcodeValeur, {
          format: element.barcodeType,
        });
        const barcodePreview = barcodeCanvas.toDataURL(); // Obtenez l'URL de l'image du canvas
        const response = await axios.post(urlBackend, {
          type: "barcode",
          barcode: barcodePreview,
          barcodeX: element.barcodeX,
          barcodeY: element.barcodeY,
          barcodeSizeX: element.barcodeSizeX,
          barcodeSizeY: element.barcodeSizeY,
        });
        console.log("INFO barcode : ", response.data);
      }
    }

    //add adresse
    for (let i = 0; i < adresseInfos.length; i++) {
      const element = adresseInfos[i];
      const structureSections = element.adresseStructure.split("|");
      const addressLines = [];
      structureSections.forEach((section) => {
        const parts = section.split("-");
        console.log("parts: ", parts);
        const formattedLine = parts.map(
          (part) => element["adresse" + part.trim()]
        );
        console.log("formattedLine: ", formattedLine);

        formattedLine.forEach((line) => {
          const formattedLine = `<xsl:value-of select="${line}"/>`;
          console.log("line: ", formattedLine);
          addressLines.push(formattedLine);
        });
        addressLines.push("<br></br>");
      });
      const formatElement =
        '<div style="position:absolute; font-size:' +
        element.adresseSize +
        "px;top:" +
        element.adresseY +
        "mm;left:" +
        element.adresseX +
        'mm;width:210mm">' +
        "<span>" +
        addressLines.join(" ") +
        "</span>" +
        "</div>";
      const adresseJson = { type: "text", message: formatElement };
      const response = await axios.post(urlBackend, adresseJson);
      console.log("INFO adresse : ", response.data);
    }

    //generation et affichage du pdf
    try {
      //afficher le chargement
      setIsLoading(true);

      const response = await axios.get("http://localhost:3001/runExecutable", {
        responseType: "blob",
      });

      //cacher le chargement
      setIsLoading(false);
      const pdfBlob = new Blob([response.data], {
        type: "application/pdf",
      });

      setPdfBlob(pdfBlob);
      const url = URL.createObjectURL(pdfBlob);

      setPdfUrl(url);
    } catch (error) {
      console.error("Erreur lors de la récupération du fichier PDF", error);
      setIsLoading(false);
    }
  };

  const handleElementTypeSelect = (elementType) => {
    setSelectedElementType(elementType);
    console.log("elementType: ", elementType);
  }; //fonction de gestion du type d'élément sélectionné

  const handleWindowSelect = (windowType) => {
    setWindowSelect(windowType);
  }; //fonction de gestion de la fenetre de composition

  const screenshot = async () => {
    try {
      const pdfDataUrl = URL.createObjectURL(pdfBlob);
      const pdf = await PDFJS.getDocument({ url: pdfDataUrl }).promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 1 });
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      await page.render({ canvasContext: context, viewport: viewport }).promise;
      const base64Preview = canvas.toDataURL();
      console.log("screenshotted successfully");
      return base64Preview;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const saveProject = async () => {
    var projectName = prompt("Entrez le nom du projet");
    console.log("csvData: ", csvData);
    projectName = projectName.replace(/ /g, "_");
    projectName = projectName + ".json";
    console.log("projectName: ", projectName);

    const attachedPDF = pdfFileName ? pdfFileName.name : "";

    // Récupérer l'URL de l'image de preview
    const base64Preview = await screenshot();

    var donneesAEnregistrer = {
      image: imageInfos,
      texte: textInfos,
      codeBarre: barcodeInfos,
      adresse: adresseInfos,
      preview: base64Preview,
      dataFileName: dataFileName,
      attachedPDF: attachedPDF,
    };
    // Convertir l'objet en format JSON
    var donneesJSON = JSON.stringify(donneesAEnregistrer);
    // Envoi des données au backend
    fetch("http://localhost:3001/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        name: projectName,
      },
      body: donneesJSON,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors de l'enregistrement des données");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Données enregistrées avec succès:", data);
      })
      .catch((error) => {
        console.error("Erreur:", error);
      });

    setTimeout(() => {
      handleRefreshDashboard();
    }, 1000);
    console.log("dashboard updated");
  };

  const loadProject = (projectName) => {
    console.log("Loading Project...");
    localStorage.clear();
    fetch("http://localhost:3001/unloadPdf", {
      method: "GET",
    });
    setDataFileName("");
    console.log("/!/ local storage cleared /!/");
    console.log("projectName: ", projectName);
    fetch("http://localhost:3001/projectLoad", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        name: projectName,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load project data");
        }
        return response.json();
      })
      // Load project data
      .then((data) => {
        // Load IMAGE data
        console.log("IMAGE data loaded:", data.image);
        setImageInfos(data.image);
        console.log("imageInfos: ", imageInfos);
        setImageItems(
          data.image.map((imageInfo) => {
            return (
              <div key={imageInfo.key}>
                <ImageItem
                  uniqueKey={imageInfo.key}
                  imageSizeImport={imageInfo.imageSize}
                  imageXImport={imageInfo.imageX}
                  imageYImport={imageInfo.imageY}
                  imagePreviewImport={imageInfo.imagePreview}
                  onImageChange={(newImageInfo) =>
                    updateImageInfo(newImageInfo, imageInfo.key)
                  }
                  onDelete={deleteImageItem}
                />
              </div>
            );
          })
        );

        // Load TEXT data
        console.log("TEXT data loaded:", data.texte);
        setTextInfos(data.texte);
        setTextItems(
          data.texte.map((textInfo) => {
            return (
              <div key={textInfo.key}>
                <TextItem
                  uniqueKey={textInfo.key}
                  textValeurImport={textInfo.textValeur}
                  textXImport={textInfo.textX}
                  textYImport={textInfo.textY}
                  textLargeurImport={textInfo.textLargeur}
                  onTextChange={(newTextInfo) =>
                    updateTextInfo(newTextInfo, textInfo.key)
                  }
                  csvColumn={csvColumn}
                  onDelete={deleteTextItem}
                />
              </div>
            );
          })
        );

        // Load BARCODE data
        console.log("BARCODE data loaded:", data.codeBarre);
        setBarcodeInfos(data.codeBarre);
        setBarcodeItems(
          data.codeBarre.map((barcodeInfo) => {
            return (
              <div key={barcodeInfo.key}>
                <BarcodeItem
                  uniqueKey={barcodeInfo.key}
                  barcodeValeurImport={barcodeInfo.barcodeValeur}
                  barcodeXImport={barcodeInfo.barcodeX}
                  barcodeYImport={barcodeInfo.barcodeY}
                  barcodeSizeXImport={barcodeInfo.barcodeSizeX}
                  barcodeSizeYImport={barcodeInfo.barcodeSizeY}
                  barcodeTypeImport={barcodeInfo.barcodeType}
                  onBarcodeChange={(newBarcodeInfo) =>
                    updateBarcodeInfo(newBarcodeInfo, barcodeInfo.key)
                  }
                  onDelete={deleteBarcodeItem}
                />
              </div>
            );
          })
        );

        // Load ADRESSE data
        console.log("ADRESSE data loaded:", data.adresse);
        setAdresseInfos(data.adresse);
        setAdresseItems(
          data.adresse.map((adresseInfo) => {
            return (
              <div key={adresseInfo.key}>
                <AdresseItem
                  uniqueKey={adresseInfo.key}
                  adresseStructureImport={adresseInfo.adresseStructure}
                  adresseXImport={adresseInfo.adresseX}
                  adresseYImport={adresseInfo.adresseY}
                  adresseSizeImport={adresseInfo.adresseSize}
                  adresse1Import={adresseInfo.adresse1}
                  adresse2Import={adresseInfo.adresse2}
                  adresse3Import={adresseInfo.adresse3}
                  adresse4Import={adresseInfo.adresse4}
                  adresse5Import={adresseInfo.adresse5}
                  adresse6Import={adresseInfo.adresse6}
                  onAdresseChange={(newAdresseInfo) =>
                    updateAdresseInfo(newAdresseInfo, adresseInfo.key)
                  }
                  csvColumn={csvColumn}
                  onDelete={deleteAdresseItem}
                />
              </div>
            );
          })
        );

        console.log("Project data loaded:", data);
        setPdfUrl("");
        setShowModal(false);
        handleRefreshDashboard();

        if (data.dataFileName && data.attachedPDF) {
          alert(
            `⚠️ Attention, les fichiers suivant sont utilisé pour ce projet, n'oubliez pas de les charger avant de générer le PDF.\n➡️ ${data.dataFileName} \n➡️ ${data.attachedPDF}\n\n✅Projet chargé avec succès`
          );
        } else if (data.dataFileName && !data.attachedPDF) {
          alert(
            `⚠️ Attention, le fichier suivant est utilisé pour ce projet, n'oubliez pas de le charger avant de générer le PDF.\n➡️ ${data.dataFileName}\n\n✅Projet chargé avec succès`
          );
        } else if (data.attachedPDF && !data.dataFileName) {
          alert(
            `⚠️ Attention, le fichier suivant est utilisé pour ce projet, n'oubliez pas de le charger avant de générer le PDF.\n➡️ ${data.attachedPDF}\n\n✅Projet chargé avec succès`
          );
        } else {
          alert("✅ Projet chargé avec succès");
        }
      })
      .catch((error) => {
        console.error("Error loading project data:", error);
      });
  };

  const deleteProject = (projectName) => {
    console.log("Deleting Project...");
    console.log("projectName: ", projectName);
    fetch("http://localhost:3001/deleteProject", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        name: projectName,
      },
    })
      .then((data) => {
        console.log("Project data deleted:", data);
        handleRefreshDashboard();
        alert("Projet supprimé avec succès");
      })
      .catch((error) => {
        console.error("Error deleting project data:", error);
      });
  };

  //#region ITEMS
  //--- IMAGE ---
  const addImageItem = () => {
    const key = Date.now().toString(); // Generate a unique key
    setImageItems((prevImageItems) => [
      ...prevImageItems,
      <div key={key}>
        <ImageItem
          uniqueKey={key}
          onImageChange={(newImageInfo) => updateImageInfo(newImageInfo, key)}
          onDelete={deleteImageItem}
        />
      </div>,
    ]);
  }; // fonction d'ajout d'un item image

  const updateImageInfo = (newImageInfo, key) => {
    setImageInfos((prevImageInfos) => {
      const index = prevImageInfos.findIndex(
        (imageInfo) => imageInfo.key === key
      );

      if (index !== -1) {
        const updatedInfos = [...prevImageInfos];
        updatedInfos[index] = { ...updatedInfos[index], ...newImageInfo };
        return updatedInfos;
      } else {
        return [...prevImageInfos, { key, ...newImageInfo }];
      }
    });
  }; // fonction de mise à jour des informations d'une image

  const deleteImageItem = (key) => {
    setImageItems((prevImageItems) =>
      prevImageItems.filter((item) => item.key !== key)
    );
    setImageInfos((prevImageInfos) =>
      prevImageInfos.filter((item) => item.key !== key)
    );
  }; // fonction de suppression d'un item image
  //------------

  //--- TEXT ---
  const addTextItem = () => {
    const key = Date.now().toString(); //genere une clé unique
    setTextItems((prevTextItems) => [
      ...prevTextItems,
      <div key={key}>
        <TextItem
          uniqueKey={key}
          onTextChange={(newTextInfo) => updateTextInfo(newTextInfo, key)}
          csvColumn={csvColumn}
          onDelete={deleteTextItem}
        />
      </div>,
    ]);
  }; //fonction d'ajout d'un item texte

  const updateTextInfo = (newTextInfo, key) => {
    setTextInfos((prevTextInfos) => {
      const index = prevTextInfos.findIndex((textInfo) => textInfo.key === key);

      if (index !== -1) {
        const updatedInfos = [...prevTextInfos];
        updatedInfos[index] = { ...updatedInfos[index], ...newTextInfo };
        return updatedInfos;
      } else {
        return [...prevTextInfos, { key, ...newTextInfo }];
      }
    });
  }; //fonction de mise à jour des informations d'un texte

  const deleteTextItem = (key) => {
    setTextItems((prevTextItems) => {
      return prevTextItems.filter((item) => item.key !== key);
    });
    setTextInfos((prevTextInfos) => {
      return prevTextInfos.filter((item) => item.key !== key);
    });
  }; //fonction de suppression d'un item texte
  //-------------

  //-- BARCODE --
  const addBarcodeItem = () => {
    const key = Date.now().toString(); //genere une clé unique
    setBarcodeItems((prevBarcodeItems) => [
      ...prevBarcodeItems,
      <div key={key}>
        <BarcodeItem
          uniqueKey={key}
          onBarcodeChange={(newBarcodeInfo) =>
            updateBarcodeInfo(newBarcodeInfo, key)
          }
          onDelete={deleteBarcodeItem}
        />
      </div>,
    ]);
  }; //fonction d'ajout d'un item barcode

  const updateBarcodeInfo = (newBarcodeInfo, key) => {
    setBarcodeInfos((prevBarcodeInfos) => {
      const index = prevBarcodeInfos.findIndex(
        (imageInfo) => imageInfo.key === key
      );

      if (index !== -1) {
        const updatedInfos = [...prevBarcodeInfos];
        updatedInfos[index] = { ...updatedInfos[index], ...newBarcodeInfo };
        return updatedInfos;
      } else {
        return [...prevBarcodeInfos, { key, ...prevBarcodeInfos }];
      }
    });
  };

  const deleteBarcodeItem = (key) => {
    setBarcodeItems((prevBarcodeItems) => {
      return prevBarcodeItems.filter((item) => item.key !== key);
    });
    setBarcodeInfos((prevBarcodeInfos) => {
      return prevBarcodeInfos.filter((item) => item.key !== key);
    });
  }; //fonction de suppression d'un item barcode
  //-------------

  //-- ADRESSE --
  const addAdresseItem = () => {
    const key = Date.now().toString(); //genere une clé unique
    setAdresseItems((prevAdresseItems) => [
      ...prevAdresseItems,
      <div key={key}>
        <AdresseItem
          uniqueKey={key}
          csvColumn={csvColumn}
          onAdresseChange={(newAdresseInfo) =>
            updateAdresseInfo(newAdresseInfo, key)
          }
          onDelete={deleteAdresseItem}
        />
      </div>,
    ]);
  }; //fonction d'ajout d'un item adresse

  const updateAdresseInfo = (newAdresseInfo, key) => {
    setAdresseInfos((prevAdresseInfos) => {
      const index = prevAdresseInfos.findIndex(
        (adresseInfos) => adresseInfos.key === key
      );

      if (index !== -1) {
        const updatedInfos = [...prevAdresseInfos];
        updatedInfos[index] = { ...updatedInfos[index], ...newAdresseInfo };
        return updatedInfos;
      } else {
        return [...prevAdresseInfos, { key, ...newAdresseInfo }];
      }
    });
  }; // fonction de mise à jour des informations d'une adresse

  const deleteAdresseItem = (key) => {
    setAdresseItems((prevAdresseItems) => {
      return prevAdresseItems.filter((item) => item.key !== key);
    });
    setAdresseInfos((prevAdresseInfos) => {
      return prevAdresseInfos.filter((item) => item.key !== key);
    });
  }; //fonction de suppression d'un item adresse
  //-------------
  //#endregion ITEMS

  return (
    <div className="app">
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-overlay-spinner">
            <svg
              version="1.1"
              id="L6"
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              viewBox="0 0 100 100"
              enable-background="new 0 0 100 100"
            >
              <rect
                fill="none"
                stroke="#fff"
                stroke-width="4"
                x="25"
                y="25"
                width="50"
                height="50"
              >
                <animateTransform
                  attributeName="transform"
                  dur="0.5s"
                  from="0 50 50"
                  to="180 50 50"
                  type="rotate"
                  id="strokeBox"
                  attributeType="XML"
                  begin="rectBox.end"
                />
              </rect>
              <rect x="27" y="27" fill="#fff" width="46" height="50">
                <animate
                  attributeName="height"
                  dur="1.3s"
                  attributeType="XML"
                  from="50"
                  to="0"
                  id="rectBox"
                  fill="freeze"
                  begin="0s;strokeBox.end"
                />
              </rect>
            </svg>
          </div>
        </div>
      )}
      <div className="menu">
        <div className="title">
          <span className="title-item">PUBLIPOSTAGE STUDIO</span>
        </div>
        <div className="categories">
          <Modal
            buttonText="DASHBOARD"
            showModal={showModal}
            setShowModal={setShowModal}
          >
            <span className="modalTitle">DASHBOARD</span>
            <div className="dashboard">
              {projectItems.map((projectItem) => {
                return (
                  <ProjectItem
                    projectName={projectItem.name}
                    projectImage={projectItem.preview}
                    attachedData={projectItem.attachedData}
                    attachedPDF={projectItem.attachedPDF}
                    onLoadButtonClick={loadProject}
                    onDeleteButtonClick={deleteProject}
                  ></ProjectItem>
                );
              })}
            </div>
          </Modal>
          <ButtonCustom onClick={() => handleWindowSelect("composition")}>
            <span className="buttonText">COMPOSITION</span>
          </ButtonCustom>
          <ButtonCustom onClick={() => handleWindowSelect("enrichir")}>
            <span className="buttonText">ENRICHIR</span>
          </ButtonCustom>
        </div>
        <div className="goal-button">
          <div className="submit">
            <ButtonCustom onClick={handleRunExecutable}>EXECUTER</ButtonCustom>
          </div>
          <div className="submit">
            <ButtonCustom onClick={saveProject}>SAUVEGARDER</ButtonCustom>
          </div>
        </div>
      </div>
      <div className="workspace">
        {pdfUrl ? (
          <embed
            src={pdfUrl}
            width="100%"
            height="100%"
            type="application/pdf"
            id="pdfEmbed"
          ></embed>
        ) : (
          <p>PDF non généré</p>
        )}
      </div>
      {windowSelect === "dashboard" && <div className="options"></div>}
      {windowSelect === "composition" && (
        <div className="options">
          <div className="elements">
            <div className="elements-line">
              {/* Fichier */}
              <div className="elements-line-button">
                <ButtonCustom
                  onClick={() => handleElementTypeSelect("fichier")}
                >
                  <div>Fichier</div>

                  <svg viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg">
                    <path d="m0 0h24v24h-24z" fill="#fff" opacity="0" />
                    <path
                      d="m19.74 7.33-4.44-5a1 1 0 0 0 -.74-.33h-8a2.53 2.53 0 0 0 -2.56 2.5v15a2.53 2.53 0 0 0 2.56 2.5h10.88a2.53 2.53 0 0 0 2.56-2.5v-11.5a1 1 0 0 0 -.26-.67zm-5.74-3.33 3.74 4h-3a.79.79 0 0 1 -.74-.85z"
                      fill="#231f20"
                    />
                  </svg>
                </ButtonCustom>
              </div>
              {/* Texte */}
              <div className="elements-line-button">
                <ButtonCustom onClick={() => handleElementTypeSelect("texte")}>
                  <div>Texte</div>

                  <svg viewBox="0 -1 8 12" xmlns="http://www.w3.org/2000/svg">
                    <path d="m0 0v2h.5c0-.55.45-1 1-1h1.5v5.5c0 .28-.22.5-.5.5h-.5v1h4v-1h-.5c-.28 0-.5-.22-.5-.5v-5.5h1.5c.55 0 1 .45 1 1h.5v-2z" />
                  </svg>
                </ButtonCustom>
              </div>
              {/* Image */}
              <div className="elements-line-button">
                <ButtonCustom onClick={() => handleElementTypeSelect("image")}>
                  <div>Image</div>

                  <svg
                    width="24"
                    height="24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M21.414 21.414l-.707-.707.707.707zm-18.828 0l.707-.707-.707.707zM21.414 2.586l.707-.707-.707.707zM6 3h12V1H6v2zM3 18V6H1v12h2zm15 3H6v2h12v-2zm3-15v12h2V6h-2zm-3 17c.915 0 1.701.002 2.328-.082.655-.088 1.284-.287 1.793-.797l-1.414-1.414c-.076.076-.212.17-.646.229-.462.062-1.09.064-2.061.064v2zm3-5c0 .971-.002 1.599-.064 2.061-.059.434-.153.57-.229.646l1.414 1.414c.51-.51.709-1.138.797-1.793C23.002 19.7 23 18.915 23 18h-2zM1 18c0 .915-.002 1.701.082 2.328.088.655.287 1.284.797 1.793l1.414-1.414c-.076-.076-.17-.212-.229-.646C3.002 19.6 3 18.971 3 18H1zm5 3c-.971 0-1.599-.002-2.061-.064-.434-.059-.57-.153-.646-.229l-1.414 1.414c.51.51 1.138.709 1.793.797C4.3 23.002 5.085 23 6 23v-2zM18 3c.971 0 1.599.002 2.061.064.434.059.57.153.646.229l1.414-1.414c-.51-.51-1.138-.709-1.793-.797C19.7.998 18.915 1 18 1v2zm5 3c0-.915.002-1.701-.082-2.328-.088-.655-.287-1.284-.797-1.793l-1.414 1.414c.076.076.17.212.229.646C20.998 4.4 21 5.029 21 6h2zM6 1c-.915 0-1.701-.002-2.328.082-.655.088-1.284.287-1.793.797l1.414 1.414c.076-.076.212-.17.646-.229C4.4 3.002 5.029 3 6 3V1zM3 6c0-.971.002-1.599.064-2.061.059-.434.153-.57.229-.646L1.879 1.879c-.51.51-.709 1.138-.797 1.793C.998 4.3 1 5.085 1 6h2z"
                      fill="currentColor"
                    />
                    <path
                      d="M12 15.846L9.827 13.73c-1.335-1.3-2.003-1.951-2.83-1.951-.825 0-1.493.65-2.827 1.952L2 15.846m20-3.516l-3.145-3.056c-1.346-1.308-2.02-1.962-2.85-1.958-.831.005-1.497.666-2.83 1.99L9.677 12.78"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </ButtonCustom>
              </div>
            </div>
            <div className="elements-line">
              {/* Barcode */}
              <div className="elements-line-button">
                <ButtonCustom
                  onClick={() => handleElementTypeSelect("barcode")}
                >
                  <div>Barcode</div>

                  <svg
                    fill="none"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g fill="#000000">
                      <path d="m17 21.25h-10c-3.65 0-5.75-2.1-5.75-5.75v-7c0-3.65 2.1-5.75 5.75-5.75h10c3.65 0 5.75 2.1 5.75 5.75v7c0 3.65-2.1 5.75-5.75 5.75zm-10-17c-2.86 0-4.25 1.39-4.25 4.25v7c0 2.86 1.39 4.25 4.25 4.25h10c2.86 0 4.25-1.39 4.25-4.25v-7c0-2.86-1.39-4.25-4.25-4.25z" />
                      <path d="m6 16.75c-.41 0-.75-.34-.75-.75v-8c0-.41.34-.75.75-.75s.75.34.75.75v8c0 .41-.34.75-.75.75z" />
                      <path d="m9 12.75c-.41 0-.75-.34-.75-.75v-4c0-.41.34-.75.75-.75s.75.34.75.75v4c0 .41-.34.75-.75.75z" />
                      <path d="m9 16.75c-.41 0-.75-.34-.75-.75v-1c0-.41.34-.75.75-.75s.75.34.75.75v1c0 .41-.34.75-.75.75z" />
                      <path d="m15 9.75c-.41 0-.75-.34-.75-.75v-1c0-.41.34-.75.75-.75s.75.34.75.75v1c0 .41-.34.75-.75.75z" />
                      <path d="m12 16.75c-.41 0-.75-.34-.75-.75v-8c0-.41.34-.75.75-.75s.75.34.75.75v8c0 .41-.34.75-.75.75z" />
                      <path d="m15 16.75c-.41 0-.75-.34-.75-.75v-4c0-.41.34-.75.75-.75s.75.34.75.75v4c0 .41-.34.75-.75.75z" />
                      <path d="m18 16.75c-.41 0-.75-.34-.75-.75v-8c0-.41.34-.75.75-.75s.75.34.75.75v8c0 .41-.34.75-.75.75z" />
                    </g>
                  </svg>
                </ButtonCustom>
              </div>
              {/* Adresse */}
              <div className="elements-line-button">
                <ButtonCustom
                  onClick={() => handleElementTypeSelect("adresse")}
                >
                  <div>Adresse</div>

                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="m2 3h12c.5522847 0 1 .44771525 1 1s-.4477153 1-1 1h-12c-.55228475 0-1-.44771525-1-1s.44771525-1 1-1z" />
                    <path d="m2 7h12c.5522847 0 1 .44771525 1 1s-.4477153 1-1 1h-12c-.55228475 0-1-.44771525-1-1s.44771525-1 1-1z" />
                    <path d="m1.88888889 11h6.22222222c.49091978 0 .88888889.4477153.88888889 1s-.39796911 1-.88888889 1h-6.22222222c-.49091978 0-.88888889-.4477153-.88888889-1s.39796911-1 .88888889-1z" />
                  </svg>
                </ButtonCustom>
              </div>
              {/* Other1 */}
              <div className="elements-line-button">
                <ButtonCustom onClick={() => handleElementTypeSelect("other2")}>
                  <div>Other1</div>

                  <svg
                    fill="none"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="m6 1a1 1 0 0 0 -2 0zm-2 3a1 1 0 0 0 2 0zm7-3a1 1 0 1 0 -2 0zm-2 3a1 1 0 0 0 2 0zm7-3a1 1 0 1 0 -2 0zm-2 3a1 1 0 1 0 2 0zm-13 2a1 1 0 0 0 0 2zm18 2a1 1 0 1 0 0-2zm-14 3v-1h-1v1zm0 .01h-1v1h1zm.01 0v1h1v-1zm0-.01h1v-1h-1zm4.99 0v-1h-1v1zm0 .01h-1v1h1zm.01 0v1h1v-1zm0-.01h1v-1h-1zm-.01 4v-1h-1v1zm0 .01h-1v1h1zm.01 0v1h1v-1zm0-.01h1v-1h-1zm4.99 0v-1h-1v1zm0 .01h-1v1h1zm.01 0v1h1v-1zm0-.01h1v-1h-1zm-.01-4v-1h-1v1zm0 .01h-1v1h1zm.01 0v1h1v-1zm0-.01h1v-1h-1zm-10.01 4v-1h-1v1zm0 .01h-1v1h1zm.01 0v1h1v-1zm0-.01h1v-1h-1zm-3.01-11h16v-2h-16zm16 0h2a2 2 0 0 0 -2-2zm0 0v14h2v-14zm0 14v2a2 2 0 0 0 2-2zm0 0h-16v2h16zm-16 0h-2a2 2 0 0 0 2 2zm0 0v-14h-2v14zm0-14v-2a2 2 0 0 0 -2 2zm2-3v3h2v-3zm5 0v3h2v-3zm5 0v3h2v-3zm-13 7h18v-2h-18zm3 3v.01h2v-.01zm1 1.01h.01v-2h-.01zm1.01-1v-.01h-2v.01zm-1-1.01h-.01v2h.01zm3.99 1v.01h2v-.01zm1 1.01h.01v-2h-.01zm1.01-1v-.01h-2v.01zm-1-1.01h-.01v2h.01zm-1.01 5v.01h2v-.01zm1 1.01h.01v-2h-.01zm1.01-1v-.01h-2v.01zm-1-1.01h-.01v2h.01zm3.99 1v.01h2v-.01zm1 1.01h.01v-2h-.01zm1.01-1v-.01h-2v.01zm-1-1.01h-.01v2h.01zm-1.01-3v.01h2v-.01zm1 1.01h.01v-2h-.01zm1.01-1v-.01h-2v.01zm-1-1.01h-.01v2h.01zm-11.01 5v.01h2v-.01zm1 1.01h.01v-2h-.01zm1.01-1v-.01h-2v.01zm-1-1.01h-.01v2h.01z"
                      fill="#000"
                    />
                  </svg>
                </ButtonCustom>
              </div>
            </div>
          </div>
          <div className="params">
            {selectedElementType === "fichier" && (
              <FileUploadForm
                onCSVFileSelect={handleCSVFileSelect}
                onPDFFileSelect={handlePDFFileSelect}
              ></FileUploadForm>
            )}
            {selectedElementType === "image" && imageItems}
            {selectedElementType === "image" && (
              <ButtonCustom onClick={addImageItem}>+</ButtonCustom>
            )}
            {selectedElementType === "barcode" && barcodeItems}
            {selectedElementType === "barcode" && (
              <ButtonCustom onClick={addBarcodeItem}>+</ButtonCustom>
            )}
            {selectedElementType === "adresse" && adresseItems}
            {selectedElementType === "adresse" && (
              <ButtonCustom onClick={addAdresseItem}>+</ButtonCustom>
            )}
            {selectedElementType === "texte" && textItems}
            {selectedElementType === "texte" && (
              <ButtonCustom onClick={addTextItem}>+</ButtonCustom>
            )}
            {selectedElementType === "other1" && "other1"}
          </div>
        </div>
      )}
      {windowSelect === "enrichir" && (
        <div className="options">
          <div>ENRICHIR</div>
        </div>
      )}
    </div>
  );
}

export default App;

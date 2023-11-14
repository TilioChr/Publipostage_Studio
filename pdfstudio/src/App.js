import "./App.css";
import React, { useState, useEffect } from "react";
import ButtonCustom from "./components/ButtonCustom/ButtonCustom.js";
import Modal from "./components/Modal/Modal";
import ImageItem from "./components/ImageItem/ImageItem";
import FileUploadForm from "./components/FileUploadForm/FileUploadForm";
import jsPDF from "jspdf";
import BarcodeItem from "./components/BarcodeItem/BarcodeItem";
import TextItem from "./components/TextItem/TextItem";
import AdresseItem from "./components/AdresseItem/AdresseItem";
import JsBarcode from "jsbarcode";
import Papa from "papaparse";
const QRCode = require("qrcode");

function App() {
  const [imageInfos, setImageInfos] = useState([]); //tableau des informations images
  const [textInfos, setTextInfos] = useState([]); //tableau des informations textes
  const [barcodeInfos, setBarcodeInfos] = useState([]); //tableau des informations barcodes
  const [adresseInfos, setAdresseInfos] = useState([]); //tableau des informations adresses

  const [imageItems, setImageItems] = useState([]); //tableau des items images
  const [textItems, setTextItems] = useState([]); //tableau des items textes
  const [barcodeItems, setBarcodeItems] = useState([]); //tableau des items barcodes
  const [adresseItems, setAdresseItems] = useState([]); //tableau des items adresses

  const [pdfDataUrl, setPdfDataUrl] = useState(null); //url du pdf généré
  /* const [selectedPdfFile, setSelectedPdfFile] = useState(null); //fichier pdf sélectionné */
  /* const [selectedCSVFile, setSelectedCSVFile] = useState(null); //fichier csv sélectionné */
  const [csvLength, setCsvLength] = useState(0); //Nombre de lignes du fichier csv
  const [csvColumn] = useState([]); //Nom des premieres colonnes du fichier csv

  const handlePdfFileSelect = (pdfFile) => {
    /* setSelectedPdfFile(pdfFile); */
  }; //fonction de gestion du fichier pdf sélectionné

  const handleCSVFileSelect = (CSVFile) => {
    /* setSelectedCSVFile(CSVFile); */
    console.log("CSV file selected:", CSVFile);

    Papa.parse(CSVFile, {
      complete: function (results) {
        csvColumn.push(results.data[0]);
        console.log("csvColumn: ", csvColumn);
        setCsvLength(results.data.length);
      },
    });
  };

  useEffect(() => {
    console.log("csvLength updated:", csvLength);
  }, [csvLength]);

  const generatePDF = async () => {
    const doc = new jsPDF(); // Création du pdf

    for (let index = 0; index < csvLength; index++) {
      // Ajout d'une nouvelle page pour chaque itération
      doc.addPage();

      // Ajout des images
      imageInfos.forEach((element) => {
        doc.addImage(
          element.imagePreview,
          "JPEG",
          element.imageX,
          element.imageY,
          element.imageSize,
          element.imageSize
        );
        console.log("image ajoutée");
      });

      // Ajout des barcodes
      barcodeInfos.forEach((element) => {
        let CB = document.createElement("canvas");

        if (element.barcodeType === "QR Code") {
          QRCode.toCanvas(
            CB,
            element.barcodeValeur,
            { errorCorrectionLevel: "H" },
            function (error) {
              if (error) console.error(error);
              console.log("QR Code ajouté");
            }
          );
        } else {
          JsBarcode(CB, element.barcodeValeur, {
            format: element.barcodeType,
          });
        }

        doc.addImage(
          CB.toDataURL("image/jpeg"),
          "JPEG",
          element.barcodeX,
          element.barcodeY,
          element.barcodeSizeX,
          element.barcodeSizeY
        );
        console.log("barcode ajouté");
      });

      // Ajout des adresses
      adresseInfos.forEach((element) => {
        doc.text(
          element.adresseSexe +
            " " +
            element.adressePrenom +
            " " +
            element.adresseNom,
          element.adresseX,
          element.adresseY
        );
        doc.text(
          element.adresseValeur,
          element.adresseX,
          parseInt(element.adresseY) + 5
        );
        doc.text(
          element.adresseCodePostal + " " + element.adresseVille,
          element.adresseX,
          parseInt(element.adresseY) + 10
        );
        doc.text(
          element.adressePays,
          element.adresseX,
          parseInt(element.adresseY) + 15
        );
        console.log("adresse ajoutée");
      });

      const textPromises = textInfos.map(async (element) => {
        const htmlText =
          '<div style="width: 100%;">' + element.textValeur + "</div>";
        return new Promise((resolve) => {
          doc.html(htmlText, {
            x: element.textX,
            y: element.textY,
            width: element.textLargeur,
            callback: () => {
              console.log("texte ajouté");
              resolve();
            },
          });
        });
      });

      // Attendre que toutes les opérations asynchrones pour cette page soient terminées
      await Promise.all(textPromises);
    }

    // Récupération des données du PDF
    const pdfDataUrl = doc.output("datauristring");
    setPdfDataUrl(pdfDataUrl);

    return doc;
  };

  //--- IMAGE ---
  const addImageItem = () => {
    const key = Date.now().toString(); //genere une clé unique
    setImageItems([
      ...imageItems,
      <div key={key}>
        <ImageItem
          key={key}
          onImageChange={(newImageInfo) => updateImageInfo(newImageInfo, key)}
        />
        <ButtonCustom onClick={() => deleteImageItem(key)}>
          Supprimer
        </ButtonCustom>
      </div>,
    ]);
  }; //fonction d'ajout d'un item image

  const updateImageInfo = (newImageInfo, key) => {
    newImageInfo.key = key;
    let found = false;
    if (imageInfos.length === 0) {
      imageInfos.push(newImageInfo);
    } else {
      imageInfos.forEach((imageInfo) => {
        if (imageInfo.key === key) {
          imageInfo.imagePreview = newImageInfo.imagePreview;
          imageInfo.imageSize = newImageInfo.imageSize;
          imageInfo.imageX = newImageInfo.imageX;
          imageInfo.imageY = newImageInfo.imageY;
          found = true;
        }
      });
      if (!found) {
        imageInfos.push(newImageInfo);
      }
    }
  }; //fonction de mise à jour des informations d'une image

  const deleteImageItem = (key) => {
    setImageItems((prevImageItems) => {
      return prevImageItems.filter((item) => item.key !== key);
    });
    setImageInfos((prevImageInfos) => {
      return prevImageInfos.filter((item) => item.key !== key);
    });
  }; //fonction de suppression d'un item image
  //------------

  //--- TEXT ---
  const addTextItem = () => {
    const key = Date.now().toString(); //genere une clé unique
    setTextItems([
      ...textItems,
      <div key={key}>
        <TextItem
          key={key}
          onTextChange={(newTextInfo) => updateTextInfo(newTextInfo, key)}
          csvColumn={csvColumn}
        />
        <ButtonCustom onClick={() => deleteTextItem(key)}>
          Supprimer
        </ButtonCustom>
      </div>,
    ]);
  }; //fonction d'ajout d'un item texte

  const updateTextInfo = (newTextInfo, key) => {
    newTextInfo.key = key;
    let found = false;
    if (textInfos.length === 0) {
      textInfos.push(newTextInfo);
    } else {
      textInfos.forEach((textInfo) => {
        if (textInfo.key === key) {
          textInfo.textX = newTextInfo.textX;
          textInfo.textY = newTextInfo.textY;
          textInfo.textLargeur = newTextInfo.textLargeur;
          textInfo.textValeur = newTextInfo.textValeur;
          found = true;
        }
      });
      if (!found) {
        textInfos.push(newTextInfo);
      }
    }
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
    setBarcodeItems([
      ...barcodeItems,
      <div key={key}>
        <BarcodeItem
          key={key}
          onBarcodeChange={(newBarcodeInfo) =>
            updateBarcodeInfo(newBarcodeInfo, key)
          }
        />
        <ButtonCustom onClick={() => deleteBarcodeItem(key)}>
          Supprimer
        </ButtonCustom>
      </div>,
    ]);
  }; //fonction d'ajout d'un item barcode

  const updateBarcodeInfo = (newBarcodeInfo, key) => {
    newBarcodeInfo.key = key;
    let found = false;
    if (barcodeInfos.length === 0) {
      barcodeInfos.push(newBarcodeInfo);
    } else {
      barcodeInfos.forEach((barcodeInfo) => {
        if (barcodeInfo.key === key) {
          barcodeInfo.barcodeSizeX = newBarcodeInfo.barcodeSizeX;
          barcodeInfo.barcodeSizeY = newBarcodeInfo.barcodeSizeY;
          barcodeInfo.barcodeX = newBarcodeInfo.barcodeX;
          barcodeInfo.barcodeY = newBarcodeInfo.barcodeY;
          barcodeInfo.barcodeType = newBarcodeInfo.barcodeType;
          barcodeInfo.barcodeValeur = newBarcodeInfo.barcodeValeur;
          found = true;
        }
      });
      if (!found) {
        barcodeInfos.push(newBarcodeInfo);
      }
    }
  }; //fonction de mise à jour des informations d'un barcode

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
    setAdresseItems([
      ...adresseItems,
      <div key={key}>
        <AdresseItem
          key={key}
          onAdresseChange={(newAdresseInfo) =>
            updateAdresseInfo(newAdresseInfo, key)
          }
        />
        <ButtonCustom onClick={() => deleteAdresseItem(key)}>
          Supprimer
        </ButtonCustom>
      </div>,
    ]);
  }; //fonction d'ajout d'un item adresse

  const updateAdresseInfo = (newAdresseInfo, key) => {
    newAdresseInfo.key = key;
    let found = false;
    if (adresseInfos.length === 0) {
      adresseInfos.push(newAdresseInfo);
    } else {
      adresseInfos.forEach((adresseInfo) => {
        if (adresseInfo.key === key) {
          adresseInfo.adresseSexe = newAdresseInfo.adresseSexe;
          adresseInfo.adressePrenom = newAdresseInfo.adressePrenom;
          adresseInfo.adresseNom = newAdresseInfo.adresseNom;
          adresseInfo.adresseValeur = newAdresseInfo.adresseValeur;
          adresseInfo.adresseCodePostal = newAdresseInfo.adresseCodePostal;
          adresseInfo.adresseVille = newAdresseInfo.adresseVille;
          adresseInfo.adressePays = newAdresseInfo.adressePays;
          adresseInfo.adresseX = newAdresseInfo.adresseX;
          adresseInfo.adresseY = newAdresseInfo.adresseY;
          found = true;
        }
      });
      if (!found) {
        adresseInfos.push(newAdresseInfo);
      }
    }
  }; //fonction de mise à jour des informations d'un adresse

  const deleteAdresseItem = (key) => {
    setAdresseItems((prevAdresseItems) => {
      return prevAdresseItems.filter((item) => item.key !== key);
    });
    setAdresseInfos((prevAdresseInfos) => {
      return prevAdresseInfos.filter((item) => item.key !== key);
    });
  }; //fonction de suppression d'un item adresse
  //-------------

  return (
    <div className="app">
      <div className="menu">
        <div className="title">
          <span className="title-item">PUBLIPOSTAGE STUDIO</span>
        </div>
        <div className="categories">
          <Modal buttonText="FICHER">
            <span className="modalTitle">FICHIER</span>
            <FileUploadForm
              onPdfFileSelect={handlePdfFileSelect}
              onCSVFileSelect={handleCSVFileSelect}
            ></FileUploadForm>
          </Modal>
          <Modal buttonText="IMAGE">
            <span className="modalTitle">IMAGE</span>
            {imageItems}
            <ButtonCustom onClick={addImageItem}>+</ButtonCustom>
          </Modal>
          <Modal buttonText="BARCODE">
            <span className="modalTitle">BARCODE & QRCODE</span>
            {barcodeItems}
            <ButtonCustom onClick={addBarcodeItem}>+</ButtonCustom>
          </Modal>
          <Modal buttonText="ADRESSE">
            <span className="modalTitle">ADRESSE</span>
            {adresseItems}
            <ButtonCustom onClick={addAdresseItem}>+</ButtonCustom>
          </Modal>
          <Modal buttonText="BLOCTEXTE">
            <span className="modalTitle">BLOCTEXTE</span>
            {textItems}
            <ButtonCustom onClick={addTextItem}>+</ButtonCustom>
          </Modal>
        </div>
        <div className="submit">
          <ButtonCustom onClick={generatePDF}>GÉNÉRER</ButtonCustom>
        </div>
      </div>
      <div className="workspace">
        {pdfDataUrl ? (
          <embed
            src={pdfDataUrl}
            width="100%"
            height="100%"
            type="application/pdf"
          ></embed>
        ) : (
          <p>PDF non généré</p>
        )}
      </div>
    </div>
  );
}

export default App;

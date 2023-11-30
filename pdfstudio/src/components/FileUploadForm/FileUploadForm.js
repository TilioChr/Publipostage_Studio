import React, { useState } from "react";
import csv from "csvtojson";
import xmlBuilder from "xmlbuilder";
import FileSaver from "file-saver";
import axios from "axios";
import "./FileUploadForm.css";

function FileUploadForm(props) {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    if (props.onCSVFileSelect) {
      props.onCSVFileSelect(selectedFile);
    }
  };

  const handlePdfFileChange = (event) => {
    const selectedPdfFile = event.target.files[0];
    if (props.onPdfFileSelect) {
      props.onPdfFileSelect(selectedPdfFile);
    }
  };

  function cleanXMLTagName(tagName) {
    // Encodez les caractères non valides
    tagName = encodeURIComponent(tagName);
    // Remplacez les caractères spéciaux encodés par des tirets
    tagName = tagName.replace(/%/g, "-");
    // Vérifiez que le nom de balise commence par une lettre ou un tiret
    if (/^[^a-zA-Z_]/.test(tagName)) {
      tagName = "tag-" + tagName;
    }
    return tagName;
  }

  const handleSubmit = async () => {
    if (file) {
      const fileContent = await readFile(file); // lecture du fichier CSV
      const fileName = file.name;
      //si fileName contient ".csv" alors
      if (fileName.includes(".csv")) {
        const jsonData = await csv().fromString(fileContent); // convertion du fichier CSV en objet JSON
        const xmlData = convertToXML(jsonData); // convertion du fichier JSON en XML
        const response = await axios.post("http://localhost:3001/importXML", {
          xml: xmlData,
        });
        console.log(response.data);
        alert("SUCCESS !");
      }
      //sinon si il ne contient pa ".xml" alors
      else if (fileName.includes(".xml")) {
        const xmlData = fileContent;
        const response = await axios.post("http://localhost:3001/importXML", {
          xml: xmlData,
        });
        console.log(response.data);
        alert("SUCCESS !");
      } else {
        alert("ERROR !");
      }
    }
  };

  const readFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event.target.result);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsText(file);
    });
  };

  const convertToXML = (jsonData) => {
    const root = xmlBuilder.create("Documents");

    jsonData.forEach((item) => {
      const doc = root.ele("Document");

      Object.keys(item).forEach((key) => {
        const cleanKey = cleanXMLTagName(key);
        doc.ele(cleanKey, item[key]);
      });
    });

    return root.end({ pretty: true });
  };

  /*   const sendToText = () => {
    if (file) {
      console.log("file", file);
    } else {
      alert("Veuillez sélectionner un fichier CSV.");
    }
  }; */

  return (
    <div className="container">
      <div>
        <input type="file" onChange={handleFileChange} accept=".csv" />
        <button onClick={handleSubmit}>Valider</button>
      </div>
      <div>
        <span>PDF d'origine</span>
        <input type="file" onChange={handlePdfFileChange} accept=".pdf"></input>
      </div>
    </div>
  );
}

export default FileUploadForm;

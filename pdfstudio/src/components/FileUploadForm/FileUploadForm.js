import React, { useState, useEffect } from "react";
import csv from "csvtojson";
import xmlBuilder from "xmlbuilder";
import axios from "axios";
import "./FileUploadForm.css";

function FileUploadForm(props) {
  const [file, setFile] = useState(() => {
    const storedFile = localStorage.getItem("uploadedFile");
    return storedFile ? JSON.parse(storedFile) : null;
  });

  const [pdfFile, setPdfFile] = useState(() => {
    const storedFile = localStorage.getItem("uploadedPdfFile");
    return storedFile ? JSON.parse(storedFile) : null;
  });

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    if (props.onCSVFileSelect) {
      props.onCSVFileSelect(selectedFile);
    }
    localStorage.setItem("uploadedFile", JSON.stringify(selectedFile));
    handleSubmit();
  };

  const handlePdfFileChange = (event) => {
    const selectedPdfFile = event.target.files[0];
    if (props.onPdfFileSelect) {
      props.onPdfFileSelect(selectedPdfFile);
    }
    localStorage.setItem("uploadedPdfFile", JSON.stringify(selectedPdfFile));
    setPdfFile(selectedPdfFile);
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
      }
      //sinon si il ne contient pas ".xml" alors
      else if (fileName.includes(".xml")) {
        const xmlData = fileContent;
        const response = await axios.post("http://localhost:3001/importXML", {
          xml: xmlData,
        });
        console.log(response.data);
      } else {
        alert("ERROR !");
        setFile(null);
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

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem("uploadedFile");
      localStorage.removeItem("uploadedPdfFile");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <div className="container">
      <span>Ficher données</span>
      <div className="datafile">
        <input type="file" onChange={handleFileChange} accept=".csv, .xml" />
        {file && (
          <div className="valid-icon">
            <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
              <path d="m504 256c0 136.967-111.033 248-248 248s-248-111.033-248-248 111.033-248 248-248 248 111.033 248 248zm-276.686 131.314 184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0l-150.059 150.058-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z" />
            </svg>
          </div>
        )}
        {!file && (
          <div className="invalid-icon">
            <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
              <path d="m256 8c-137 0-248 111-248 248s111 248 248 248 248-111 248-248-111-248-248-248zm121.6 313.1c4.7 4.7 4.7 12.3 0 17l-39.6 39.5c-4.7 4.7-12.3 4.7-17 0l-65-65.6-65.1 65.6c-4.7 4.7-12.3 4.7-17 0l-39.5-39.6c-4.7-4.7-4.7-12.3 0-17l65.6-65-65.6-65.1c-4.7-4.7-4.7-12.3 0-17l39.6-39.6c4.7-4.7 12.3-4.7 17 0l65 65.7 65.1-65.6c4.7-4.7 12.3-4.7 17 0l39.6 39.6c4.7 4.7 4.7 12.3 0 17l-65.7 65z" />
            </svg>
          </div>
        )}
      </div>

      <span>PDF d'origine</span>
      <div className="pdffile">
        <input type="file" onChange={handlePdfFileChange} accept=".pdf"></input>
        {pdfFile && (
          <div className="valid-icon">
            <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
              <path d="m504 256c0 136.967-111.033 248-248 248s-248-111.033-248-248 111.033-248 248-248 248 111.033 248 248zm-276.686 131.314 184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0l-150.059 150.058-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z" />
            </svg>
          </div>
        )}
        {!pdfFile && (
          <div className="invalid-icon">
            <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
              <path d="m256 8c-137 0-248 111-248 248s111 248 248 248 248-111 248-248-111-248-248-248zm121.6 313.1c4.7 4.7 4.7 12.3 0 17l-39.6 39.5c-4.7 4.7-12.3 4.7-17 0l-65-65.6-65.1 65.6c-4.7 4.7-12.3 4.7-17 0l-39.5-39.6c-4.7-4.7-4.7-12.3 0-17l65.6-65-65.6-65.1c-4.7-4.7-4.7-12.3 0-17l39.6-39.6c4.7-4.7 12.3-4.7 17 0l65 65.7 65.1-65.6c4.7-4.7 12.3-4.7 17 0l39.6 39.6c4.7 4.7 4.7 12.3 0 17l-65.7 65z" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}

export default FileUploadForm;

import React, { useState } from "react";
import csv from "csvtojson";
import xmlBuilder from "xmlbuilder";
import axios from "axios";
import "./FileUploadForm.css";

function FileUploadForm(props) {
  const [dataName, setDataName] = useState(() => {
    const storedDataName = localStorage.getItem("dataName");
    return JSON.parse(storedDataName) || null;
  });
  const [pdfName, setPdfName] = useState(() => {
    const storedName = localStorage.getItem("pdfName");
    return JSON.parse(storedName) || null;
  });

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) {
      return;
    }
    setDataName(selectedFile.name);
    localStorage.setItem("dataName", JSON.stringify(selectedFile.name));

    if (props.onCSVFileSelect) {
      props.onCSVFileSelect(selectedFile);
    }

    localStorage.setItem("uploadedFile", JSON.stringify(selectedFile));

    if (selectedFile) {
      const fileContent = await readFile(selectedFile);

      if (selectedFile.name.includes(".csv")) {
        const jsonData = await csv().fromString(fileContent);
        const xmlData = convertToXML(jsonData);
        const response = await axios.post("http://localhost:3001/importXML", {
          xml: xmlData,
        });
        console.log(response.data);
      } else if (selectedFile.name.includes(".xml")) {
        const xmlData = fileContent;
        const response = await axios.post("http://localhost:3001/importXML", {
          xml: xmlData,
        });
        console.log(response.data);
      } else {
        alert("ERROR !");
      }
    }
  };

  const handlePdfFileChange = async (event) => {
    const selectedPdfFile = event.target.files[0];
    if (!selectedPdfFile) {
      return;
    }
    setPdfName(selectedPdfFile.name);
    localStorage.setItem("pdfName", JSON.stringify(selectedPdfFile.name));
    if (props.onPDFFileSelect) {
      props.onPDFFileSelect(selectedPdfFile);
    }
    localStorage.setItem("uploadedPdfFile", JSON.stringify(selectedPdfFile));
    const pdfFileName = selectedPdfFile.name;
    console.log("PDF file name:", pdfFileName);

    try {
      const formData = new FormData();
      formData.append("pdfFile", selectedPdfFile);
      const response = await axios.post(
        "http://localhost:3001/uploadPdf",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);

      if (props.onPdfFileNameChange) {
        props.onPdfFileNameChange(pdfFileName);
      }
    } catch (error) {
      console.error("Error uploading PDF file:", error);
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
    const root = xmlBuilder.create("Documents", { encoding: "UTF-8" });

    jsonData.forEach((item) => {
      const doc = root.ele("Document");

      Object.keys(item).forEach((key) => {
        const cleanKey = cleanXMLTagName(key);
        doc.ele(cleanKey, item[key]);
      });
    });

    console.log(root.end({ pretty: true }));

    return root.end({ pretty: true });
  };

  return (
    <div className="container">
      <div className="file-item">
        <span className="file-item-title">Ficher données</span>
        {dataName && <span className="file-item-name">({dataName})</span>}
        <div className="datafile">
          <input
            type="file"
            className="input-data"
            onChange={handleFileChange}
            accept=".csv, .xml"
          />
          {dataName && (
            <div className="valid-icon">
              <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                <path d="m504 256c0 136.967-111.033 248-248 248s-248-111.033-248-248 111.033-248 248-248 248 111.033 248 248zm-276.686 131.314 184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0l-150.059 150.058-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z" />
              </svg>
            </div>
          )}
          {!dataName && (
            <div className="invalid-icon">
              <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                <path d="m256 8c-137 0-248 111-248 248s111 248 248 248 248-111 248-248-111-248-248-248zm121.6 313.1c4.7 4.7 4.7 12.3 0 17l-39.6 39.5c-4.7 4.7-12.3 4.7-17 0l-65-65.6-65.1 65.6c-4.7 4.7-12.3 4.7-17 0l-39.5-39.6c-4.7-4.7-4.7-12.3 0-17l65.6-65-65.6-65.1c-4.7-4.7-4.7-12.3 0-17l39.6-39.6c4.7-4.7 12.3-4.7 17 0l65 65.7 65.1-65.6c4.7-4.7 12.3-4.7 17 0l39.6 39.6c4.7 4.7 4.7 12.3 0 17l-65.7 65z" />
              </svg>
            </div>
          )}
        </div>
      </div>

      <div className="file-item">
        <span className="file-item-title">PDF d'origine</span>
        {pdfName && <span className="file-item-name">({pdfName})</span>}
        <div className="pdffile">
          <input
            className="input-pdf"
            type="file"
            onChange={handlePdfFileChange}
            accept=".pdf"
          ></input>
          {pdfName && (
            <div className="valid-icon">
              <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                <path d="m504 256c0 136.967-111.033 248-248 248s-248-111.033-248-248 111.033-248 248-248 248 111.033 248 248zm-276.686 131.314 184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0l-150.059 150.058-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z" />
              </svg>
            </div>
          )}
          {!pdfName && (
            <div className="invalid-icon">
              <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                <path d="m256 8c-137 0-248 111-248 248s111 248 248 248 248-111 248-248-111-248-248-248zm121.6 313.1c4.7 4.7 4.7 12.3 0 17l-39.6 39.5c-4.7 4.7-12.3 4.7-17 0l-65-65.6-65.1 65.6c-4.7 4.7-12.3 4.7-17 0l-39.5-39.6c-4.7-4.7-4.7-12.3 0-17l65.6-65-65.6-65.1c-4.7-4.7-4.7-12.3 0-17l39.6-39.6c4.7-4.7 12.3-4.7 17 0l65 65.7 65.1-65.6c4.7-4.7 12.3-4.7 17 0l39.6 39.6c4.7 4.7 4.7 12.3 0 17l-65.7 65z" />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FileUploadForm;

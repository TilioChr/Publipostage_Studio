import React, { useState, useEffect, useRef } from "react";
import "./BarcodeItem.css";
import JsBarcode from "jsbarcode";
import QRCode from "qrcode.react";

const BarcodeItem = ({ onBarcodeChange }) => {
  const [barcodeValeur, setbarcodeValeur] = useState(""); // État pour stocker la source du barcode
  const [barcodeSizeX, setbarcodeSizeX] = useState(0); // État pour stocker la taille du barcode
  const [barcodeSizeY, setbarcodeSizeY] = useState(0); // État pour stocker la taille du barcode
  const [barcodeX, setBarcodeX] = useState(0); // État pour stocker la position X du barcode
  const [barcodeY, setBarcodeY] = useState(0); // État pour stocker la position Y du barcode
  const [barcodeType, setBarcodeType] = useState("CODE128"); // Type de code-barres par défaut
  const [errorMessage, setErrorMessage] = useState(""); // État pour stocker les messages d'erreur
  const svgRef = useRef(null); // Référence à l'élément SVG

  useEffect(() => {
    setErrorMessage(""); // Effacer les erreurs
    if (!errorMessage) {
      // Si aucune erreur, générer le code-barres
      generateBarcode(barcodeValeur, barcodeType);
    } else {
      if (barcodeType !== "QR Code") {
        // Sinon, si ce n'est pas un QRCODE qui est générer, effacer le code-barres
        JsBarcode(svgRef.current).init();
      }
    }
  }, [barcodeValeur, barcodeType, errorMessage]);

  const generateBarcode = (value, type) => {
    if (value) {
      try {
        JsBarcode(svgRef.current, value, {
          format: type,
        });
      } catch (error) {
        setErrorMessage("Erreur de génération du code-barres");
      }
    }
  };

  const handleBarcodeChange = (event) => {
    const barcode = event.target.value;
    setbarcodeValeur(barcode);
    onBarcodeChange({
      barcodeSizeX,
      barcodeSizeY,
      barcodeValeur: barcode,
      barcodeX,
      barcodeY,
      barcodeType,
    });
  };

  const handleTypeChange = (event) => {
    const type = event.target.value;
    setBarcodeType(type);
    onBarcodeChange({
      barcodeSizeX,
      barcodeSizeY,
      barcodeValeur,
      barcodeX,
      barcodeY,
      barcodeType: type,
    });
  };

  const handlebarcodeSizeXChange = (event) => {
    const sizeX = parseInt(event.target.value);
    setbarcodeSizeX(sizeX);
    onBarcodeChange({
      barcodeSizeX: sizeX,
      barcodeSizeY,
      barcodeValeur,
      barcodeX,
      barcodeY,
      barcodeType,
    });
  };

  const handlebarcodeSizeYChange = (event) => {
    const sizeY = parseInt(event.target.value);
    setbarcodeSizeY(sizeY);
    onBarcodeChange({
      barcodeSizeX,
      barcodeSizeY: sizeY,
      barcodeValeur,
      barcodeX,
      barcodeY,
      barcodeType,
    });
  };

  const handleBarcodeXChange = (event) => {
    const positionX = parseInt(event.target.value);
    setBarcodeX(positionX);
    onBarcodeChange({
      barcodeX: positionX,
      barcodeValeur,
      barcodeSizeX,
      barcodeSizeY,
      barcodeY,
      barcodeType,
    });
  };

  const handleBarcodeYChange = (event) => {
    const positionY = parseInt(event.target.value);
    setBarcodeY(positionY);
    onBarcodeChange({
      barcodeY: positionY,
      barcodeValeur,
      barcodeSizeX,
      barcodeSizeY,
      barcodeX,
      barcodeType,
    });
  };

  return (
    <div className="barcode">
      <div className="barcode-option">
        <div className="barcode-option-item">
          <span>Taille (L, H)</span>
          <div className="barcode-option-item-size">
            <input
              name="barcodeSizeX"
              type="number"
              value={barcodeSizeX}
              onChange={handlebarcodeSizeXChange}
            />
            <input
              name="barcodeSizeY"
              type="number"
              value={barcodeSizeY}
              onChange={handlebarcodeSizeYChange}
            />
          </div>
        </div>
        <div className="barcode-option-item-type">
          <span>Type</span>
          <select onChange={handleTypeChange} value={barcodeType}>
            <option>CODABAR</option>
            <option>CODE128</option>
            <option>CODE39</option>
            <option>EAN5</option>
            <option>EAN8</option>
            <option>UPC</option>
            <option>ITF</option>
            <option>MSI10</option>
            <option>PHARMACODE</option>
            <option>QR Code</option>
          </select>
        </div>
        <div className="barcode-option-item">
          <span>Position</span>
          <div className="barcode-option-item-position">
            <input
              name="barcodeX"
              type="number"
              value={barcodeX}
              onChange={handleBarcodeXChange}
            />
            <input
              name="barcodeY"
              type="number"
              value={barcodeY}
              onChange={handleBarcodeYChange}
            />
          </div>
        </div>
        <div className="barcode-option-item-valeur">
          <span>Valeur </span>
          <input
            name="barcodeValeur"
            type="text"
            onChange={handleBarcodeChange}
          />
        </div>
      </div>

      <div className="barcode-preview">
        {barcodeType === "QR Code" && barcodeValeur.length <= 800 ? (
          <QRCode value={barcodeValeur} level="H" />
        ) : barcodeValeur ? (
          <svg ref={svgRef}></svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="nobarcode"
            viewBox="0 0 24 30"
            fill="none"
            x="0px"
            y="0px"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M23.4988 4.5601C23.8081 4.28463 23.8356 3.81055 23.5601 3.50122C23.2846 3.19188 22.8105 3.16444 22.5012 3.43991L3.50121 20.3603C3.19188 20.6358 3.16443 21.1099 3.43991 21.4192C3.71538 21.7285 4.18946 21.756 4.49879 21.4805L5.92705 20.2086C6.64032 20.25 7.47612 20.25 8.44509 20.25H15.5549C16.9225 20.25 18.0248 20.25 18.8918 20.1335C19.7919 20.0125 20.5497 19.7536 21.1517 19.1517C21.7536 18.5497 22.0125 17.7919 22.1335 16.8918C22.25 16.0248 22.25 14.9225 22.25 13.5549V10.4451C22.25 9.07755 22.25 7.97523 22.1335 7.10826C22.0803 6.71257 22.0004 6.34437 21.8765 6.00482L23.4988 4.5601ZM20.6193 7.12446L18.5 9.01177V16.5313C18.5 16.6769 18.5 16.7497 18.4762 16.8071C18.4445 16.8837 18.3837 16.9445 18.3071 16.9763C18.2497 17 18.1769 17 18.0312 17C17.8856 17 17.8128 17 17.7554 16.9763C17.6788 16.9445 17.618 16.8837 17.5863 16.8071C17.5625 16.7497 17.5625 16.6769 17.5625 16.5313V9.84665L16.125 11.1268V16.6875C16.125 16.8043 16.125 16.8628 16.0999 16.9063C16.0834 16.9348 16.0598 16.9584 16.0313 16.9749C15.9877 17 15.9293 17 15.8125 17C15.6957 17 15.6373 17 15.5938 16.9749C15.5653 16.9584 15.5416 16.9348 15.5251 16.9063C15.5 16.8628 15.5 16.8043 15.5 16.6875V11.6834L14 13.0192V16.375C14 16.6696 14 16.817 13.9085 16.9085C13.8169 17 13.6696 17 13.375 17H13.0625C12.7679 17 12.6206 17 12.529 16.9085C12.4375 16.817 12.4375 16.6696 12.4375 16.375V14.4107L11 15.6909V16.6875C11 16.8043 11 16.8628 10.9749 16.9063C10.9584 16.9348 10.9348 16.9584 10.9063 16.9749C10.8627 17 10.8043 17 10.6875 17C10.5707 17 10.5123 17 10.4688 16.9749C10.4403 16.9584 10.4166 16.9348 10.4001 16.9063C10.375 16.8628 10.375 16.8043 10.375 16.6875V16.2475L7.56657 18.7485C7.8558 18.7499 8.16615 18.75 8.5 18.75H15.5C16.9354 18.75 17.9365 18.7484 18.6919 18.6469C19.4257 18.5482 19.8142 18.3678 20.091 18.091C20.3678 17.8142 20.5482 17.4257 20.6469 16.6919C20.7484 15.9365 20.75 14.9354 20.75 13.5V10.5C20.75 9.06459 20.7484 8.06348 20.6469 7.30813C20.6383 7.24435 20.6291 7.18318 20.6193 7.12446Z"
              fill="black"
            />
            <path
              d="M18.8918 3.86653C19.2254 3.91139 19.5395 3.9752 19.8334 4.0684L18.4253 5.32234C17.7041 5.25126 16.7728 5.25001 15.5 5.25001H8.5C7.06459 5.25001 6.06347 5.2516 5.30812 5.35316C4.57435 5.45181 4.18578 5.63226 3.90901 5.90902C3.63225 6.18578 3.4518 6.57435 3.35315 7.30813C3.2516 8.06348 3.25 9.06459 3.25 10.5V13.5C3.25 14.9354 3.2516 15.9365 3.35315 16.6919C3.4518 17.4257 3.63225 17.8142 3.90901 18.091C3.93696 18.1189 3.96604 18.1459 3.99651 18.1719L2.87108 19.1742L2.84835 19.1517C2.24644 18.5497 1.98754 17.7919 1.86653 16.8918C1.74997 16.0248 1.74998 14.9225 1.75 13.5549V10.4451C1.74998 9.07757 1.74997 7.97522 1.86653 7.10826C1.98754 6.20815 2.24644 5.45028 2.84835 4.84836C3.45027 4.24644 4.20814 3.98755 5.10825 3.86653C5.97521 3.74997 7.07752 3.74999 8.4451 3.75001H15.5549C16.9225 3.74999 18.0248 3.74997 18.8918 3.86653Z"
              fill="black"
            />
            <path
              d="M12.4375 10.6548L14 9.26331V7.62501C14 7.33038 14 7.18307 13.9085 7.09154C13.8169 7.00001 13.6696 7.00001 13.375 7.00001H13.0625C12.7679 7.00001 12.6206 7.00001 12.529 7.09154C12.4375 7.18307 12.4375 7.33038 12.4375 7.62501V10.6548Z"
              fill="black"
            />
            <path
              d="M15.5 7.92749L16.125 7.3709V7.31251C16.125 7.19568 16.125 7.13727 16.0999 7.09376C16.0834 7.06526 16.0598 7.04159 16.0313 7.02513C15.9877 7.00001 15.9293 7.00001 15.8125 7.00001C15.6957 7.00001 15.6373 7.00001 15.5938 7.02513C15.5653 7.04159 15.5416 7.06526 15.5251 7.09376C15.5 7.13727 15.5 7.19568 15.5 7.31251V7.92749Z"
              fill="black"
            />
            <path
              d="M10.375 12.4915L11 11.935V7.31251C11 7.19568 11 7.13727 10.9749 7.09376C10.9584 7.06526 10.9348 7.04159 10.9063 7.02513C10.8627 7.00001 10.8043 7.00001 10.6875 7.00001C10.5707 7.00001 10.5123 7.00001 10.4688 7.02513C10.4403 7.04159 10.4166 7.06526 10.4001 7.09376C10.375 7.13727 10.375 7.19568 10.375 7.31251V12.4915Z"
              fill="black"
            />
            <path
              d="M9 7.46876V13.7161L8.0625 14.5509V7.46876C8.0625 7.32315 8.0625 7.25035 8.08629 7.19292C8.11801 7.11635 8.17884 7.05551 8.25541 7.0238C8.31284 7.00001 8.38564 7.00001 8.53125 7.00001C8.67686 7.00001 8.74966 7.00001 8.80709 7.0238C8.88366 7.05551 8.9445 7.11635 8.97621 7.19292C9 7.25035 9 7.32315 9 7.46876Z"
              fill="black"
            />
            <path
              d="M6.98886 7.65793V15.6971L5.58114 16.7607C5.56249 16.6707 5.56249 16.5484 5.56249 16.375V7.62501C5.56249 7.33038 5.56249 7.18307 5.65402 7.09154C5.74555 7.00001 5.89287 7.00001 6.1875 7.00001C6.65848 7.03293 6.8058 7.03293 6.89733 7.12446C6.98886 7.21599 6.98886 7.3633 6.98886 7.65793Z"
              fill="black"
            />
            <text
              x="0"
              y="39"
              fill="#000000"
              font-size="5px"
              font-weight="bold"
              font-family="'Helvetica Neue', Helvetica, Arial-Unicode, Arial, Sans-serif"
            ></text>
            <text
              x="0"
              y="44"
              fill="#000000"
              font-size="5px"
              font-weight="bold"
              font-family="'Helvetica Neue', Helvetica, Arial-Unicode, Arial, Sans-serif"
            ></text>
          </svg>
        )}
      </div>
    </div>
  );
};

export default BarcodeItem;

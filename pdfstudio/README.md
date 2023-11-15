# Publipostage Studio

Publipostage Studio is a web application that allows users to generate personalized PDF documents using templates and data from CSV files. The application is built using React.

## Features

- **File Upload:** Users can upload both PDF and CSV files. The PDF file serves as a base, and the CSV file provides data for placeholders in the template.

- **Item Management:**

  - _Images:_ Users can add image items with customizable positions and sizes.
  - _Text:_ Text items can be added with adjustable positions, sizes, and dynamic content from the CSV file.
  - _Barcodes and QR Codes:_ Barcode items are supported, including QR codes, with customizable types and values.
  - _Addresses:_ Users can include address items with gender, name, address lines, and more.

- **PDF Generation:** The application dynamically generates a PDF document based on the provided template, replacing placeholders with data from the CSV file.

## Usage

1. **File Upload:**

   - Click on the "FICHER" button to upload PDF and CSV files.
   - The PDF file serves as the template, and the CSV file provides data for placeholders.

2. **Item Management:**

   - Use the modals for managing different types of items: Image, Barcode, Address, Text, etc.
   - Add, update, or delete items based on your requirements.

3. **PDF Generation:**

   - Click the "GÉNÉRER" button to generate the PDF.
   - The application will replace placeholders in the template with data from the CSV file and create a personalized PDF document.

4. **Workspace Display:**
   - The generated PDF will be displayed in the workspace area.

## Getting Started

1. **Clone the Repository:**

   ```
   git clone https://github.com/your-username/publipostage-studio.git
   cd publipostage-studio
   ```

2. **Install Dependencies:**

   ```
   npm install
   ```

3. **Run the Application:**
   ```
   npm start
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Dependencies

- React: [https://reactjs.org/](https://reactjs.org/)
- jsPDF: [https://github.com/eKoopmans/pdfmake](https://github.com/eKoopmans/pdfmake)
- jsBarcode: [https://lindell.me/JsBarcode/](https://lindell.me/JsBarcode/)
- QRCode: [https://github.com/soldair/node-qrcode](https://github.com/soldair/node-qrcode)
- PapaParse: [https://www.papaparse.com/](https://www.papaparse.com/)

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

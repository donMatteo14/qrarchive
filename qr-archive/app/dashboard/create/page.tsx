'use client'; // 👈 Fondamentale in Next.js: dice che questa pagina è interattiva

import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react'; // Importiamo il "motore" del QR

export default function CreateQRPage() {
  // Simuliamo un ID unico generato dal database (es. quando l'utente carica un file)
  const [fileId, setFileId] = useState('abcd-1234'); 
  
  // Questo è l'indirizzo dinamico che il QR conterrà
  const qrLink = `https://iltuosito.com/view/${fileId}`;

  // Funzione extra: permette all'utente di scaricare il QR come immagine
  const scaricaQR = () => {
    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;
    
    // Converte l'SVG in un'immagine scaricabile
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = "Il_Mio_QRCode.png";
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-2 text-gray-800">Crea il tuo QR Code</h1>
        <p className="text-gray-500 mb-6 text-sm">Il QR è già pronto! Collegato al file ID: {fileId}</p>

        {/* --- IL QUADRATINO DEL QR CODE --- */}
        <div className="flex justify-center p-4 bg-gray-100 rounded-xl mb-6">
          <QRCodeSVG 
            id="qr-code-svg" // Serve per la funzione di download
            value={qrLink}   // 👈 L'indirizzo che si aprirà scansionando!
            size={200}       // Dimensione in pixel
            bgColor={"#ffffff"} // Colore di sfondo (bianco)
            fgColor={"#000000"} // Colore dei quadratini (nero)
            level={"H"}      // Livello di correzione errori (H è il più alto, utile se il QR si rovina)
            marginSize={2}   // Bordo bianco attorno al QR
          />
        </div>

        {/* Pulsante per scaricare il QR code sul computer dell'utente */}
        <button 
          onClick={scaricaQR}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
        >
          Scarica QR Code (PNG)
        </button>
        
      </div>
    </div>
  );
}
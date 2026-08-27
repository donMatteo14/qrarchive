'use client';

import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { supabase } from '@/lib/supabase'; // 👈 Importiamo il "ponte" verso il database!

export default function CreateQRPage() {
  // Stati per gestire l'interfaccia
  const [fileId, setFileId] = useState<string | null>(null); 
  const [isUploading, setIsUploading] = useState(false);

    // window.location.origin capisce in automatico se sei su localhost o sul sito vero
    const qrLink = fileId ? `${window.location.origin}/view/${fileId}` : '';

  // 🚀 QUESTA È LA FUNZIONE CHE FA LA MAGIA
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true); // Mostriamo all'utente che stiamo caricando...

    try {
      // NUOVO: 1. Scopriamo chi è l'utente attualmente loggato
      const { data: authData } = await supabase.auth.getUser();
      const user = authData.user;

      // Se per qualche motivo l'utente non è loggato, blocchiamo tutto
      if (!user) {
        alert("Devi fare il login per caricare un file!");
        setIsUploading(false);
        return;
      }

      // 2. Diamo un nome unico al file
      const uniqueName = `${Date.now()}-${file.name}`;
      
      // 3. Carichiamo il file fisicamente nel Bucket
      const { error: uploadError } = await supabase.storage
        .from('qr-files')
        .upload(uniqueName, file);

      if (uploadError) throw uploadError;

      // 4. Chiediamo a Supabase il link pubblico del file
      const { data: publicUrlData } = supabase.storage
        .from('qr-files')
        .getPublicUrl(uniqueName);
      
      const fileUrl = publicUrlData.publicUrl;

      // NUOVO: 5. Salviamo i dati associandoli all'ID dell'utente!
      const { data: dbData, error: dbError } = await supabase
        .from('qr_codes')
        .insert([{ 
          file_name: file.name, 
          file_url: fileUrl,
          user_id: user.id // 👈 Firmiamo il salvataggio!
        }])
        .select('id') 
        .single();

      if (dbError) throw dbError;

      // Successo! 
      setFileId(dbData.id);

    } catch (error) {
      console.error('Errore durante il caricamento:', error);
      alert('Ops! C\'è stato un errore durante il caricamento.');
    } finally {
      setIsUploading(false); // Finito il caricamento (con successo o errore)
    }
  };

  // Funzione per scaricare il QR (identica a prima)
  const scaricaQR = () => {
    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;
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
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Generatore QR Dinamico</h1>
        
        {/* Se NON c'è ancora un ID, mostriamo il bottone di caricamento */}
        {!fileId ? (
          <div className="mb-6">
            <p className="text-gray-500 mb-4 text-sm">Carica un file (PDF o Immagine) per generare il tuo QR Code.</p>
            <label className={`cursor-pointer inline-block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors ${isUploading ? 'opacity-50' : ''}`}>
              {isUploading ? 'Caricamento in corso...' : 'Scegli un file'}
              <input 
                type="file" 
                className="hidden" 
                onChange={handleFileUpload} 
                disabled={isUploading}
              />
            </label>
          </div>
        ) : (
          /* Se c'è l'ID, mostriamo il QR Code! */
          <div>
            <p className="text-green-600 font-medium mb-2">File caricato con successo!</p>
            <p className="text-gray-400 text-xs mb-6 truncate">ID: {fileId}</p>

            <div className="flex justify-center p-4 bg-gray-100 rounded-xl mb-6">
              <QRCodeSVG 
                id="qr-code-svg"
                value={qrLink} 
                size={200}
                bgColor={"#ffffff"}
                fgColor={"#000000"}
                level={"H"}
                marginSize={2}
              />
            </div>

            <button 
              onClick={scaricaQR}
              className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-3 px-4 rounded-lg transition-colors mb-3"
            >
              Scarica QR Code (PNG)
            </button>
            
            <button 
              onClick={() => setFileId(null)}
              className="w-full text-gray-500 hover:text-gray-800 font-medium py-2 text-sm"
            >
              Crea un altro QR
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
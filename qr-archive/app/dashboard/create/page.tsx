'use client';

import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { supabase } from '@/lib/supabase';

export default function CreateQRPage() {
  const [fileId, setFileId] = useState<string | null>(null); 
  const [isUploading, setIsUploading] = useState(false);
  
  // Nuovo stato per capire se vogliamo caricare un File o un Link
  const [mode, setMode] = useState<'file' | 'link'>('file');
  
  // Stati per il salvataggio del link
  const [linkName, setLinkName] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  const qrLink = fileId ? `${window.location.origin}/view/${fileId}` : '';

  // 1. Caricamento File (Invariato)
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploading(true);

    try {
      const { data: authData } = await supabase.auth.getUser();
      const user = authData.user;
      if (!user) {
        alert("Devi fare il login!");
        setIsUploading(false);
        return;
      }

      const uniqueName = `${Date.now()}-${file.name}`;
      
      const { error: uploadError } = await supabase.storage
        .from('qr-files')
        .upload(uniqueName, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('qr-files')
        .getPublicUrl(uniqueName);
      
      const { data: dbData, error: dbError } = await supabase
        .from('qr_codes')
        .insert([{ 
          file_name: file.name, 
          file_url: publicUrlData.publicUrl,
          user_id: user.id 
        }])
        .select('id') 
        .single();

      if (dbError) throw dbError;
      setFileId(dbData.id);
    } catch (error) {
      console.error(error);
      alert('Errore durante il caricamento del file.');
    } finally {
      setIsUploading(false);
    }
  };

  // 2. Salvataggio Link Diretto (Nuova funzione)
  const handleLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkName || !linkUrl) return;
    setIsUploading(true);

    try {
      const { data: authData } = await supabase.auth.getUser();
      const user = authData.user;
      if (!user) return;

      // Correzione automatica se l'utente dimentica "https://"
      let finalUrl = linkUrl;
      if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
        finalUrl = 'https://' + finalUrl;
      }

      // Saltiamo lo Storage e scriviamo direttamente nel Database
      const { data: dbData, error: dbError } = await supabase
        .from('qr_codes')
        .insert([{ 
          file_name: linkName, 
          file_url: finalUrl,
          user_id: user.id 
        }])
        .select('id') 
        .single();

      if (dbError) throw dbError;
      setFileId(dbData.id);
    } catch (error) {
      alert('Errore durante il salvataggio del link.');
    } finally {
      setIsUploading(false);
    }
  };

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
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Nuovo QR Code</h1>
        
        {!fileId ? (
          <>
            {/* Selettore Modalità */}
            <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
              <button 
                onClick={() => setMode('file')}
                className={`flex-1 py-2 rounded-md font-medium text-sm transition-colors ${mode === 'file' ? 'bg-white shadow text-black' : 'text-gray-500'}`}
              >
                Carica File
              </button>
              <button 
                onClick={() => setMode('link')}
                className={`flex-1 py-2 rounded-md font-medium text-sm transition-colors ${mode === 'link' ? 'bg-white shadow text-black' : 'text-gray-500'}`}
              >
                Collega Link
              </button>
            </div>

            {/* Interfaccia File */}
            {mode === 'file' && (
              <div className="mb-2">
                <p className="text-gray-500 mb-4 text-sm">Carica un PDF o un'Immagine.</p>
                <label className={`cursor-pointer inline-block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors ${isUploading ? 'opacity-50' : ''}`}>
                  {isUploading ? 'Caricamento in corso...' : 'Scegli un file'}
                  <input type="file" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
                </label>
              </div>
            )}

            {/* Interfaccia Link */}
            {mode === 'link' && (
              <form onSubmit={handleLinkSubmit} className="flex flex-col gap-4 text-left">
                <div>
                  <label className="text-sm font-semibold text-gray-700">Nome identificativo</label>
                  <input
                    type="text"
                    placeholder="es. Sito Web, Profilo IG..."
                    value={linkName}
                    onChange={(e) => setLinkName(e.target.value)}
                    className="w-full mt-1 p-3 border border-gray-300 rounded-lg text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">Indirizzo web (URL)</label>
                  <input
                    type="url"
                    placeholder="es. www.google.com"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    className="w-full mt-1 p-3 border border-gray-300 rounded-lg text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <button 
                  type="submit"
                  disabled={isUploading}
                  className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                  {isUploading ? 'Generazione...' : 'Genera QR Code'}
                </button>
              </form>
            )}
          </>
        ) : (
          <div>
            <p className="text-green-600 font-medium mb-2">Creato con successo!</p>
            <div className="flex justify-center p-4 bg-gray-100 rounded-xl mb-6 mt-4">
              <QRCodeSVG id="qr-code-svg" value={qrLink} size={200} bgColor={"#ffffff"} fgColor={"#000000"} level={"H"} marginSize={2} />
            </div>
            <button onClick={scaricaQR} className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-3 px-4 rounded-lg mb-3">
              Scarica PNG
            </button>
            <button onClick={() => setFileId(null)} className="w-full text-gray-500 hover:text-gray-800 font-medium py-2 text-sm">
              Creane un altro
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
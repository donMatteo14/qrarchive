'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import Link from 'next/link';

export default function DashboardPage() {
  const [qrCodes, setQrCodes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Nuovi stati per gestire l'eliminazione visiva (Modale)
  const [qrToDelete, setQrToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const router = useRouter();

  useEffect(() => {
    const fetchQRCodes = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data, error } = await supabase
        .from('qr_codes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) console.error('Errore nel recupero:', error);
      else setQrCodes(data || []);
      
      setIsLoading(false);
    };

    fetchQRCodes();
  }, [router]);

  const scaricaQR = (qrId: string, fileName: string) => {
    const svg = document.getElementById(`qr-code-svg-${qrId}`);
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
      downloadLink.download = `QR_${fileName}.png`;
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  };

  // Funzione che fa scattare l'eliminazione effettiva
  const confirmDelete = async () => {
    if (!qrToDelete) return;
    setIsDeleting(true);
    setErrorMsg('');

    const { error } = await supabase
      .from('qr_codes')
      .delete()
      .eq('id', qrToDelete);

    if (error) {
      setErrorMsg("Errore durante l'eliminazione. Riprova.");
      console.error(error);
    } else {
      // Rimuove istantaneamente il QR dalla griglia visiva
      setQrCodes(qrCodes.filter(qr => qr.id !== qrToDelete));
      // Chiude la modale
      setQrToDelete(null);
    }
    setIsDeleting(false);
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-gray-50">Caricamento...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8 relative">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">I Miei QR Code</h1>
          <Link href="/dashboard/create" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
            + Nuovo QR Code
          </Link>
        </div>

        {qrCodes.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl shadow text-center">
            <p className="text-gray-500 mb-4 text-lg">Non hai ancora creato nessun QR code.</p>
            <Link href="/dashboard/create" className="text-blue-600 font-semibold hover:underline text-lg">
              Creane uno adesso!
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {qrCodes.map((qr) => {
              const qrLink = `${window.location.origin}/view/${qr.id}`;
              
              return (
                <div key={qr.id} className="bg-white p-6 rounded-2xl shadow flex flex-col items-center text-center">
                  <div className="bg-gray-100 p-4 rounded-xl mb-4">
                    <QRCodeSVG id={`qr-code-svg-${qr.id}`} value={qrLink} size={140} bgColor={"#ffffff"} fgColor={"#000000"} level={"H"} marginSize={2} />
                  </div>
                  <h2 className="font-semibold text-gray-800 truncate w-full" title={qr.file_name}>{qr.file_name}</h2>
                  <p className="text-xs text-gray-400 mb-4 mt-1">
                    Creato il: {new Date(qr.created_at).toLocaleDateString('it-IT')}
                  </p>
                  
                  <div className="flex w-full gap-2">
                    <a href={qrLink} target="_blank" rel="noopener noreferrer" className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium py-2 rounded-lg flex items-center justify-center">
                      Apri
                    </a>
                    <button onClick={() => scaricaQR(qr.id, qr.file_name)} className="flex-1 bg-black hover:bg-gray-800 text-white text-xs font-medium py-2 rounded-lg">
                      Scarica
                    </button>
                    {/* Al click, salviamo l'ID e apriamo la modale, senza usare conferme native */}
                    <button onClick={() => setQrToDelete(qr.id)} className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-medium py-2 rounded-lg transition-colors">
                      Elimina
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODALE DI CONFERMA ELIMINAZIONE */}
      {qrToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl transform transition-all">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Eliminare questo QR?</h3>
            <p className="text-gray-500 text-sm mb-6">
              Questa azione non può essere annullata. Chi inquadrerà il QR fisico visualizzerà una pagina di errore.
            </p>

            {/* Messaggio di errore se qualcosa va storto */}
            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm font-medium rounded-lg border border-red-200">
                {errorMsg}
              </div>
            )}

            <div className="flex gap-3">
              <button 
                onClick={() => { setQrToDelete(null); setErrorMsg(''); }}
                disabled={isDeleting}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
              >
                Annulla
              </button>
              <button 
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
              >
                {isDeleting ? 'Eliminazione...' : 'Sì, elimina'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import Link from 'next/link'; // Serve per creare link veloci tra le pagine

export default function DashboardPage() {
  const [qrCodes, setQrCodes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchQRCodes = async () => {
      // 1. Controlliamo chi è l'utente
      const { data: { user } } = await supabase.auth.getUser();
      
      // Se non c'è nessuno loggato, lo rispediamo al login!
      if (!user) {
        router.push('/login');
        return;
      }

      // 2. Chiediamo al database: "Dammi tutti i QR code dove lo user_id è il mio"
      const { data, error } = await supabase
        .from('qr_codes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }); // Mettiamo i più recenti per primi

      if (error) {
        console.error('Errore nel recupero:', error);
      } else {
        setQrCodes(data || []); // Salviamo i dati per mostrarli
      }
      
      setIsLoading(false);
    };

    fetchQRCodes();
  }, [router]);

  // Schermata di caricamento mentre il database risponde
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">Caricamento...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Intestazione */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">I Miei QR Code</h1>
          {/* Questo pulsante porta alla pagina "create" che avevamo fatto all'inizio */}
          <Link 
            href="/dashboard/create" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            + Nuovo QR Code
          </Link>
        </div>

        {/* Se l'utente non ha ancora nessun QR... */}
        {qrCodes.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl shadow text-center">
            <p className="text-gray-500 mb-4 text-lg">Non hai ancora creato nessun QR code.</p>
            <Link href="/dashboard/create" className="text-blue-600 font-semibold hover:underline text-lg">
              Creane uno adesso!
            </Link>
          </div>
        ) : (
          /* Se invece ne ha, creiamo una bella griglia! */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {qrCodes.map((qr) => {
              // Generiamo il link al volo per disegnargli il QR in anteprima
              const qrLink = `${window.location.origin}/view/${qr.id}`;
              
              return (
                <div key={qr.id} className="bg-white p-6 rounded-2xl shadow flex flex-col items-center text-center">
                  
                  {/* Il quadratino del QR */}
                  <div className="bg-gray-100 p-4 rounded-xl mb-4">
                    <QRCodeSVG value={qrLink} size={140} />
                  </div>
                  
                  {/* Nome del file e data */}
                  <h2 className="font-semibold text-gray-800 truncate w-full" title={qr.file_name}>
                    {qr.file_name}
                  </h2>
                  <p className="text-xs text-gray-400 mb-4 mt-1">
                    Creato il: {new Date(qr.created_at).toLocaleDateString('it-IT')}
                  </p>
                  
                  {/* Bottone per testare il link */}
                  <a 
                    href={qrLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium py-2 rounded-lg transition-colors"
                  >
                    Apri Risorsa
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
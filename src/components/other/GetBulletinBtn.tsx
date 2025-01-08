import React, { useEffect, useState } from "react";
import { GetDocs } from "../../utils/docAdm";
import { downloadFile } from "../../utils/download";

export function BulletinBtn({ period }: { period: string }) {
  const [docs, setDocs] = useState<any[]>([]);
  const token = localStorage.getItem("token");


  useEffect(() => {
    if (!token) {
      console.error("Token non trouvé dans localStorage");
      return;
    }

    async function fetchDocs() {
      try {
        const result = await GetDocs(token); 
        setDocs(result);
      } catch (error) {
        console.error("Erreur lors de la récupération des documents:", error);
      }
    }

    fetchDocs();
  }, [token]);

  if (!Array.isArray(docs) || docs.length === 0) {
    return <div></div>;
  }

  let id: number | undefined;

  switch (period) {
    case "A001":
      try{
        id = docs[0].id;
      } catch (err) {
        return(<div></div>)
      }
      break;
    case "A002":
        try{
            id = docs[1].id;
        } catch (err) {
            return(<div></div>)
        }
      break;
    case "A003":
        try{
            id = docs[2].id;
        } catch (err) {
            return(<div></div>)         
        }
      break;
    default:
      console.warn("Période inconnue");
  }

  return (
    <button
      onClick={() => {
        if (id) {
          downloadFile(id, token, "pdf");
        } else {
          console.error("ID introuvable pour la période donnée");
        }
      }}
      className="flex items-center gap-1 bg-white/10 rounded-lg px-3 py-1 text-sm font-medium hover:bg-white/20 transition-colors"
    >
      <span>Voir le bulletin</span>
    </button>
  );
}

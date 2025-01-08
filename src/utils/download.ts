const API_URL = 'https://api.ecoledirecte.com/v3';

export async function downloadFile(id: number, token: string, type: string, libelle: string) {
  try {
    const url = `${API_URL}/telechargement.awp?verbe=get&queueEnabled=1&fichierId=${id}&leTypeDeFichier=${type}&v=4.69.0`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'x-token': token,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `data=${JSON.stringify({ forceDownload: 0 })}`,
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    // jsp ou j'ai vu ca..
    const blob = await response.blob();

    const fileURL = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = fileURL;
    link.download = `${libelle}_SPC.to.pdf` || `SPC.to_fichier_${id}.${type}`; 
    document.body.appendChild(link);
    link.click();

    // Nettoyage
    document.body.removeChild(link);
    URL.revokeObjectURL(fileURL);

    console.log(`Téléchargement réussi: ${link.download}`);
  } catch (error) {
    console.error('Erreur lors du téléchargement du fichier:', error);
  }
}

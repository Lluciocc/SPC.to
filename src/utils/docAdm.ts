const API_URL = 'https://api.ecoledirecte.com/v3';
const API_VERSION = '4.64.0';

export async function GetDocs(token:string){
    try{
        const response = await fetch(
            `${API_URL}/elevesDocuments.awp?archive=&verbe=get&v=${API_VERSION}`,
            {
              method: 'POST',
              headers: {
                'X-Token': token,
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: 'data={}',
            }
        );
        const data = await response.json();
        const notes = data.data?.notes;

        const sortedNotes = notes.sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return dateB - dateA;
        });

        return sortedNotes;
    } catch (err) {
        console.log("Erreur lors du fetch des docs: ", err)
    }

}
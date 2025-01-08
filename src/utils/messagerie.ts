/*Ceci ne contient absolument aucune documentation et a donc été codé, analysé et développé par mes soins.*/

import { decodeBase64 } from "./base64";

const API_URL = 'https://api.ecoledirecte.com/v3';

export async function GetMessagerie(token: string, id: number){
    try {
        const url = `${API_URL}/eleves/${id}/messages.awp?force=false&typeRecuperation=received&idClasseur=0&orderBy=date&order=desc&query=&onlyRead=&page=0&itemsPerPage=100&getAll=0&verbe=get&v=4.69.0` 
        const response = await fetch(url, {
        method: 'POST',
        headers: {
            'x-token': token,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `data=${JSON.stringify({ anneeMessages: "2024-2025" })}`,
        });

        const data = await response.json()
        const messages = data.data?.messages?.received

        return messages;
    } catch (err) {
        console.error('Erreur lors du fetch de la messagerie:', err);
    }
}

export async function GetMessageContent(token: string, id: number, messageID: number){
    try {
        const url = `${API_URL}/eleves/${id}/messages/${messageID}.awp?verbe=get&mode=destinataire&v=4.69.0`
        const response = await fetch(url, {
        method: 'POST',
        headers: {
            'x-token': token,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `data=${JSON.stringify({ anneeMessages: "2024-2025" })}`,
        });

        const data = await response.json()
        const content = data.data

        console.log(content)

        return content;
    } catch (err) {
        console.error('Erreur lors de la recuperation du contenu du message:', err);
    }
}
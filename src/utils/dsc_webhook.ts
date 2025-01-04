import axios from "axios";

const webhookUrl =  import.meta.env.VITE_WEBHOOK_URL;

const colors = {
    Question: 0x3498db,
    Probleme: 0xe74c3c,
    Suggestion: 0x3498db,
    Default: 0x95a5a6,
};

export const sendDiscordMessage = async (title: string, content: string, contact:string, type:string) => {
    if (!webhookUrl) {
        console.error("L'URL du webhook est introuvable !");
        alert("Erreur : L'URL du webhook n'est pas configurée.");
        return;
    }

    const colors = {
        Question: 0x3498db,
        Probleme: 0xe74c3c,
        Suggestion: 0x3498db,
        Default: 0x95a5a6,
    };

    const color = colors[type as keyof typeof colors] || colors.Default;
    const payload = {
        content: "Nouveau retour <@761245346176565301>", 
        username: "Retour SPC.to Bot",  
        embeds: [
        {
            title: title,
            color: color,
            fields: [
            {
                name: type,
                value: "",
                inline: true,
            },
            {
                name: "Probleme decrit",
                value: content,
                inline: false,
            },
            {
                name: "Contact",
                value: contact,
                inline: false,
            },
            ],
            timestamp: new Date().toISOString(),
        },
        ],
    };

    try {
        const response = await axios.post(webhookUrl, payload);
        alert("🎉Envoie du formulaire effectué !🎉");
        console.log("Message envoyé avec succès :", response.status);
    } catch (err:any) {
        console.error("Erreur lors de l'envoi du message :", err.message);
        alert("Erreur lors de l'envoie du formulaire");
    }
};

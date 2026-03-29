// 1. DEFINIM FUNCȚIILE MAI ÎNTÂI (pentru a fi disponibile peste tot)

async function fetchGuilds(token) {
    try {
        console.log("Se inițiază fetch către Discord...");
        const response = await fetch('https://discord.com/api/users/@me/guilds', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error("Eroare la Discord API: " + response.status);

        const guilds = await response.json();
        const list = document.getElementById('guilds-list');
        
        if (!list) return;
        list.innerHTML = ''; 

        guilds.forEach(guild => {
            // Verificăm permisiunea de Administrator (0x8)
            if ((guild.permissions & 0x8) === 0x8) {
                const icon = guild.icon 
                    ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
                    : 'https://cdn.discordapp.com/embed/avatars/0.png';
                
                const card = document.createElement('div');
                card.className = 'guild-card';
                card.style.cssText = "background: #1e1f22; padding: 15px; border-radius: 8px; display: flex; align-items: center; gap: 15px; cursor: pointer; border: 1px solid #444; margin-bottom: 10px; transition: 0.3s;";
                
                card.innerHTML = `
                    <img src="${icon}" style="width: 40px; height: 40px; border-radius: 50%;">
                    <strong style="color: white;">${guild.name}</strong>
                `;
                
                card.onclick = () => {
                    localStorage.setItem('selectedServerId', guild.id);
                    localStorage.setItem('selectedServerName', guild.name);
                    window.location.href = 'dashboard.html';
                };
                
                list.appendChild(card);
            }
        });
    } catch (err) {
        console.error("Eroare fetchGuilds:", err);
    }
}

function loginWithDiscord() {
    const CLIENT_ID = '1427291236980490404'; // SCHIMBĂ CU ID-UL TĂU
    const REDIRECT_URI = encodeURIComponent('https://pcaf.vercel.app'); 
    const scope = 'identify guilds';
    window.location.href = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=token&scope=${scope}`;
}

// 2. EXECUTĂM LOGICA DUPĂ CE PAGINA S-A ÎNCĂRCAT

window.addEventListener('DOMContentLoaded', () => {
    // Punem event pe buton
    const loginBtn = document.getElementById('btn-discord-login');
    if (loginBtn) {
        loginBtn.onclick = loginWithDiscord;
    }

    // Verificăm dacă ne-am întors din login (avem token în URL)
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    const accessToken = fragment.get('access_token');

    if (accessToken) {
        // Ascundem butonul, arătăm lista
        const loginContainer = document.getElementById('login-container');
        const guildsContainer = document.getElementById('guilds-container');
        
        if (loginContainer) loginContainer.style.display = 'none';
        if (guildsContainer) guildsContainer.style.display = 'block';

        // Curățăm hash-ul din URL fără să dăm refresh
        window.history.replaceState({}, document.title, window.location.pathname);

        // ACUM apelăm funcția (care este deja definită mai sus)
        fetchGuilds(accessToken);
    }
});
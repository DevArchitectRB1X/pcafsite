// 1. Funcția de Login
function loginWithDiscord() {
    const CLIENT_ID = '1427291236980490404'; 
    const REDIRECT_URI = encodeURIComponent('https://pcaf.vercel.app'); 
    const scope = 'identify guilds';
    
    // Redirect către Discord
    window.location.href = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=token&scope=${scope}`;
}

// 2. Atașare Event pe buton (asigură-te că butonul are id="btn-discord-login")
document.getElementById('btn-discord-login')?.addEventListener('click', loginWithDiscord);

// 3. Logica de verificare a Token-ului (Rulează imediat ce se încarcă pagina)
window.addEventListener('DOMContentLoaded', () => {
    // Verificăm dacă avem fragmentul cu access_token în URL
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    const accessToken = fragment.get('access_token');

    if (accessToken) {
        console.log("Token găsit! Încărcăm serverele...");
        
        // Ascundem butonul de login și arătăm containerul de servere
        const loginContainer = document.getElementById('login-container');
        const guildsContainer = document.getElementById('guilds-container');
        
        if (loginContainer) loginContainer.style.display = 'none';
        if (guildsContainer) guildsContainer.style.display = 'block';

        // Curățăm URL-ul (opțional, dar arată mai bine)
        window.history.replaceState({}, document.title, window.location.pathname);

        // Chemăm funcția de fetch
        fetchGuilds(accessToken);
    }
});

// 4. Funcția care trage serverele de la Discord
async function fetchGuilds(token) {
    try {
        const response = await fetch('https://discord.com/api/users/@me/guilds', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error("Eroare la Discord API");

        const guilds = await response.json();
        const list = document.getElementById('guilds-list');
        
        if (!list) return;
        list.innerHTML = ''; 

        guilds.forEach(guild => {
            // Permisiunea 0x8 este ADMINISTRATOR
            if ((guild.permissions & 0x8) === 0x8) {
                const icon = guild.icon 
                    ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
                    : 'https://cdn.discordapp.com/embed/avatars/0.png';
                
                const card = document.createElement('div');
                card.className = 'guild-card'; // Folosește stilul tău CSS
                card.style.cssText = "background: #1e1f22; padding: 15px; border-radius: 8px; display: flex; align-items: center; gap: 15px; cursor: pointer; border: 1px solid #444; margin-bottom: 10px;";
                
                card.innerHTML = `
                    <img src="${icon}" style="width: 40px; height: 40px; border-radius: 50%;">
                    <strong>${guild.name}</strong>
                `;
                
                // Când dă click, salvează și trimite la Dashboard
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
        alert("S-a produs o eroare la încărcarea serverelor. Verifică Consola (F12).");
    }
}
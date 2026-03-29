function loginWithDiscord() {
    const CLIENT_ID = '1427291236980490404'; // Asigură-te că aici e ID-ul tău corect
    
    // Folosim exact primul link din lista ta de Redirecționări
    const REDIRECT_URI = encodeURIComponent('https://pcaf.vercel.app'); 
    
    const scope = 'identify guilds';
    
    // Construim URL-ul final
    window.location.href = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=token&scope=${scope}`;
}

// Verificăm dacă ne-am întors din login cu un token în URL
window.onload = () => {
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    const accessToken = fragment.get('access_token');

    if (accessToken) {
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('guilds-container').style.display = 'block';
        fetchGuilds(accessToken);
    }
};

async function fetchGuilds(token) {
    const response = await fetch('https://discord.com/api/users/@me/guilds', {
        headers: { Authorization: `Bearer ${token}` }
    });
    const guilds = await response.json();
    const list = document.getElementById('guilds-list');

    guilds.forEach(guild => {
        // Filtrăm serverele unde utilizatorul are permisiuni de admin (0x8)
        if ((guild.permissions & 0x8) === 0x8) {
            const icon = guild.icon 
                ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
                : 'https://archive.org/download/discord-v2-3-logo-svg/discord-v2-3-logo-svg.png';
            
            list.innerHTML += `
                <div class="guild-card">
                    <img src="${icon}" class="guild-icon">
                    <div>
                        <strong style="display: block;">${guild.name}</strong>
                        <small style="color: #2ecc71;">Lider / Admin</small>
                    </div>
                </div>
            `;
        }
    });
}
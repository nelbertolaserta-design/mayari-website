

// =========================================
// MAYARI SMP SERVER STATUS
// =========================================

// CHANGE THIS TO YOUR REAL SERVER IP
const MINECRAFT_SERVER = "play.mayari.space :19025";

// Java Edition API
const API_URL =
    "https://api.mcsrvstat.us/bedrock/3/" + MINECRAFT_SERVER;


// =========================================
// HTML ELEMENTS
// =========================================

const statusDot = document.getElementById("status-dot");
const statusText = document.getElementById("status-text");
const statusSubtitle = document.getElementById("status-subtitle");
const statusBadge = document.getElementById("status-badge");

const playerCount = document.getElementById("player-count");
const serverVersion = document.getElementById("server-version");

const serverIcon = document.getElementById("server-icon");
const serverMotd = document.getElementById("server-motd");
const serverAddress = document.getElementById("server-address");
const serverAddressDetails =
    document.getElementById("server-address-details");

const playerList = document.getElementById("player-list");
const playerListCount =
    document.getElementById("player-list-count");

const refreshButton = document.getElementById("refresh-status");
const lastUpdated = document.getElementById("last-updated");


// =========================================
// UPDATE SERVER ICON
// =========================================

function updateServerIcon(data) {

    if (data.icon && serverIcon) {

        serverIcon.src = data.icon;

    } else {

        // Use your local icon if API has no icon
        serverIcon.src = "images/mayari-icon.png";
    }
}


// =========================================
// UPDATE SERVER MOTD
// =========================================

function updateServerMOTD(data) {

    if (!serverMotd) return;

    // MOTD clean text is usually an array of lines
    const motdLines = data.motd?.clean;

    if (Array.isArray(motdLines) && motdLines.length > 0) {

        serverMotd.textContent = motdLines.join(" ");

    } else if (typeof motdLines === "string") {

        serverMotd.textContent = motdLines;

    } else {

        serverMotd.textContent =
            "Welcome to Mayari SMP — Survival RPG + Vanilla SMP";
    }
}


// =========================================
// UPDATE PLAYER LIST
// =========================================

function updatePlayerList(data) {

    if (!playerList || !playerListCount) return;

    playerList.innerHTML = "";

    const players = data.players?.list;

    // API may not provide player names
    if (!Array.isArray(players) || players.length === 0) {

        playerListCount.textContent = "Names unavailable";

        const emptyMessage = document.createElement("p");

        emptyMessage.className = "no-players";

        emptyMessage.textContent =
            "No player names available right now.";

        playerList.appendChild(emptyMessage);

        return;
    }

    playerListCount.textContent =
        players.length + " Players";

    players.forEach(player => {

        // Some APIs return strings,
        // others may return objects.
        const playerName =
            typeof player === "string"
                ? player
                : player.name || "Unknown Player";

        const playerElement =
            document.createElement("div");

        playerElement.className = "player-name";

        playerElement.textContent = playerName;

        playerList.appendChild(playerElement);
    });
}


// =========================================
// UPDATE SERVER STATUS
// =========================================

function updateServerStatus(data) {

    updateServerIcon(data);
    updateServerMOTD(data);
    updatePlayerList(data);

    if (data.online === true) {

        // ONLINE

        statusDot.className = "status-dot online";

        statusText.textContent = "Server Online";

        statusSubtitle.textContent =
            "Mayari SMP is ready for adventure!";

        statusBadge.className = "status-badge online";

        statusBadge.textContent = "Online";

        // PLAYER COUNT

        const onlinePlayers =
            data.players?.online ?? 0;

        const maxPlayers =
            data.players?.max ?? "?";

        playerCount.textContent =
            onlinePlayers + " / " + maxPlayers;

        // VERSION

        serverVersion.textContent =
            data.version || "Unknown";

    } else {

        // OFFLINE

        statusDot.className = "status-dot offline";

        statusText.textContent = "Server Offline";

        statusSubtitle.textContent =
            "The server is currently unavailable.";

        statusBadge.className = "status-badge offline";

        statusBadge.textContent = "Offline";

        playerCount.textContent = "0 / --";

        serverVersion.textContent = "--";

        playerList.innerHTML = "";

        playerListCount.textContent = "0 Players";

        const offlineMessage = document.createElement("p");

        offlineMessage.className = "no-players";

        offlineMessage.textContent =
            "No adventurers online.";

        playerList.appendChild(offlineMessage);
    }

    serverAddress.textContent = MINECRAFT_SERVER;

    serverAddressDetails.textContent = MINECRAFT_SERVER;

    lastUpdated.textContent =
        "Last checked: " + new Date().toLocaleTimeString();
}


// =========================================
// FETCH SERVER STATUS
// =========================================

async function fetchServerStatus() {

    if (MINECRAFT_SERVER === "YOUR-SERVER-IP") {

        statusText.textContent = "Setup Required";

        statusSubtitle.textContent =
            "Add your real Minecraft server IP.";

        statusBadge.textContent = "Not Configured";

        playerCount.textContent = "-- / --";

        serverVersion.textContent = "--";

        serverMotd.textContent =
            "Add your server IP to display the MOTD.";

        playerList.innerHTML = "";

        playerListCount.textContent = "Not Connected";

        const setupMessage = document.createElement("p");

        setupMessage.className = "no-players";

        setupMessage.textContent =
            "Configure your server IP first.";

        playerList.appendChild(setupMessage);

        return;
    }

    refreshButton.disabled = true;

    refreshButton.textContent = "⏳ Checking...";

    statusText.textContent = "Checking Server...";

    statusSubtitle.textContent =
        "Connecting to Mayari SMP";

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {

            throw new Error("API request failed");
        }

        const data = await response.json();

        updateServerStatus(data);

    } catch (error) {

        console.error("Server status error:", error);

        statusDot.className = "status-dot offline";

        statusText.textContent = "Status Unavailable";

        statusSubtitle.textContent =
            "Could not retrieve server information.";

        statusBadge.className = "status-badge offline";

        statusBadge.textContent = "Unknown";

        playerCount.textContent = "-- / --";

        serverVersion.textContent = "--";

        serverMotd.textContent =
            "Unable to load the server MOTD.";

        playerList.innerHTML = "";

        playerListCount.textContent = "Unavailable";

        const errorMessage = document.createElement("p");

        errorMessage.className = "no-players";

        errorMessage.textContent =
            "Player list unavailable.";

        playerList.appendChild(errorMessage);

        lastUpdated.textContent =
            "Please try again later.";

    } finally {

        refreshButton.disabled = false;

        refreshButton.textContent = "🔄 Refresh Status";
    }
}


// =========================================
// REFRESH BUTTON
// =========================================

refreshButton.addEventListener(
    "click",
    fetchServerStatus
);


// =========================================
// INITIAL CHECK
// =========================================

fetchServerStatus();const serverData = {
    online: true,

    icon: "data:image/png;base64,...",

    motd: {
        clean: [
            "Welcome to Mayari SMP",
            "Survival RPG + Vanilla SMP"
        ]
    },

    players: {
        online: 24,
        max: 100,
        list: [
            "PlayerOne",
            "MayariKnight",
            "RPGMaster"
        ]
    },

    version: "1.21.8"
};
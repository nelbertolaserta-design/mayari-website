

// =========================================
// MAYARI SMP SERVER STATUS
// =========================================

const MINECRAFT_SERVER = "play.mayari.space:19025";
const API_URL = "https://api.mcsrvstat.us/2/" + MINECRAFT_SERVER;

const STATUS_ANIMATIONS = {
    online: "https://lottie.host/embed/70ce6072-e6c7-47d0-b8b4-929698f8d91b/iQyRQDBdpw.lottie",
    offline: "https://lottie.host/embed/ec575775-2c6d-4897-8954-14ce582926d1/wDMa2G7jbT.lottie"
};

const statusDot = document.getElementById("status-dot");
const statusText = document.getElementById("status-text");
const statusSubtitle = document.getElementById("status-subtitle");
const playerCount = document.getElementById("player-count");
const serverVersion = document.getElementById("server-version");
const serverAddress = document.getElementById("server-address");
const refreshButton = document.getElementById("refresh-status");
const lastUpdated = document.getElementById("last-updated");

function setStatusDot(state) {
    if (!statusDot) return;

    const className = state === "online" ? "online" : "offline";
    const label = className === "online" ? "Server online" : "Server offline";

    const animation = statusDot.querySelector("iframe");
    if (animation) {
        animation.src = STATUS_ANIMATIONS[state] || STATUS_ANIMATIONS.offline;
    }
    statusDot.title = label;
    statusDot.setAttribute("aria-label", label);
    statusDot.classList.remove("online", "offline");
    statusDot.classList.add(className);
}

function updateServerStatus(data) {
    if (!statusDot || !statusText || !statusSubtitle || !playerCount || !serverVersion || !serverAddress || !lastUpdated) {
        return;
    }

    const online = Boolean(data?.online);

    if (online) {
        setStatusDot("online");
        statusText.textContent = "Server Online";
        statusSubtitle.textContent = "Mayari SMP is ready for adventure!";

        const onlinePlayers = data?.players?.online ?? 0;
        const maxPlayers = data?.players?.max ?? "?";

        playerCount.textContent = onlinePlayers + " / " + maxPlayers;
        serverVersion.textContent = data?.version || "Unknown";
    } else {
        setStatusDot("offline");
        statusText.textContent = "Server Offline";
        statusSubtitle.textContent = "The server is currently unavailable.";
        playerCount.textContent = "0 / --";
        serverVersion.textContent = "--";
    }

    serverAddress.textContent = MINECRAFT_SERVER;
    lastUpdated.textContent = "Last checked: " + new Date().toLocaleTimeString();
}

async function fetchServerStatus() {
    if (!statusText || !statusSubtitle || !playerCount || !serverVersion || !lastUpdated) {
        return;
    }

    if (MINECRAFT_SERVER === "YOUR-SERVER-IP") {
        statusText.textContent = "Setup Required";
        statusSubtitle.textContent = "Add your real Minecraft server IP.";
        playerCount.textContent = "-- / --";
        serverVersion.textContent = "--";
        lastUpdated.textContent = "Please configure your server IP first.";
        return;
    }

    if (refreshButton) {
        refreshButton.disabled = true;
        refreshButton.textContent = "⏳ Checking...";
    }

    statusText.textContent = "Checking Server...";
    statusSubtitle.textContent = "Connecting to Mayari SMP";

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("API request failed");
        }

        const data = await response.json();
        updateServerStatus(data);
    } catch (error) {
        console.error("Server status error:", error);

        setStatusDot("offline");
        statusText.textContent = "Status Unavailable";
        statusSubtitle.textContent = "Could not retrieve server information.";
        playerCount.textContent = "-- / --";
        serverVersion.textContent = "--";
        lastUpdated.textContent = "Please try again later.";
    } finally {
        if (refreshButton) {
            refreshButton.disabled = false;
            refreshButton.textContent = "↻ Refresh Status";
        }
    }
}

if (refreshButton) {
    refreshButton.addEventListener("click", fetchServerStatus);
}

fetchServerStatus();

const cosmeticCards = document.querySelectorAll(".cosmetic-card");

cosmeticCards.forEach(card => {
    card.addEventListener("toggle", () => {
        if (!card.open) return;

        cosmeticCards.forEach(otherCard => {
            if (otherCard !== card) otherCard.open = false;
        });

        const details = card.querySelector(".cosmetic-details");
        const title = card.querySelector("summary span");

        if (!details || details.querySelector(".cosmetic-close")) return;

        const heading = document.createElement("h2");
        heading.textContent = title ? title.textContent : "Cosmetic Details";
        heading.className = "cosmetic-popup-title";

        const closeButton = document.createElement("button");
        closeButton.type = "button";
        closeButton.className = "cosmetic-close";
        closeButton.textContent = "Close";
        closeButton.addEventListener("click", () => {
            card.open = false;
        });

        const actionRow = document.createElement("div");
        actionRow.className = "cosmetic-actions";

        const discordButton = document.createElement("a");
        discordButton.className = "cosmetic-discord";
        discordButton.href = "discord://-/channels/1424987498635067465/1430040430849949718";
        discordButton.target = "_blank";
        discordButton.rel = "noopener noreferrer";
        discordButton.textContent = "🛒 Buy on Discord";

        details.prepend(heading);
        actionRow.append(discordButton, closeButton);
        details.appendChild(actionRow);
    });
});

document.addEventListener("keydown", event => {
    if (event.key !== "Escape") return;

    cosmeticCards.forEach(card => {
        card.open = false;
    });
});

async function copyServerIp() {
    const ip = document.getElementById('server-ip').textContent.trim();
    const message = document.getElementById('copy-message');

        try {
            await navigator.clipboard.writeText(ip);
        } catch (error) {
            const fallback = document.createElement('textarea');
            fallback.value = ip;
            fallback.style.position = 'fixed';
            fallback.style.opacity = '0';
            document.body.appendChild(fallback);
            fallback.focus();
            fallback.select();                document.execCommand('copy');
            fallback.remove();
        }
        message.textContent = 'Server IP copied!';
        }
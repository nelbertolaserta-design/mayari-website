
// Mayari SMP Copy IP System

const serverIP = document.getElementById("server-ip");
const copyButton = document.getElementById("copy-ip-btn");
const mainCopyButton = document.getElementById("copy-ip-main");
const copyMessage = document.getElementById("copy-message");

// Copy the server IP
async function copyServerIP(button) {
    const ip = serverIP.textContent.trim();

    try {
        await navigator.clipboard.writeText(ip);

        copyMessage.textContent = "✅ Server IP copied!";

        button.textContent = "✅ Copied!";

        setTimeout(() => {
            button.textContent = "📋 Copy IP";
            copyMessage.textContent = "";
        }, 2000);

    } catch (error) {
        copyMessage.textContent =
            "Please copy the IP manually: " + ip;

        console.error("Copy failed:", error);
    }
}

// Small Copy IP button
copyButton.addEventListener("click", () => {
    copyServerIP(copyButton);
});

// Main Copy IP button
mainCopyButton.addEventListener("click", () => {
    copyServerIP(mainCopyButton);
});
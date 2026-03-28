const { default: makeWASocket, useMultiFileAuthState, downloadContentFromMessage } = require("@whiskeysockets/baileys")
const yts = require("yt-search")
const ytdl = require("ytdl-core")

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("auth")

const sock = makeWASocket({
    auth: state
})
    const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys")
const qrcode = require("qrcode-terminal")

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("auth")

    const sock = makeWASocket({
        auth: state
    })

    sock.ev.on("creds.update", saveCreds)

    // 👇 NOVO JEITO DE PEGAR QR
    sock.ev.on("connection.update", (update) => {
        const { qr, connection } = update

        if (qr) {
            console.log("📲 ESCANEIA ESSE QR:")
            qrcode.generate(qr, { small: true })
        }

        if (connection === "open") {
            console.log("✅ BOT CONECTADO!")
        }
    })
}

startBot()
    

    sock.ev.on("creds.update", saveCreds)

    sock.ev.on("messages.upsert", async ({ messages }) => {
        const msg = messages[0]
        if (!msg.message) return

        const from = msg.key.remoteJid
        const isGroup = from.includes("@g.us")
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text

        // MENU
        if (text === "!menu") {
            return sock.sendMessage(from, {
                text: `🤖 MENU SUPREMO:

!oi
!hora
!zoar
!jogo
!fig
!music nome`
            })
        }

        // OI
        if (text === "!oi") {
            return sock.sendMessage(from, { text: "Tô online 😎🔥" })
        }

        // HORA
        if (text === "!hora") {
            return sock.sendMessage(from, {
                text: "⏰ " + new Date().toLocaleTimeString()
            })
        }

        // ZOEIRA
        if (text === "!zoar") {
            const frases = [
                "Você é bug em produção 😂",
                "Compila primeiro, fala depois 💀",
                "Erro 404: cérebro não encontrado 🧠❌"
            ]
            return sock.sendMessage(from, {
                text: frases[Math.floor(Math.random() * frases.length)]
            })
        }

        // JOGO
        if (text === "!jogo") {
            const num = Math.floor(Math.random() * 10)
            return sock.sendMessage(from, {
                text: `🎮 Número: ${num}`
            })
        }

        // FIGURINHA
        if (text === "!fig") {
            if (msg.message.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage) {
                const quoted = msg.message.extendedTextMessage.contextInfo.quotedMessage
                const stream = await downloadContentFromMessage(quoted.imageMessage, "image")

                let buffer = Buffer.from([])
                for await (const chunk of stream) {
                    buffer = Buffer.concat([buffer, chunk])
                }

                return sock.sendMessage(from, { sticker: buffer })
            } else {
                return sock.sendMessage(from, { text: "Marca uma imagem 🖼️" })
            }
        }

        // MUSIC
        if (text && text.startsWith("!music")) {
            const query = text.replace("!music", "").trim()

            if (!query) {
                return sock.sendMessage(from, {
                    text: "Coloca o nome da música 🎵"
                })
            }

            await sock.sendMessage(from, { text: "🔎 Buscando..." })

            const search = await yts(query)
            const video = search.videos[0]

            if (!video) {
                return sock.sendMessage(from, { text: "Não achei 😢" })
            }

            await sock.sendMessage(from, {
                text: `🎵 ${video.title}`
            })

            try {
                const stream = ytdl(video.url, { filter: "audioonly" })

                let buffer = Buffer.from([])
                for await (const chunk of stream) {
                    buffer = Buffer.concat([buffer, chunk])
                }

                return sock.sendMessage(from, {
                    audio: buffer,
                    mimetype: "audio/mp4"
                })
            } catch {
                return sock.sendMessage(from, {
                    text: "Erro 😭\n" + video.url
                })
            }
        }

        // IA SIMPLES
        if (text && !text.startsWith("!")) {
            const respostas = [
                "Hmm 🤔",
                "Explica melhor 👀",
                "Interessante 😳",
                "Não sei não hein 😈"
            ]

            return sock.sendMessage(from, {
                text: respostas[Math.floor(Math.random() * respostas.length)]
            })
        }
    })
}

startBot()

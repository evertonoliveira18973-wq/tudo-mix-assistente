const messages = document.getElementById("messages");
const messageInput = document.getElementById("messageInput");


// Enviar mensagem
async function sendMessage() {

    const mensagem = messageInput.value.trim();

    if (mensagem === "") {
        return;
    }

    // Mostra mensagem do usuário
    addMessage(mensagem, "user");

    // Limpa o campo
    messageInput.value = "";

    // Desativa temporariamente o input
    messageInput.disabled = true;

    // Mostra indicador de digitação
    const typingMessage = createTypingMessage();

    try {

        const resposta = await fetch("/chat", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                mensagem: mensagem
            })

        });

        const dados = await resposta.json();

        // Remove indicador de digitação
        typingMessage.remove();

        if (dados.response) {

            addMessage(dados.response, "bot");

        } else {

            addMessage(
                "Desculpe, não consegui responder agora. 😕",
                "bot"
            );

        }

    } catch (erro) {

        typingMessage.remove();

        addMessage(
            "❌ Ocorreu um erro ao conversar com o assistente.",
            "bot"
        );

        console.error("Erro:", erro);

    } finally {

        // Reativa o campo
        messageInput.disabled = false;

        // Coloca o cursor novamente no campo
        messageInput.focus();

    }

}


// Adiciona mensagem na tela
function addMessage(texto, tipo) {

    const message = document.createElement("div");

    message.classList.add("message", tipo);

    message.innerHTML = texto
        .replace(/\n/g, "<br>");

    messages.appendChild(message);

    messages.scrollTop = messages.scrollHeight;

    return message;

}


// Indicador de digitação
function createTypingMessage() {

    const message = document.createElement("div");

    message.classList.add("message", "bot", "typing");

    message.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
    `;

    messages.appendChild(message);

    messages.scrollTop = messages.scrollHeight;

    return message;

}


// Botões de sugestão
function sendSuggestion(texto) {

    messageInput.value = texto;

    sendMessage();

}


// Permite enviar com Enter
messageInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {

        sendMessage();

    }

});
function clearChat() {

    messages.innerHTML = `

        <div class="message bot">

            Olá! 👋<br><br>

            Sou o <strong>Tudo Mix Assistente</strong> 🛒

            <br><br>

            Posso te ajudar a encontrar produtos, conhecer nossas categorias e tirar suas dúvidas sobre compras.

            <br><br>

            O que você está procurando hoje? 😊

        </div>

    `;

}
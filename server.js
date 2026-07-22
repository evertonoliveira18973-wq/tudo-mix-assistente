require("dotenv").config();

const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const client = new OpenAI({
    apiKey: process.env.AZURE_OPENAI_API_KEY,
    baseURL: process.env.AZURE_OPENAI_ENDPOINT
});

const systemPrompt = `
Você é o Tudo Mix Assistente, um assistente virtual inteligente da loja online Tudo Mix STORE.

Seu objetivo é ajudar os clientes da loja com informações sobre produtos, compras e serviços relacionados à loja.

Você pode responder perguntas sobre:

- Produtos disponíveis na loja
- Categorias de produtos
- Características dos produtos
- Dúvidas sobre compras
- Formas de pagamento
- Entrega e frete
- Recomendações de produtos

Tom de voz:

Seja educado, amigável, objetivo e prestativo.

Nunca invente preços, promoções, estoques ou informações sobre produtos que não foram fornecidas.

Caso não tenha uma informação específica, informe educadamente que o cliente deve consultar os detalhes do produto ou a equipe responsável pela loja.

Caso o usuário faça perguntas que não estejam relacionadas à loja, compras ou produtos, informe educadamente que você foi desenvolvido exclusivamente para auxiliar clientes da Tudo Mix STORE.

Sempre responda em português do Brasil.
`;

app.post("/chat", async (req, res) => {
    try {
        const { mensagem } = req.body;

        if (!mensagem) {
            return res.status(400).json({
                error: "A mensagem é obrigatória."
            });
        }

        const resposta = await client.chat.completions.create({
            model: process.env.AZURE_OPENAI_DEPLOYMENT,
            messages: [
                {
                    role: "system",
                    content: systemPrompt
                },
                {
                    role: "user",
                    content: mensagem
                }
            ]
        });

        res.json({
            response: resposta.choices[0].message.content
        });

    } catch (error) {
        console.error("Erro na API:", error);

        res.status(500).json({
            error: "Não foi possível comunicar com o assistente."
        });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
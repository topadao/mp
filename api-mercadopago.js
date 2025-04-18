import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT ?? 10000;

app.use(cors());
app.use(express.json());

const ACCESS_TOKEN = 'APP_USR-7905763012500383-041815-34b3be71351ee11f9db214a2fe271c7c-1557375351';

app.post('/criar-pagamento', async (req, res) => {
  try {
    const response = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ACCESS_TOKEN}`
      },
      body: JSON.stringify({
        transaction_amount: 36.90,
        payment_method_id: 'pix',
        description: 'Checkout Pix Fixo R$36,90',
        payer: {
          email: 'pagador@email.com',
          first_name: 'Cliente',
          last_name: 'Checkout'
        }
      })
    });

    const data = await response.json();
    if (data.point_of_interaction) {
      res.json({
        qr_code_base64: data.point_of_interaction.transaction_data.qr_code_base64,
        qr_code: data.point_of_interaction.transaction_data.qr_code,
        link: data.point_of_interaction.transaction_data.ticket_url
      });
    } else {
      res.status(400).json({ error: 'Erro ao gerar pagamento', detalhes: data });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro interno ao criar pagamento' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
});

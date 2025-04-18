
import express from 'express';
import mercadopago from 'mercadopago';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

mercadopago.configure({
  access_token: "APP_USR-7905763012500383-041815-34b3be71351ee11f9db214a2fe271c7c-1557375351"
});

app.post('/criar-pagamento', async (req, res) => {
  try {
    const preference = {
      transaction_amount: 36.9,
      description: 'Produto Checkout Pix',
      payment_method_id: 'pix',
      payer: {
        email: 'comprador@email.com',
        first_name: 'João',
        last_name: 'Silva',
        identification: {
          type: 'CPF',
          number: '12345678909'
        },
        address: {
          zip_code: '06233200',
          street_name: 'Av. das Nações Unidas',
          street_number: '3003',
          neighborhood: 'Bonfim',
          city: 'Osasco',
          federal_unit: 'SP'
        }
      }
    };

    const result = await mercadopago.payment.create(preference);
    const { point_of_interaction } = result.response;

    res.json({
      qr_code_base64: point_of_interaction.transaction_data.qr_code_base64,
      link: point_of_interaction.transaction_data.ticket_url
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar pagamento' });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
});

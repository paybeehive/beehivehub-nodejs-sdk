# Beehive Hub Node.js SDK

Official SDK for integrating with the Beehive Hub API. Accept payments simply and quickly.

[![npm version](https://img.shields.io/npm/v/@paybeehive/beehivehub-nodejs-sdk)](https://www.npmjs.com/package/@paybeehive/beehivehub-nodejs-sdk)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Authentication](#authentication)
- [Resources](#resources)
  - [Transactions](#transactions)
  - [Customers](#customers)
  - [Transfers](#transfers)
  - [Balance](#balance)
  - [Recipients](#recipients)
  - [Bank Accounts](#bank-accounts)
  - [Company](#company)
  - [Payment Links](#payment-links)
- [Error Handling](#error-handling)
- [Values in Cents](#values-in-cents)
- [Security Best Practices](#security-best-practices)
- [Testing](#testing)
- [Support](#support)
- [License](#license)

## Installation

```bash
npm install @paybeehive/beehivehub-nodejs-sdk
```

## Quick Start

```typescript
import BeehiveHub from "@paybeehive/beehivehub-nodejs-sdk";

const beehive = BeehiveHub("your_secret_key");

const transaction = await beehive.transactions.create({
  amount: 10000, // BRL 100.00 in cents
  paymentMethod: "pix",
  customer: {
    name: "João Silva",
    email: "joao@example.com",
    document: { type: "cpf", number: "00000000191" },
    phone: "11999999999"
  },
  items: [
    { title: "Produto Teste", unitPrice: 10000, quantity: 1, tangible: true }
  ],
  postbackUrl: "https://example.com/webhook"
});

console.log("Transaction created:", transaction);
```

## Authentication

The SDK uses **Basic Authentication**. Provide your **SECRET_KEY** when initializing.

### Getting your credentials

1. Access the [Beehive Hub dashboard](https://app.conta.paybeehive.com.br)
2. Navigate to **Settings → API Credentials**
3. Copy your **SECRET_KEY**

```typescript
const beehive = BeehiveHub("your_secret_key_here");
```

### Sandbox environment

```typescript
const beehive = BeehiveHub("your_secret_key", { environment: "sandbox" });
```

**Important:** Never expose your secret key in client-side code or public repositories. Use environment variables:

```typescript
const beehive = BeehiveHub(process.env.BEEHIVE_SECRET_KEY!);
```

## Resources

### Transactions

#### Create a transaction

```typescript
const transaction = await beehive.transactions.create({
  amount: 10000,
  paymentMethod: "pix",
  customer: {
    name: "João Silva",
    email: "joao@example.com",
    document: { type: "cpf", number: "00000000191" },
    phone: "11999999999"
  },
  items: [
    { title: "Produto Teste", unitPrice: 10000, quantity: 1, tangible: true }
  ],
  postbackUrl: "https://example.com/webhook",
  metadata: { orderId: "1234567890" }
});
```

#### List transactions

```typescript
const transactions = await beehive.transactions.list({
  limit: 100,
  offset: 0,
  createdFrom: "2026-01-01T00:00:00"
});
```

#### Get a transaction

```typescript
const transaction = await beehive.transactions.get(123456);
```

#### Refund a transaction

```typescript
// Full refund
const refund = await beehive.transactions.refund(123456);

// Partial refund
const partialRefund = await beehive.transactions.refund(123456, 5000);
```

#### Update delivery status

```typescript
const updated = await beehive.transactions.updateDelivery(123456, {
  status: "in_transit",
  trackingCode: "BR123456789"
});
```

### Customers

#### Create a customer

```typescript
const customer = await beehive.customers.create({
  name: "Maria Santos",
  email: "maria@example.com",
  document: { type: "cpf", number: "98765432100" },
  phone: "11988888888",
  address: {
    street: "Rua Teste",
    streetNumber: "456",
    complement: "Apto 101",
    neighborhood: "Jardins",
    zipCode: "01234567",
    city: "São Paulo",
    state: "SP",
    country: "br"
  }
});
```

#### List customers

O parâmetro `email` é obrigatório. A API não aceita parâmetros de paginação convencionais.

```typescript
const customers = await beehive.customers.list({
  email: "cliente@example.com",
});
```

#### Get a customer

```typescript
const customer = await beehive.customers.get(123456);
```

### Transfers

#### Create a transfer

```typescript
const transfer = await beehive.transfers.create({
  amount: 50000,
  recipientId: 916
});

// With optional bank account
const transferWithAccount = await beehive.transfers.create({
  amount: 50000,
  recipientId: 916,
  bankAccount: {
    bankCode: "001",
    agencyNumber: "1234",
    accountNumber: "12345",
    accountDigit: "6",
    type: "conta_corrente",
    legalName: "Destinatário Teste",
    documentNumber: "12345678900",
    documentType: "cpf"
  }
});
```

#### Get a transfer

```typescript
const transfer = await beehive.transfers.get(123456);
```

### Balance

```typescript
const balance = await beehive.balance.get();
console.log(`Available: BRL ${balance.amount / 100}`);
console.log(`Recipient ID: ${balance.recipientId}`);
```

### Recipients

#### Create a recipient

```typescript
const recipient = await beehive.recipients.create({
  legalName: "Recebedor Teste Ltda",
  document: { type: "cnpj", number: "58593776000142" },
  transferSettings: {
    transferEnabled: true,
    automaticAnticipationEnabled: false,
    anticipatableVolumePercentage: 100
  },
  bankAccount: {
    bankCode: "001",
    agencyNumber: "1234",
    accountNumber: "12345",
    accountDigit: "6",
    type: "conta_corrente",
    legalName: "Recebedor Teste Ltda",
    documentNumber: "58593776000142",
    documentType: "cnpj"
  }
});
```

#### List recipients

```typescript
const recipients = await beehive.recipients.list();
```

#### Get a recipient

```typescript
const recipient = await beehive.recipients.get(916);
```

#### Update a recipient

```typescript
const updated = await beehive.recipients.update(916, {
  legalName: "Beehive Sandbox"
});
```

### Bank Accounts

#### Add a bank account

```typescript
const bankAccount = await beehive.bankAccounts.create(916, {
  bankCode: "341",
  agencyNumber: "9876",
  accountNumber: "54321",
  accountDigit: "0",
  type: "conta_poupanca",
  legalName: "Empresa Teste Ltda",
  documentNumber: "60572883000136",
  documentType: "cnpj"
});
```

#### List bank accounts

```typescript
const accounts = await beehive.bankAccounts.list(916);
```

### Company

#### Get company data

```typescript
const company = await beehive.company.get();
```

#### Update company data

```typescript
const updated = await beehive.company.update({
  invoiceDescriptor: "Beehive Hub",
  details: {
    averageRevenue: 10000,
    averageTicket: 100.50,
    physicalProducts: true,
    productsDescription: "Produtos físicos",
    siteUrl: "https://www.meusite.com.br",
    phone: "11999999999",
    email: "contato@meusite.com.br"
  }
});
```

### Payment Links

O SDK adiciona `url` às respostas (create, get, list, update) quando há `alias`:
- **Produção:** `https://link.conta.paybeehive.com.br/{alias}`
- **Sandbox:** `https://link.sandbox.hopysplit.com.br/{alias}`

#### Create a payment link

Create e update aceitam payloads parciais. Se `alias` não for informado, o SDK gera automaticamente um código alfanumérico de 10 caracteres. Em `pix` e `boleto`, `expiresInDays` é opcional (a API usa 0 quando omitido); recomenda-se informá-lo explicitamente.

```typescript
const paymentLink = await beehive.paymentLinks.create({
  title: "novo link alterado",
  alias: "alias_alterado",
  amount: 1000,
  settings: {
    defaultPaymentMethod: "credit_card",
    requestAddress: true,
    requestPhone: true,
    traceable: true,
    boleto: { enabled: true, expiresInDays: 0 },
    pix: { enabled: false, expiresInDays: 0 },
    card: { enabled: false, freeInstallments: 1, maxInstallments: 12 }
  }
});
// paymentLink.url já vem montada (ex: https://link.conta.paybeehive.com.br/alias_alterado)
```

#### List payment links

A API não aceita filtros por query parameters; retorna todos os links da empresa.

```typescript
const paymentLinks = await beehive.paymentLinks.list();
```

#### Get a payment link

```typescript
const paymentLink = await beehive.paymentLinks.get(247);
```

#### Update a payment link

Aceita atualizações parciais (apenas os campos que deseja alterar).

```typescript
const updated = await beehive.paymentLinks.update(247, {
  title: "novo link alterado",
  alias: "alias_alterado",
  amount: 1000,
  settings: {
    defaultPaymentMethod: "credit_card",
    requestAddress: true,
    requestPhone: true,
    traceable: true,
    boleto: { enabled: true, expiresInDays: 0 },
    pix: { enabled: false, expiresInDays: 0 },
    card: { enabled: false, freeInstallments: 1, maxInstallments: 12 }
  }
});
```

#### Delete a payment link

```typescript
await beehive.paymentLinks.delete(247);
```

## Error Handling

The SDK throws specific error classes for different scenarios:

- `BeehiveHubAPIError` - General API errors (4xx, 5xx)
- `BeehiveHubAuthenticationError` - Authentication failures (401)
- `BeehiveHubValidationError` - Request validation errors (400)
- `BeehiveHubNotFoundError` - Resource not found (404)
- `BeehiveHubRateLimitError` - Rate limit exceeded (429)
- `BeehiveHubNetworkError` - Network/connection errors

```typescript
import BeehiveHub, {
  BeehiveHubAPIError,
  BeehiveHubAuthenticationError,
  BeehiveHubValidationError
} from "@paybeehive/beehivehub-nodejs-sdk";

const beehive = BeehiveHub(process.env.BEEHIVE_SECRET_KEY!);

try {
  const transaction = await beehive.transactions.create({
    amount: 10000,
    paymentMethod: "pix",
    customer: {
      name: "João Silva",
      email: "joao@example.com",
      document: { type: "cpf", number: "12345678900" },
      phone: "11999999999"
    }
  });
  console.log("Transaction created:", transaction);
} catch (error) {
  if (error instanceof BeehiveHubAuthenticationError) {
    console.error("Invalid API key:", error.message);
  } else if (error instanceof BeehiveHubValidationError) {
    console.error("Validation error:", error.message);
  } else if (error instanceof BeehiveHubAPIError) {
    console.error("API error:", error.message);
  } else {
    console.error("Unexpected error:", error);
  }
}
```

## Values in Cents

All monetary values in the API are expressed in **cents**.

```typescript
// BRL 100.00 = 10000 cents
amount: 10000;

// BRL 1.50 = 150 cents
amount: 150;

// Convert reais to cents
const reais = 100.0;
const cents = Math.round(reais * 100); // 10000
```

## Security Best Practices

1. **Never expose your SECRET_KEY** - Use environment variables
2. **Don't generate card_hash on backend** - Use Beehive Hub's JavaScript library on frontend
3. **Validate user data** - Always validate and sanitize before sending to API
4. **Use HTTPS** - Always use secure connections
5. **Implement webhooks** - Receive status change notifications

```typescript
// .env
BEEHIVE_SECRET_KEY=your_secret_key_here

// app.ts
import BeehiveHub from "@paybeehive/beehivehub-nodejs-sdk";
import dotenv from "dotenv";

dotenv.config();

const beehive = BeehiveHub(process.env.BEEHIVE_SECRET_KEY!);
```

## Additional Documentation

- [Official API Documentation](https://paybeehive.readme.io/reference)
- [Integration Guide](https://paybeehive.readme.io/docs)
- [Card Tokenization](https://paybeehive.readme.io/reference#tokenizando-cartao)
- [Postback Format](https://paybeehive.readme.io/reference#formato-dos-postbacks)

## Testing

```bash
npm test
```

```bash
npm run test:coverage
```

## Support

For suggestions, bug reports, or questions:

- **Email:** contato@paybeehive.com.br
- **Documentation:** https://paybeehive.readme.io

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

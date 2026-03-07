// ============================================================================
// SHARED TYPES (camelCase)
// ============================================================================

export type IAddress = {
  street: string;
  streetNumber: string;
  complement?: string | null;
  neighborhood: string;
  zipCode: string;
  city: string;
  state: string;
  country: string;
};

export type IDocument = {
  type: "cpf" | "cnpj";
  number: string;
};

// ============================================================================
// TRANSACTION TYPES
// ============================================================================

export type TransactionStatus =
  | "processing"
  | "authorized"
  | "paid"
  | "refunded"
  | "waiting_payment"
  | "pending_refund"
  | "refused"
  | "chargedback"
  | "analyzing"
  | "pending_review"
  | "unknown";

export type TransactionPaymentMethod = "credit_card" | "debit_card" | "boleto" | "pix";

export type IItem = {
  externalRef?: string | null;
  title: string;
  unitPrice: number;
  quantity: number;
  tangible: boolean;
};

export type ISplit = {
  recipientId: number;
  amount: number;
  netAmount?: number;
  chargeProcessingFee?: boolean;
};

export type IRefund = {
  amount: number;
  trigger?: string;
  preChargeback?: boolean;
  preChargebackCents?: number;
  createdAt: string;
};

export type IFee = {
  fixedAmount: number;
  spreadPercentage: number;
  estimatedFee: number;
  netAmount: number;
};

export type IPix = {
  qrcode: string;
  expirationDate: string;
  end2EndId?: string | null;
  receiptUrl?: string | null;
};

export type IBoleto = {
  url: string;
  barcode: string;
  digitableLine?: string;
  expirationDate: string;
  instructions?: string | null;
};

export type IDelivery = {
  status: "waiting" | "in_transit" | "delivered";
  trackingCode?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ITransactionCustomer = {
  id: number;
  externalRef?: string | null;
  name: string;
  email: string;
  phone: string;
  birthdate?: string | null;
  createdAt: string;
  address?: IAddress;
  document: IDocument;
};

export type ITransaction = {
  id: number;
  amount: number;
  paidAmount: number;
  refundedAmount: number;
  companyId: number;
  installments: number;
  paymentMethod: TransactionPaymentMethod;
  status: TransactionStatus;
  postbackUrl?: string | null;
  metadata?: Record<string, unknown>;
  traceable: boolean;
  secureId: string;
  secureUrl: string;
  createdAt: string;
  updatedAt: string;
  paidAt?: string | null;
  ip?: string | null;
  externalRef?: string | null;
  authorizationCode?: string | null;
  basePrice?: number | null;
  interestRate?: number | null;
  origin?: string | null;
  subaccountId?: number | null;
  balanceManagedBy?: unknown | null;
  customer: ITransactionCustomer;
  fee: IFee;
  card?: unknown | null;
  boleto?: IBoleto | null;
  pix?: IPix | null;
  shipping?: { fee: number; address: IAddress } | null;
  refusedReason?: unknown | null;
  items: IItem[];
  splits: ISplit[];
  refunds: IRefund[];
  delivery?: IDelivery | null;
  payer?: unknown | null;
};

export type CreateTransactionData = {
  amount: number;
  paymentMethod: TransactionPaymentMethod;
  installments?: number;
  postbackUrl?: string;
  metadata?: Record<string, unknown>;
  customer: {
    name: string;
    email: string;
    document: IDocument;
    phone: string;
  };
  shipping?: {
    fee: number;
    address: IAddress;
  };
  items?: IItem[];
  splits?: Array<{ recipientId: number; amount: number; chargeProcessingFee?: boolean }>;
};

export type ListTransactionsParams = Record<string, string | number | undefined>;

export type CreateTransactionResponse = ITransaction;
export type GetTransactionResponse = ITransaction;
export type ListTransactionsResponse = ITransaction[];
export type RefundTransactionResponse = ITransaction;

export type UpdateDeliveryStatusData = {
  status: "waiting" | "in_transit" | "delivered";
  trackingCode?: string;
};

export type UpdateDeliveryStatusResponse = ITransaction;

// ============================================================================
// CUSTOMER TYPES
// ============================================================================

export type ICustomer = {
  id: number;
  externalRef?: string | null;
  name: string;
  email: string;
  phone: string;
  birthdate?: string | null;
  createdAt: string;
  address?: IAddress;
  document: IDocument;
  revenue?: {
    totalAmount: number;
    totalCount: number;
    cardAmount: number;
    cardCount: number;
    pixAmount: number;
    pixCount: number;
    boletoAmount: number;
    boletoCount: number;
    chargebackAmount: number;
    chargebackCount: number;
    refundAmount: number;
    refundCount: number;
    createdAt: string;
  };
};

export type CreateCustomerData = {
  name: string;
  email: string;
  document: IDocument;
  phone: string;
  address?: IAddress;
};

/** Parâmetros para listar clientes. O parâmetro `email` é obrigatório. */
export type ListCustomersParams = {
  email: string;
};

export type CreateCustomerResponse = ICustomer;
export type GetCustomerResponse = ICustomer;
export type ListCustomersResponse = ICustomer[];

// ============================================================================
// TRANSFER TYPES
// ============================================================================

export type TransferStatus = "pending" | "bank_processing" | "success" | "failed";

export type ITransfer = {
  id: number;
  companyId: number;
  recipientId: number;
  amount: number;
  fee: number;
  status: TransferStatus;
  type?: string;
  failReason?: string | null;
  postbackUrl?: string | null;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
  bankAccount?: IBankAccount | null;
  /** Campos adicionais retornados pela API */
  description?: string | null;
  pixKey?: string | null;
  checkPayer?: unknown | null;
  pixEnd2EndId?: string | null;
  receiptUrl?: string | null;
  transferredAt?: string | null;
  externalRef?: string | null;
  processedAt?: string | null;
  secureId?: string | null;
  attempts?: number;
  nextAttemptAt?: string | null;
  crypto?: unknown | null;
};

export type CreateTransferData = {
  amount: number;
  recipientId: number;
  bankAccount?: {
    bankCode: string;
    agencyNumber: string;
    accountNumber: string;
    accountDigit: string;
    type: "conta_corrente" | "conta_poupanca";
    legalName: string;
    documentNumber: string;
    documentType: "cpf" | "cnpj";
  };
};

export type CreateTransferResponse = ITransfer;
export type GetTransferResponse = ITransfer;

// ============================================================================
// BALANCE TYPES
// ============================================================================

export type IBalance = {
  amount: number;
  recipientId: number;
};

export type GetBalanceResponse = IBalance;

// ============================================================================
// RECIPIENT TYPES
// ============================================================================

export type IRecipient = {
  id: number;
  companyId: number;
  tenantId: number;
  legalName: string;
  createdAt: string;
  document: IDocument;
  transferSettings: {
    id: number;
    transferEnabled: boolean;
    automaticAnticipationEnabled: boolean;
    anticipatableVolumePercentage: number;
    createdAt: string;
  };
  balance?: {
    recipientId: number;
    companyId: number;
    tenantId: number;
    available: number;
    waitingFunds: number;
    transferred: number;
    lockedFunds: number;
    referralComissionWaitingFunds: number;
    updatedAt: string;
  };
};

export type CreateRecipientData = {
  legalName: string;
  document: IDocument;
  transferSettings: {
    transferEnabled: boolean;
    automaticAnticipationEnabled?: boolean;
    anticipatableVolumePercentage?: number;
  };
  bankAccount: {
    bankCode: string;
    agencyNumber: string;
    accountNumber: string;
    accountDigit: string;
    type: "conta_corrente" | "conta_poupanca";
    legalName: string;
    documentNumber: string;
    documentType: "cpf" | "cnpj";
  };
};

export type UpdateRecipientData = {
  legalName?: string;
};

export type CreateRecipientResponse = IRecipient;
export type GetRecipientResponse = IRecipient;
export type ListRecipientsResponse = IRecipient[];
export type UpdateRecipientResponse = IRecipient;

// ============================================================================
// BANK ACCOUNT TYPES
// ============================================================================

export type IBankAccount = {
  id: number;
  bankCode: string;
  agencyNumber: string;
  agencyDigit?: string | null;
  accountNumber: string;
  accountDigit: string;
  type: "conta_corrente" | "conta_poupanca";
  legalName: string;
  documentNumber: string;
  documentType: "cpf" | "cnpj";
  isActive: boolean;
  isVisible: boolean;
  createdAt: string;
};

export type CreateBankAccountData = {
  bankCode: string;
  agencyNumber: string;
  accountNumber: string;
  accountDigit: string;
  type: "conta_corrente" | "conta_poupanca";
  legalName: string;
  documentNumber: string;
  documentType: "cpf" | "cnpj";
};

export type CreateBankAccountResponse = IBankAccount;
export type ListBankAccountsResponse = IBankAccount[];

// ============================================================================
// COMPANY TYPES
// ============================================================================

export type ICompany = Record<string, unknown>;

export type UpdateCompanyData = {
  invoiceDescriptor?: string;
  details?: {
    averageRevenue?: number;
    averageTicket?: number;
    physicalProducts?: boolean;
    productsDescription?: string;
    siteUrl?: string;
    phone?: string;
    email?: string;
    intentionToSell?: boolean;
    intentionToUseReferral?: boolean;
  };
};

export type GetCompanyResponse = ICompany;
export type UpdateCompanyResponse = ICompany;

// ============================================================================
// PAYMENT LINK TYPES
// ============================================================================

export type IPaymentLink = {
  id: number;
  companyId: number;
  alias?: string | null;
  title?: string | null;
  amount: number;
  status?: string;
  createdAt: string;
  updatedAt?: string;
  settings?: Record<string, unknown>;
  /** URL montada pelo SDK (produção ou sandbox conforme ambiente). Presente quando `alias` existe. */
  url?: string;
};

/** Payload para criar link de pagamento. Alinhado com a API Beehive Hub. */
export type CreatePaymentLinkData = {
  /** Título do link (ex: "novo link") */
  title?: string;
  /** Valor em centavos */
  amount: number;
  /** Alias para URL curta (ex: "7oVnM7sUTE"). Se omitido, a API gera. A URL do link é: produção `link.conta.paybeehive.com.br/{alias}`, sandbox `link.sandbox.hopysplit.com.br/{alias}` */
  alias?: string;
  settings?: {
    defaultPaymentMethod?: "credit_card" | "pix" | "boleto";
    requestAddress?: boolean;
    requestPhone?: boolean;
    requestDocument?: boolean;
    traceable?: boolean;
    card?: { enabled?: boolean; freeInstallments?: number; maxInstallments?: number };
    /** pix/boleto: expiresInDays opcional (API usa 0 quando omitido); recomenda-se informar explicitamente */
    pix?: { enabled?: boolean; expiresInDays?: number };
    boleto?: { enabled?: boolean; expiresInDays?: number };
  };
};

export type CreatePaymentLinkResponse = IPaymentLink;
export type GetPaymentLinkResponse = IPaymentLink;
export type UpdatePaymentLinkData = Partial<CreatePaymentLinkData>;
export type UpdatePaymentLinkResponse = IPaymentLink;
export type ListPaymentLinksResponse = IPaymentLink[];

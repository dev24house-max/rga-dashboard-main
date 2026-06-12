export type ChatMessageMetadata = Record<string, unknown>;

export interface ChatWebhookResult {
  answer: string;
  metadata: ChatMessageMetadata;
  raw: unknown;
}

export const ACTIVE_CHAT_SESSION_STORAGE_KEY = "ai_assistant_active_session_id";
export const WIDGET_CHAT_SESSION_STORAGE_KEY = "widget_chat_session_id";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === "object" && !Array.isArray(value);

export const normalizeChatMetadata = (
  metadata: unknown
): ChatMessageMetadata => (isRecord(metadata) ? metadata : {});

const asText = (value: unknown): string => {
  if (typeof value === "string") return value;
  if (value == null) return "";
  return typeof value === "object" ? "" : String(value);
};

const parseJsonText = (text: string): unknown => {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

const firstPayload = (payload: unknown): unknown =>
  Array.isArray(payload) ? payload[0] : payload;

const extractFromRecord = (
  record: Record<string, unknown>
): ChatWebhookResult => {
  const directMetadata = normalizeChatMetadata(record.metadata);
  const dataMetadata = normalizeChatMetadata(
    isRecord(record.data) ? record.data.metadata : null
  );
  const metadata =
    Object.keys(directMetadata).length > 0 ? directMetadata : dataMetadata;

  const directAnswer =
    asText(record.answer) ||
    asText(record.message) ||
    asText(record.response) ||
    asText(record.reply) ||
    asText(record.output) ||
    asText(record.text) ||
    asText(record.content);

  if (directAnswer) {
    return { answer: directAnswer, metadata, raw: record };
  }

  const nestedCandidates = [
    record.data,
    record.output,
    record.response,
    record.reply,
    record.message,
  ];

  for (const candidate of nestedCandidates) {
    if (!candidate || candidate === record) continue;
    const nested = extractChatWebhookResult(candidate);
    if (nested.answer) {
      return {
        answer: nested.answer,
        metadata: Object.keys(metadata).length > 0 ? metadata : nested.metadata,
        raw: record,
      };
    }
  }

  return { answer: "", metadata, raw: record };
};

export const extractChatWebhookResult = (
  payload: unknown
): ChatWebhookResult => {
  const normalized = firstPayload(payload);

  if (typeof normalized === "string") {
    const parsed = parseJsonText(normalized);
    if (parsed !== normalized) {
      return extractChatWebhookResult(parsed);
    }
    return { answer: normalized, metadata: {}, raw: payload };
  }

  if (isRecord(normalized)) {
    return extractFromRecord(normalized);
  }

  return { answer: asText(normalized), metadata: {}, raw: payload };
};

export const parseChatWebhookResponse = async (
  response: Response
): Promise<ChatWebhookResult> => {
  const contentType = response.headers.get("content-type") || "";
  const rawText = await response.text();
  const payload =
    contentType.includes("application/json") && rawText.trim()
      ? parseJsonText(rawText)
      : rawText;

  if (!response.ok) {
    const result = extractChatWebhookResult(payload);
    throw new Error(result.answer || `HTTP ${response.status}`);
  }

  return extractChatWebhookResult(payload);
};

import ChatbotWidget from "./Chatbotwidget";

interface N8nChatWidgetProps {
  webhookUrl?: string;
  mode?: "window" | "fullscreen";
  initialMessages?: string[];
  title?: string;
  subtitle?: string;
  inputPlaceholder?: string;
}

export const N8nChatWidget = ({ webhookUrl }: N8nChatWidgetProps) => {
  return <ChatbotWidget webhookUrl={webhookUrl} />;
};

export default N8nChatWidget;

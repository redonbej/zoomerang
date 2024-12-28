import { ActionButtonsProps } from "@/lib/interfaces";
import SidePanelContent from "./sidePanelContent";
import SidePanelTitle from "./sidePanelTitle";

export default function SidePanel({ toggleSidePanel, setMessages, messages, onMessageSend }: ActionButtonsProps) {
  return (
    <aside className="p-6 w-full h-full rounded-md">
      <div className="w-full h-full flex flex-col justify-between">
        <SidePanelTitle toggleSidePanel={toggleSidePanel} title="In-call messages" />
        <SidePanelContent messages={messages} setMessages={setMessages} onMessageSend={onMessageSend}/>
      </div>
    </aside>
  );
}

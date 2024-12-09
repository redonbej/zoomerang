import SidePanelContent from "./sidePanelContent";
import SidePanelTitle from "./sidePanelTitle";

export default function SidePanel({ toggleSidePanel }: ActionButtonsProps) {
  return (
    <aside className="p-6 w-full h-full rounded-md">
      <div className="w-full h-full flex flex-col justify-between">
        <SidePanelTitle toggleSidePanel={toggleSidePanel} title="In-call messages" />
        <SidePanelContent />
      </div>
    </aside>
  );
}

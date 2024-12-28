"use client";

import { useState } from "react";
import SidePanel from "@/components/chat/sidePanel";
import ActionButtons from "@/components/chat/actionButtons";

export default function Home() {
  const [isSidePanelVisible, setIsSidePanelVisible] = useState(false);

  const toggleSidePanel = () => {
    setIsSidePanelVisible(!isSidePanelVisible);
  };

  return (
    <div className="flex">
      <div className="flex-1">
        <div className="w-full">
          text
        </div>
      </div>

    </div>
  );
}

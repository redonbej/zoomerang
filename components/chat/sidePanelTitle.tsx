import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { XIcon } from "lucide-react";

export default function SidePanelTitle({ toggleSidePanel, title }: SidePanelTitleProps) {
    return (
        <div className="flex justify-between items-center">
            <h1 className="text-lg text-gray-800">{title}</h1>
            <TooltipProvider delayDuration={0}>
                <Tooltip>
                    <TooltipTrigger>
                        <div onClick={toggleSidePanel} className="hover:bg-gray-100 active:bg-gray-200 p-2 rounded-full transition-colors">
                            <XIcon />
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <span>Close</span>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    )
}

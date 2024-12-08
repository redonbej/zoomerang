import { SendIcon } from "@/assets/svgs";
import { Textarea } from "../ui/textarea";
import { useRef, useState } from "react";
import SendButton from "./sendButton";

export default function SidePanelContent() {
    const [hasText, setHasText] = useState(false);
    const textareaRef = useRef(null);

    const handleInput = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
            setHasText(textarea.value.trim().length > 0);
        }
    };

    return (
        <div className="h-full flex flex-col justify-between">
            <div>SidePanelContent</div>
            <SendButton />
        </div>
    );
}

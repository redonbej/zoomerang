import { SendIcon } from "@/assets/svgs";
import { Textarea } from "../ui/textarea";
import { useRef, useState } from "react";

export default function SendButton() {
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
        <div className="flex rounded-3xl items-center border bg-gray-100">
            <Textarea
                className="my-1 border-none text-gray-800 text-sm shadow-none flex w-full focus-visible:!ring-0 focus-visible:!outline-0 focus-visible:!border-0 resize-none overflow-auto max-h-[120px]"
                placeholder="Send a message to everyone"
                ref={textareaRef}
                rows={1}
                onInput={handleInput}
            />
            <div className={`p-2 transition-colors ${hasText ? "cursor-pointer hover:bg-gray-200 active:bg-gray-300 rounded-full" : ""}`}>
                <SendIcon className={`size-7 ${hasText ? "text-blue-500" : "text-gray-300"}`} />
            </div>
        </div>
    )
}

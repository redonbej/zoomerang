import { SendIcon } from "@/assets/svgs";
import { Textarea } from "../ui/textarea";
import { useRef, useState, useEffect } from "react";
import SimpleBar from "simplebar-react";
import 'simplebar-react/dist/simplebar.min.css';

export default function SidePanelContent() {
    const [hasText, setHasText] = useState(false);
    const [messages, setMessages] = useState<string[]>([]);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const simpleBarRef = useRef<any>(null);

    const handleInput = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
            setHasText(textarea.value.trim().length > 0);
        }
    };

    const handleSendMessage = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            const message = textarea.value.trim();
            if (message) {
                setMessages((prevMessages) => [...prevMessages, message]);
                textarea.value = "";
                textarea.style.height = "auto";
                setHasText(false);
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    useEffect(() => {
        if (simpleBarRef.current) {
            const simpleBarContent = simpleBarRef.current.getScrollElement();
            simpleBarContent.scrollTop = simpleBarContent.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="h-full flex flex-col justify-between">
            <SimpleBar className="flex-1 my-4 px-2 h-[500px]" ref={simpleBarRef}>
                <div className="flex flex-col gap-2">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className="bg-blue-500 w-fit break-all whitespace-pre-wrap text-white px-2 py-1 rounded-md text-sm"
                        >
                            {msg}
                        </div>
                    ))}
                </div>
            </SimpleBar>

            <div className="flex rounded-3xl items-center border bg-gray-100">
                <Textarea
                    className="my-1 border-none text-gray-800 text-sm shadow-none flex w-full focus-visible:!ring-0 focus-visible:!outline-0 focus-visible:!border-0 resize-none overflow-auto max-h-[120px]"
                    placeholder="Send a message to everyone"
                    ref={textareaRef}
                    rows={1}
                    onInput={handleInput}
                    onKeyDown={handleKeyDown}
                />
                <div
                    className={`p-2 transition-colors rounded-full ${hasText
                        ? "cursor-pointer hover:bg-gray-200 active:bg-gray-300 "
                        : ""
                        }`}
                    onClick={handleSendMessage}
                >
                    <SendIcon
                        className={`size-7 ${hasText ? "text-blue-500" : "text-gray-300"
                            }`}
                    />
                </div>
            </div>
        </div>
    );
}

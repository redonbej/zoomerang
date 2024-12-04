import React from 'react';

interface ActionButtonsProps {
    toggleSideChat: () => void;
}

export default function ActionButtons({ toggleSideChat }: ActionButtonsProps) {
    return (
        <div className='flex justify-center'>
            <button
                onClick={toggleSideChat}
                className="p-2 bg-blue-500 text-white rounded-md m-4"
            >
                Toggle SideChat
            </button>
        </div>
    );
}

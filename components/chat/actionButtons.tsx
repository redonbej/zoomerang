import React from 'react';

export default function ActionButtons({ toggleSidePanel }: ActionButtonsProps) {
    return (
        <div className='flex justify-center'>
            <button
                onClick={toggleSidePanel}
                className="p-2 bg-blue-500 text-white rounded-md m-4"
            >
                Toggle SideChat
            </button>
        </div>
    );
}

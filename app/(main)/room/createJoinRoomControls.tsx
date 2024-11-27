'use client';

import {useState} from "react";
import {Button} from "@/components/ui/button";
import {Keyboard, Video} from "lucide-react";

export default function CreateJoinRoomControls() {

    const [focussed, setFocussed] = useState(false);
    const [joinDisabled, setJoinDisabled] = useState(false);

    const focusIn = () => {
        setFocussed(true);
    }

    const focusOut = () => {
        setFocussed(false);
    }

    const textChange = (text: string) => {
        console.log(text);
        if (!text?.trim()) {
            setJoinDisabled(true);
        } else {
            setJoinDisabled(false);
        }
    }

    return (
        <div className='flex items-center flex-wrap justify-center sm:justify-start pb-10 border-b border-gray-800'>

            <Button className='bg-blue-500 hover:bg-blue-600 text-xl h-14 py-3 sm:mb-0 mb-5'>
                <Video style={{width: '24px', height: '24px'}} className='mr-2.5'/>
                New Meeting
            </Button>

            <div className='mx-5 flex items-center'>
                <div
                    className={'flex items-center border-2 border-[#e3e3e3] text-xl h-14 py-3 px-4 rounded-md ' + (focussed ? 'border-blue-500' : '')}>
                    <Keyboard className='mr-2.5'/>
                    <input className='outline-0 sm:w-[180px] w-full' placeholder='Enter Room Code' onFocus={focusIn}
                           onBlur={focusOut} onChange={(e) => textChange(e.target.value)}/>
                </div>

                <Button className='text-xl enabled:text-blue-600 ml-5 h-14 py-3 hover:bg-blue-100' variant='ghost' disabled={joinDisabled}>
                    Join
                </Button>
            </div>


        </div>
    )

}
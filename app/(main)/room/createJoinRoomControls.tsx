'use client';

import {useState} from "react";
import {Button} from "@/components/ui/button";
import {Keyboard, Video} from "lucide-react";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import axios from "axios";

export default function CreateJoinRoomControls() {

    const [focussed, setFocussed] = useState(false);
    const [joinDisabled, setJoinDisabled] = useState(true);
    const [loading, setLoading] = useState('');
    const [text, setText] = useState("");

    const router = useRouter()

    const focusIn = () => {
        setFocussed(true);
    }

    const focusOut = () => {
        setFocussed(false);
    }

    const textChange = (text: string) => {
        setText(text);
        if (!text?.trim()) {
            setJoinDisabled(true);
        } else {
            setJoinDisabled(false);
        }
    }

    const onJoin = async () => {
        setLoading("Joining");

        try {
            const response = await axios.get(`/api/room`, { params: { code: text } });
            const body = response.data;

            if (!body.rooms?.length) {
                toast.error('Room does not exist');
            } else {
                router.push(`/room/${body.rooms[0].id}`);
            }
        } catch (error) {
            console.error("Error joining room:", error);
            toast.error('There was an error, please try again later');
        } finally {
            setLoading(null);
        }
    };

    const onCreate = async () => {
        setLoading("Creating room");

        try {
            const response = await axios.post(`/api/room`);
            const room = response.data;

            if(!room.id) {
                toast.error('Could not create room, please try again later');
            } else {
                router.push(`/room/${room.id}`);
            }
        } catch (error) {
            console.error("Error creating room:", error);
            toast.error('Could not create room, please try again later');
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className='flex items-center flex-wrap justify-center sm:justify-start pb-10 border-b border-gray-800'>

            <Button className='bg-blue-500 hover:bg-blue-600 text-xl h-14 py-3 sm:mb-0 mb-5' onClick={onCreate}>
                <Video style={{width: '24px', height: '24px'}} className='mr-2.5'/>
                New Meeting
            </Button>

            <div className='mx-5 flex items-center'>
                <div
                    className={'flex items-center border-2 border-[#e3e3e3] text-xl h-14 py-3 px-4 rounded-md ' + (focussed ? 'border-blue-500' : '')}>
                    <Keyboard className='text-gray-100 mr-2.5'/>
                    <input className='bg-transparent text-gray-100 placeholder:text-gray-100 outline-0 sm:w-[180px] w-full' placeholder='Enter Room Code' onFocus={focusIn}
                           onBlur={focusOut} onChange={(e) => textChange(e.target.value)}/>
                </div>

                <div className={`${joinDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                    <Button className='text-xl enabled:text-gray-100 text-gray-100 ml-5 h-14 py-3 bg-blue-500 hover:bg-blue-600' variant='ghost'
                            disabled={joinDisabled} onClick={onJoin}>
                        Join
                    </Button>
                </div>
            </div>

            {
                loading && <div className='fixed w-screen h-screen left-0 top-0 bg-black/50 flex items-center justify-center'>
                    <p className='text-white text-xl font-semibold'>{loading}</p>
                </div>
            }
            <div></div>

        </div>
    )

}
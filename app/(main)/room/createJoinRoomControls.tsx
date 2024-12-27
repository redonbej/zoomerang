'use client';

import {useState} from "react";
import {Button} from "@/components/ui/button";
import {Keyboard, Video} from "lucide-react";
import {toast} from "sonner";
import {useRouter} from "next/navigation";

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

    const onJoin = () => {
        setLoading('Joining');
        fetch(`api/room?code=${text}`).then(res => res.json()).then(body => {
            console.log(body);
            if (!body.rooms?.length) {
                toast.error('Room does not exist');
            } else {
                router.push(`/room/${body.rooms[0].id}`);
            }
            setLoading(null);
        }).catch(error => {
            toast.error('There was an error, please try again later');
            setLoading(null);
        });
    }

    const onCreate = () => {
        setLoading('Creating room');
        fetch(`api/room`, {
            method: 'POST',
        }).then(res => res.json()).then(room => {
            if(!room.id) {
                toast.error('Could not create room, polease try again later');
            } else {
                router.push(`/room/${room.id}`);
            }
            setLoading(null);
        }).catch(error => {
           setLoading(null);
           toast.error('Could not create room, polease try again later');
        });
    }

    return (
        <div className='flex items-center flex-wrap justify-center sm:justify-start pb-10 border-b border-gray-800'>

            <Button className='bg-blue-500 hover:bg-blue-600 text-xl h-14 py-3 sm:mb-0 mb-5' onClick={onCreate}>
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

                <Button className='text-xl enabled:text-blue-600 ml-5 h-14 py-3 hover:bg-blue-100' variant='ghost'
                        disabled={joinDisabled} onClick={onJoin}>
                    Join
                </Button>
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
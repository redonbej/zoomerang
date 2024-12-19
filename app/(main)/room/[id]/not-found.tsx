import {Button} from "@/components/ui/button";
import Link from "next/link";

export default async function RoomNotFound() {
    return (
        <div className='flex justify-center w-full h-full bg-white'>
            <div className='w-full sm:w-[400px] bg-white rounded-lg m-5 p-5 flex flex-col items-center'>
                <p className='text-center text-3xl mt-28'>Room Not Found</p>

                <Button className='mt-44'>
                    <Link href='/room'>Return to Home</Link>
                </Button>
            </div>
        </div>
    )
}
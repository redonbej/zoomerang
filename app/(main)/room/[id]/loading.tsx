import {LoadingSpinner} from "@/components/ui/spinner";

export default async function Loading() {
    return (
        <div className='w-full h-full flex items-center justify-center'>
            <div>
                <p className='text-center font-semibold'>Loading</p>
                <LoadingSpinner style={{width: '400px', height: '400px'}}>this is Loading</LoadingSpinner>
            </div>
        </div>
    )
}
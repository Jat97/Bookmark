import {CheckIcon} from '@heroicons/react/24/solid';

const SavePopup = () => {
    return (
        <div className='animate-bounce fixed bottom-[10px] left-[100px] flex justify-center items-center gap-x-5 
            border border-slate-200 shadow-sm shadow-slate-200 p-2 w-[300px] md:left-[450px]'>
            <span className='rounded-full bg-green-400 p-1 w-[30px]'>
                <CheckIcon className='h-5 fill-white md:h-6' />
            </span>

            <span className='font-semibold'> Successfully updated </span>
        </div>
    )
};

export default SavePopup;
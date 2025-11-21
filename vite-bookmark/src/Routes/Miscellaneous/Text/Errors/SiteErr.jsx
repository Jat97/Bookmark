import {ExclamationTriangleIcon} from '@heroicons/react/24/solid';

const SiteErr = (props) => {
    const error = props.props;

    return (
        <div className='animate-bounce text-sm flex justify-around items-center bg-white border-slate-200 shadow-sm 
            shadow-slate-200 p-2 max-w-1/2'>
            <ExclamationTriangleIcon className='h-6 fill-red-400' /> 
            
            {error} 
        </div>
    )
};

export default SiteErr;
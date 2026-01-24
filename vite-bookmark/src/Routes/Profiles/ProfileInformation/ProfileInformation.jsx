import dayjs from 'dayjs';

const ProfileInformation = ({profile, post_count, user_count}) => {
    return (
        <div className='flex flex-col items-start border border-slate-200 p-2 gap-3 w-[500px]'>
            <div className='grid grid-cols-2 items-center gap-3 w-full'>
                <p className='flex flex-col items-start'> 
                    <span className='font-semibold'> {profile?.date_of_birth ? 'Date of birth:' : 'Created:'} </span> 
                    {dayjs(profile?.date_of_birth ? profile?.date_of_birth : profile?.created).format('MMMM D, YYYY')} 
                </p>

                {profile?.moderator && <p className='flex flex-col items-start'> 
                    <span className='font-semibold'> Created by: </span> 
                    {`${moderator?.first_name} ${moderator?.last_name}`} 
                </p>
                }

                {profile?.alma_mater && 
                    <p className='flex flex-col items-start'> 
                        <span className='font-semibold'> Education: </span> 
                        {profile?.alma_mater} 
                        <span className='text-sm'> {profile?.degree} </span> 
                    </p>
                }

                <p className='flex flex-col items-start'> <span className='font-semibold'> Role: </span> {profile?.role} </p>

                <p className='flex flex-col items-start'> <span className='font-semibold'> Posts: </span> {post_count} </p>

                <p className='flex flex-col items-start'> 
                    <span className='font-semibold'> {profile.members ? 'Members:' : 'Friends:'} </span> 
                    {user_count}
                </p>
            </div>

            <p className='flex flex-col items-start'> 
                <span className='font-semibold'> About: </span> 
                {profile?.description} 
            </p>
        </div>
    )
}

export default ProfileInformation;
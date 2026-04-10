import dayjs from 'dayjs';

const ProfileInformation = ({profile}) => {
    return (
        <div className='flex justify-between p-2 gap-x-8 w-full md:flex-col md:items-start md:gap-3 md:border md:border-slate-200 
            md:shadow-sm md:shadow-slate-200'>
                <p className='flex flex-col items-start'> 
                    <span className='font-semibold'> {profile?.date_of_birth ? 'Date of birth:' : 'Created:'} </span> 
                    {dayjs(profile?.date_of_birth ? profile?.date_of_birth : profile?.created).format('MMMM D, YYYY')} 
                </p>

                {profile?.moderator && 
                    <p className='flex flex-col items-start'> 
                        <span className='font-semibold'> Created by: </span> 
                        {`${profile.moderator?.first_name} ${profile.moderator?.last_name}`} 
                    </p>
                }

                {profile?.alma_mater && 
                    <p className='flex flex-col items-start'> 
                        <span className='font-semibold'> Education: </span> 
                        <span> {profile?.alma_mater} </span>
                        <span className='text-sm'> {profile?.degree} </span> 
                    </p>
                }

                {profile.role &&
                    <p className='flex flex-col items-start'> 
                        <span className='font-semibold'> Role: </span> 
                        {profile?.role} 
                    </p>
                }
        </div>
    )
}

export default ProfileInformation;
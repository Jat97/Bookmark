import {useQuery} from '@tanstack/react-query';

export const useFetchGroups = ([authorized, setAuthorized, setSiteError]) => {
    const result = useQuery({
        queryKey: ['groups'],
        queryFn: async () => {
            return await fetch(`http://localhost:9000/api/groups`, {
                method: 'GET',
                credentials: 'include'
            })
            .then(res => {
                if(res.status === 401 || res.status === 500) {
                    setAuthorized(false);
                }
                else {
                    if(!authorized) {    
                        setAuthorized(true);
                    }
                }
                
                return res.json();
            })
            .catch(err => setSiteError(err))
        }
    });

    return result;
};
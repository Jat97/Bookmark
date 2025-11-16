import {useQuery} from '@tanstack/react-query';

export const useFetchChats = ([authorized, setAuthorized, setSiteError]) => {
    const result = useQuery({
        queryKey: ['chats'],
        queryFn: async () => {
            return await fetch('http://localhost:9000/api/chats', {
                method: 'GET',
                credentials: 'include'
            })
            .then(res => {
                if(res.status === 401) {
                    setAuthorized(false);
                }   
                else if(!res.ok) {
                    throw Error(`Error ${res.status}: ${res.statusText}`);
                }
                else {
                    if(!authorized) {
                        setAuthorized(true);
                    }

                    return res.json();
                }
            })
            .catch(err => setSiteError(err))
        }
    });

    return result;
};
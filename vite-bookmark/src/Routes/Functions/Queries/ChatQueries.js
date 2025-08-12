import {useQuery} from '@tanstack/react-query';

export const useFetchChats = ([authorized, setAuthorized, setSiteError]) => {
    const result = useQuery({
        queryKey: ['chats'],
        queryFn: () => {
            fetch('http://127.0.0.1:9000/api/chats', {
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

export const useFetchMessages = ([userid, authorized, setAuthorized, setSiteError]) => {
    const result = useQuery({
        queryKey: ['messages'], 
        queryFn: () => {
            fetch(`http://127.0.0.1:9000/api/chat/${userid}`, {
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
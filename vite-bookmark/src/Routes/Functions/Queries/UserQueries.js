import {useQuery} from '@tanstack/react-query';

export const useFetchLogged = ([authorized, setAuthorized, setSiteError]) => {
    const result = useQuery({
        queryKey: ['logged'],
        queryFn: async () => {
            return await fetch('http://localhost:9000/api/user', {
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

export const useFetchUsers = ([authorized, setAuthorized, setSiteError]) => {
    const result = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            return await fetch('http://localhost:9000/api/users', {
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
}

export const useFetchFriends = ([authorized, setAuthorized, setSiteError]) => {
    const result = useQuery({
        queryKey: ['friends'],
        queryFn: async () => {
            return await fetch('http://localhost:9000/api/friends', {
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

export const useFetchBlocked = ([authorized, setAuthorized, setSiteError]) => {
    const result = useQuery({
        queryKey: ['blocked'],
        queryFn: async () => {
            return await fetch('http://localhost:9000/api/blocked', {
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

export const useFetchAlerts = ([authorized, setAuthorized, setSiteError]) => {
    const result = useQuery({
        queryKey: ['alerts'],
        queryFn: async () => {
            return await fetch('http://localhost:9000/api/notifications', {
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
import {users} from './mock_users';

export const groups = [
    {
        id: 20,
        title: 'Russian Lit Circle',
        moderator: users[2],
        description: `We're just as depressed as the writers we love!`,
        group_image: 'RLC.jpg',
        private: false,
        members: [
            users[3],
            users[0]
        ],
        requests: []
    },
    {
        id: 21,
        title: 'Fans of Buraiha',
        moderator: users[0],
        description:  `We mostly just talk about Osamu Dazai.`,
        group_image: 'Buraiha.jpg',
        private: true,
        members: [
            users[4],
            users[1]
        ],
        requests: [
            users[3]
        ]
    },
    {
        id: 22,
        title: 'Library of Borges',
        moderator: users[4],
        description: 'A page to discuss the works of Jorge Luis Borges.',
        group_image: 'Borges.jpg',
        private: false,
        members: [
            users[0],
            users[2],
            users[3]
        ],
        requests: []
    }
];
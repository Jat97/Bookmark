import {users} from "./mock_users"

export const chats = [
    {
        chat: {
            id: 30,
            user: users[4]
        },
        messages: [
            {
                id: 40,
                text: 'Hey, how have you been?',
                image: null,
                sending_user: users[0],
                receiving_user: users[4],
                sent: Date.now(),
                checked: true
            },
            {
                id: 41,
                text: 'Fine. I got a new puppy last week.',
                image: 'NewDog.jpg',
                sending_user: users[4],
                receiving_user: users[0],
                sent: Date.now(),
                checked: true
            },
            {
                id: 42,
                text: `Aw! That's adorable! What's his name?`,
                image: null,
                sending_user: users[0],
                receiving_user: users[4],
                sent: Date.now(),
                checked: false
            }
        ]
    },
    {
        chat: {
            id: 31,
            user: users[2]
        },
        messages: [
            {
                id: 43,
                text: `I heard you like to collect old books. I have a textbook on physiology from the 19th-century. Want it?`,
                image: 'OldBook.jpg',
                sending_user: users[2],
                receiving_user: users[0],
                sent: Date.now(),
                checked: true
            },
            {
                id: 44,
                text: 'Sure! How much do I need to pay?',
                image: null,
                sending_user: users[0],
                receiving_user: users[2],
                sent: Date.now(),
                checked: false
            }
        ]
    },
    {
        chat: {
            id: 32,
            user: users[3]
        },
        messages: [
            {
                id: 45,
                text: 'Hey! You might not remember me, but we took a couple lit classes together in college! How have you been?',
                image: null,
                sending_user: users[0],
                receiving_user: users[3],
                sent: Date.now(),
                checked: false  
            }
        ]
    }
];
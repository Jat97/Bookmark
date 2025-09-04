import {users} from './mock_users';
import {groups} from './mock_group';
import {posts} from './mock_posts';

export const comments = [
    {
        id: 50,
        post: posts[0],
        commenting_user: users[2],
        text: `It's a very depressing novel, but it gives a decent glimpse at aristocratic life in post-War Japan.`,
        posted: Date.now(),
        likes: [
            {
                liking_user: users[4],
            },
            {
                liking_user: users[0],
            }
        ],
        replies: [
            {
                commenting_user: users[0],
                text: `How did you feel about Naoji as a character? 
                    He really embodies the decline of the Japanese aristocracy.`,
                posted: Date.now(),
                likes: [],
                replies: []
            }
        ]
    },
    {
        id: 51,
        post: posts[0],
        commenting_user: users[1],
        text: `I've been meaning to read this one for a while now!`,
        posted: Date.now(),
        likes: [],
        replies: []
    },
    {
        id: 52,
        post: posts[3],
        commenting_user: users[4],
        text: `I don't think the Hunger Games was really that good beyond the first novel. 
            Mockingjay in particular was a bore.`,
        posted: Date.now(),
        likes: [
            {
                liking_user: users[3],
            }
        ],
        replies: []
    },
    {
        id: 53,
        posts: posts[4],
        commenting_user: users[1],
        text: `Are you going to do any short story readings sometime soon? I'd love to talk about Romanesque sometime.`,
        posted: Date.now(),
        likes: [
            {
                liking_group: groups[1]
            }
        ],
        replies: [
            {
                commenting_group: groups[1],
                text: `Yeah, we're thinking of doing something like that next month!`,
                posted: Date.now(),
                likes: [],
                replies: []
            }
        ]
    }
];
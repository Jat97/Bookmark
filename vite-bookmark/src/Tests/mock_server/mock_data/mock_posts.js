import {users} from './mock_users';
import {groups} from './mock_groups';

export const posts  = [
    {
        id: 10,
        original_poster: users[0],
        text: `Is anyone familiar with Osamu Dazai? I just finished reading The Setting Sun, 
            and I'm in the mood to talk about it.`,
        posted: Date.now(),
        edited: null,
        original_group: null,
        shared_by: null,
        likes: []
    },
    {
        id: 11,
        original_poster: users[2],
        text: 'Anybody have any recommendations for Russian literature besides Dostoevsky?',
        posted: Date.now(),
        edited: null,
        original_group: null,
        shared_by: null,
        likes: []
    },
    {
        id: 12,
        original_poster: users[3], 
        text: `I think I'm going to need someone to explain Thus Spoke Zarathustra to me. Nietzsche's writing confuses me.`,
        posted: Date.now(),
        edited: null,
        original_group: null,
        shared_by: null,
        likes: [
            users[4],
            users[1]
        ]
    },
    {
        id: 13,
        original_poster: users[4],
        text: `You guys should comment your unpopular opinions about fiction. 
            I'll start: Harry Potter is terrible and adults who still talk about it are annoying.`,
        posted: Date.now(),
        edited: null,
        original_group: null,
        shared_by: users[1],
        likes: [
            users[0],
            users[2]
        ]
    },
    {
        id: 14,
        original_poster: null,
        text: `Next Thursday, we're going to start our group reading of Flowers of Buffoonery by Osamu Dazai!`,
        posted: Date.now(),
        edited: null,
        original_group: groups[1],
        shared_by: null,
        likes: []
    }
];
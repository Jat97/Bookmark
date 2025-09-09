export const users = [
    {
        id: 1,
        first_name: 'Fred',
        last_name: 'Smith',
        dob: '05/23/1986',
        profile_picture: 'FredSmith.jpg',
        online: true,
        hidden: true
    },
    {
        id: 2,
        first_name: 'Jerome',
        last_name: 'White',
        dob: '12/02/1994',
        profile_picture: 'JeromeWhite.jpg',
        online: true,
        hidden: false
    },
    {
        id: 3,
        first_name: 'Leonard',
        last_name: 'Graham',
        dob: '06/21/1963',
        profile_picture: 'LeonardGraham.jpg',
        online: false,
        hidden: false
    },
    {
        id: 4,
        first_name: 'Sarah',
        last_name: 'Flannigan',
        dob: '09/07/2001',
        profile_picture: 'SarahFlannigan.jpg',
        online: false,
        hidden: true
    },
    {
        id: 5,
        first_name: 'Claire',
        last_name: 'Johnson',
        dob: '04/14/1993',
        profile_picture: 'ClaireJohnson.jpg',
        online: true,
        hidden: false
    },
    {
        id: 6,
        first_name: 'Thomas',
        last_name: 'Dinkleberg',
        dob: '06/06/1966',
        profile_picture: 'ThomasDinkleberg.jpg',
        online: true,
        hidden: true
    },
    {
        id: 7,
        first_name: 'Eric',
        last_name: 'Goldberg',
        dob: '11/19/1987',
        profile_picture: 'EricGoldberg.jpg',
        online: true,
        hidden: false
    },
    {
        id: 8,
        first_name: 'Samantha',
        last_name: 'Jones',
        dob: '06/06/1998',
        profile_picture: 'SamanthaJones.jpg',
        online: true,
        hidden: false
    }
];

export const friends = [
    users[1],
    users[2],
    users[4]
];

export const blocked = [
    users[5]
];

export const alerts = {
    notifications: [
        {
            alerting_user: users[2],
            text: 'commented on your post',
            sent: Date.now()
        },
    ],
    requests: [
        users[5]
    ],
    pending: [
        users[3]
    ]
};
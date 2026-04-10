# Bookmark

## Overview

Bookmark is an app where users can discuss literature with others who share their interests. In addition to creating and participating in posts, users can add friends and chat with them. Users also have the option to participate in groups relating to specific interests within literature, or create their own if no such group exists.

## Table of Contents

+ [Authentication & Authorization](#authentication--authorization)
+ [Users](#users)
+ [Friends](#friends)
+ [Blocked](#blocked)
+ [Groups](#groups)
+ [Posts](#posts)
+ [Comments](#comments)
+ [Chats](#chats)

## Authentication and Authorization

Users who log in through their own accounts will be given a JSONWebToken named "usertoken," which gives users full access to the API.

If a user does not wish to create an account, or log in through an existing one, they will be given the option to log in as a guest. Guests will receive a guesttoken that grants limited access to the API.

## Error Codes

**401 Unauthorized** - Received if neither a usertoken nor a guesttoken can be found in the Cookie header.

**403 Forbidden** - Received if a user with a guesttoken is attempting to perform an action permitted only for users with a usertoken, such as liking a post or sending a message.

**500 Internal Server Error** - Received if there is an unexpected error when sending a request to the server.

## Users

Users are the accounts that have registered with Bookmark.

### User Methods

| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/users | GET | Retrieve all users |
| /api/user | GET | Retrieve your account information |
| /api/signup | POST | Create an account |
| /api/login | POST | Log into your existing account |
| /api/login/guest | POST | Log in without creating an account |
| /api/user | PUT | Edit your profile's information |
| /api/user/picture | PATCH | Edit your profile picture |
| /api/user/hidden | PATCH | Toggle your profile's visibility |
| /api/notifications | GET | Retrieve your notifications |
| /api/notifications | PATCH | Check your notifications |
| /api/logout | PATCH | Log out of your account |
| /api/user | DELETE | Delete your account |

#### GET /api/users

Users can view the accounts that have been registered with Bookmark.

**Parameters**

None

**Request example** 

> curl -X GET "http://api.bookmark.com/api/users" -H "Content-Type: application/json" -H "Cookie: usertoken=your_token"

**Response**

If the request is successful, then users will receive a 200 HTTP status code and an array containing the data for accounts registered to Bookmark.

    + If a user has been blocked by the logged-in user, or if the logged-in user has been blocked by another user, then those accounts will be omitted from the array.

        + Because there is a separate endpoint to retrieve data for the logged-in user, their account will be omitted from the array as well.

    + Because guests cannot block or be blocked by other users, they will receive the full list of accounts.

**Response Example**

    { 
        "users": [
            {
                "id": 1,
                "first_name": "Andrew",
                "last_name": "Taylor",
                "date_of_birth": "1959-05-15",
                "profile_picture": "null",
                "alma_mater": "ExampleUniversity",
                "degree": "Associate's",
                "role": "Reader",
                "online": true,
                "hidden": false
            },
            {
                "id": 2,
                "first_name": "Catherine",
                "last_name": "Bush",
                "date_of_birth": "1958-07-30",
                "profile_picture": "https://examplestorage.com/examplestring1/image/upload/examplestring2/image.jpg",
                "alma_mater": "Sample State College",
                "degree": "Bachelor's",
                "role": "Novelist",
                "online": false,
                "hidden": true
            },
            {
                "id": 5,
                "first_name": "David",
                "last_name": "Jones",
                "date_of_birth": "1947-08-01",
                "profile_picture": ""https://examplestorage.com/examplestring3/image/upload/examplestring4/profile.jpg",
                "alma_mater": null,
                "degree": null,
                "role": "Essayist",
                "online": true,
                "hidden": false
            },
            {
                "id": 6,
                "first_name": "Roderick",
                "last_name": "Stewart",
                "date_of_birth": "1945-01-10",
                "profile_picture": ""https://examplestorage.com/examplestring5/image/upload/examplestring6/picture.jpg",
                "alma_mater": "A Real University",
                "degree": "Master's",
                "role": "Critic",
                "online": false,
                "hidden": true 
            }
        ]
    }

#### GET /api/user

Users can view their own profile.

**Parameters** 

None

**Request Example**

> curl -X GET "http://api.bookmark.com/api/user" -H "Content-Type: application/json" -H "Cookie: usertoken=your_token"

**Response**

If the user has a usertoken, and the request is successful, then they will receive a 200 HTTP status code and an object containing data for their own account.

**Response Example**

    {
        "profile": {
            "id": 3,
            "first_name": "John",
            "last_name": "Johnson",
            "profile_picture": null,
            "date_of_birth": "1995-08-21",
            "alma_mater": null,
            "degree": null,
            "role": "Reader",
            "online": true,
            "hidden": true
        },
        "friends": [
            {
                "id": 1,
                "first_name": "Andrew",
                "last_name": "Taylor",
                "profile_picture": null
            },
            {
                "id": 2,
                "first_name": "Catherine",
                "last_name": "Bush",
                "profile_picture": "https://examplestorage.com/examplestring1/image/upload/examplestring2/image.jpg"
            }
        ],
        "blocked": [
            {
                "id": 4,
                "first_name": "Lewis",
                "last_name": "Reed",
                "profile_picture": null
            }
        ]
    }

#### POST /api/signup

Allows the user to create an account with Bookmark.

**Parameters**

None

**Request Body Example**

    {
        "email": "SampleEmail@example.com",
        "first_name": "Sample",
        "last_name": "User",
        "dob": "1995-20-06",
        "role": "Novelist",
        "password": "SamplePassword",
        "confirm": "SamplePassword"
    }
    
**Request Error Example**

> {user_err: This email is already in use.}

**Response**

If the request is successful, then the user will receive a 201 HTTP status code and a usertoken.

    + Because this endpoint does not redirect elsewhere after a succesful request, any redirects must be handled in the client.    

If the user submits an email address that is registered to another user, or if they submit two separate passwords, then they will receive a 400 HTTP status code and an accompanying error.

#### POST /api/login

Users can log into their accounts.

**Parameters**

None

**Request Body Example**

    {
        "user": "SampleEmail@example.com",
        "password": "Sampelpasswerd"
    }

**Request Error Example**

> {pass_err: The password is incorrect.}

**Response**

If the request is successful, then the user will receive a 200 HTTP status code and a usertoken.

    + Because this endpoint does not redirect elsewhere after a successful request, any redirects must be handled in the client.

If the user submits an email address that is not registered to an account, or if they submit an incorrect or empty password, then they will receive a 400 HTTP status code and an accompanying error.

#### POST /api/login/guest

Users who don't have their own accounts can log in as guests.

**Parameters**

None

**Request Example**

> curl -X POST "http://api.bookmark.com/api/login/guest" -H "Content-Type: application/json"

**Response**

If the request is successful, then the user will receive a 200 HTTP status code and a guesttoken. 

#### PUT /api/user

Users can update their profile information.

**Parameters**

None

**Request Body Example**

    {
        "first_name": "Johnny",
        "last_name": "Johnson",
        "alma_mater": "University of Demonstration",
        "degree": "Bachelor's",
        "role": "Reader"
    }

**Response**

If the user has a usertoken, and the request is successful, then they will receive a 200 HTTP status code and object containing the updated data for their account.

**Response Example**

{
    "profile": {
        "id": 3,
        "first_name": "Johnny",
        "last_name": "Johnson",
        "alma_mater": "University of Demonstration",
        "degree": "Bachelor's",
        "role": "Reader",
    }
}

#### PATCH /api/user/picture

Users can update their profile picture.

**Parameters**

None

**Request Example**

> curl -X PATCH "http://api.bookmark.com/api/user/picture" -H "Cookie: usertoken=your_token" -F "profilepicture=@/express-bookmark/public/profilepics""

    + The file uploaded to profilepics must be an image. 

        + Images with .jpg extensions will be accepted, though other extensions are untested. 

        + There are no file size restrictions.

**Response**

If the user has a usertoken, and the request is successful, then they will receive a 200 HTTP status code and, an object containing the data for their profile picture.

    + When uploading an image, the API will return a URL that will then be saved to the user's "profile_picture" property.

    + If the user makes a request without uploading an image, then they will receive a 200 HTTP status code without an accompanying object.

**Response Example**

    {
        "updated_user": {
            "id": 3,
            "first_name": "John",
            "last_name": "Johnson,
            "profile_picture": "https://examplestorage.com/examplestring9/image/upload/examplestring10/image.jpg"
        }
    }

#### PATCH /api/user/hidden

Users can toggle their online visibility.

**Parameters**

None

**Request Example**

> curl -X PATCH "http://api.bookmark.com/api/user/hidden" -H "Content-Type: application/json" -H "Cookie: usertoken=your_token"

**Response**

If the user has a usertoken, and the request is successful, then they will receive a 200 HTTP status code and an object containing their updated status.

    + Because this endpoint does not require a request body, the user's hidden status will update depending on its initial value. If the user's hidden status is set to true, then it will update to false, and vice versa.

**Response Example**

    {
        "updated_user": {
            "id": 3,
            "first_name": "John",
            "last_name": "Johnson",
            "hidden": true
        }
    }

#### GET /api/notifications

Users can retrieve all notifications, including post alerts and friend requests.

**Parameters**

None

**Request Example**

> curl -X GET "http://api.bookmark.com/api/notifications" -H "Content-Type: application/json" -H "Cookie: usertoken=your_token"

**Response**

If the user has a usertoken, and the request is successful, then they will receive both a 200 HTTP status code and arrays containing all notifications and requests attached to their account.

**Response Example**

{
    "notifications": [
        {
            "id": 10,
            "alerting_user": {
                "first_name": "Andrew",
                "last_name": "Taylor",
                "profile_picture": null
            },
            "post": {
                "id": 20,
                "text": "Has anyone ever read Demons? I think it's underappreciated compared to Dostoevsky's other works."
            },
            "text": "liked your post.",
            "sent": "2026-02-27",
            "checked": false 
        },
        {
            "id": 11,
            "alerting_user": {
                "id": 2,
                "first_name": "Catherine",
                "last_name": "Bush",
                "profile_picture": "https://examplestorage.com/examplestring1/image/upload/examplestring2/image.jpg"
            },
            "post": {
                "id": 23,
                "text": "Can anyone recommend one of Herman Hesse's novels? I remember loving Siddhartha in high school."
            }
            "text": "commented on your post: Steppenwolf is pretty beloved, if you haven't read that one yet.",
            "sent": "2026-03-05",
            "checked": false
        }
    ],
    "requests": [
        {
            "id": 6,
            "first_name": "Roderick",
            "last_name": "Stewart",
            "profile_picture": "https://examplestorage.com/examplestring5/image/upload/examplestring6/picture.jpg",
        }
    ],
    "pending": [
        {
            "id": 5,
            "first_name": "David",
            "last_name": "Jones",
            "profile_picture": "https://examplestorage.com/examplestring3/image/upload/examplestring4/profile.jpg",
        }
    ]
}

#### PATCH /api/notifications

Users can check unread notifications.

**Parameters**

None

**Request Example**

> curl -X PATCH "http://api.bookmark.com/api/notifications" -H "Content-Type: application/json" -H "Cookie: usertoken=your_token" 

**Response**

If the user has a usertoken, and the request is successful, then they will receive a 200 HTTP status code.

    + Because this endpoint does not require a request body, notifications will be updated based on the value of their "checked" property. If the "checked" value is set to false, then it will be updated to true.

        + If all notifications have already been checked, then no changes will be made.

#### PATCH /api/logout

Users and guests can end their current session.

**Parameters**

None

**Request Example**

> curl -X PATCH "http://api.bookmark.com/api/logout" -H "Content-Type: application/json" -H "Cookie: usertoken=your_token"

**Response** 

Users and guests will have their tokens removed, and they will receive a 200 HTTP status code.
    
    + Because this endpoint does not redirect elsewhere after a successful request, any redirects must be handled in the client.

#### DELETE /api/user

Users can delete their accounts.

**Parameters**

None

**Request Example**

> curl -X DELETE "http://api.bookmark.com/api/user" -H "Content-Type: application/json" -H "Cookie: usertoken=your_token"

**Response**

If the user has a usertoken, and the request is successful, then they will receive a 200 HTTP status code in addition to their token being removed.

    + Chats, messages, posts, comments, and groups created by the user will be deleted, as well as notifications received by the user.

    + Because this endpoint does not redirect elsewhere after a successful request, any redirects must be handled in the client.

## Friends

Users can send friend requests to other users, as well as accept or reject requests from others.

### Friend Methods

| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/user/{userid}/request | POST | Send a friend request |
| /api/user/{userid}/accept | POST | Accept another user's friend request |
| /api/user/{userid}/reject | DELETE | Reject another user's friend request |
| /api/user/{userid}/unfriend | DELETE | Remove a user from your friendslist |

#### POST /api/user/{userid}/request

Users can send friend requests to other users.

**Parameters**

    userid (path parameter): An integer representing the id of the user who will receive the friend request.

**Request Example**

> curl -X POST "http://api.bookmark.com/api/user/6/request" -H "Content-Type: application/json" -H "Cookie: usertoken=your_token"

**Response**

If the user has a usertoken, and the request is successful, then they will receive a 200 HTTP status code and an object containing both their id and the id of the user who received the request.

**Response Example**

    {
        "friend_request": {
            "id": 30,
            "requesting_user": 3,
            "requested_user": 6
        }
    }

#### POST /api/user/{userid}/accept

Users can accept friend requests from other users.

**Parameters**

    userid (path parameter): An integer representing the id of the selected user.

**Request Example**

> curl -X POST "http://api.bookmark.com/api/5/accept" -H "Content-Type: application/json" -H "Cookie: usertoken=your_token"

**Response**

If the user has a usertoken, and the request is successful, then they will receive a 201 HTTP status code and an object containing both their id and the id of the befriended user.

**Response Example**

    {
        "friend": {
            "id": 40,
            "friend_1": 3,
            "friend_2": 5 
        }
    }

#### DELETE /api/user/{userid}/reject

Users can reject requests from other users.

**Parameters**

    userid (path parameter): An integer representing the id of the selected user.

**Request Example**

> curl -X DELETE "http://api.bookmark.com/api/5/reject" -H "Content-Type: application/json" -H "Cookie: usertoken=your_token"

**Response**

If the user has a usertoken, and the request is successful, then they will receive a 200 HTTP status code.

#### DELETE /api/user/{userid}/unfriend

Users can remove users from their friendslist.

**Parameters**

    userid (path parameter): An integer representing the id of the selected user.

**Request Example**

> curl -X DELETE "http://api.bookmark.com/api/1/unfriend" -H "Content-Type: application/json" -H "Cookie: usertoken=your_token"

**Response**

If the user has a usertoken, and the request is successful, then they will receive a 200 HTTP status code.

    + Because the API creates separate friend objects for each user, the other user's friend object will also be deleted.

## Blocked

In addition to adding friends, users can block other users. When a user is blocked, both users will have their accounts and posts hidden from the other.

### Blocked Methods

| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/user/{userid}/block | POST | Block another user |
| /api/user/{userid}/unblock | DELETE | Unblock a user |

#### POST /api/user/{userid}/block

Users can add other users to their list of blocked users.

**Parameters**

    userid (path parameter): An integer representing the id of the blocked user.

**Request Example**

> curl -X POST "http://api.bookmark.com/api/4/block" -H "Content-Type: application/json" -H "Cookie: usertoken=your_token"

**Response**

If the user has a usertoken, and the request is successful, then they will receive a 201 HTTP status code and an object containing both their id and the id of the blocked user.

**Response Example**

    {
        "block": {
            "id": 50,
            "blocked_user": 4,
            "blocked_by": 3  
        }
    }

#### DELETE /api/user/{userid}/unblock

Users can remove another user from their blocked list.

**Parameters**

    userid (path parameter): An integer representing the id of the selected user.

**Request Example**

> curl -X DELETE "http://api.bookmark.com/api/4/unblock" -H "Content-Type: application/json" -H "Cookie: usertoken=your_token"

**Response**

If the user has a usertoken, and the request is successful, then they will receive a 200 HTTP status code.

## Groups

Groups are profiles that have been created by users for a specific purpose, like discussing an author or literary genre.

### Group Methods

| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/groups | GET | Retrieve all groups | 
| /api/group | POST | Create a group |
| /api/group/{groupid} | PUT | Edit your group's information |
| /api/group/{groupid}/private | PATCH | Toggle group privacy |
| /api/group/{groupid}/request | POST | Request to join a group |
| /api/group/{groupid}/{userid}/accept | POST | Accept a user's request to join |
| /api/group/{groupid}/{userid}/reject | DELETE | Deny a user's request to join |
| /api/group/{groupid}/leave | DELETE | Leave a group |
| /api/group/{groupid}/{userid}/ban | POST | Ban a user from your group |
| /api/group/{groupid}/{userid}/unban | DELETE | Unban a user from your group |
| /api/group/{groupid} | DELETE | Delete your group |

#### GET /api/groups

Users can view the groups created on Bookmark.

**Parameters**

None

**Request Example**

> curl -X GET "http://api.bookmark.com/api/groups" -H "Content-Type: application/json" -H "Cookie: usertoken=your_token"

**Response**

If the request is successful, then the user will receive a 200 HTTP status code and an array containing all groups created on Bookmark, as well as their members.

    + The data received will be same for both users and guests.

    + Users who are also moderators of their own groups will receive two additional arrays containing data for group requests and users that they have banned.

**Response Example**

{
    "groups": [
        {
            "id": 60,
            "title": "Dostoevsky Fan Club",
            "description": "We're a group dedicated to Dostoevsky. We primarily discuss his works, but we'll sometimes talk about the author himself.",
            "group_image": "https://examplestorage.com/examplestring7/image/upload/examplestring8/fyodr.jpg",
            "moderator": {
                "id": 3,
                "first_name": "John",
                "last_name": "Johnson",
                "profile_picture": null 
            },
            "private": false,
            "created": "2026-03-10",
            "members": [
                {
                    "id": 2,
                    "first_name": "Catherine",
                    "last_name": "Bush",
                    "profile_picture": "https://examplestorage.com/examplestring1/image/upload/examplestring2/image.jpg"
                },
                {
                    "id": 5,
                    "first_name": "David",
                    "last_name": "Jones",
                    "profile_picture": "https://examplestorage.com/examplestring3/image/upload/examplestring4/image.jpg"
                }
            ],
            "banned_users": [
                {
                    "id": 4,
                    "first_name": "Lewis",
                    "last_name": "Reed",
                    "profile_picture": null
                }
            ],
            "requests": [
                {
                    "id": 1,
                    "first_name": "Andrew",
                    "last_name": "Taylor",
                    "profile_picture": null
                }
            ]
        },
        {
            "id": 61,
            "title": "Let's Talk Victorian",
            "description": "The place for Victorian enthusiasts. From Tennyson to Wilde, we cover all the writers active during Victoria's reign. Every day, we discuss poetry, and every Tuesday, we host group reading sessions. Come and join us!",
            "group_image": null,
            "moderator": {
                "id": 2,
                "first_name": "Catherine",
                "last_name": "Bush",
                "profile_picture": "https://examplestorage.com/examplestring1/image/upload/examplestring2/image.jpg"
            },
            "private": true,
            "created": "2026-03-12",
            "members": [
                {
                    "id": 1,
                    "first_name": "Andrew",
                    "last_name": "Taylor",
                    "profile_picture": null
                },
                {
                    "id": 5,
                    "first_name": "David",
                    "last_name": "Jones",
                    "profile_picture": "https://examplestorage.com/examplestring3/image/upload/examplestring4/image.jpg"
                }
            ]
        }
    ]
}

#### POST /api/group

Users can create their own groups.

**Parameters**

None

**Request Body Example**

    {    
        "title": "Japanese Literature Circle",
        "description": "We discuss Japanese literature and its impacts on both Japanese culture and the broader literary world.",
        "private": true    
    }

**Request Error Example**

> {group_err: A group by this name already exists.}

**Response**

If the user has a usertoken, and the request is successful, then the user will receive both a 201 HTTP status code and an object containing data for their new group.

    + Because this endpoint doesn't redirect to the new group's URL after a successful request, the redirect must be handled in the client.

If the user enters a name that belongs to another group, then they will receive a 400 HTTP status code and an accompanying error.

**Response Example**

    {
        "group": {
            "id": 62,
            "title": "Japanese Literature Circle",
            "description": "We discuss Japanese literature and its impacts on both Japanese culture and the broader literary world.",
            "moderator": 3,
            "group_image": null,
            "private": true,
            "created": "2026-03-17",
        }
    }

#### PUT /api/group/{groupid}

Users can edit the information for their group.

**Parameters**

    groupid (path parameter): An integer representing the id of the group to be updated.

**Request Example**

> curl -X PUT "http://api.bookmark.com/api/group/62" -H "Cookie: usertoken=your_token" -F "groupimage=@/express-bookmark/public/groupimages" -F "title=Japanese Literary Circle" -F "description=We discuss Japanese literature and its impacts on both Japanese culture and the broader literary world. -F "private=true"

    + The file uploaded to groupimages must be an image.

        + The server accepts .jpg extensions, though other extensions are untested.

        + There are no file size restrictions.

**Request Error Example**

> {group_err: A group by this name already exists.}

**Response**

If the user has a usertoken, and the request is successful, then they will receive a 200 HTTP status code and an object containing the updated group data.

    + If a file is uploaded to the server, then the API will return a URL that will then be saved to the group's "group_image" property.

If the user submits a name that belongs to another group, then they will receive a 400 HTTP status code and an accompanying error.

**Response Example**

    {
        "updated_group": {
            "id": 62,
            "title": "Japanese Literary Circle",
            "description": "We discuss Japanese literature and its impacts on both Japanese culture and the broader literary world. You may discuss authors outside of Japan, but only if it's to show how Japanese literature influenced them.",
            "group_image": "https://examplestorage.com/examplestring15/image/upload/examplestring16/image.jpg"
            "private": false
        }
    }

#### PATCH /api/group/{groupid}/private

Users who moderate their own groups can hide them from other users.

**Parameters**

    groupid (path parameter): An integer representing the id of the selected group.

**Request Example**

> curl -X PATCH "http://api.bookmark.com/api/60/private" -H "Content-Type: application/json" -H "Cookie: usertoken=your_token"

**Response**

If the user has a usertoken, and the request is successful, then they will receive a 200 HTTP status code and an object containing the updated privacy status.

    + Because this endpoint does not require a request body, the privacy status of the group will update based on its initial value. If "private" was set to true, then it will be updated to false, and vice versa.

**Response Example**

    {
        "updated_group": {
            "id": 62,
            "title": "Japanese Literary Circle",
            "private": true 
        }
    }

#### POST /api/group/{groupid}/request

Users can request to join groups.

**Parameters**

    groupid (path parameter): An integer representing the id of the selected group.

**Request Example**

> curl -X POST "http://api.bookmark.com/api/group/61/request" -H "Content-Type: application/json" -H "Cookie: usertoken=your_token"

**Response**

If the user has a usertoken, and the request is successful, then they will receive a 201 HTTP status code and an object containing the ids of both the user and the group they wish to join.

**Response Example**

    {
        "request": {
            "id": 70,
            "requesting_user": 1,
            "requesting_group": 61 
        }
    }

#### POST /api/group/{groupid}/{userid}/accept

Users who moderate their own groups can accept requests from other users.

**Parameters**

    groupid (path parameters): An integer representing the id of the group that is accepting the request.

    userid (path parameters): An integer representing the id of the accepted user.

**Request Example**

> curl -X POST "http://api.bookmark.com/api/60/5/accept" -H "Content-Type: application/json" -H "Cookie: usertoken=your_token"

**Response**

If the user has a usertoken, and the request is successful, then they will receive a 201 HTTP status code and an object containing both the id of the accepted user and the id of the group.

**Response Example**

    {
        "member": {
            "id": 80,
            "member": 1,
            "member_of": 60  
        }
    }

#### DELETE /api/group/{groupid}/{userid}/reject

Users who moderate their own groups can reject requests from other users.

**Parameters**

    groupid (path parameter): An integer representing the id of the group that is rejecting the request.

    userid (path parameter): An integer representing the id of the rejected user.

**Request Example**

> curl -X DELETE "http://api.bookmark.com/api/60/5/reject" -H "Content-Type: application/json" -H "Cookie: usertoken=your_token"

**Response**

If the user has a usertoken, and the request is successful, then they will receive a 200 HTTP status code.

#### DELETE /api/group/{groupid}/leave

Users can leave groups that they've joined.

**Parameters**

    groupid (path parameter): An integer that represents the id of the group the logged-in user is leaving.

**Request Example**

> curl -X DELETE "http://api.bookmark.com/api/61/leave" -H "Content-Type: application/json" -H "Cookie: usertoken=your_token"

**Response**

If the user has a usertoken, and the request is successful, then the user will receive a 200 HTTP status code.

#### POST /api/group/{groupid}/{userid}/ban

Group moderators can ban users from their groups.

**Parameters**

    groupid (path parameter): An integer representing the id of the selected group.

    userid (path parameter): An integer representing the id of the user to be banned.

**Request Example**

> curl -X POST "http://api.bookmark.com/api/60/1/ban" -H "Content-Type: application/json" -H "Cookie: usertoken=your_token"

**Response**

If the user has a usertoken, and the request is successful, then they will receive a 201 HTTP status code and an object containing the ids of the banned user and the group that banned them.

    + If the banned user was a member of the group that banned them, then they will be removed as a member as well.

**Response Example**

{
    "ban": {
        "id": 90,
        "banned_user": 5,
        "banning_group": 60
    }
}

#### DELETE /api/group/{groupid}/{userid}/unban

Moderators can revoke bans that other users have received.

**Parameters**

    groupid (path parameter): An integer representing the id of the group that is revoking the ban.

    userid (path parameter): An integer representing the id of the user whose ban is being revoked.

**Request Example**

> curl -X DELETE "http://api.bookmark.com/api/60/5/unban" -H "Content-Type: application/json" -H "Cookie: usertoken=your_token"

**Response**

If the user has a usertoken, then they will receive a 200 HTTP status code.

#### DELETE /api/group/{groupid}

Users can delete the groups they've created.

**Parameters**

    groupid (path parameters): An integer representing the id of the group to be deleted.

**Request Example**

> curl -X DELETE "http://api.bookmark.com/api/group/60" -H "Content-Type: application/json" -H "Cookie: usertoken=your_token"

**Response**

If the user has a usertoken, and the request is successful, then they will receive a 200 HTTP status code.

    + In addition, all posts, comments, requests, notifications, and memberships associated with the group will be deleted.

    + Because this endpoint does not redirect elsewhere after a successful request, redirects must be handled in the client. 

## Posts

### Post Methods

| Endpoints | Method | Description |
|-----------|--------|-------------|
| /api/posts | GET | Retrieve posts from you and your friends |
| /api/post | POST | Create a post |
| /api/post/{postid} | PUT | Edit your post |
| /api/post/{postid}/like | POST | Like a post |
| /api/post/{postid}/unlike | DELETE | Unlike a post |
| /api/post/{postid}/share | POST | Share another user's post |
| /api/post/{postid} | DELETE | Delete a post | 

#### GET /api/posts

Users can retrieve and view posts.

**Parameters**

None

**Request Example**

> curl -X GET "http://api.bookmark.com/api/posts" -H "Content-Type: application/json" -H "Cookie: usertoken=your_token"

**Response**

If the user has a usertoken, then they will receive an array containing data for posts created by them, users in their friendslist, and groups that they have joined.

If the user has a guesttoken, then they will receive an array containing all posts made by users on Bookmark.

Regardless of which token the user has, if the request is successful, then they will receive a 200 HTTP status code.

**Response Example**

    {
        "posts": [
            {
                "id": 20,
                "original_poster": {
                    "id": 3,
                    "first_name": "John",
                    "last_name": "Johnson",
                    "profile_picture": null
                }
                "text": "Has anyone ever read Demons? I think it's underappreciated compared to Dostoevsky's other works.",
                "posted": "2026-02-27",
                "shared_by": null,
                "edited": null,
                "original_group": null,
                "likes": [
                    {
                        "id": 1,
                        "first_name": "Andrew",
                        "last_name": "Taylor",
                        "profile_picture": null
                    }
                ]
            },
            {
                "id": 21,
                "original_poster": null,
                "text": "Next Tuesday, we're going to begin our group reading of Kokoro by Natsume Souseki! If you want to participate, be sure to have read the first three chapters by then!",
                "posted": "2026-03-02",
                "shared_by": null,
                "edited": null,
                "original_group": {
                    "id": 62,
                    "title": "Japanese Literary Circle",
                    "group_image": null
                },
                "likes": []
            },
            {
                "id": 22,
                "original_poster": {
                    "id": 3,
                    "first_name": "John",
                    "last_name": "Johnson",
                    "profile_picture": null
                },
                "text": "Can anyone recommend one of Herman Hesse's novels? I remember loving Siddhartha in high school.",
                "posted": "2026-03-05",
                "shared_by": null,
                "edited": null,
                "original_group": null,
                "likes": []
            },
            {
                "id": 23,
                "original_poster": {
                    "id": 2,
                    "first_name": "Catherine",
                    "last_name": "Bush",
                    "profile_picture": "https://examplestorage.com/examplestring1/image/upload/examplestring2/image.jpg"
                },
                "text": "I'm about to read Wuthering Heights for the millionth time. Everyone hates it, but I think it's a fascinating novel.",
                "posted": "2026-03-06",
                "shared_by": null,
                "edited": null,
                "original_group": null,
                "likes": []
            }
        ]
    }

#### POST /api/post

Users can create their own posts.

**Parameters**

None

**Request Body Example**

    {
        "text": "You know what's really funny? How Matthew Lewis realized that he barely had any plot for The Monk, so he had to develop a barely-relevant B-plot just so he could write an entire act around it.",
        groupid: null
    }

        + groupid will only have a value if the user is posting on behalf of a group. Otherwise, it is always null.

**Response**

If the user has a usertoken, and the request is successful, then they will receive a 201 HTTP status code and an object containing data for the new post.

**Response Example**

    {
        "post": {
            "id": 24,
            "original_poster": 3,
            "original_group": null,
            "text": "You know what's really funny? How Matthew Lewis realized that he barely had any plot for The Monk, so he had to develop a barely-relevant B-plot just so he could write an entire act around it.",
            "shared": null,
            "posted": "2026-03-15",
            "edited": null
        }
    }

#### PUT /api/post/{postid}

Users can edit their posts.

**Parameters**

    postid (path parameter): An integer representing the id of the edited post.

**Request Body Example**

    {
       "text": "You know what's really funny? How Matthew Lewis realized that he barely had any plot for The Monk, so he had to develop a barely-relevant B-plot and write an entire act around it. For as long as it drags on, the ending is kind of hilarious, at least."
    }

**Response**

If the user has a usertoken, and the request is successful, then the user will receive both a 200 HTTP status code and an object containing the updated post information.

**Response Example**

    {
        "post": {
            "id": 24,
            "original_poster": 3,
            "text": "You know what's really funny? How Matthew Lewis realized that he barely had any plot for The Monk, so he had to develop a barely-relevant B-plot and write an entire act around it. For as long as it drags on, the ending is kind of hilarious, at least.",
            "posted": "2026-03-15",
            "shared_by": null,
            "edited": "2026-03-16",
            "original_group": null
        }
    }

#### POST /api/post/{postid}/like

Users have the ability to like posts.

**Parameters**

    postid (path parameter): An integer representing the id of the liked post.

**Request Example**

> curl -X POST "http://api.bookmark.com/api/post/21/like" -H "Content-Type: application/json" -H "Cookie: usertoken=your_token"

**Response**

If the user has a usertoken, and the request is successful, then they will receive both a 201 HTTP status code and an object containing the updated post data. 

    + If the liked post was not made by the user, then a notification will be sent to the original poster. 

**Response Example**

    {
        "like": {
            "id": 110,
            "liking_user": 3,
            "liked_post": 21
        }
    }

#### DELETE /api/post/{postid}/unlike

Users can undo likes they've made on another user's posts.

**Parameters**

    postid (path parameter): An integer representing the id of the selected post.

**Request Example**

> curl -X DELETE "http://api.bookmark.com/api/post/21/unlike" -H "Content-Type: application/json" -H "Cookie: usertoken=your_token"

**Response**

If the user has a usertoken, and the request is successful, then they will receive a 200 HTTP status code.

    + In addition, if a notification was sent when the post was liked, then it will be deleted alongside the like.

#### POST /api/post/{postid}/share

Users can share posts from other users.

**Parameter**

    postid (path parameter): An integer representing the id of the shared post.

**Request Example**

> curl -X POST "http://api.bookmark.com/api/21/share" -H "Content-Type: application/json" -H "Cookie: usertoken=your_token"

**Response**

If the user has a usertoken, then they will receive a 201 HTTP status code and an object containing data for the post that was shared.

    + Because the API treats shared posts as separate from original posts, the returned object will be a newly-created post.

**Response Example**

    {
        "post": {
            "id": 25,
            "original_poster": null,
            "text": "Next Tuesday, we're going to begin our group reading of Kokoro by Natsume Souseki! If you want to participate, be sure to have read the first three chapters by then!",
            "posted": "2026-03-02",
            "shared_by": 3
            "edited": null,
            "original_group": 62,
            "likes": []
        }
    }

#### DELETE /api/post/{postid}

Users can delete the posts they've created.

**Parameters**

    postid (path parameter): An integer representing the id of the post to be deleted.

**Request Example**

> curl -X DELETE "http://api.bookmark.com/api/post/20" -H "Content-Type: application/json" -H "Cookie: usertoken=your_token"

**Response**

If the user has a usertoken, and the request is successful, then they will receive a 200 HTTP status code.

    + In addition, all comments and likes associated with the post will be deleted.

    + Because this endpoint does not redirect elsewhere after a successful request, any redirects must be handled in the client.

## Comments

Users can comment on another user's post or comment. Comments can be liked, though they cannot be shared.

### Comment Methods

| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/post/{postid}/comments | GET | Retrieve the comments to a post |
| /api/post/{postid}/comment | POST | Comment on a post |
| /api/comment/{commentid} | PUT | Edit your comment |
| /api/comment/{commentid}/like | POST | Like a comment |
| /api/comment/{commentid}/unlike | DELETE | Unlike a comment |
| /api/comment/{commentid} | DELETE | Delete a comment |

#### GET /api/post/{postid}/comments

View the comments for a post.

**Parameters**

    postid (path parameter): An integer representing the id of the post being viewed.

**Request Example**

> curl -X GET "http://api.bookmark.com/api/23/comments" -H "Content-Type: application/json" -H "Cookie: usertoken=your_token"

**Response**

If the user has a usertoken, then they will receive the comments posted by users who have not blocked or been blocked by them.

Because guests cannot block or be blocked by other users, they will receive every comment associated with the post.

**Response Example**

{
    "comments": [
        {
            "id": 100,
            "commenting_user": {
                "id": 2,
                "first_name": "Catherine",
                "last_name": "Bush",
                "profile_picture": "https://examplestorage.com/examplestring1/image/upload/examplestring2/image.jpg"
            },
            "commenting_group": null,
            "text": "Steppenwolf is pretty beloved, if you haven't read that one yet.",
            "posted": "2026-03-04",
            "reply_to": null,
            "edited": null,
            "likes": [],
            "replies": []
        },
        {
            "id": 101,
            "commenting_user": {
                "id": 1,
                "first_name": "Andrew",
                "last_name": "Taylor",
                "profile_picture": null
            },
            "commenting_group": null,
            "text": "I'm not sure if I've ever read Siddhartha. Does it have anything to do with Siddhartha Gautama?",
            "posted": "2026-03-05",
            "edited": null,
            "likes": [],
            "replies": []
        }
    ]
}

#### POST /api/post/{postid}/comment

Users can comment on posts or other comments.

**Parameters**

    postid (path parameter): An integer representing the id of the post or comment that will receive the reply.

**Request Body Example**

    {
        "text": "I think a lot of people hate it because it's one of those novels where nothing really happens, but that's true of a lot of works from that era as well."
    }

**Response**

If the user has a usertoken, and the request is successful, then they will receive a 201 HTTP status code and an object containing the new comment's data.

**Response Example**

    {
        "comment": {
            "id": 102,
            "commenting_user": 3,
            "commenting_group": null,
            "post": 23
            "text": "I think a lot of people hate it because it's one of those novels where nothing really happens, but that's true of a lot of works from that era as well.",
            "reply_to": null,
            "posted": "2026-03-06",
            "edited": null
        }
    }

#### PUT /api/comment/{commentid}

Users can make edits to their comments.

**Parameters**

    commentid (path parameter): An integer representing the id of the comment that will be edited.

**Request Body Example**

    {
        "text": "I think a lot of people hate it because it's one of those novels where nothing really happens, but that's true of a lot of works from that era as well. Ever read a Jane Austen novel?",
    }

**Response**

If the user has a usertoken, and the request is successful, then they will receive a 200 HTTP status code with an object containing the updated comment data.

**Response Example**

    {
        "comment": {
            "id": 102,
            "commenting_user": 3,
            "commenting_group": null,
            "post": 23,
            "text": "I think a lot of people hate it because it's one of those novels where nothing really happens, but that's true of a lot of works from that era as well. Ever read a Jane Austen novel?",
            "reply_to": null,
            "posted": "2026-03-06",
            "edited": "2026-03-06"
        }
    }

#### POST /api/comment/{commentid}/like

Users can like other user's comments.

**Parameters**

    commentid (path parameter): An integer representing the id of the comment that will be liked.

**Request Example**

> curl -X POST "http://api.bookmark.com/api/comment/100/like" -H "Content-Type: application/json" -H "Cookie: usertoken=your_token"

**Response**

If the user has a usertoken, and the request is successful, then they will receive a 201 HTTP status code and an object containing the ids of the user and the liked comment.

    + If the comment was not posted by the logged-in user, then a notification will be sent to the original poster.

**Response Example**

    {
        "like": {
            "id": 111,
            "liking_user": 3,
            "liked_comment": 100
        }
    }

#### DELETE /api/comment/{commentid}/unlike

Users can undo a like made on another user's comment.

**Parameters**

    commentid (path parameter): An integer representing the id of the selected comment.

**Request Example**

> curl -X DELETE "http://api.bookmark.com/api/comment/100/unlike" -H "Content-Type: application/json" -H "Cookie: usertoken=your_token"

**Response**

If the user has a usertoken, and the request is successful, they will receive a 200 HTTP status code.

    + If a notification was sent when the comment was liked, then it will be deleted as well.

#### DELETE /api/comment/{commentid}

Users can delete comments that they've posted.

**Parameters**

    commentid (path parameter): An integer representing the id of the comment that will be deleted.

**Request Example**

> curl -X DELETE "http://api.bookmark.com/api/comment/102" -H "Content-Type: application/json" -H "Cookie: usertoken=your_token"

**Response**

If the user has a usertoken, and the request is successful, then they will receive a 200 HTTP status code.

    + All associated likes and replies will be deleted in addition to the comment.

        + If a notification was created when the comment was posted, then it will be deleted as well.

## Chats

Chats allow two users to send private messages to each other.

### Chat Methods

| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/chats | GET | Retrieve your chats |
| /api/chat/{userid} | POST | Create a chat with another user |
| /api/chat/{userid} | PATCH | Read all unread messages |
| /api/chat/{userid}/message | POST | Send a message |
| /api/chat/{chatid} | DELETE | Delete a chat |

#### GET /api/chats

Users can view their chats.

**Parameters**

None

**Request Example**

> curl -X GET "http://api.bookmark.com/api/chats" -H "Content-Type: application/json" -H "Cookie: usertoken=your_token"

**Response**

If the user has a usertoken, and the request is successful, then they will receive a 200 HTTP status code and an array containing their chats and the messages associated with them.

**Response Example**

    {
        "chats": [
            {
                "chat": {
                    "id": 120,
                    "user": {
                        "id": 2,
                        "first_name": "Catherine",
                        "last_name": "Bush",
                        "profile_picture": "https://examplestorage.com/examplestring1/image/upload/examplestring2/image.jpg",
                        "online": false,
                        "hidden": true
                    }
                },
                "messages": [
                    {
                        "id": 130,
                        "sending_user": 3,
                        "receiving_user": 2,
                        "text": "What do you think of the early Gothic novels? I feel like you'd enjoy the Castle of Otranto.",
                        "image": null,
                        "sent": "2026-03-13",
                        "checked": true
                    },
                    {
                        "id": 131,
                        "sending_user": 2,
                        "receiving_user": 3,
                        "text": "I don't care much for Otranto, but I did enjoy Mysteries of Udolpho. Ann Radcliffe's prose can be captivating.",
                        "image": null,
                        "sent": "2026-03-13",
                        "checked": false
                    }
                ]
            },
            {
                "chat": {
                   "id": 121,
                    "user": {
                        "id": 1,
                        "first_name": "Andrew",
                        "last_name": "Taylor",
                        "profile_picture": null,
                        "online": true,
                        "hidden": true
                    }
                },
                "messages": [
                    {
                        "id": 132,
                        "sending_user": 1,
                        "receiving_user": 3,
                        "text": "I'm curious to know what you think of this novel.",
                        "image": "https://examplestorage.com/examplestring11/image/upload/examplestring12/golden_pavillion.jpg",
                        "sent": "2026-03-14",
                        "checked": false
                    }
                ]
            }
        ]
    }

#### POST /api/chat/{userid}

Users can initiate chats with other users.

**Parameters**

    userid (path parameter): An integer that represents the id of the selected user.

**Request Example**

> curl -X POST "http://api.bookmark.com/api/chat/5" -H "Content-Type: application/json" -H "Cookie: usertoken=your_token"

**Response**

If the user has a usertoken, and the request is successful, then they will receive a 201 HTTP status code and an object containing the data for the new chat.

**Response Example**

    {
        "chat": {
            "id": 123,
            "user_1": 3,
            "user_2": 5
        }
    }

#### PATCH /api/chat/{userid}

Users can read all unread messages from a chat.

**Parameters** 

    userid (path parameter): An integer representing the id of the selected user.

**Request Example**

> curl -X PATCH "http://api.bookmark.com/api/chat/2" -H "Content-Type: application/json" -H "Cookie: usertoken=your_token"

**Response**

If the user has a usertoken, and the request is successful, then they will receive a 200 HTTP status code.

    + Because this endpoint does not require a request body, the server will check to see if there are any unread messages from the other user. If there are, then the "checked" property of each message will be set to true.

#### POST /api/chat/{userid}/message

Users can send messages to other users.

**Parameters**

    userid (path parameter): An integer representing the id of the user who will receive the message.

**Request Example**

> curl -X POST "http://api.bookmark.com/api/5/message" -H "Cookie: usertoken=your_token" -F "chatimage=@/express-bookmark/public/chatimage" -F "text=How it feels to read the first chapter of Portrait of the Artist as a Young Man."

**Response**

If the user has a usertoken, and the request is successful, then they will receive a 201 HTTP status code and an object containing the data for the new message.

    + If the user receiving the message does not have an active chat with the logged-in user, then a new one will be created.

**Response Example**

    {
        "message": {
            "id": 133,
            "sending_user": 3,
            "receiving_user": 5,
            "text": "How it feels to read the first chapter of Portrait of the Artist as a Young Man.",
            "image": "http://examplestorage.com/examplestring13/image/upload/examplestring14/joyce_meme.jpg",
            "sent": "2026-03-18",
            "checked": false
        }
    }

#### DELETE /api/chat/{chatid}

Users can delete their chats.

**Parameters**

    chatid (path parameter): An integer representing the id of the chat that will be deleted.

**Request Example**

> curl -X DELETE "http://api.bookmark.com/api/chat/1" -H "Content-Type: application/json" -H "Cookie: usertoken=your_token"

**Response**

If the user has a usertoken, and the request is successful, then they will receive a 200 HTTP status code.

    + Because the API creates separate chats for each user, no messages will be deleted if the second chat exists. If both chats have been deleted, then all messages associated with them will be deleted as well.
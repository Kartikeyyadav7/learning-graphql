import { createServer } from '@graphql-yoga/node'

const users = [
    {
        id: "1",
        name: "Kartikey",
        email: "Kartikey@gmail.com",
        age: 21
    },
    {
        id: "2",
        name: "Sarah",
        email: "sarah@gmail.com",
        age: 19
    },
    {
        id: "3",
        name: "Jack",
        email: "jack@gmail.com",
        age: 55
    }

]

const posts = [
    {
        id: '10',
        title: "Future Diary",
        body: "Predicts the future",
        published: true,
        author: '1'
    },
    {
        id: '20',
        title: "Attack on titans",
        body: "Titans attack people out of nowhere",
        published: true,
        author: '2'
    },
    {
        id: "30",
        title: "Naruto",
        body: "Super duper cool ninjas",
        published: true,
        author: '3'
    }
]

const comments = [
    {
        id: '11',
        text: "Hey man , how are you doing",
        author: '1',
        post: '10'
    },
    {
        id: "22",
        text: "I am doing fine, how about you",
        author: '2',
        post: '30'
    },
    {
        id: "33",
        text: " Well I am doing fine as well",
        author: '2',
        post: '20'
    }
]

const server = createServer({
    schema: {
        typeDefs: `
            type Query {
              users : [User!]!
              posts(query: String) : [Post!]!
              comments : [Comment!]!
              me : User!
              post : Post!
              comment : Comment!
            }

            type User {
                id : ID!
                name : String!
                email : String!
                age : Int
                posts: [Post!]!
                comments : [Comment!]!
            }

            type Post {
                id: ID!
                title : String!
                body : String!
                published : Boolean!
                author : User!
                comments : [Comment!]!
            }

            type Comment {
                id : ID!,
                text: String!
                author : User!
                post : Post!
            }
        `,

        resolvers: {
            Query: {
                users: (parent, args, ctx, info) => {
                    return users
                },
                posts: (parent, args, ctx, info) => {
                    if (!args.query) {
                        return posts
                    }

                    return posts.filter((post) => {
                        const isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase())
                        const isBodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase())
                        return isTitleMatch || isBodyMatch
                    })
                },
                comments: (parent, args, ctx, info) => {
                    return comments
                },
                me: () => {
                    return {
                        id: "123456",
                        name: "Kartikey",
                        email: "kartikey@gmail.com",
                    }
                },
                comment: () => {
                    return {
                        id: "123456poe",
                        text: "I am a comment after all, I am here to judge you"
                    }
                },
                post: () => {
                    return {
                        id: "123456789",
                        title: "The great hunger games",
                        body: "This is the greatest hunger game of all time and we deserve to know what it is",
                        published: true
                    }
                }

            },
            Post: {
                author: (parent, args, ctx, info) => {
                    return users.find((user) => {
                        return user.id === parent.author
                    })
                },
                comments: (parent, args, ctx, info) => {
                    return comments.filter((comment) => {
                        return comment.post === parent.id
                    })
                }
            },
            User: {
                posts: (parent, args, ctx, info) => {
                    return posts.filter((post) => {
                        return post.author === parent.id
                    })
                },
                comments: (parent, args, ctx, info) => {
                    return comments.filter((comment) => {
                        return comment.author === parent.id
                    })
                }
            },
            Comment: {
                author: (parent, args, ctx, info) => {
                    return users.find((user) => {
                        return user.id === parent.author
                    })
                },
                post: (parent, args, ctx, info) => {
                    return posts.find((post) => {
                        return post.id === parent.post
                    })
                }
            }
        }
    }
})

server.start()
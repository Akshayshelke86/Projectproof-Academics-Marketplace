import bcrypt from 'bcryptjs'

const users = [
    {
        name: 'Akshay Shelke',
        email: 'akshayshelk86@gmail.com',
        password: 'Akshay@123',
        isAdmin: true,
        role: 'admin',
        isFreelancer: true
    },
    {
        name: 'Aniket',
        email: 'aniket@gmail.com',
        password: '123456',
        isFreelancer: true
    },
    {
        name: 'Prawin',
        email: 'prawin@gmail.com',
        password: '123456',
        isFreelancer: true,
        role: 'guide'
    },
    {
        name: 'Sandy',
        email: 'santhosh@gmail.com',
        password: '123456',
        isFreelancer: false,
        role: 'student'
    },
    {
        name: 'Harshit',
        email: 'harshit@gmail.com',
        password: '123456',
        isFreelancer: false
    },
    {
        name: 'Aakash',
        email: 'aakash@gmail.com',
        password: '123456',
        isFreelancer: false
    },
    {
        name: 'test',
        email: 'test@gmail.com',
        password: '123456',
        isFreelancer: false
    }
]

export default users
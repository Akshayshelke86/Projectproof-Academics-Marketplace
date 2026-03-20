import jwt from 'jsonwebtoken';

const id = '123';
const secret = '6e39e44e46eac799dfd050db1891454f6954f14f81943c09d44a9a2daa904';

try {
    const token = jwt.sign({ id }, secret, { expiresIn: '30d' });
    console.log('Token generated successfully:', token);
} catch (error) {
    console.error('Token generation failed:', error.message);
}

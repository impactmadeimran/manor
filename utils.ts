import JWT from 'jsonwebtoken'

const maxAge = 30000;
export const createToken = async (id: any) => {
    return JWT.sign(id, process.env.JWT_SECRET as string, { expiresIn: maxAge });
}
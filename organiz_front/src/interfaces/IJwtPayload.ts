export default interface IJwtPayload {
    id: string;
    email: string;
    firstname: string;
    lastname: string;
    role: string;
    iat: number;
    exp: number;
}
export interface UserJWT {
    userId: number;
    email: string;
    role: USER_ROLE;
}
export enum USER_ROLE {
    customer = 'customer',
    staff = 'staff',
}

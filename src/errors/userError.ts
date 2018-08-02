export abstract class UserError extends Error {
    public code: number;
    public message: string;
    public isUserError: boolean;

    constructor() {
        super('Something went wrong');
        this.isUserError = true;
    }
}

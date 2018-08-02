import { UserError } from './userError';

export class UnauthorizedError extends UserError {
    constructor() {
        super();
        this.code = 401;
        this.message = `Unauthorized`;
    }
}

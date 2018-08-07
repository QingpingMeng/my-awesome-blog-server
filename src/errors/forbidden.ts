import { UserError } from './userError';

export class ForbiddenError extends UserError {
    constructor(action: string = 'Action') {
        super();
        this.code = 403;
        this.message = `${action} is not allowed`;
    }
}

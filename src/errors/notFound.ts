import { UserError } from './userError';

export class NotFoundError extends UserError {
    constructor(target: string) {
        super();
        this.code = 404;
        this.message = `${target} is not found`;
    }
}

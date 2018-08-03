import { UserError } from './userError';

export class InvalidParameter extends UserError {
    constructor(param: string) {
        super();
        this.code = 400;
        this.message = `Invalid parameter ${param}`;
    }
}

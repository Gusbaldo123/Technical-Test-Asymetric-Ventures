import { Author } from "../../../generated/prisma/client";

export class LoginAuthorDTO {
    constructor(
        public email: string,
        public password: string
    ) {}
}
import { Author } from "../../../generated/prisma/client";

export class UpdateAuthorDTO {
    constructor(
        public name: string | null,
        public email: string,
        public password: string
    ) {}
}
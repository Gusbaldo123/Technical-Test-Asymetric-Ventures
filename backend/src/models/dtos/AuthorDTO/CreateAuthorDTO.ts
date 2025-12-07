import { Author } from "../../../generated/prisma/client";

export class CreateAuthorDTO {
    constructor(
        public name: string | null,
        public email: string,
        public password: string
    ) {}
}
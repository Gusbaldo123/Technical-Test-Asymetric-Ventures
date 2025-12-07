import { Author } from "../generated/prisma/client"
import { CreateAuthorDTO, UpdateAuthorDTO, AuthorResponseDTO } from '../models/dtos';
import { Prisma } from "../managers/Prisma";
import { Crud } from "../models/Crud";
import * as bcrypt from 'bcrypt';

class AuthorService extends Crud<Author, AuthorResponseDTO> {
    public override async create(author: CreateAuthorDTO): Promise<AuthorResponseDTO | null> {
        try {
            let { name, email, password } = author;
            let saltRounds: number = 10;

            let hashPassword = await bcrypt.hash(password, saltRounds);

            let createdAuthor: Author = await Prisma.author.create({
                data: { name, email, password: hashPassword }
            })
            return AuthorResponseDTO.fromEntity(createdAuthor);
        } catch (error) {
            console.log(error);
            return null;
        }

    }

    public override async getById(id: number): Promise<AuthorResponseDTO | null> {
        let foundAuthor: Author | null = await Prisma.author.findFirst({
            where: { id: id }
        });
        if (foundAuthor)
            return AuthorResponseDTO.fromEntity(foundAuthor);
        return null;
    }

    public override async updateById(id: number, author: UpdateAuthorDTO): Promise<AuthorResponseDTO | null> {
        const { name, email, password } = author;

        let updatedAuthor: Author = await Prisma.author.update({
            where: { id },
            data: { email, name, password }
        });
        if (updatedAuthor)
            return AuthorResponseDTO.fromEntity(updatedAuthor);
        return null;
    }

    public override async deleteById(id: number): Promise<void> {
        await Prisma.author.delete({
            where: { id }
        });
    }
}

const authorService = new AuthorService();

export { authorService, AuthorService };
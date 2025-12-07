import { Author } from "../generated/prisma/client"
import { Prisma } from "../managers/Prisma";
import { Crud } from "../models/Crud";
import * as bcrypt from 'bcrypt';

class AuthorService extends Crud<Author> {
    public override async create(author: Author): Promise<Author|null> {
        try {
            let { name, email, password } = author;
            let saltRounds: number = 10;

            let hashPassword = await bcrypt.hash(password, saltRounds);

            let createdAuthor: Author = await Prisma.author.create({
                data: { name, email, password: hashPassword }
            })
            return createdAuthor;
        } catch (error) {
            console.log(error);
            return null;
        }
        
    }

    public override async getById(id: number): Promise<Author | null> {
        let foundAuthor: Author | null = await Prisma.author.findFirst({
            where: { id: id }
        });
        return foundAuthor;
    }

    public override async updateById(id: number, author: Author): Promise<Author> {
        const { name, email, password } = author;

        let updatedAuthor: Author = await Prisma.author.update({
            where: { id },
            data: { email, name, password }
        });
        return updatedAuthor;
    }

    public override async deleteById(id: number): Promise<void> {
        await Prisma.author.delete({
            where: { id }
        });
    }
}

const authorService = new AuthorService();

export { authorService, AuthorService };
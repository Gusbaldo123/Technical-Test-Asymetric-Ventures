import { Post } from "../generated/prisma/client"
import { Prisma } from "./Prisma";
import { Crud } from "../models/Crud";

class PostService extends Crud<Post> {
    public override async create(post: Post): Promise<Post> {
        let { createdAt, updatedAt, title, published, authorId } = post;
        let createdPost: Post = await Prisma.post.create({
            data: { createdAt, updatedAt, title, published, authorId }
        })
        return createdPost;
    }

    public override async getById(id: number): Promise<Post | null> {
        let foundPost: Post | null = await Prisma.post.findFirst({
            where: { id: id }
        });
        return foundPost;
    }

    public async getByAuthorId(authorId: number): Promise<Post[] | null> {
        let foundPosts: Post[] | null = await Prisma.post.findMany({
            where: { authorId: authorId }
        });
        return foundPosts;
    }

    public override async updateById(id: number, post: Post): Promise<Post> {
        let { createdAt, updatedAt, title, published, authorId } = post;

        let updatedPost: Post = await Prisma.post.update({
            where: { id },
            data: { createdAt, updatedAt, title, published, authorId }
        });
        return updatedPost;
    }

    async deleteById(id: number): Promise<void> {
        await Prisma.post.delete({
            where: { id }
        });
    }
}

const postService = new PostService();

export { postService };
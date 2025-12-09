import { Post } from "../generated/prisma/client"
import { Prisma } from "../managers/Prisma";
import { Crud } from "../models/Crud";
import { Author } from "../generated/prisma/client";
import { AuthorResponseDTO, PostCreateDTO, PostResponseDTO } from "../models/dtos";
import { Category } from "../generated/prisma/client";


class PostService extends Crud<PostCreateDTO, PostResponseDTO> {

    public override async create(post: PostCreateDTO, requester: AuthorResponseDTO): Promise<PostResponseDTO | null> {
        try {
            const { title, content, categoryIds } = post;

            const foundAuthor: Author | null = await Prisma.author.findFirst({
                where: { id: requester.id }
            });

            if (!foundAuthor) return null;

            const categories: Category[] = await Prisma.category.findMany({
                where: { id: { in: categoryIds } }
            });

            if (categories.length !== categoryIds.length) return null;

            const createdPost: Post = await Prisma.post.create({
                data: {
                    title,
                    content,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    authorId: foundAuthor.id,
                    postCategories: {
                        create: categoryIds.map(categoryId => ({ category: { connect: { id: categoryId } } }))
                    }
                },
                include: {
                    postCategories: { include: { category: true } },
                    author: true
                }
            });

            return PostResponseDTO.fromEntity(createdPost, AuthorResponseDTO.fromEntity(foundAuthor), categories);
        } catch (error) {
            return null;
        }
    }

    public override async getById(id: number): Promise<PostResponseDTO | null> {
        const foundPost = await Prisma.post.findFirst({
            where: { id: id },
            include: {
                postCategories: { include: { category: true } },
                author: true
            }
        });

        if (!foundPost) return null;

        const foundCategories = foundPost.postCategories.map(pc => pc.category);

        return PostResponseDTO.fromEntity(foundPost, AuthorResponseDTO.fromEntity(foundPost.author), foundCategories);
    }

    public override async updateById(id: number, post: PostCreateDTO, requester: AuthorResponseDTO): Promise<PostResponseDTO | null> {
        try {
            const { title, content, categoryIds } = post;

            const existingPost = await Prisma.post.findUnique({
                where: { id },
                include: {
                    postCategories: true,
                    author: true
                }
            });

            if (!existingPost || !existingPost.author) return null;

            if (categoryIds && categoryIds.length > 0) {
                const categories = await Prisma.category.findMany({ where: { id: { in: categoryIds } } });

                if (categories.length !== categoryIds.length) return null;
            }

            const result = await Prisma.$transaction(async (prisma) => {
                await prisma.postCategory.deleteMany({ where: { postId: id } });
                await prisma.post.update({
                    where: { id },
                    data: { title, content, updatedAt: new Date() }
                });

                if (categoryIds && categoryIds.length > 0) {
                    await prisma.postCategory.createMany({
                        data: categoryIds.map(categoryId => ({
                            postId: id,
                            categoryId
                        }))
                    });
                }

                return await prisma.post.findUnique({
                    where: { id },
                    include: {
                        postCategories: { include: { category: true } },
                        author: true
                    }
                });
            });

            if (!result || !result.author) return null;

            const updatedCategories = result.postCategories.map(pc => pc.category);

            return PostResponseDTO.fromEntity(
                result,
                AuthorResponseDTO.fromEntity(result.author),
                updatedCategories
            );

        } catch (error) {
            console.error("Erro ao atualizar post:", error);
            return null;
        }
    }

    public override async deleteById(id: number): Promise<boolean> {
        try {
            await Prisma.$transaction(async (prisma) => {
                await prisma.postCategory.deleteMany({ where: { postId: id } });
                await prisma.post.delete({ where: { id } });
            });
            return true;
        } catch (error) {
            return false;
        }
    }

    public async listByAuthor(authorId: number): Promise<PostResponseDTO[] | null> {
        const foundPosts = await Prisma.post.findMany({
            where: { authorId },
            include: {
                postCategories: { include: { category: true } },
                author: true
            }
        });

        if (!foundPosts.length) return null;

        return foundPosts.map(post => {
            const categories = post.postCategories.map(pc => pc.category);
            return PostResponseDTO.fromEntity(post, AuthorResponseDTO.fromEntity(post.author), categories);
        });
    }

    public async isAuthorOriginalPoster(authorId: number, postId: number): Promise<boolean> {
        const isOriginalPoster = await Prisma.post.findFirst({
            where: { id: postId, authorId }
        });
        return isOriginalPoster!=null;
    }
}

export { PostService };
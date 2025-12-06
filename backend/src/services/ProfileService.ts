import { Profile } from "../generated/prisma/client"
import { Prisma } from "../managers/Prisma";
import { Author } from "../generated/prisma/client";
import { Crud } from "../models/Crud";

class ProfileService extends Crud<Profile> {
    public override async create(profile: Profile): Promise<Profile> {
        let { bio, authorId } = profile;
        let createdProfile: Profile = await Prisma.profile.create({
            data: { bio, authorId }
        })
        return createdProfile;
    }

    public override async getById(id: number): Promise<Profile | null> {
        let foundProfile: Profile | null = await Prisma.profile.findFirst({
            where: { id: id }
        });
        return foundProfile;
    }

    async getAuthor(authorId: number): Promise<Author | null> {
        let foundAuthor: Author | null = await Prisma.author.findFirst({
            where:{ id:authorId }
        });
        return foundAuthor;
    }

    public override async updateById(id: number, profile: Profile): Promise<Profile> {
        let { bio, authorId } = profile;

        let updatedProfile: Profile = await Prisma.profile.update({
            where: { id },
            data: { bio, authorId }
        });
        return updatedProfile;
    }

    public override async deleteById(id: number): Promise<void> {
        await Prisma.profile.delete({
            where: { id }
        });
    }
}

export { ProfileService };
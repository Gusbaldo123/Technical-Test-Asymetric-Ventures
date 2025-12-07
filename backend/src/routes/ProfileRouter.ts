import { ProfileService } from '../services/ProfileService';
import { Profile } from '../generated/prisma/client';
import { RouterAPI } from '../models/RouterAPI';

class ProfileRouter extends RouterAPI<ProfileService, Profile, Profile> {
    constructor() {
        super(new ProfileService());
    }
}

export default new ProfileRouter().getRouter();

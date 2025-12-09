// src/managers/JobManager.ts
import cron from 'node-cron';
import { ScheduledTask } from 'node-cron';
import { PostService } from '../services/PostService';
import { CategoryService } from '../services/CategoryService';
import { AuthorService } from '../services/AuthorService';
import { PostCreateDTO } from '../models/dtos';
import { AuthorResponseDTO } from '../models/dtos';

import generatePost from '../models/agent/agent';



class JobManager {
    private static instance: JobManager;
    private postService!: PostService;
    private categoryService!: CategoryService;
    private authorService!: AuthorService;
    private jobs: ScheduledTask[] = [];

    private constructor() {
        this.initJobs();
    }

    static getInstance(): JobManager {
        if (!JobManager.instance) {
            JobManager.instance = new JobManager();
        }
        return JobManager.instance;
    }

    private initJobs(): void {
        const job1: ScheduledTask = cron.schedule('*/1 * * * *', async () => await this.executeJob());

        this.jobs.push(job1);

        console.log(`${this.jobs.length} jobs scheduled`);
    }

    private async executeJob(): Promise<any> {
        function getRandomInt(min: number, max: number): number {
            min = Math.ceil(min); // Ensure min is an integer
            max = Math.floor(max); // Ensure max is an integer
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        console.log("\n\nCreating new post...");
        const randomCategories = await this.categoryService.getRandomCategories(getRandomInt(1, 3));
        if (!randomCategories) {
            console.log(`Unreachable category found.`);
            return null;
        }

        const post: PostCreateDTO|null = await generatePost(randomCategories);
        if (!post) {
            console.log(`Post unavaliable`);
            return null;
        }

        const author: AuthorResponseDTO | null = await this.authorService.getById(1);
        if (!author) {
            console.log(`Unreachable author found.`);
            return null;
        }

        const createdPost = await this.postService.create(post, author);
        console.log(`Title: ${createdPost?.title}\nContent: ${createdPost?.content}\nCategories: ${randomCategories.map(cat=>cat.name)}`);
    }

    public startAll(): void {
        this.postService = new PostService();
        this.categoryService = new CategoryService();
        this.authorService = new AuthorService();
        this.jobs.forEach(job => job.start());
    }

    public stopAll(): void {
        this.jobs.forEach(job => job.stop());
    }

    public async getJobStatus(): Promise<Array<{ expression: string, status: string }>> {
        const statuses = Array<{ expression: string, status: string }>();
        this.jobs.map(async job => (
            statuses.push({
                expression: job.name || 'unknown',
                status: await job.getStatus()
            })
        ));
        return statuses;
    }
}

export default JobManager.getInstance();
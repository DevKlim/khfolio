// TypeScript Interfaces for the Portfolio
// Compile logic: tsc --target es6 --outDir ../static/js

export interface Project {
    id: string;
    title: string;
    shortDescription: string;
    longDescription: string;
    techStack: string[];
    thumbnailUrl: string;
    mainImageUrl: string;
    githubUrl?: string;
    liveDemoUrl?: string;
}

export interface GithubRepo {
    id: number;
    name: string;
    description: string;
    html_url: string;
    stargazers_count: number;
    language: string;
    pushed_at: string;
}

export interface MemoryImage {
    id: number;
    filename: string;
    width: number;
    height: number;
    createdAt: number;
}
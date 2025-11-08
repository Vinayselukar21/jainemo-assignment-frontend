import { apiClient } from '@/lib/api/client';

export interface SheetListResponse {
    _id: string;
    title: string;
    description?: string;
    order: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    __v?: number;
}


export interface Progress {
    _id: string;
    problemId: string;
    userId: string;
    state: "Completed" | "In Progress" | "Not Started"; // customize if needed
    createdAt: string;
    updatedAt: string;
    lastUpdated?: string;
    __v?: number;
}

export interface Problem {
    _id: string;
    topicId: string;
    title: string;
    slug: string;
    order: number;
    difficulty: "Easy" | "Medium" | "Hard"; // optional enum if you prefer strictness
    youtubeUrl?: string;
    leetCodeUrl?: string;
    articleUrl?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    __v?: number;
}

export interface SheetTopicsResponse {
    _id: string;
    sheetId: string;
    title: string;
    description?: string | null;
    order: number;
    isActive: boolean;
    problems: Problem[][]; // nested array structure (as in your JSON)
    progress: Progress[];
}


export const sheetService = {
    getAllSheets: async () => {
        const response = await apiClient.get<SheetListResponse[]>('/api/sheets');
        return response.data;
    },

    getSheetTopics: async (sheetId: string) => {
        const response = await apiClient.get<SheetTopicsResponse[]>(`/api/topics/sheet/${sheetId}`);
        return response.data;
    },
};

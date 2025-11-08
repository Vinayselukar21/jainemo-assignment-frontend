import { apiClient } from '@/lib/api/client';

export interface ProgressRequest {
    problemId: string;
    state: 'Completed' | 'InProgress' | 'NotStarted';
}
export interface ProgressResponse {
    _id: string;
    problemId: string;
    userId: string;
    __v: number;
    createdAt: string;
    lastUpdated: string;
    state: 'Completed' | 'InProgress' | 'NotStarted';
    updatedAt: string;
}

export const progressService = {
    updateProgress: async (payload: ProgressRequest): Promise<ProgressResponse> => {
        const response = await apiClient.post<ProgressResponse>(
            '/api/progress',
            payload
        );
        return response.data;
    }
};

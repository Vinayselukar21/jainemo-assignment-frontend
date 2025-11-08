import { ProgressRequest, progressService } from '@/services/progress.service';
import { useMutation } from '@tanstack/react-query';

export const useUpdateProgressMutation = () => {
    return useMutation({
        mutationFn: (payload: ProgressRequest) => progressService.updateProgress(payload),
    });
};
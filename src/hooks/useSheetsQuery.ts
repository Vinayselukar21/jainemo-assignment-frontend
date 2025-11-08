import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { sheetService } from '@/services/sheet.service';


// React query hook to fetch all sheets
export const useSheetsQuery = () => {
    return useQuery({
        queryKey: ['sheets'],
        queryFn: () => sheetService.getAllSheets(),
    });
}

// React query hook to fetch topics of a single sheet by id
export const useSheetTopicsQuery = (id: string) => {
    return useQuery({
        queryKey: ['sheet', id],
        queryFn: () => sheetService.getSheetTopics(id),
        enabled: id !== '' && id !== undefined && id !== null,
    });
}

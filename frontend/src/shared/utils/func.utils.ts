export const formatDate = (dateValue: string | Date | null | undefined): string => {
    if (!dateValue) return '';
    if (dateValue instanceof Date) {
        return dateValue.toISOString().split('T')[0];
    }
    return dateValue;
};
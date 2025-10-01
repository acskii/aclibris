
export function parsePDFDate (dateStr: string | undefined): string | undefined {
    if (!dateStr || !dateStr.startsWith('D:')) return undefined;
    try {
        // Simple extraction: "D:20240115143000Z" -> "2024-01-15T14:30:00Z"
        const year = dateStr.substring(2, 6);
        const month = dateStr.substring(6, 8) || '01';
        const day = dateStr.substring(8, 10) || '01';
        const hour = dateStr.substring(10, 12) || '00';
        const minute = dateStr.substring(12, 14) || '00';
        const second = dateStr.substring(14, 16) || '00';
        return `${year}-${month}-${day}T${hour}:${minute}:${second}Z`;
    } catch {
        return undefined;
    }
};

export function formatDate (dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

export function toUnix (dateString: string) {
    return new Date(dateString).getTime();
}

export function fromUnix (unix: number) {
    return new Date(unix).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}   
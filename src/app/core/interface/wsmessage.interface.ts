export interface WSMessage {
    event: string;
    data: Record<string, any>;
}
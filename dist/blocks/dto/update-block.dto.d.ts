declare class PositionDto {
    x: number;
    y: number;
    dropEffect?: string;
}
export declare class UpdateBlockDto {
    content?: string;
    position?: PositionDto;
    width?: number;
    height?: number;
}
export {};

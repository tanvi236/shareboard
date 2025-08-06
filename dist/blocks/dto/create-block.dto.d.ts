declare class PositionDto {
    x: number;
    y: number;
}
export declare class CreateBlockDto {
    type: 'text' | 'image' | 'link';
    content: string;
    position: PositionDto;
    boardId: string;
    width?: number;
    height?: number;
}
export {};

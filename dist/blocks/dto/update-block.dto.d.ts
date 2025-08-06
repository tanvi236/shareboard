import { CreateBlockDto } from './create-block.dto';
declare const UpdateBlockDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateBlockDto>>;
export declare class UpdateBlockDto extends UpdateBlockDto_base {
    lastEdited?: Date;
    width?: number;
    height?: number;
}
export {};

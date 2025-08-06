import { Board } from '../schemas/board.schema';
import { Block } from '../../blocks/schemas/block.schema';
export interface BoardWithPopulatedBlocks extends Omit<Board, 'blocks'> {
    blocks: Block[];
}

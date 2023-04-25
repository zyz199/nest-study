import { PartialType } from '@nestjs/swagger';
import { CreateTrackLogDto } from './create-track-log.dto';

export class UpdateTrackLogDto extends PartialType(CreateTrackLogDto) {}

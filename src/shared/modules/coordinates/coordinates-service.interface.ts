import { DocumentType } from '@typegoose/typegoose';
import { CreateCoordinatesDto } from './dto/create-coordinates.dto.js';
import { CoordinatesEntity } from './coordinates.entity.js';

export interface CoordinatesService {
  create(dto: CreateCoordinatesDto): Promise<DocumentType<CoordinatesEntity>>;
  findById(id: string): Promise<DocumentType<CoordinatesEntity> | null>;
  findByCoordinates(dto: CreateCoordinatesDto): Promise<DocumentType<CoordinatesEntity> | null>;
  findOrCreate(dto: CreateCoordinatesDto): Promise<DocumentType<CoordinatesEntity>>;
}

import { DocumentType, types } from '@typegoose/typegoose';
import { inject } from 'inversify';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { CoordinatesService } from './coordinates-service.interface.js';
import { CreateCoordinatesDto } from './dto/create-coordinates.dto.js';
import { CoordinatesEntity } from './coordinates.entity.js';

export class DefaultCoordinatesService implements CoordinatesService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.CoordinatesModel)
    private readonly coordinatesModel: types.ModelType<CoordinatesEntity>
  ) {}

  public async create(
    dto: CreateCoordinatesDto
  ): Promise<DocumentType<CoordinatesEntity>> {
    const coordinates = new CoordinatesEntity(dto);

    const result = await this.coordinatesModel.create(coordinates);
    this.logger.info(`Созданы новые координаты ${result}`);

    return result;
  }

  public findById(id: string): Promise<DocumentType<CoordinatesEntity> | null> {
    return this.coordinatesModel.findOne({ id });
  }

  public findByCoordinates(dto: CreateCoordinatesDto): Promise<DocumentType<CoordinatesEntity> | null> {
    return this.coordinatesModel.findOne({...dto});
  }

  public async findOrCreate(
    dto: CreateCoordinatesDto
  ): Promise<DocumentType<CoordinatesEntity>> {
    const existedUser = await this.findByCoordinates(dto);

    if (existedUser) {
      return existedUser;
    }

    return this.create(dto);
  }
}

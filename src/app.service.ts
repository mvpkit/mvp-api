import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {

  // constructor(
  //   @InjectRepository(Entity)
  //   private EntityRepository: Repository<Entity>,
  // ) {}

  // findAll(): Promise<Entity[]> {
  //   return this.EntityRepository.find();
  // }

  // findOne(id: string): Promise<Entity> {
  //   return this.EntityRepository.findOne(id);
  // }

  // save(Entity: EntityDto) : Promise<Entity> {
  //   return this.EntityRepository.save(Entity);
  // }

  // async remove(id: string): Promise<void> {
  //   await this.EntityRepository.delete(id);
  // }
}

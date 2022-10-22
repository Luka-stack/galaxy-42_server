import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Planet } from '../planets/entities/planet.entity';
import { Channel } from './entities/channel.entity';
import { User } from '../users/entities/user.entity';
import { ChannelInput } from './inputs/channel.input';
import { UserRole } from 'src/planets/entities/user-role';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(Channel)
    private readonly channelRepo: Repository<Channel>,
    @InjectRepository(Planet)
    private readonly planetRepo: Repository<Planet>,
  ) {}

  async saveChannel(channelInput: ChannelInput, user: User) {
    const planet = await this.planetRepo.findOne({
      where: { uuid: channelInput.planetId },
      relations: ['users'],
    });
    if (!planet) {
      return new NotFoundException('Planet not found');
    }

    const isAdmin = planet.users.some(
      (u) => u.role === UserRole.ADMIN && u.userId === user.id,
    );
    if (!isAdmin) {
      return new UnauthorizedException('Unathorized to create channel');
    }

    const dbChannel = await this.channelRepo.findOneBy({
      name: channelInput.name,
    });
    if (dbChannel) {
      return new BadRequestException('Group name must be unique');
    }

    return this.channelRepo.save({
      ...channelInput,
      planetId: planet.id,
    });
  }

  createChannel(name: string, planet: Planet) {
    return this.channelRepo.create({ name, planet });
  }

  getPlanetsChannels(planet: Planet) {
    return this.channelRepo.find({
      where: { planetId: planet.id },
    });
  }
}

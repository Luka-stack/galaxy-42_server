import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Channel } from '../channels/entities/channel.entity';
import { GetUser } from '../common/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { Message } from './entities/message.entity';
import { MessageInput } from './inputs/message.input';
import { QueryMessageInput } from './inputs/query-message.input';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Channel)
    private readonly channelRepo: Repository<Channel>,
  ) {}

  // TODO add subs
  async sendMessage(message: MessageInput, @GetUser() user: User) {
    let toUser: User | null;
    let channel: Channel | null;

    if (message.to) {
      toUser = await this.userRepo.findOne({
        where: { uuid: message.to },
      });

      if (!toUser) {
        return new BadRequestException('User not found');
      }
    } else if (message.channel) {
      channel = await this.channelRepo.findOne({
        relations: {
          planet: true,
        },
        where: {
          name: message.channel,
          planet: {
            uuid: message.planetId,
          },
        },
      });

      if (!channel) {
        return new BadRequestException('Channel not found');
      }
    }

    return this.messageRepo.save({
      content: message.content,
      author: user,
      recipient: toUser,
      channel: channel,
    });
  }

  getMessages(query: QueryMessageInput, user: User) {
    const where: any = {
      authorId: user.id,
    };

    if (query.channel) {
      where.channelUuid = query.channel;
    }

    if (query.to) {
      where.recipientUuid = query.to;
    }

    return this.messageRepo.find({
      where,
      order: {
        createdAt: 'DESC',
      },
    });
  }

  getAuthor(message: Message) {
    return this.userRepo.findOne({
      where: { id: message.authorId },
    });
  }
}

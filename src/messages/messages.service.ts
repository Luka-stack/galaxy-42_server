import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

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
    return this.messageRepo.save({
      content: message.content,
      recipient: message.recipient,
      toChannel: message.toChannel,
      author: user,
    });
  }

  async getMessages(query: QueryMessageInput, user: User) {
    if (query.toChannel) {
      return this.messageRepo.find({
        where: { toChannel: true, recipient: query.recipient },
      });
    } else {
      const otherUser = await this.userRepo.findOneBy({
        uuid: query.recipient,
      });

      if (!otherUser) {
        return new BadRequestException('User not found');
      }

      return this.messageRepo.find({
        where: {
          toChannel: false,
          authorId: In([user.id, otherUser.id]),
          recipient: In([user.uuid, otherUser.uuid]),
        },
      });
    }
  }

  getAuthor(message: Message) {
    return this.userRepo.findOne({
      where: { id: message.authorId },
    });
  }
}

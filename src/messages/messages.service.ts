import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Channel } from '../channels/entities/channel.entity';
import { GetUser } from '../common/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { Message } from './entities/message.entity';
import { MessageInput } from './inputs/message.input';

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
      recipientUuid: message.recipient,
      author: user,
    });
  }

  getMessages(recipients: string[], user: User) {
    return [];
  }

  getAuthor(message: Message) {
    return this.userRepo.findOne({
      where: { id: message.authorId },
    });
  }
}

import { Repository } from 'typeorm';
import { Chat } from './chat.entity';
export declare class AppService {
    private chatRepository;
    constructor(chatRepository: Repository<Chat>);
    createMessage(chat: Chat): Promise<Chat>;
    getMessages(): Promise<Chat[]>;
}

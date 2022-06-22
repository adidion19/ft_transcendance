import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    Home(): void;
    Chat(res: any): Promise<void>;
}

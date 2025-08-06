import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';

@Catch(WsException)
export class WsExceptionFilter extends BaseWsExceptionFilter {
  catch(exception: WsException, host: ArgumentsHost) {
    const client = host.switchToWs().getClient();
    const error = exception.getError();
    
    // Fix the type issue with proper type checking
    const message = typeof error === 'string' 
      ? error 
      : (error as any)?.message || 'Unknown error';
    
    client.emit('error', {
      message,
      timestamp: new Date().toISOString(),
    });
  }
}

import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class TskvLogger implements LoggerService {
  formatMessage(level: string, message: any, ...optionalParams: any[]) {
    const fields = {
      level,
      message: String(message),
      context: String(optionalParams[0] ?? ''),
      timestamp: new Date().toISOString(),
    };

    // Пример записи: time=10\tday=monday\n
    return (
      Object.entries(fields)
        .map(([key, value]) => `${key}=${value}`)
        .join('\t') + '\n'
    );
  }

  log(message: any, ...optionalParams: any[]) {
    process.stdout.write(this.formatMessage('log', message, ...optionalParams));
  }

  error(message: any, ...optionalParams: any[]) {
    process.stderr.write(
      this.formatMessage('error', message, ...optionalParams),
    );
  }

  warn(message: any, ...optionalParams: any[]) {
    process.stdout.write(
      this.formatMessage('warn', message, ...optionalParams),
    );
  }

  debug(message: any, ...optionalParams: any[]) {
    process.stdout.write(
      this.formatMessage('debug', message, ...optionalParams),
    );
  }

  verbose(message: any, ...optionalParams: any[]) {
    process.stdout.write(
      this.formatMessage('verbose', message, ...optionalParams),
    );
  }
}

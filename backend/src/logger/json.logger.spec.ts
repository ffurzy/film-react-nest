import { JsonLogger } from './json.logger';

describe('JsonLogger', () => {
  let logger: JsonLogger;

  beforeEach(() => {
    logger = new JsonLogger();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // тест на formatMessage

  describe('formatMessage', () => {
    it('должен вернуть JSON со всеми полями', () => {
      const result = logger.formatMessage(
        'log',
        'тестовое сообщение',
        'AppModule',
      );
      const parsed = JSON.parse(result);

      expect(parsed.level).toBe('log');
      expect(parsed.message).toBe('тестовое сообщение');
      expect(parsed.context).toBe('AppModule');
      expect(parsed.timestamp).toBeDefined();
    });

    it('должен подставить null в контекст если не передан', () => {
      const result = logger.formatMessage('warn', 'без контекста');
      const parsed = JSON.parse(result);

      expect(parsed.context).toBeNull();
    });

    it('должен подставлять уровень лога', () => {
      const levels = ['log', 'error', 'warn', 'debug', 'verbose'];

      levels.forEach((level) => {
        const result = logger.formatMessage(level, 'msg');
        const parsed = JSON.parse(result);
        expect(parsed.level).toBe(level);
      });
    });
  });

  // тест на методы логгера и убираем мусор из тестов

  describe('log()', () => {
    it('должен вызвать console.log с JSON-строкой', () => {
      const spy = jest.spyOn(console, 'log').mockImplementation(() => {});

      logger.log('привет', 'TestContext');
      expect(spy).toHaveBeenCalledTimes(1);
      const output = spy.mock.calls[0][0];
      const parsed = JSON.parse(output);

      expect(parsed.level).toBe('log');
      expect(parsed.message).toBe('привет');
    });
  });

  describe('error()', () => {
    it('должен вызвать console.error', () => {
      const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

      logger.error('что-то сломалось');

      expect(spy).toHaveBeenCalledTimes(1);
      const parsed = JSON.parse(spy.mock.calls[0][0]);
      expect(parsed.level).toBe('error');
    });
  });

  describe('warn()', () => {
    it('должен вызвать console.warn', () => {
      const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});

      logger.warn('предупреждение');

      expect(spy).toHaveBeenCalledTimes(1);
      const parsed = JSON.parse(spy.mock.calls[0][0]);
      expect(parsed.level).toBe('warn');
    });
  });
});

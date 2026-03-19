import { TskvLogger } from './tskv.logger';

describe('TskvLogger', () => {
  let logger: TskvLogger;

  beforeEach(() => {
    logger = new TskvLogger();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('formatMessage', () => {
    it('должен вернуть строку с полями разделёнными табуляцией', () => {
      const result = logger.formatMessage('log', 'тест', 'AppModule');
      expect(result).toContain('\t');
    });

    it('должен заканчиваться символом новой строки', () => {
      const result = logger.formatMessage('log', 'тест');
      expect(result.endsWith('\n')).toBe(true);
    });

    it('должен содержать все ключи в формате key=value', () => {
      const result = logger.formatMessage('warn', 'сообщение', 'SomeModule');
      expect(result).toContain('level=warn');
      expect(result).toContain('message=сообщение');
      expect(result).toContain('context=SomeModule');
      expect(result).toContain('timestamp=');
    });

    it('каждое поле должно быть в формате key=value', () => {
      const result = logger.formatMessage('log', 'msg');
      const fields = result.trimEnd().split('\t');
      fields.forEach((field) => {
        expect(field).toContain('=');
      });
    });
  });

  describe('log()', () => {
    it('должен писать в process.stdout', () => {
      const spy = jest
        .spyOn(process.stdout, 'write')
        .mockImplementation(() => true);

      logger.log('тестовое сообщение');

      expect(spy).toHaveBeenCalledTimes(1);

      const output = spy.mock.calls[0][0] as string;
      expect(output).toContain('level=log');
      expect(output).toContain('message=тестовое сообщение');
    });
  });

  describe('error()', () => {
    it('должен писать в process.stderr', () => {
      const spy = jest
        .spyOn(process.stderr, 'write')
        .mockImplementation(() => true);

      logger.error('ошибка');
      expect(spy).toHaveBeenCalledTimes(1);
      const output = spy.mock.calls[0][0] as string;
      expect(output).toContain('level=error');
    });
  });
});

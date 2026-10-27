import { createSender } from '../../channel';
import { isService } from './index';
import { compareIsContenaVersion } from '../../context';

jest.mock('../../channel', () => ({
  createSender: jest.fn(() => jest.fn()),
}));

jest.mock('../../context', () => ({
  compareIsContenaVersion: jest.fn(),
}));

describe('Private Service Context', () => {
  beforeEach(() => {
    (compareIsContenaVersion as jest.Mock).mockResolvedValue(false);
  });

  it('creates a sender for the service check', () => {
    expect(createSender).toHaveBeenCalledWith('contextIsService', {});
    expect(isService).toEqual(expect.any(Function));
  });

  it('sends the service check request', async () => {
    const sender = (createSender as jest.Mock).mock.results[0]?.value as jest.Mock;

    await isService();

    expect(sender).toHaveBeenCalledWith();
  });

  it('throws without sending the service check before Contena 6.7.14.0', async () => {
    const sender = (createSender as jest.Mock).mock.results[0]?.value as jest.Mock;
    (compareIsContenaVersion as jest.Mock).mockResolvedValue(true);
    sender.mockClear();

    await expect(isService()).rejects.toThrow(
      'isService() requires Contena 6.7.14.0 or newer',
    );

    expect(compareIsContenaVersion).toHaveBeenCalledWith('<', '6.7.14.0');
    expect(sender).not.toHaveBeenCalled();
  });
});

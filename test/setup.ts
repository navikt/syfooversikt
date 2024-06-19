import { vi } from 'vitest';

vi.stubGlobal('XMLHttpRequest', vi.fn());

vi.mock('@amplitude/analytics-browser', () => ({
  track: vi.fn(),
  init: vi.fn(),
}));

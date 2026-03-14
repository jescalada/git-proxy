/**
 * Copyright 2026 GitProxy Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest';

describe('local auth defaults', () => {
  const originalNodeEnv = process.env.NODE_ENV;

  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    process.env.NODE_ENV = originalNodeEnv;
  });

  it('does not create default local users in production', async () => {
    process.env.NODE_ENV = 'production';

    const dbStub = {
      findUser: vi.fn(),
      createUser: vi.fn(),
    };
    vi.doMock('../../../src/db', () => dbStub);

    const { createDefaultAdmin } = await import('../../../src/service/passport/local');
    await createDefaultAdmin();

    expect(dbStub.findUser).not.toHaveBeenCalled();
    expect(dbStub.createUser).not.toHaveBeenCalled();
  });

  it('creates default local users outside production when missing', async () => {
    process.env.NODE_ENV = 'test';

    const dbStub = {
      findUser: vi.fn().mockResolvedValue(null),
      createUser: vi.fn().mockResolvedValue(undefined),
    };
    vi.doMock('../../../src/db', () => dbStub);

    const { createDefaultAdmin } = await import('../../../src/service/passport/local');
    await createDefaultAdmin();

    expect(dbStub.findUser).toHaveBeenCalledWith('admin');
    expect(dbStub.findUser).toHaveBeenCalledWith('user');
    expect(dbStub.createUser).toHaveBeenCalledWith(
      'admin',
      'admin',
      'admin@place.com',
      'none',
      true,
    );
    expect(dbStub.createUser).toHaveBeenCalledWith('user', 'user', 'user@place.com', 'none', false);
  });
});

describe('local auth login hardening', () => {
  const originalNodeEnv = process.env.NODE_ENV;
  let verifyCallback:
    | ((
        username: string,
        password: string,
        done: (err: unknown, user?: unknown, info?: unknown) => void,
      ) => Promise<void>)
    | undefined;

  beforeEach(() => {
    vi.resetModules();
    verifyCallback = undefined;
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    process.env.NODE_ENV = originalNodeEnv;
  });

  it('rejects known default credentials in production before DB lookup', async () => {
    process.env.NODE_ENV = 'production';

    const dbStub = {
      findUser: vi.fn(),
      createUser: vi.fn(),
    };
    const passportStub = {
      use: vi.fn(),
      serializeUser: vi.fn(),
      deserializeUser: vi.fn(),
    };

    vi.doMock('../../../src/db', () => dbStub);
    vi.doMock('passport-local', () => ({
      Strategy: class {
        constructor(
          callback: (
            username: string,
            password: string,
            done: (err: unknown, user?: unknown, info?: unknown) => void,
          ) => Promise<void>,
        ) {
          verifyCallback = callback;
        }
      },
    }));

    const { configure } = await import('../../../src/service/passport/local');
    await configure(passportStub as any);

    expect(verifyCallback).toBeDefined();
    const done = vi.fn();
    await verifyCallback!('admin', 'admin', done);

    expect(dbStub.findUser).not.toHaveBeenCalled();
    expect(done).toHaveBeenCalledTimes(1);
    const [_err, user, info] = done.mock.calls[0];
    expect(user).toBeUndefined();
    expect((info as { message?: string })?.message).toContain('Default credentials are disabled');
  });
});

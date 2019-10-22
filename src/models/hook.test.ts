import Hook, { HookCallback, HookMatcher } from './hook';

let hook: Hook<typeof state>;
let matcher: HookMatcher;
let callback: HookCallback<typeof state>;
const state = { foo: '', bar: 1, baz: false };

beforeEach(() => {
  matcher = jest.fn((action: string) => action === 'TEST_ACTION');
  callback = jest.fn();
  hook = new Hook(matcher, callback);
});

describe('Hook', () => {
  describe('run', () => {
    it('should run the callback', () => {
      hook.run(state);
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should check whether action matches the hook', () => {
      expect(hook.matches('TEST_ACTION')).toBeTruthy();
      expect(hook.matches('FOO_ACTION')).toBeFalsy();
      expect(hook.matches('BAR_ACTION')).toBeFalsy();
      expect(hook.matches('BAZ_ACTION')).toBeFalsy();
    });

    it('should call the callback with state and true on the first run', () => {
      hook.run(state);
      expect(callback).toHaveBeenCalledWith(state, true);
    });

    it('should call the callback with state and false on the second run and so forth', () => {
      hook.run(state);
      for (let i = 0; i < 9; i++) {
        hook.run(state);
        expect(callback).toHaveBeenCalledWith(state, false);
      }
    });
  });
});

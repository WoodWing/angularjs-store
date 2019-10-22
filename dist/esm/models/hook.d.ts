export declare type HookMatcher = (action: string) => boolean;
export declare type HookCallback<State> = (state: Readonly<State>, initialRun: boolean) => void;
export default class Hook<State> {
  private $$match;
  private $$callback;
  private $$called;
  constructor(matcher: HookMatcher, callback: HookCallback<State>);
  run(state: Readonly<State>): void;
  matches: (action: string) => boolean;
}

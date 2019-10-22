import { HookCallback } from './models/hook';
import HookLink from './models/hook-link';
export declare type HookActionQuery<Actions extends string[] = string[]> =
  | '*'
  | Actions[number]
  | Array<Actions[number] | '*'>
  | RegExp;
declare type StateFactory<T> = (prevState: T) => Partial<T>;
export default class NgStore<
  State extends {
    [key: string]: any;
  } = {},
  Actions extends string[] = string[]
> {
  private $$stateHolder;
  private $$hooks;
  constructor(initialState: State);
  copy(): State;
  hook(query: HookActionQuery<Actions>, callback: HookCallback<State>): HookLink;
  dispatch(action: Actions[number], state: Partial<State>): void;
  dispatch(action: Actions[number], setState: StateFactory<State>): void;
}
export {};

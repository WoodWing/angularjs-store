export interface StateHolder<State> {
  get(): State;
  set(partialState: Partial<State>): void;
}
export default function holdState<State>(state: State): StateHolder<State>;

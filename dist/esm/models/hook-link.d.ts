import { IScope } from 'angular';
export default class HookLink {
  private $$destroyer;
  constructor(destroyer: () => void);
  destroy(): void;
  destroyOn(scope: IScope): void;
}

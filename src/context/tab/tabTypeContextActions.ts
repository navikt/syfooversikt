import { OverviewTabType } from '@/konstanter';

export enum ActionType {
  SetTabType,
}

export interface SetTabType {
  type: ActionType.SetTabType;
  tabType: OverviewTabType;
}

import {
  GOAL_TYPE_FEATURES,
  GOAL_TYPE_INCOME,
  GOAL_TYPE_MONETIZATION,
  GOAL_TYPE_RISK,
  GOAL_TYPE_USERS
} from "./constants/constants";

export class Iteration {
  constructor(description="New Iteration", goals=[]) {
    this.description = description
    this.goals = goals;

    this.duration = 1;
    this.solved = false
  }

  setDuration(duration) {
    this.duration = duration
    return this;
  }

  static createRiskGoal = (project, riskId)                 => ({goalType: GOAL_TYPE_RISK, riskId})
  static createIncomeGoal = (project, income)               => ({goalType: GOAL_TYPE_INCOME, income})
  static createUserGoal = (project, audienceID, amount)     => ({goalType: GOAL_TYPE_USERS, userId: audienceID, amount})
  static createMonetizationGoal = (project, planId, amount) => ({goalType: GOAL_TYPE_MONETIZATION, planId, amount})
  static createFeatureGoal = (project, text)                => ({goalType: GOAL_TYPE_FEATURES, text})

  static getGoalsByGoalType = goalType => (it) => it.goals.filter(gg => gg.goalType === goalType)
}
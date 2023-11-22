import {APP_TYPE_APP, APP_TYPE_GAME} from "../constants/constants";

export const isGame = project => project.type === APP_TYPE_GAME
export const isApp = project => project.type === APP_TYPE_APP
import {UiState, INITIAL_UI_STATE} from "./ui-state";
import {StoreData, INITIAL_STORE_DATA, INITIAL_APP_DB, IAppDb} from "./store-data";

export interface ApplicationState {
    uiState: UiState,
    storeData: StoreData
    appDb: IAppDb
}
export const INITIAL_APPLICATION_STATE: ApplicationState = {
    uiState: INITIAL_UI_STATE,
    storeData: INITIAL_STORE_DATA,
    appDb: INITIAL_APP_DB
};
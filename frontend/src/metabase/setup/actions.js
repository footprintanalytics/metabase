import { createAction } from "redux-actions";
import { createThunkAction } from "metabase/lib/redux";

import * as MetabaseAnalytics from "metabase/lib/analytics";
import MetabaseSettings from "metabase/lib/settings";

import { SetupApi, UtilApi } from "metabase/services";

// action constants
export const SET_ACTIVE_STEP = "SET_ACTIVE_STEP";
export const SET_LANGUAGE_DETAILS = "SET_LANGUAGE_DETAILS";
export const SET_USER_DETAILS = "SET_USER_DETAILS";
export const SET_DATABASE_DETAILS = "SET_DATABASE_DETAILS";
export const SET_ALLOW_TRACKING = "SET_ALLOW_TRACKING";
export const VALIDATE_DATABASE = "VALIDATE_DATABASE";
export const VALIDATE_PASSWORD = "VALIDATE_PASSWORD";
export const SUBMIT_SETUP = "SUBMIT_SETUP";
export const COMPLETE_SETUP = "COMPLETE_SETUP";

// action creators
export const setActiveStep = createAction(SET_ACTIVE_STEP);
export const setLanguageDetails = createAction(SET_LANGUAGE_DETAILS);
export const setUserDetails = createAction(SET_USER_DETAILS);
export const setDatabaseDetails = createAction(SET_DATABASE_DETAILS);
export const setAllowTracking = createAction(SET_ALLOW_TRACKING);

export const validateDatabase = createThunkAction(VALIDATE_DATABASE, function(
  database,
) {
  return async function(dispatch, getState) {
    return await SetupApi.validate_db({
      token: MetabaseSettings.get("setup-token"),
      // NOTE: the validate endpoint calls this `details` but it's actually an object containing `engine` and `details`
      details: database,
    });
  };
});

export const validatePassword = createThunkAction(VALIDATE_PASSWORD, function(
  password,
) {
  return async function(dispatch, getState) {
    return await UtilApi.password_check({
      password: password,
    });
  };
});

export const submitSetup = createThunkAction(SUBMIT_SETUP, function() {
  return async function(dispatch, getState) {
    const {
      setup: { allowTracking, databaseDetails, userDetails, languageDetails },
    } = getState();

    try {
      // NOTE: this request will return a Set-Cookie header for the session
      const response = await SetupApi.create({
        token: MetabaseSettings.get("setup-token"),
        prefs: {
          site_name: userDetails.site_name,
          site_locale: languageDetails.site_locale,
          allow_tracking: allowTracking.toString(),
        },
        database: databaseDetails,
        user: userDetails,
      });

      // setup complete!
      dispatch(completeSetup(response));

      return null;
    } catch (error) {
      MetabaseAnalytics.trackStructEvent("Setup", "Error", "save");

      return error;
    }
  };
});

export const completeSetup = createAction(COMPLETE_SETUP, function(
  apiResponse,
) {
  // clear setup token from settings
  MetabaseSettings.set("setup-token", null);

  return true;
});

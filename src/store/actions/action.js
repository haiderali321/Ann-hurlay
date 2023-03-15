
import { _storeData, _retrieveData } from '../../services/assynsStorage';
import { getApi, postApi, putApi, deleteApi } from '../../services/api/apiFunction';
import Toast from 'react-native-toast-message';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { AccessToken, LoginManager } from 'react-native-fbsdk-next';
import Contacts from 'react-native-contacts';

export const getCurrentUser = (key) => async dispatch => {
  console.log(key, 'User')
  let retrievAsync = await _retrieveData('Token')
  let resp = await getApi('user-profile/', null, null, retrievAsync);
  dispatch({ type: "FETCH_USER", payload: resp });
}

export const getAllUsers = (key) => async dispatch => {
  let retrievAsync = await _retrieveData('Token')
  let resp = await getApi('user-profile/search', null, null, retrievAsync);
  dispatch({ type: "FETCH_ALL_USER", payload: resp });
}

export const updateProfile = (user, navigation) => async dispatch => {
  let retrievAsync = await _retrieveData('Token')
  let resp = await putApi('user-profile/', user, null, retrievAsync);
  if (resp.status === 200) {
    dispatch({ type: "FETCH_USER", payload: resp.data, });
    Toast.show({ type: 'success', text1: 'Update successful', position: 'bottom' });
  }
  else {
    resp.name && Toast.show({ type: 'error', text1: resp.name[0], position: 'bottom' });
    resp.bio && Toast.show({ type: 'error', text1: resp.bio[0], position: 'bottom' });
    resp.birthdate && Toast.show({ type: 'error', text1: resp.birthdate[0], position: 'bottom' });
    resp.gender && Toast.show({ type: 'error', text1: resp.gender[0], position: 'bottom' });
    resp.address && Toast.show({ type: 'error', text1: resp.address[0], position: 'bottom' });
    resp.zip_code && Toast.show({ type: 'error', text1: resp.zip_code[0], position: 'bottom' });
    resp.country && Toast.show({ type: 'error', text1: resp.country[0], position: 'bottom' });
    resp.profile_picture && Toast.show({ type: 'error', text1: resp.profile_picture[0], position: 'bottom' });
  }
};

export const signIn = (credentials, navigation) => async dispatch => {
  let resp = await postApi('rest-auth/login/', credentials, true);
  if (resp.status === 200) {
    _storeData('Token', JSON.stringify(resp.data.key))
    navigation.navigate('Home')
    dispatch(getCurrentUser(resp.data.key))
    dispatch(getAllUsers())
    Toast.show({ type: 'success', text1: 'Login successful', position: 'bottom' });
  }
  resp.email?.length && Toast.show({ type: 'error', text1: resp.email[0], position: 'bottom' });
  resp.password?.length && Toast.show({ type: 'error', text1: resp.password[0], position: 'bottom' });
  resp.non_field_errors?.length && Toast.show({ type: 'error', text1: resp.non_field_errors[0], position: 'bottom' });
};

export const signUp = (credentials, navigation) => async dispatch => {
  let resp = await postApi('rest-auth/registration/', credentials, true);
  // console.log(JSON.stringify(resp.data.key), "User_Token")
  resp.email?.length && Toast.show({ type: 'error', text1: resp.email[0], position: 'bottom' });
  resp.password?.length && Toast.show({ type: 'error', text1: resp.password[0], position: 'bottom' });
  _storeData('Token', JSON.stringify(resp.data.key))
  resp.status === 201 && dispatch(getCurrentUser(resp.data.key))
  resp.status === 201 && dispatch(getAllUsers())
  resp.status === 201 && navigation.navigate('Home')
};

export const forgotPassword = (credentials, navigation) => async dispatch => {
  let resp = await postApi('api/password_reset/', credentials, true);
  resp.status === 200 && navigation.navigate('VerifyEmail')
  resp.status === 200 && Toast.show({ type: 'success', text1: 'Password reset e-mail has been sent.', position: 'bottom' });
  resp.email?.length && Toast.show({ type: 'error', text1: resp.email[0], position: 'bottom' });
};

export const verifyCode = (credentials, navigation) => async dispatch => {
  let resp = await postApi('api/password_reset/validate_token/', credentials, true);
  resp.status === 200 && navigation.navigate('ResetPassword', { token: credentials.token, headerText: 'Reset Password' })
  resp.status === 200 && Toast.show({ type: 'success', text1: 'Token has been verified', position: 'bottom' });
  resp.detail === 'Not found.' && Toast.show({ type: 'error', text1: "Token didn't matched", position: 'bottom' });
};

export const resetPassword = (credentials, navigation) => async dispatch => {
  let resp = await postApi('api/password_reset/confirm/', credentials, true);
  resp.status === 200 && navigation.navigate('SignIn')
  resp.status === 200 && Toast.show({ type: 'success', text1: 'Password has been reset', position: 'bottom' });
  resp.password?.length && Toast.show({ type: 'error', text1: resp.password[0], position: 'bottom' });
};

export const resetPasswordInsideApp = (credentials, navigation) => async dispatch => {
  let retrievAsync = await _retrieveData('Token')
  let resp = await postApi('rest-auth/password/change/', credentials, true, retrievAsync);
  resp.status === 200 && navigation.navigate('SignIn')
  resp.status === 200 && Toast.show({ type: 'success', text1: 'New password has been saved.', position: 'bottom' });
  resp.new_password1?.length && Toast.show({ type: 'error', text1: resp.new_password1[0], position: 'bottom' });
  resp.new_password2?.length && Toast.show({ type: 'error', text1: resp.new_password2[0], position: 'bottom' });
};

export const termsAndCondition = (credentials, navigation) => async dispatch => {
  let resp = await getApi('modules/terms-and-conditions/', null, true, null);
  dispatch({ type: "FETCH_TERMS_AND_CONDITION", payload: resp });
};

export const privacyPolicy = (credentials, navigation) => async dispatch => {
  let resp = await getApi('modules/privacy-policy/', null, true, null);
  dispatch({ type: "FETCH_PRIVACY_POLICY", payload: resp });
};

export const getEvents = (navigation) => async dispatch => {
  let retrievAsync = await _retrieveData('Token')
  let resp = await getApi('events/event/', null, null, retrievAsync);
  dispatch({ type: "FETCH_EVENT", payload: resp });
};

export const getInvites = (navigation) => async dispatch => {
  let retrievAsync = await _retrieveData('Token')
  let resp = await getApi('events/invites/', null, null, retrievAsync);
  dispatch({ type: "FETCH_INVITE", payload: resp });
};

export const getCalenderBookedDate = (navigation) => async dispatch => {
  let retrievAsync = await _retrieveData('Token')
  let resp = await getApi('events/calendar/', null, null, retrievAsync);
  dispatch({ type: "FETCH_BOOKED_DATE", payload: resp });
};

export const createEvent = (picture, data, navigation, surveyAnswear, surveyQuestion, surveyChoiceType) => async dispatch => {
  let retrievAsync = await _retrieveData('Token')
  let resp = await postApi('events/event/', data, null, retrievAsync);
  console.log(resp, "resp_create_event")
  if (resp.itinerary_items && resp.itinerary_items.length != 0) {
    for (let index = 0; index < resp.itinerary_items.length; index++) {
      const element = resp.itinerary_items[index];
      element.location?.length && Toast.show({ type: 'error', text1: element.location[0] == 'This field may not be blank.' ? 'Itinerary field may not be blank.' : element.location[0], position: 'bottom' });
    }
  }
  let respImageUpload = await putApi('events/event/' + resp.data.id + '/', picture, null, retrievAsync);
  resp.length && Toast.show({ type: 'error', text1: resp[0], position: 'bottom' });
  resp.status === 201 && dispatch(getEvents())
  resp.status === 201 && Toast.show({ type: 'success', text1: 'Event created successful', position: 'bottom' });
  resp.status === 201 && dispatch(getCalenderBookedDate())
  resp.status === 201 && dispatch(createQuestion(resp.data.id, surveyAnswear, surveyQuestion, surveyChoiceType))
  resp.status === 201 && dispatch({ type: "CLEAR_SURVEY", });
  resp.status === 201 && navigation.navigate('Home')
};

export const uploadImage = (picture, navigation, id) => async dispatch => {
  let retrievAsync = await _retrieveData('Token')
  let resp = await putApi('events/event/' + id + '/', picture, null, retrievAsync);
  resp.status === 200 && dispatch(getEvents())
  resp.status === 200 && navigation.navigate('Home')
  resp.status === 200 && Toast.show({ type: 'success', text1: 'Images Uploded', position: 'bottom' });
  resp.length && Toast.show({ type: 'error', text1: resp[0], position: 'bottom' });
};

export const addMemberInEv = (date, navigation, id) => async dispatch => {
  let retrievAsync = await _retrieveData('Token')
  let resp = await putApi('events/event/' + id + '/', date, null, retrievAsync);
  console.log(resp, date, 'resp_addMemberInEv')
  resp.status === 200 && dispatch(getEvents())
  resp.status === 200 && navigation.navigate('Home')
  resp.status === 200 && Toast.show({ type: 'success', text1: 'Members Updated', position: 'bottom' });
  resp.length && Toast.show({ type: 'error', text1: resp[0], position: 'bottom' });
};

export const updateEvStatus = (date, navigation, id) => async dispatch => {
  let retrievAsync = await _retrieveData('Token')
  let resp = await putApi('events/invites/' + id + '/', date, null, retrievAsync);
  resp.status === 200 && Toast.show({ type: 'success', text1: 'Status Updated', position: 'bottom' });
  resp.status === 200 && dispatch(getEvents())
  resp.status === 200 && navigation.navigate('Home')
  resp.detail && Toast.show({ type: 'error', text1: resp.detail, position: 'bottom' });
};

export const deleteEvent = (navigation, id) => async dispatch => {
  let retrievAsync = await _retrieveData('Token')
  let resp = await deleteApi('events/event/' + id + '/', null, null, retrievAsync);
  resp.status === 204 && Toast.show({ type: 'error', text1: 'The event has been successfully removed.', position: 'bottom' });
  resp.status === 204 && dispatch(getEvents())
  resp.status === 204 && navigation.navigate('Home')
};

export const showError = (navigation) => async dispatch => {
  dispatch({ type: "IS_ERROR", payload: true });
  setTimeout(() => {
    dispatch({ type: "IS_ERROR", payload: false });
  }, 5000);
};

export const googleSignIn = (navigation) => async dispatch => {
  let retrievAsync = await _retrieveData('Token')
  try {
    const userInfo = GoogleSignin.signIn()
      .then(async (data) => {
        const currentUser = GoogleSignin.getTokens().then(async (res) => {
          console.log(res, 'userInfo')

          let data = {
            access_token: res.accessToken
          }
          let resp = await postApi('users/google', data, true, retrievAsync);
          console.log(resp, "resp_google_SignIn")
          if (resp.status === 200) {
            _storeData('Token', JSON.stringify(resp.data.key))
            navigation.navigate('Home')
            dispatch(getCurrentUser(resp.data.key))
            dispatch(getAllUsers())
            Toast.show({ type: 'success', text1: 'Login successful', position: 'bottom' });
          }
          resp.detail?.length && Toast.show({ type: 'error', text1: resp.detail, position: 'bottom' });
          resp.non_field_errors?.length && Toast.show({ type: 'error', text1: resp.non_field_errors[0], position: 'bottom' });
        });
      })
      .then((user) => {
        // console.log("TEST G LOGIN 1 " + JSON.stringify(user))
      })
      .catch((error) => {
        Toast.show({ type: 'error', text1: error.message, position: 'bottom' });
        console.log("....." + JSON.stringify(error))
      });

  } catch (error) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      console.log(error, "error_SIGN_IN_CANCELLED")
      // user cancelled the login flow
    } else if (error.code === statusCodes.IN_PROGRESS) {
      console.log(error, "error_IN_PROGRESS")
      // operation (e.g. sign in) is in progress already
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      console.log(error, "error_PLAY_SERVICES_NOT_AVAILABLE")
      // play services not available or outdated
    } else {
      console.log(error, "error")
      // some other error happened
    }
  }
};

export const faceBookSignin = (navigation) => async dispatch => {
  let retrievAsync = await _retrieveData('Token')
  LoginManager.logInWithPermissions(["public_profile"]).then(
    function (result) {
      if (result.isCancelled) {
        // console.log("Login cancelled");
        Toast.show({ type: 'error', text1: 'Login cancelled', position: 'bottom' });
      } else {
        console.log(
          result, "Login success with permissions: " +
        result.grantedPermissions.toString()
        );
        const currentUser = AccessToken.getCurrentAccessToken().then(
          async (res) => {
            console.log('token', res)
            let data = {
              access_token: res.accessToken
            }
            let resp = await postApi('users/facebook', data, true, retrievAsync);
            console.log(resp, "resp_facebook_SignIn")
            if (resp.status === 200) {
              _storeData('Token', JSON.stringify(resp.data.key))
              navigation.navigate('Home')
              dispatch(getCurrentUser(resp.data.key))
              dispatch(getAllUsers())
              Toast.show({ type: 'success', text1: 'Login successful', position: 'bottom' });
            }
            resp.detail?.length && Toast.show({ type: 'error', text1: resp.detail, position: 'bottom' });
            resp.non_field_errors?.length && Toast.show({ type: 'error', text1: resp.non_field_errors[0], position: 'bottom' });
          }
        )
        console.log(currentUser, 'currentUser')
      }
    },
    function (error) {
      // console.log("Login fail with error: " + error);
      Toast.show({ type: 'error', text1: " " + error, position: 'bottom' });

    }
  );
};

export const sendMsg = (date, id, pvtEmail) => async dispatch => {
  let retrievAsync = await _retrieveData('Token')
  let resp = await postApi('api/chat/send-message/', date, true, retrievAsync);
  dispatch(getChats(id))
};

export const getChats = (id) => async dispatch => {
  let retrievAsync = await _retrieveData('Token')
  let resp = await getApi('api/chat/channel-messages/' + id + '/ ', null, true, retrievAsync);
  dispatch({ type: "FETCH_CHAT", payload: resp.results });
};

export const getPvtChats = (senderEmail) => async dispatch => {
  let retrievAsync = await _retrieveData('Token')
  let channelId = await getApi('api/chat/private-channel/' + senderEmail + '/ ', null, true, retrievAsync);
  let resp = await getApi('api/chat/channel-messages/' + channelId.pk + '/ ', null, true, retrievAsync);
  dispatch({ type: "FETCH_PVT_ID", payload: channelId.pk });
  dispatch({ type: "FETCH_CHAT", payload: resp.results });
};

export const getInboxItems = () => async dispatch => {
  dispatch({ type: "IS_LOADER" });
  let retrievAsync = await _retrieveData('Token')
  let respSingleInbox = await getApi('api/chat/inbox', null, true, retrievAsync);
  let respGroupInbox = await getApi('api/chat/group-inbox/', null, true, retrievAsync);
  dispatch({ type: "FETCH_INBOX_ITEMS_SINGLE", payload: respSingleInbox });
  dispatch({ type: "FETCH_INBOX_ITEMS_GROUP", payload: respGroupInbox });
  dispatch({ type: "IS_LOADER" });
};

export const getContacts = () => async dispatch => {
  Contacts.getAll().then(contacts => {
    let propertyAddInContact = []
    for (let index = 0; index < contacts.length; index++) {
      const element = contacts[index];
      element.selected = false
      propertyAddInContact.push(element)
    }
    dispatch({ type: "FETCH_CONTACTS", payload: propertyAddInContact });
  });
};

export const feedBack = (data) => async dispatch => {
  let retrievAsync = await _retrieveData('Token')
  let resp = await postApi('user-profile/feedback', data, null, retrievAsync);
  resp.status === 201 && Toast.show({ type: 'success', text1: 'Your feedback has been successfully submitted', position: 'bottom' });
  resp.email?.length && Toast.show({ type: 'error', text1: resp.email[0], position: 'bottom' });
  resp.name?.length && Toast.show({ type: 'error', text1: resp.name[0], position: 'bottom' });
  resp.message?.length && Toast.show({ type: 'error', text1: resp.message[0], position: 'bottom' });
};

export const logout = (navigation) => async dispatch => {
  // let retrievAsync = await _retrieveData('Token')
  // let resp = await postApi('rest-auth/logout/', null, true, retrievAsync);
  // resp.status === 200 && navigation.navigate('SignIn')
  // resp.status === 200 && Toast.show({ type: 'success', text1: 'Successfully logged out.', position: 'bottom' });
  LoginManager.logOut();
  try {
    await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
  } catch (error) {
    console.error(error);
  }
  Toast.show({ type: 'success', text1: 'Successfully logged out.', position: 'bottom' });
  navigation.navigate('SignIn')
};

export const deletAccount = (navigation) => async dispatch => {
  let retrievAsync = await _retrieveData('Token')
  let resp = await deleteApi('user-profile/delete', null, null, retrievAsync);
  resp.status === 204 && navigation.navigate('SignIn')
  resp.status === 204 && Toast.show({ type: 'success', text1: 'Successfully deleted account.', position: 'bottom' });
};

export const setSurveyOption = (answare, question, choice, navigation) => async dispatch => {
  dispatch({ type: "SET_SURVEY", payload: answare });
  dispatch({ type: "SET_SURVEY_QUESTION", payload: question });
  dispatch({ type: "SET_SURVEY_CHOICE", payload: choice });
  // navigation.goBack()
};

export const getSurveyQuestion = () => async dispatch => {
  dispatch({ type: "IS_LOADER" });
  let retrievAsync = await _retrieveData('Token')
  let resp = await getApi('surveys/polls/', null, null, retrievAsync);
  dispatch({ type: "FETCH_SURVEY_POLLS", payload: resp });
};

export const getSurveyChoice = () => async dispatch => {
  dispatch({ type: "IS_LOADER" });
  let retrievAsync = await _retrieveData('Token')
  let resp = await getApi('surveys/choices/', null, null, retrievAsync);
  dispatch({ type: "FETCH_SURVEY_CHOICES", payload: resp });
};

export const createQuestion = (evId, surveyAnswear, surveyQuestion, surveyChoiceType) => async dispatch => {
  let data = {
    event: evId,
    text: surveyQuestion,
    poll_type: surveyChoiceType != 'Multiple Choice' ? 'Text Poll' : 'Choice Poll',
  }
  let retrievAsync = await _retrieveData('Token')
  let resp = await postApi('surveys/polls/', data, null, retrievAsync);
  resp.status === 201 && dispatch(createAnswear(resp.data.id, surveyAnswear, surveyChoiceType))
};

export const createAnswear = (pollId, surveyAnswear, surveyChoiceType) => async dispatch => {
  let multiAnswear = []
  for (let index = 0; index < surveyAnswear.length; index++) {
    const element = surveyAnswear[index].choice_text;
    multiAnswear.push(element)
  }
  if (surveyChoiceType != 'Multiple Choice') {
    let data = {
      poll: pollId,
      choice_text: surveyAnswear[0].choice_text,
    }
    let retrievAsync = await _retrieveData('Token')
    let resp = await postApi('surveys/choices/', data, null, retrievAsync);
  }
  else {
    let data = {
      poll: pollId,
      choice_titles: multiAnswear,
    }
    let retrievAsync = await _retrieveData('Token')
    let resp = await postApi('surveys/choices-multiple/', data, null, retrievAsync);
  }
  dispatch(getSurveyQuestion())
  dispatch(getSurveyChoice())

};

export const surveyVotes = (id, navigation) => async dispatch => {
  let data = { choice: id }
  let retrievAsync = await _retrieveData('Token')
  let resp = await postApi('surveys/votes/', data, null, retrievAsync);
  resp.status === 201 && Toast.show({ type: 'success', text1: 'Successfully vote submited.', position: 'bottom' });
  resp.status === 201 && dispatch(getSurveyQuestion())
  resp.status === 201 && dispatch(getSurveyChoice())
  resp.status === 201 && navigation.goBack()
  resp.error && Toast.show({ type: 'error', text1: resp.error, position: 'bottom' });
};

export const updateVote = (id, pollId, navigation) => async dispatch => {
  let data = { choice: id }
  let retrievAsync = await _retrieveData('Token')
  let resp = await putApi('surveys/votes/' + pollId + '/', data, null, retrievAsync, 'PATCH');
  resp.status === 201 && Toast.show({ type: 'success', text1: 'Successfully vote submited.', position: 'bottom' });
  resp.status === 201 && dispatch(getSurveyQuestion())
  resp.status === 201 && dispatch(getSurveyChoice())
  resp.detail && Toast.show({ type: 'error', text1: resp.detail, position: 'bottom' });
};


export const getNotification = (credentials, navigation) => async dispatch => {
  let retrievAsync = await _retrieveData('Token')
  let resp = await getApi('user-profile/notification', null, null, retrievAsync);
  console.log(resp, 'resp_notification')
  dispatch({ type: "FETCH_NOTIFICATION", payload: resp });
};

export const addExpense = (data, navigation) => async dispatch => {
  let retrievAsync = await _retrieveData('Token')
  let resp = await postApi('events/expense/', data, null, retrievAsync);
  resp.status === 201 && Toast.show({ type: 'success', text1: 'Successfully expense added.', position: 'bottom' });
  resp.status === 201 && dispatch(getEvents())
  resp.status === 201 && navigation.goBack()
};






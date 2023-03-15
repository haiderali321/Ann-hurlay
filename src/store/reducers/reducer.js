const initState = {
    errorMsg: '',
    isError: false,
    isLoader: false,
    user: {},
    allUsers: [],
    terms: [],
    privacy: [],
    events: [],
    invites: [],
    bookedDate: [],
    inboxItems1to1: [],
    inboxItemsGroup: [],
    chats: [],
    contacts: [],
    pvtChannelId: null,
    selectedSurvey: [],
    surveyQuestion: '',
    surveyChoiceType: 'Multiple Choice',
    surveyPolls: [],
    surveyChoices: [],
    notification: [],
}

const reducer = (state = initState, action) => {
    // console.log(state.chats, "THIS_IS_REDUCER")
    switch (action.type) {
        case 'IS_ERROR':
            return {
                ...state,
                isError: action.payload,
            }
        case 'IS_LOADER':
            return {
                ...state,
                isLoader: !state.isLoader,
            }
        case 'FETCH_TERMS_AND_CONDITION':
            return {
                ...state,
                terms: action.payload,
            }
        case 'FETCH_PRIVACY_POLICY':
            return {
                ...state,
                privacy: action.payload,
            }
        case 'FETCH_USER':
            return {
                ...state,
                user: action.payload,
            }
        case 'FETCH_EVENT':
            return {
                ...state,
                events: action.payload,
            }
        case 'FETCH_BOOKED_DATE':
            return {
                ...state,
                bookedDate: action.payload,
            }
        case 'FETCH_ALL_USER':
            return {
                ...state,
                allUsers: action.payload,
            }
        case 'FETCH_INBOX_ITEMS_SINGLE':
            return {
                ...state,
                inboxItems1to1: action.payload,
            }
        case 'FETCH_INBOX_ITEMS_GROUP':
            return {
                ...state,
                inboxItemsGroup: action.payload,
            }
        case 'FETCH_CHAT':
            return {
                ...state,
                chats: action.payload,
            }
        case 'FETCH_INVITE':
            return {
                ...state,
                invites: action.payload,
            }
        case 'FETCH_CONTACTS':
            return {
                ...state,
                contacts: action.payload,
            }
        case 'FETCH_PVT_ID':
            return {
                ...state,
                pvtChannelId: action.payload,
            }
        case 'SET_SURVEY':
            return {
                ...state,
                selectedSurvey: action.payload,
            }
        case 'SET_SURVEY_QUESTION':
            return {
                ...state,
                surveyQuestion: action.payload,
            }
        case 'SET_SURVEY_CHOICE':
            return {
                ...state,
                surveyChoiceType: action.payload,
            }
        case 'FETCH_SURVEY_CHOICES':
            return {
                ...state,
                surveyChoices: action.payload,
            }
        case 'FETCH_SURVEY_POLLS':
            return {
                ...state,
                surveyPolls: action.payload,
            }
        case 'CLEAR_SURVEY':
            return {
                ...state,
                selectedSurvey: [],
                surveyQuestion: '',
            }
        case 'FETCH_NOTIFICATION':
            return {
                ...state,
                notification: action.payload,
            }
        default:
            return state
    }
}
export default reducer
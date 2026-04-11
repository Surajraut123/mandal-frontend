import { createAsyncThunk, createSlice, isFulfilled } from '@reduxjs/toolkit'
import { getCall } from '../../axios/apis';

const initialState ={
    roleName: "",
    userId: null,
    userContributedData: [],
    investMentRequestsData: [],
    mandalMembers : [],
    loginToken : "",
    getContributedDetails : []
}

export const fetchUserContribution = createAsyncThunk(
    'role/fetchUserContribution',
    async (endPoint) => {
        const response = await getCall(endPoint);
        return response.data;
    }
)
export const fetchUserInvestmentRequests = createAsyncThunk(
    'role/fetchUserInvestments',
    async (endPoint) => {
        const response = await getCall(endPoint);
    return response.data;
    }
)

export const fetchMandalMembers = createAsyncThunk(
    'role/fetchMandalMembers',
    async (endPoint) => {
        const response = await getCall(endPoint);
        return response.data;
    }
)

export const fetchContributedUsers = createAsyncThunk(
    'role/fetchContributionDetails', 
    async (endPoint) => {
        const response = await getCall(endPoint);
        return response.data
    }
)

const slice = createSlice({
    name: 'role',
    initialState,
    reducers: {
        setRole: (state, action) => {
            state.roleName = action.payload;
        },
        setLoggedInUserId: (state, action) => {
            state.userId = action.payload;
        },
        clearRole : (state) => {
            state.roleName = null;
        },
        setToken : (state, action) => {
            state.loginToken = action.payload
        },
        setUserContributedData : (state, action) => {
            state.userContributedData = action.payload
        },
        getUserInvestmentRequests : (state, action) => {
            state.userContributedData = action.payload
        },
        setMandalMembers : (state, action) => {
            state.mandalMembers = action.payload
        },
        updateRequestStatus: (state, action) => {
            const { data, newStatus, request_id, type, event } = action.payload;
            console.log("Updating request status in redux slice : ", action.payload);
            const list =
              type === 'contribution'
                ? state.userContributedData.data
                : state.investMentRequestsData.data;
            
            console.log("List to be updated : ", list);
            console.log("Event Type : ", event, " ", event === "update");
            console.log("type : ", typeof request_id)
            if(event) {
                if(event === "add") {
                    list.unshift(data);
                    console.log("List after adding new request : ", list);
                    return;
                } else if(event === "update") {
                    const item = list.find((i) => i.request_id === request_id);
                    console.log("Existing status : ", item, " newStatus : ", newStatus, " Request id : ", request_id)
                    if (item) {
                        console.log("Updating status for request id : ", request_id, " from ", item.request_status, " to ", newStatus);
                        item.request_status = newStatus.toUpperCase();
                    }
                }
            } else {
                console.error("No event type matched");
            }
            console.log("List : ", list)
        },
        updateMandalMemberStatus: (state, action) => {

            console.log("Inside updateMandalMemberStatus reducer, action payload : ", action.payload);
            const { user_id, newStatus } = action.payload;
            console.log("Updating mandal member status in redux slice : ", state.mandalMembers);
            const member = state.mandalMembers.userList.find((member) => member.user_id === user_id);
            console.log("Existing member : ", member, " newStatus : ", newStatus, " User id : ", user_id)
            if (member) {
                member.status = (newStatus === "active") ? true : false;
            }

        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchUserContribution.fulfilled, (state, action) => {
            state.userContributedData = action.payload
        })
        builder.addCase(fetchUserInvestmentRequests.fulfilled, (state, action) => {
            state.investMentRequestsData = action.payload
        })
        builder.addCase(fetchMandalMembers.fulfilled, (state, action) => {
            state.mandalMembers = action.payload
        })
        builder.addCase(fetchContributedUsers.fulfilled, (state, action) => {
            state.getContributedDetails = action.payload
        })
    }
})
export const { setRole, setLoggedInUserId, clearRole, setToken, setUserContributedData, getUserInvestmentRequests, setMandalMembers, updateRequestStatus, updateMandalMemberStatus} = slice.actions;
export default slice.reducer;
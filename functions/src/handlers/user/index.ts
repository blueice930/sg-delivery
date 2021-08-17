import initFirebase from '../../helpers/initFirebase';
import {registerUserFn} from './registerUserFn';
import {updateUserFn} from './updateUserFn';
import {topUpFn} from './topUpFn';
import {functions} from '../../helpers/initFirebaseFunctions';
import {fetchUserFn} from './fetchUserFn';

initFirebase();

const registerUser = functions.onCall(registerUserFn);
const updateUser = functions.onCall(updateUserFn);
const topUp = functions.onCall(topUpFn);
const fetchUser = functions.onCall(fetchUserFn);

export {
  registerUser,
  updateUser,
  topUp,
  fetchUser,
};

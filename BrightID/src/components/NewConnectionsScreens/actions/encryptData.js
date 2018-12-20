// @flow

import { createCipher } from 'react-native-crypto';
import { Buffer } from 'buffer';
import { postData } from './postData';
import { retrieveAvatar } from '../../../utils/filesystem';
import { obj2b64, objToUint8, strToUint8Array, uInt8Array2b64 } from '../../../utils/encoding';
import nacl from "tweetnacl";

export const encryptAndUploadLocalData = () => async (dispatch, getState) => {
  const {
    publicKey,
    secretKey,
    avatar: { uri },
    nameornym,
    connectQrData: { aesKey },
    trustScore,
    connectUserData,
  } = getState().main;

  // encode public key into a base64 string
  const base64Key = uInt8Array2b64(publicKey);
  // retrieve avatar
  const avatar = await retrieveAvatar(uri);

  let timestamp;
  let signedMessage;

  if(connectUserData.publicKey && !connectUserData.signedMessage) {
    // The other user sent their publicKey. Sign the message and send it.

    timestamp = Date.now();
    const message = base64Key + obj2b64(connectUserData.publicKey) + timestamp;
    signedMessage = obj2b64(nacl.sign.detached(strToUint8Array(message), objToUint8(secretKey)));
  }

  const dataObj = {
    publicKey: base64Key,
    avatar,
    nameornym,
    trustScore,
    signedMessage,
    timestamp,
  };

  const dataStr = JSON.stringify(dataObj);

  const cipher = createCipher('aes128', aesKey);

  let encrypted =
    cipher.update(dataStr, 'utf8', 'base64') + cipher.final('base64');
  console.log('encrypting data');
  dispatch(postData(encrypted));
};

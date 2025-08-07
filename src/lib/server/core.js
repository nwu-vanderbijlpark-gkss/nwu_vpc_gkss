import { json } from "@sveltejs/kit"
import { CRYPTO_KEY } from '$env/static/private';
import CryptoJS from 'crypto-js';
// place files you want to import through the `$lib` alias in this folder.
const key = CRYPTO_KEY;

export const encrypt = (text) => {
    return CryptoJS.AES.encrypt(text,key).toString();
}

export const decrypt = (cipherText) => {
    const bytes = CryptoJS.AES.decrypt(cipherText,key);
    return bytes.toString(CryptoJS.enc.Utf8);
}

 //returns the supabase.from(tablename).query... to be used as table(supabase,tablename).query...
export const table = (supabase,table) => supabase.from(table);

export const returnData = (data,error) => {
    /**@description checks the error and data and return the json, must be returned in calling */
    if(error){
        return json({success: false, data: error})
    }
    else{
        return json({success: true, data: data})
    }
}
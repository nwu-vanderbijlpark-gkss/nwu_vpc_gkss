import { json } from "@sveltejs/kit"


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
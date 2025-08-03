import { decrypt } from '$lib';

export const load = async ({cookies, fetch, params}) => {
    const event_id = params.event_id;
    let judge = cookies.get("judge") || null;
    if(judge){
        //decrypt the judge
        judge = JSON.parse(decrypt(judge));
        let groups = null;
        //get the groups this judge hasnt judged yet
        let judge_id = judge[0].id;
        let req = await fetch(`/api/event/group?event=${event_id}&judge=${judge_id}`);
        let res = await req.json();
        if(res.success){
            groups = res.data;
        }
        return {judge, groups};
    }
    else{
        return {judge: null}
    }
}
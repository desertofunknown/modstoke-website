// Local empty responses match the reviewed envelope shape only.
// No existing client endpoint is changed and no remote API is contacted.
export function emptyCatalog(path, params) {
 if(path==='/api/categories') return {data:[]};
 if(path!=='/api/mods') return null;
 const requested=params.get('page')||'1';
 if(!/^[1-9][0-9]*$/.test(requested)||!Number.isSafeInteger(Number(requested))) throw Error('Invalid page');
 return {meta:{limit:20,next_page:null,page:Number(requested),pages:0,prev_page:null,total:0},data:[]};
}

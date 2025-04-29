export function fetchMap(filename){
    return new Promise((resolve,reject)=>{
        fetch(filename).then((resp)=>{
            var r = resp.text().then((s)=>{
                resolve(s)
            });
        });

    })
}

export async function loadJSON(filename){
    let map = await fetchMap(filename);
    return JSON.parse(map);
}    

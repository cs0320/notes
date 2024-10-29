const f = async (url:string) => {
    const response: Response = await fetch(url)
    const json = await response.json()
    return json;
}
//const g: (url:string) => Promise<Response> = f

const f2 = (url:string) => {
    const response: Promise<Response> = fetch(url)
    response.then( (response) => 
        response.json()
    ) // + some connective tissue to get the value back out

}

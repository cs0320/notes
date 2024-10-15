const f = async (url: string) => {
    const response = await fetch(url)
    return response;
}

export const fetcher = (url: string, includeCredentials = true) => 
    fetch(url, { credentials: includeCredentials ? 'include' : 'omit' })
      .then(res => res.json());
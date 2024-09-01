export const useApi = async (request, method,body=null) => {
    let token = getItem("accessToken")
    token = "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIxNWVvU25fZmNEOVNqSE11XzRSeFc0Rzh0RFlkTHBjUWZWZ0ZfX0x1aEdBIn0.eyJleHAiOjE3MjUzNzEwMTQsImlhdCI6MTcyNDc2NjIxNCwianRpIjoiYTlhYWE1MTUtOGZmYS00NTRhLWEyOWQtYTAwNDNkZDlkMzE5IiwiaXNzIjoiaHR0cHM6Ly9hY2NvdW50cy5ncmVlbnNoZWFydC5jb20vcmVhbG1zL2dyZWVuc2hlYXJ0IiwiYXVkIjoiYWNjb3VudCIsInN1YiI6IjUyYzY3ZjM5LTNlYzMtNDFjNS1hYzI4LThhZDQ1ZmJlMzIyNSIsInR5cCI6IkJlYXJlciIsImF6cCI6ImdyZWVuc2hlYXJ0Iiwic2Vzc2lvbl9zdGF0ZSI6IjNjNTVmNjg0LWUzNTEtNDBiOS1hMmM3LTM3MjllNDg1NGNlYiIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cHM6Ly9zZmVyMDA1OS1sb2NhbC5ncmVlbnNoZWFydC5jb20iLCJodHRwczovL2pjaHUwMDU2LWxvY2FsLmdyZWVuc2hlYXJ0LmNvbSIsImh0dHBzOi8vanlhcDAwMzAtbG9jYWwuZ3JlZW5zaGVhcnQuY29tIiwiaHR0cHM6Ly9hcmllZi1sb2NhbC5ncmVlbnNoZWFydC5jb20iLCJodHRwczovL3NndWgwMDAzLWxvY2FsLmdyZWVuc2hlYXJ0LmNvbSIsImh0dHBzOi8vZ3lvbjAwMDQtbG9jYWwuZ3JlZW5zaGVhcnQuY29tIiwiaHR0cHM6Ly9hcmF2MDAyMC1sb2NhbC5ncmVlbnNoZWFydC5jb20iLCJodHRwczovL3ljaHUwMDUzLWxvY2FsLmdyZWVuc2hlYXJ0LmNvbSIsImh0dHBzOi8vc3NzYW0tbG9jYWwuZ3JlZW5zaGVhcnQuY29tIiwiaHR0cHM6Ly9uaWNvbGFzd2VpbmJyZWNodC1sb2NhbC5ncmVlbnNoZWFydC5jb20iLCJodHRwOi8vbG9jYWxob3N0OjMwMDAiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImRlZmF1bHQtcm9sZXMtZ3JlZW5zaGVhcnQiLCJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJlbWFpbCBwcm9maWxlIiwic2lkIjoiM2M1NWY2ODQtZTM1MS00MGI5LWEyYzctMzcyOWU0ODU0Y2ViIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5hbWUiOiJKdW4gSmllIENodWEiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJqY2h1MDA1N0BzdHVkZW50Lm1vbmFzaC5lZHUiLCJnaXZlbl9uYW1lIjoiSnVuIEppZSIsImZhbWlseV9uYW1lIjoiQ2h1YSIsImVtYWlsIjoiamNodTAwNTdAc3R1ZGVudC5tb25hc2guZWR1In0.aGgjuYLETNxACppy_M1lo-jsfkX2eGC35KgB0BTQGzq3-5fwnKuxh-BKdcN4Zs0KVCs2o3-IifxnpbvGcmKmDNhgIuRuo6074vZbpxibAN_JD79mNvnqmvD4SSl0872mz_aRX5YP-Vb4UOK80n_YQVdJwFUIY8rJ0R8Xm5bWT7VkNNSTWg056eoRFv1HLiW-8lViZbG1mIInCfvecJXqANgcSzUkXbm7Sy3rrZPLKq22vmyWcqfJoE7q7QKzmmQplwc7AFB5tZMNYzHBK9m2iggtzzrlnDBnipnCIxsHkKIbZcoIT4T-HAXzGvn7mmvuBTjpJaW0c68R4bGMk5Utmg"
    let result = await useLazyFetch(request, {
        baseURL: "http://localhost:3001",
        method: method,
        body: method === "POST" ? JSON.stringify(body) : null,
        headers: {
            ...useRequestURL(),
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    });

  if(result.error.value == null) {
    result.data.isError = false
		return result.data
	}
	else {
    result.error.isError = true
		return result.error
	}
}

function getItem(item) {
    if (process.client) {
      return localStorage.getItem(item)
    } else {
      return undefined
    }
}

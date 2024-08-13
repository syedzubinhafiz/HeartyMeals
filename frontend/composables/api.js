export const useApi = async (request, method) => {
    let token = getItem("accessToken")
    token = "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIxNWVvU25fZmNEOVNqSE11XzRSeFc0Rzh0RFlkTHBjUWZWZ0ZfX0x1aEdBIn0.eyJleHAiOjE3MjQxNTE4MDIsImlhdCI6MTcyMzU0NzAwMiwianRpIjoiODcxYjUwN2QtODcxZC00MjFmLWI0NTEtMzM2NzhhYzFhNzU4IiwiaXNzIjoiaHR0cHM6Ly9hY2NvdW50cy5ncmVlbnNoZWFydC5jb20vcmVhbG1zL2dyZWVuc2hlYXJ0IiwiYXVkIjoiYWNjb3VudCIsInN1YiI6IjUxYWZjMTM3LTZhNDctNDA4Yi1hYWRhLWNmZmU3YTlkN2E0NSIsInR5cCI6IkJlYXJlciIsImF6cCI6ImdyZWVuc2hlYXJ0Iiwic2Vzc2lvbl9zdGF0ZSI6IjQ1Nzc4NjNiLWJlMWYtNGZiYS1hOGQzLWE0ZmExYzNmM2NkOCIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cHM6Ly9zZmVyMDA1OS1sb2NhbC5ncmVlbnNoZWFydC5jb20iLCJodHRwczovL2pjaHUwMDU2LWxvY2FsLmdyZWVuc2hlYXJ0LmNvbSIsImh0dHBzOi8vanlhcDAwMzAtbG9jYWwuZ3JlZW5zaGVhcnQuY29tIiwiaHR0cHM6Ly9hcmllZi1sb2NhbC5ncmVlbnNoZWFydC5jb20iLCJodHRwczovL3NndWgwMDAzLWxvY2FsLmdyZWVuc2hlYXJ0LmNvbSIsImh0dHBzOi8vZ3lvbjAwMDQtbG9jYWwuZ3JlZW5zaGVhcnQuY29tIiwiaHR0cHM6Ly9hcmF2MDAyMC1sb2NhbC5ncmVlbnNoZWFydC5jb20iLCJodHRwczovL3ljaHUwMDUzLWxvY2FsLmdyZWVuc2hlYXJ0LmNvbSIsImh0dHBzOi8vc3NzYW0tbG9jYWwuZ3JlZW5zaGVhcnQuY29tIiwiaHR0cHM6Ly9uaWNvbGFzd2VpbmJyZWNodC1sb2NhbC5ncmVlbnNoZWFydC5jb20iLCJodHRwOi8vbG9jYWxob3N0OjMwMDAiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImRlZmF1bHQtcm9sZXMtZ3JlZW5zaGVhcnQiLCJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJlbWFpbCBwcm9maWxlIiwic2lkIjoiNDU3Nzg2M2ItYmUxZi00ZmJhLWE4ZDMtYTRmYTFjM2YzY2Q4IiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5hbWUiOiJNYXJpbyBTdXNhbnRvIiwicHJlZmVycmVkX3VzZXJuYW1lIjoibXN1czAwMDRAc3R1ZGVudC5tb25hc2guZWR1IiwiZ2l2ZW5fbmFtZSI6Ik1hcmlvIiwibG9jYWxlIjoiZW4iLCJmYW1pbHlfbmFtZSI6IlN1c2FudG8iLCJlbWFpbCI6Im1zdXMwMDA0QHN0dWRlbnQubW9uYXNoLmVkdSJ9.pueBocu5MVoe8lrCb8cvDEnusmXxp9zWy8mszGokihrn2dNxOmhFe1971bjC_itslto9AOJNY4vTR-5FS9RpC85uCUrtD06Y0B0-44dCSVETBHf4TtWdd0lgJpsk-6ghev1X-_S6D19ly4IJVd-ekSE-SdmxPwX_TZZx8rHP2wJO_8hFPlGk3Huh4NSU4u7H-esVXTE593CYMk5LlmScaJpt_a3YujnNjYuuX96arr7rKiQ0XvUg3nDG2XBGIBwYrg-SgSzMAmw4mhlKS1Lga_d-qZer4ND1lKBnKEbDc8tEfnfNeFM1AsiHorCNUL-bX2HZZgumy1mtNEdrGUeBwQ"
    console.log(token)
    let result = await useLazyFetch(request, {
        baseURL: "http://localhost:3001",
        method: method,
        headers: {
            ...useRequestURL(),
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
	if(result.error.value == null) {
		return result.data.value
	}
	else {
		console.log("API CALL ERROR")
		console.log(result.error)
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

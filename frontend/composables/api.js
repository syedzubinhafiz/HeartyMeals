export const useApi = async (request, method,body=null) => {
    let token = getItem("accessToken")
    token = "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIxNWVvU25fZmNEOVNqSE11XzRSeFc0Rzh0RFlkTHBjUWZWZ0ZfX0x1aEdBIn0.eyJleHAiOjE3MjQxNTgyNjcsImlhdCI6MTcyMzU1MzQ2NywianRpIjoiZjg4YjA3NWItNTg1YS00MmFmLWE3NDctOGU1MjhkNmIxMzhmIiwiaXNzIjoiaHR0cHM6Ly9hY2NvdW50cy5ncmVlbnNoZWFydC5jb20vcmVhbG1zL2dyZWVuc2hlYXJ0IiwiYXVkIjoiYWNjb3VudCIsInN1YiI6IjUxYWZjMTM3LTZhNDctNDA4Yi1hYWRhLWNmZmU3YTlkN2E0NSIsInR5cCI6IkJlYXJlciIsImF6cCI6ImdyZWVuc2hlYXJ0Iiwic2Vzc2lvbl9zdGF0ZSI6Ijc5N2NhNTZhLTY2NDItNDU2ZC05NDI5LWZmYjlkZmZkYTVhMyIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cHM6Ly9zZmVyMDA1OS1sb2NhbC5ncmVlbnNoZWFydC5jb20iLCJodHRwczovL2pjaHUwMDU2LWxvY2FsLmdyZWVuc2hlYXJ0LmNvbSIsImh0dHBzOi8vanlhcDAwMzAtbG9jYWwuZ3JlZW5zaGVhcnQuY29tIiwiaHR0cHM6Ly9hcmllZi1sb2NhbC5ncmVlbnNoZWFydC5jb20iLCJodHRwczovL3NndWgwMDAzLWxvY2FsLmdyZWVuc2hlYXJ0LmNvbSIsImh0dHBzOi8vZ3lvbjAwMDQtbG9jYWwuZ3JlZW5zaGVhcnQuY29tIiwiaHR0cHM6Ly9hcmF2MDAyMC1sb2NhbC5ncmVlbnNoZWFydC5jb20iLCJodHRwczovL3ljaHUwMDUzLWxvY2FsLmdyZWVuc2hlYXJ0LmNvbSIsImh0dHBzOi8vc3NzYW0tbG9jYWwuZ3JlZW5zaGVhcnQuY29tIiwiaHR0cHM6Ly9uaWNvbGFzd2VpbmJyZWNodC1sb2NhbC5ncmVlbnNoZWFydC5jb20iLCJodHRwOi8vbG9jYWxob3N0OjMwMDAiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImRlZmF1bHQtcm9sZXMtZ3JlZW5zaGVhcnQiLCJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJlbWFpbCBwcm9maWxlIiwic2lkIjoiNzk3Y2E1NmEtNjY0Mi00NTZkLTk0MjktZmZiOWRmZmRhNWEzIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5hbWUiOiJNYXJpbyBTdXNhbnRvIiwicHJlZmVycmVkX3VzZXJuYW1lIjoibXN1czAwMDRAc3R1ZGVudC5tb25hc2guZWR1IiwiZ2l2ZW5fbmFtZSI6Ik1hcmlvIiwibG9jYWxlIjoiZW4iLCJmYW1pbHlfbmFtZSI6IlN1c2FudG8iLCJlbWFpbCI6Im1zdXMwMDA0QHN0dWRlbnQubW9uYXNoLmVkdSJ9.MBvnA-lIsyG1nf1VPfsRxl2WVupTKoFdKi16a7Zl_avsizRY4lORGs4uT8MA1vZamqxPepREWHPza0LomqmQIlo3jFz6sTLwqgXNXRcpgga6RcA-xbSLBlQp_F2rlvYuXOFoXtPd0lFFFBN-mHzCj5kdoOVdqgPFhy4zZSFzh3cPCiWespOYqe4zT8bU2zIuD_isIjqXjUAcdk_C_8eMx6rJgWYX8VdZHTR_t-joyJqX-2wNJt6Lqca6oJnxsfFu1DpgCcrFBEtNz5CPnC4mX6IB1yUXTOCCBxRxkc8exViXtzdSNXd-F6946evXrlHJufk-oQlIc1668c3eSN7e3A"
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

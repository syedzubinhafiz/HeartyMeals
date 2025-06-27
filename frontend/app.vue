<!-- this code brings up a loading page while the website loads -->
<!-- and then redirects the user to the page index.vue -->
<template>
	<NuxtLayout>
		<!-- Re-enable loading indicator with better configuration -->
		<NuxtLoadingIndicator 
			color="#f59120" 
			:height="4" 
			:duration="1000" 
			:throttle="100"
			:finish-on-route-change="true"
		/>
		<NuxtPage />
	</NuxtLayout>
</template>

<!-- this code brings up a loading page while the website loads -->
<!-- and then redirects the user to the page index.vue -->
<template>
	<NuxtLayout>
		<NuxtLoadingIndicator color="#f59120" :height="4" />
		<NuxtPage />
	</NuxtLayout>
</template>

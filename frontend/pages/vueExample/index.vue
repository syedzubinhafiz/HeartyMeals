<template>
    <div class="flex flex-col items-center justify-center p-5 space-y-5">
        <div class="flex flex-col space-y-2 bg-custom-overlay-brown shadow-md rounded-md w-full p-2">
            <h1 class="text-2xl font-bold">Welcome to Nuxt JS</h1>
            <hr>
            <p>Imma try to write some stuff about Nuxt/Vue JS.</p>
            <p> This guide is located in "pages/vueExample/index.vue", which might be helpful as a reference point as this guide mainly showcases the underlying code. Hope it helps!</p>
        </div>
        <!-- ------------------------------------------------------------------------------------------------------ -->
        <div class="flex flex-col space-y-2 bg-custom-overlay-brown shadow-md rounded-md w-full p-2">
            <h1 class="text-2xl font-bold">Layouts</h1>
            <hr>
            <p>Layout are templates that can be found under the "layouts/" folder</p>
            <p>They can be useful for defining the base structure of a page, such as the header and footer</p>
            <p>This page makes use of the baselayout layout, which is defined under "layouts/baselayout.vue" and is applied on this page via the definePageMeta function under the script tag</p>
        </div>
        <!-- ------------------------------------------------------------------------------------------------------ -->
        <div class="flex flex-col space-y-2 bg-custom-overlay-brown shadow-md rounded-md w-full p-2">
            <h1 class="text-2xl font-bold">Components</h1>
            <hr>
            <p>Components are user defined elements. They can be found under the "components/" folder</p>
            <p>We could maybe replace normal HTML elements with custom components, which could be helpful for avoiding needing to copy paste tailwind CSS as much and would allow modifying the theme more easily. For example:</p>

            <H1>Heading 1</H1>
            <H2>Heading 2</H2>
            <H3>Heading 3</H3>
            <P>Paragraph</P>
            <Button @click.prevent="() => {console.log('button clicked!')}">Button</Button>
            <Input></Input>
            <Input type="number" placeholder="insert number"></Input>
        </div>
        <!-- ------------------------------------------------------------------------------------------------------ -->
        <div class="flex flex-col space-y-2 bg-custom-overlay-brown shadow-md rounded-md w-full p-2">
            <h1 class="text-2xl font-bold">Variable Binding</h1>
            <hr>
            
            <p>Vue allows for automatically updating HTML elements according to javascript variables</p>
            <p>We'll need to wrap said variable around either a ref() or a reactive() function</p>
            <p>For example, the binded variable exampleRefVariable can update the text whenever the input value is modified: </p>
            <div>
                <p class="font-bold">Variable value:</p>
                <p>{{ exampleRefVariable }}</p>
                <p class="font-bold">Input box:</p>
                <input v-model="exampleRefVariable" class="border shadow-sm bg-gray-100"/>
            </div>
            <hr>
            
            <p>We can also run a function whenever a variable is modified.</p>
            <p>This is done via the watch() function, which runs a function whenever the variable is modified</p>
            <p>An example with the variables originalValue and squaredValue:</p>
            <div>
                <p class="font-bold">input box for originalValue:</p>
                <Input v-model="originalValue" type="number" class="border shadow-sm bg-gray-100"/>
                <p class="font-bold">value of originalValue:</p>
                <p>{{ originalValue }}</p>
                <p class="font-bold">value of squaredValue:</p>
                <p>{{ squaredValue }}</p>
            </div>
            <p>FYI this example uses the Input component rather than the normal input HTML component;</p>
            <p>Please check its code under "components/Input.vue" to see how to pass info in and out of a component</p>
        </div>
        <!-- ------------------------------------------------------------------------------------------------------ -->
        <div class="flex flex-col space-y-2 bg-custom-overlay-brown shadow-md rounded-md w-full p-2">
            <h1 class="text-2xl font-bold">Routing</h1>
            <hr>
            <p>Nuxt provides file based routing for pages.</p>
            <p>The starting page or the main page within a folder is named "index.vue". This page is an example, with the route "/vueExample" as it is located in the vueExample folder</p>
            
            <p>One way to route to pages is through the NuxtLink element</p>
            <p>We can define pages that are within the same folder, such as the page in the route "/vueExample/examplePage" below:</p>
            <NuxtLink to="/vueExample/examplePage" class="px-2 py-1 rounded-sm shadow-sm bg-custom-button-green text-white w-fit hover:bg-custom-button-green">Link</NuxtLink>
            
            <p>Another way of routing to pages is via the navigateTo function</p>
            <p>Here's an example of a page within a folder:</p>
            <button @click.prevent="gotoPage" class="px-2 py-1 rounded-sm shadow-sm bg-custom-button-green text-white w-fit hover:bg-custom-button-green">Button</button>
            
            <p>if we need to have a dynamic url (eg for each recipe) we can define the page name in brackets, such as [recipe].vue; an example is shown below:</p>
            <Input v-model="dynamicPageVariable" type="number"/>
            <button @click.prevent="gotoDynamicPage" class="px-2 py-1 rounded-sm shadow-sm bg-custom-button-green text-white w-fit hover:bg-custom-button-green">Go to page {{ dynamicPageVariable }}</button>
        </div>
        <!-- ------------------------------------------------------------------------------------------------------ -->
        <div class="flex flex-col space-y-2 bg-custom-overlay-brown shadow-md rounded-md w-full p-2">
            <h1 class="text-2xl font-bold">Interacting with the Backend</h1>
            <hr>
            <p>We are currently using Nest JS to organize data in the backend</p>
            <p>The backend can be called via an API when both the frontend and backend are being run</p>
            <p>The frontend is accessed from http://localhost:3000/ while the backend is currently accessed from http://localhost:3420/</p>
            <p>example of a backend call:</p>
            <Button @click.prevent="getExampleAPI">Get</Button>
            <div class="bg-gray-100 p-2">
                <p>{{apiOutput}}</p>
            </div>


            <p>We can also pass in data into API calls via queries. For example: </p>
            <Input type="number" v-model="apiVal1" placeholder="enter number"/>
            <Input type="number" v-model="apiVal2" placeholder="enter number"/>
            <Button @click.prevent="getExampleAPI2">Post</Button>
            <div class="bg-gray-100 p-2">
                <p>{{apiOutput2}}</p>
            </div>

            <p>Data can also be passed through as a json body (check code to see the difference with queries): </p>
            <Input type="number" v-model="apiVal3" placeholder="enter number"/>
            <Input type="number" v-model="apiVal4" placeholder="enter number"/>
            <Input v-model="apiVal5" placeholder="enter string" default="apple"/>
            <Input v-model="apiVal6" placeholder="enter string" default="banana"/>
            <Button @click.prevent="getExampleAPI3">Post</Button>
            <div class="bg-gray-100 p-2">
                <p>{{apiOutput3}}</p>
            </div>
        </div>
        <!-- ------------------------------------------------------------------------------------------------------ -->
        <div class="flex flex-col space-y-2 bg-custom-overlay-brown shadow-md rounded-md w-full p-2">
                <h1 class="text-2xl font-bold">Cookies</h1>
                <p>Transferring information between pages without involving the backend/database can be done via the useCookie() function</p>
                <p>The value of the cookies are saved between reloads</p>
                <p>an example of cookies:</p>
                <p class="font-bold">cookie value input box:</p>
                <Input v-model="exampleCookie.cookieVar"/>
                <p class="font-bold">current cookie value:</p>
                <p>{{ exampleCookie }}</p>
        </div>
        <!-- ------------------------------------------------------------------------------------------------------ -->
        <div class="flex flex-col space-y-2 bg-custom-overlay-brown shadow-md rounded-md w-full p-2">
        <h1 class="text-2xl font-bold">Additional Components</h1>
        <SearchBar v-model="searchBarVal" :dataList="searchDataList"/>
        <ChartBar :data="barChartData" :options="barChartOptions" class="w-1/2"/>
        </div>

        
    </div>

</template>
<script setup>
// defines the name of the page
defineOptions({
	name: "vueExample",
});

// this defines the layout that the page uses
// the page will be wrapped around the selected layout, which are defined in the layouts folder
definePageMeta({
	layout: "baselayout"
});

// variable that automatically updates the HTML whenever the value within the reference is modified
const exampleRefVariable = ref("Potato")


const originalValue = ref(3)
const squaredValue = ref(9)

// function that runs whenever the value within originalValue changes
watch(originalValue, () => {
    // updates the value within squaredValue
    squaredValue.value = originalValue.value * originalValue.value 
})


// function that navigates to a page
const gotoPage = async () => {
    navigateTo("/vueExample/folderPage");
}

// reference value for storing what page to go to
const dynamicPageVariable = ref(2)

// function that goes to a page based on the selected page indice
const gotoDynamicPage = async() => {
    navigateTo(`/vueExample/${dynamicPageVariable.value}`);
}

// stores the result of running GET /examples
const apiOutput = ref("")

// calls API and stores the result
const getExampleAPI = async () => {
    let result = await useApi("/examples", {
        method: "GET",
    });
    apiOutput.value = result
}

// input variables for the  POST /examples/sum call
const apiVal1 = ref(0)
const apiVal2 = ref(0)

// stores the result of running POST /examples/sum
const apiOutput2 = ref("")

// calls API and stores the result, passing in the variables as input data
const getExampleAPI2 = async () => {
    let result = await useApi("/examples/sum", {
        method: "POST",
        params: {
            a: apiVal1.value,
            b: apiVal2.value
        }
    });
    apiOutput2.value = result
}

// input variables for the  POST /examples/doStuff call
const apiVal3 = ref(0)
const apiVal4 = ref(0)
const apiVal5 = ref("apple")
const apiVal6 = ref("banana")

// stores the result of running POST /examples/doStuff
const apiOutput3 = ref("")

// calls API and stores the result, passing in the variables as input data
const getExampleAPI3 = async () => {
    let result = await useApi("/examples/doStuff", {
        method: "POST",
        body: {
            num1: apiVal3.value,
            num2: apiVal4.value,
            str1: apiVal5.value,
            str2: apiVal6.value
        }
    });
    apiOutput3.value = result
}


// creates a cookie with a default value
const exampleCookie = useCookie("exampleCookie",  {
    default: () => ({ value: "pineapple" }),
  })

// reference variables for additional components
const searchBarVal = ref("chicken")
const searchDataList = ref(["pizza","salad","chicken burger","beef burger","pad thai","nasi lemak","nasi padang","sushi","fried chicken","fried amogus","caesar salad"])

const barChartData = ref({
    labels: ["Calories", "Protein", "Carbs", "Sodium", "Fats", "Chol"],
    datasets: [
        {
            backgroundColor: "#FFA17A",
            data: [200, 20, 40, 1, 10, 20],
        },
    ],
});

const barChartOptions = ref({
    responsive: true,
});
</script>
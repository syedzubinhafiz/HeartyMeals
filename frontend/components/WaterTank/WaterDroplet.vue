<template>
    <div class="svg-container">
        <svg width="450" height="699" viewBox="0 0 450 699" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
            <mask id="mask" x="0" y="0" width="450" height="699">
                <rect :y="maskY" width="450" height="699" fill="white" />
            </mask>
            </defs>
    
            <!-- Fixed background color path -->
            <g filter="url(#filter0_d_1837_13558)">
            <path fill="#D0D0D0" d="M428.018 365.993C460.816 573.262 339.07 678 226.915 678C114.761 678 -9.26457 572.212 21.8696 365.993C33.704 287.607 132.284 95.9969 223.963 13C315.642 95.9969 415.696 288.119 428.018 365.993Z" />
            </g>
    
            <!-- Dynamic fill color path -->
            <g filter="url(#filter0_d_1837_13558)">
            <path :fill="fillColor" mask="url(#mask)" d="M428.018 365.993C460.816 573.262 339.07 678 226.915 678C114.761 678 -9.26457 572.212 21.8696 365.993C33.704 287.607 132.284 95.9969 223.963 13C315.642 95.9969 415.696 288.119 428.018 365.993Z" />
            </g>
    
            <!-- Stroke for visual clarity -->
            <path d="M426.783 366.188C443.139 469.548 420.943 547.185 380.836 598.957C340.717 650.744 282.607 676.75 226.915 676.75C171.225 676.75 112.541 650.482 71.6411 598.555C30.7548 546.645 7.58121 469.006 23.1055 366.18C28.9881 327.216 56.4992 259.879 94.0687 191.83C131.397 124.219 178.531 56.1279 223.963 14.689C269.401 56.131 316.902 124.351 354.658 192.027C392.657 260.142 420.658 327.48 426.783 366.188Z" stroke="#A7A7A7" stroke-width="2.5" />
    
            <defs>
            <filter id="filter0_d_1837_13558" x="0.799999" y="0.799999" width="448.853" height="697.4" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="4" />
                <feGaussianBlur stdDeviation="8.1" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1837_13558" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1837_13558" result="shape" />
            </filter>
            </defs>
        </svg>
        <!-- Overlay Text and Button -->
        <div class="overlay">
            <h2>Remaining Water Intake</h2>
            <h2>{{ remainingVolume }}/{{ maxVolume }} ml</h2>
            <button @click="openModal" class="open-overlay-button">
                <img src="~/assets/icon/Water-Droplet-Icon.svg" style="margin-right: 5px; margin-top: auto; margin-bottom: auto;" >
                LOG INTAKE
            </button>
        </div>
    </div>
    <!-- Modal Overlay -->
    <div v-if="isModalOpen" class="modal" @click="closeOnOutsideClick">
        <div class="modal-content" @click.stop>
            <div class="modal-header">
                <h1 style="margin: 0; text-align: center; font-size: larger; font-weight: 600;">Enter Amount</h1>
                <span class="close" @click="closeModal">&times;</span>
            </div>
            
            <!-- Input fields container -->
            <div class="input-container">
                <input type="number" placeholder="Enter number" v-model="inputValue"/>
                <SingleSelectionDropdown class="unit-dropdown" :defaultText="defaultText" :items="units" @update:modelValue="handleItemSelected"/>
            </div>

            <!-- Button below the fields -->
            <button @click="logIntake" class="done-button">
                <img src="~/assets/icon/Done-Icon.svg" style="margin-right: 5px; margin-top: auto; margin-bottom: auto;" >
                Done
            </button>
        </div>
</div>

  </template>
  
  <script setup>
    import { ref, computed } from 'vue';
    import SingleSelectionDropdown from '../Dropdown/SingleSelectionDropdown.vue';
    const { $axios } = useNuxtApp();
    
    // Handle water filling
    const props = defineProps({
        maxVolume: Number,
        remainingVolume: Number,
    });
    // Refs for fill color and other data
    const fillColor = ref('#A9C1DA');
    const remainingVolume = ref(props.remainingVolume);
    const maxVolume = ref(props.maxVolume);

    // Watch both props for changes
    watch([() => props.remainingVolume, () => props.maxVolume], ([newRemainingVolume, newMaxVolume]) => {
        remainingVolume.value = newRemainingVolume;
        maxVolume.value = newMaxVolume;
    });

    // Compute the fill percentage based on the updated values
    const fillPercentage = computed(() => (remainingVolume.value / maxVolume.value) * 100);

    // Calculate the mask position dynamically
    const maskY = computed(() => {
        const svgHeight = 699; // Height of the SVG
        return svgHeight - (svgHeight * (fillPercentage.value / 100)); // Adjust mask position based on fill percentage
    });
    
    // Modal state
    const isModalOpen = ref(false);

    // Functions to open and close the modal
    const openModal = () => {
        isModalOpen.value = true;
    };

    const closeModal = () => {
        isModalOpen.value = false;
    };

    // Function to handle clicks outside of the modal content
    const closeOnOutsideClick = (event) => {
    // This will only close the modal if the click is on the background (outside modal-content)
        closeModal();
    };

    // Handle fluids logging
    const defaultText = ref('unit');
    const units = [
        { id: 1, display: 'ml' },
        { id: 2, display: 'L' },
        { id: 3, display: 'fl oz' },
        { id: 4, display: 'gal' },
        { id: 5, display: 'pt' },
        { id: 6, display: 'qt' },
        { id: 7, display: 'ml' },
        { id: 8, display: 'ct' },
    ];
    const inputValue = ref(0);
    const selectedItem = ref(null);

    const handleItemSelected = (itemId) => {
        selectedItem.value = itemId;
    }

    const validation = () => {
        if (inputValue.value <= 0) {
            useToast().error("Please enter a valid intake number");
            return false;
        }
        
        if (selectedItem.value === null) {
            useToast().error("Please select a unit");
            return false;
        }

        return true;
    }

    const logIntake = async () => {
        // use api to get data
        try {
            if (!validation()) return;

            const unit = units[selectedItem.value - 1]['display'];
            // Calculate the intake value in ml based on the selected unit
            let intakeValueInMl = inputValue.value;
            if (unit === 'L') intakeValueInMl *= 1000; // Convert to ml if needed
            else if (unit === 'fl oz') intakeValueInMl *= 29.5735; // Convert to ml
            else if (unit === 'gal') intakeValueInMl *= 3785.41; // Convert to ml
            else if (unit === 'pt') intakeValueInMl *= 473.176; // Convert to ml
            else if (unit === 'qt') intakeValueInMl *= 946.353; // Convert to ml
            else if (unit === 'ct') intakeValueInMl *= 240; // Assuming ct is cups, convert to ml

            const today_date = () => {
                const date = new Date();
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                const seconds = String(date.getSeconds()).padStart(2, '0');

                const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
                return formattedDate;
            };
            const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

            const fluidIntake = {
                waterIntake: inputValue.value,
                fluidUnit: unit,
                loggingDateTime: today_date(),
                timeZone: timeZone,
            };

            const token = localStorage.getItem('accessToken');
            const response = await $axios.post(`/fluid-logging/update`, fluidIntake, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
            if (response.status === 201) {
                remainingVolume.value -= parseFloat((intakeValueInMl).toFixed(2));
                useToast().success("Fluid intake is logged!")
                console.log('Intake logged');
                closeModal();
            }
            else {
                console.log(response);
            }
        }
        catch (e) {
            useToast().error("Failed to load fluid intake data")
        }
    };

  </script>
  
  <style scoped>
    .svg-container {
        position: relative; /* Set the position to relative to allow absolute positioning of overlay */
        width: 100%;
        height: auto;

        svg {
            margin-left:auto;
            margin-right:auto;
        }
    }
    
    .overlay {
        position: absolute; /* Position the overlay absolutely */
        top: 60%; /* Center vertically */
        left: 50%; /* Center horizontally */
        transform: translate(-50%, -50%); /* Adjust to center */
        color: #000; /* Text color */
        text-align: center; /* Center the text */
    }

    h2{
        color: #3A6088;
        margin-top: 10%;
        font-weight: 600;
        font-size: 115%;
    }
    
    button {
        cursor: pointer; /* Change cursor to pointer on hover */
        box-shadow: 0px 4px 16.2px -1px rgba(0,0,0,0.1);
        border: none; /* Remove border */
    }

    .open-overlay-button {
        margin-top: 20%; /* Space between text and button */
        margin-left: auto;
        margin-right: auto;
        padding: 5% 10%; /* Button padding */
        display: flex; /* Align text and icon */
        justify-content: center; /* Center text and icon */

        background-color: #FFA17A; /* Button background color */
        color: #993300; /* Button text color */
        border-radius: 5vh; /* Rounded corners */
        font-weight: 600; /* Button text weight */
    }

    .open-overlay-button:hover {
        background-color: #e5946b; /* Darker shade on hover */
    }

    .done-button {
        margin-top: 5%; /* Space between text and button */
        margin-left: auto;
        margin-right: auto;
        padding: 1% 2%; /* Button padding */
        display: flex; /* Align text and icon */
        justify-content: center; /* Center text and icon */

        color: #FFFEF1; /* Button text color */
        background-color: #87A98D; /* Button background color */
        border-radius: 1vh; /* Rounded corners */
        font-size: large;
    }

    /* Modal styles */
    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }

    .modal-content {
        background-color: #F3EADA;
        padding: 3%;
        border-radius: 3vh;
        width: 30%;
        text-align: center;
        position: relative;
    }

    .modal-header {
        display: flex; /* Flexbox for horizontal alignment */
        justify-content: space-around; /* Ensures there's space between the close button and the text */
        align-items: center; /* Vertically centers the text and button */
        position: relative;
        text-align: center;
    }

    .close {
        cursor: pointer;
        font-size: 150%;
        position: absolute;
        right: 0%;
    }

    /* Flexbox container for input fields */
    .input-container {
        display: flex;
        justify-content: center;
        gap: 3%;
        margin-top: 8%;
        margin-bottom: 8%;
    }

    input {
        width: 30%; 
        height: 2%;
        padding: 2%;
        font-size: 85%;
        border: 1px solid #ccc;
        border-radius: 0.375rem;
        box-shadow: 0px 4px 16.2px -1px rgba(0,0,0,0.1);
    }

    input:focus {
        outline: none;
    }

    .unit-dropdown {
        width: 30%;
    }
  </style>
  
<template>
    <div class="relative inline-block text-left w-full" ref="dropdown">
        <div class="flex justify-between items-center w-full">
            <button @click="toggleDropdown" class="inline-flex justify-between w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none" :style='buttonStyle'>
                <span class="text-left">{{ selectedItemDisplay }}</span>
                <svg class="ml-2 h-5 w-5" src="~/assets/icon/Dropdown_Arrow.svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
            </button>
        </div>
        <div v-if="isOpen" class="origin-top-right absolute right-0 mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5" :style='dropdownStyle'>
            <div class="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                <a @click.prevent="unselectItem" class="block px-4 py-2 text-sm text-gray-400 hover:bg-gray-100" role="menuitem">
                    Clear Selection
                </a>

                <a v-for="item in items" :key="item.id" @click.prevent="selectItem(item)" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                    {{ item.display }}
                </a>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "SingleSelectionDropdown",
    props: {
        items: {
            type: Array,
            required: true
        },
        modelValue: {
            type: String,
            default: null
        },
        defaultText: {
            type: String,
            default: 'Select an item'
        },
        buttonStyle: {
            type: String,
            default: ''
        },
        dropdownStyle: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            isOpen: false,
            selectedItemDisplay: this.defaultText,
            selectedItemId: this.modelValue
        };
    },
    watch: {
        modelValue(newVal) {
            const selectedItem = this.items.find(item => item.id === newVal);
            this.selectedItemDisplay = selectedItem ? selectedItem.display : this.defaultText;
        }
    },
    methods: {
        toggleDropdown() {
            this.isOpen = !this.isOpen;
        },
        selectItem(item) {
            this.selectedItemDisplay = item.display;
            this.selectedItemId = item.id;
            this.isOpen = false;
            this.$emit('update:modelValue', item.id); // Emit the selected item's id
        },
        unselectItem() {
            this.selectedItemDisplay = this.defaultText;
            this.selectedItemId = null;
            this.isOpen = false;
            this.$emit('update:modelValue', null); // Emit null when selection is cleared
        },
        handleClickOutside(event) {
            if (this.$refs.dropdown && !this.$refs.dropdown.contains(event.target)) {
                this.isOpen = false;
            }
        }
    },
    mounted() {
        document.addEventListener('click', this.handleClickOutside);
    },
    beforeUnmount() {
        document.removeEventListener('click', this.handleClickOutside);
    }
};
</script>

<style scoped>
/* Add any additional styling here */
</style>

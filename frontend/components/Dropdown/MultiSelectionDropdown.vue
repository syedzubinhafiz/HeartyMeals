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
                <a @click.prevent="unselectAllItems" class="block px-4 py-2 text-sm text-gray-400 hover:bg-gray-100" role="menuitem">
                    Clear Selection
                </a>

                <a v-for="item in items" :key="item.id" @click.prevent="toggleItemSelection(item)" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                    <input type="checkbox" :checked="isSelected(item)" class="mr-2">{{ item.display }}
                </a>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "MultiSelectionDropdown",
    props: {
        items: {
            type: Array,
            required: true
        },
        defaultText: {
            type: String,
            default: 'Select items'
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
            selectedItems: [],
        };
    },
    computed: {
        selectedItemDisplay() {
            return this.selectedItems.length > 0 ? this.selectedItems.map(item => item.display).join(', ') : this.defaultText;
        }
    },
    methods: {
        toggleDropdown() {
            this.isOpen = !this.isOpen;
        },
        toggleItemSelection(item) {
            const index = this.selectedItems.findIndex(selectedItem => selectedItem.id === item.id);
            if (index === -1) {
                this.selectedItems.push(item);
            } else {
                this.selectedItems.splice(index, 1);
            }
            this.$emit('items-selected', this.selectedItems.map(item => item.id)); // Emit the selected items' ids
        },
        unselectAllItems() {
            this.selectedItems = [];
            this.isOpen = false;
            this.$emit('items-selected', []); // Emit an empty array when selection is cleared
        },
        isSelected(item) {
            return this.selectedItems.some(selectedItem => selectedItem.id === item.id);
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

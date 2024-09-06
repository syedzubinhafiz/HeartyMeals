<template>
    <div class="pagination">
      <button
        @click="changePage(currentPage - 1)"
        :disabled="currentPage === 1"
      >
        <i class="fa fa-chevron-left"></i> Previous
      </button>
  
      <button
        v-for="page in pages"
        :key="page"
        @click="changePage(page)"
        :class="{ active: currentPage === page }"
      >
        {{ page }}
      </button>
  
      <button
        @click="changePage(currentPage + 1)"
        :disabled="currentPage === totalPages"
      >
        Next <i class="fa fa-chevron-right"></i>
      </button>
    </div>
  </template>
  
  
  <script>
  export default {
    props: {
      totalItems: {
        type: Number,
        required: true,
      },
      itemsPerPage: {
        type: Number,
        required: true,
        default: 6,
      },
      currentPage: {
        type: Number,
        required: true,
        default: 1,
      },
    },
    computed: {
      totalPages() {
        console.log("---")
        console.log(this.totalItems)
        console.log(this.itemsPerPage)
        return Math.ceil(this.totalItems / this.itemsPerPage);
      },
      pages() {
        let startPage = Math.max(1, this.currentPage - 2);
        let endPage = Math.min(this.totalPages, startPage + 4);
        if (endPage - startPage < 4 && startPage > 1) {
          startPage = Math.max(1, endPage - 4);
        }
        return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
      },
    },
    methods: {
      changePage(page) {
        console.log(page)
        console.log(this.totalPages)
        console.log(this.totalItems)
        if (page > 0 && page <= this.totalPages) {
          this.$emit("update:currentPage", page);
        }
      },
    },
  };
  </script>
  
  <style scoped>
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

button {
  margin: 0 5px;
  padding: 8px 12px;
  border: none; /* remove default border */
  background-color: #004d40;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1); /* subtle shadow for depth */
}

button:hover {
  transform: translateY(-2px); /* lift button slightly on hover */
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

button.active {
  background-color: #004d40; /* darker green for active state */
  color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2); /* more pronounced shadow for active button */
}

/* Ensure icons are visible and aligned */
button i.fa {
  margin-right: 5px; /* space between icon and text */
  color: inherit; /* icons should inherit the button's text color */
}
</style>

  
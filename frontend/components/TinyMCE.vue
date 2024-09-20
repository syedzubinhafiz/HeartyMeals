<template>
    <client-only>
      <tinymce-vue
        ref="tinymceEditor"
        :api-key="apiKey"
        :init="tinymceInit"
        @init="handleEditorInit"
        @editorChange="handleEditorChange"
      />
    </client-only>
</template>

<script>
import Editor from '@tinymce/tinymce-vue';

export default {
  components: {
    'tinymce-vue': Editor
  },
  data() {
    return {
      apiKey: null,
      tinymceInit: {
        height: 500,
        menubar: true,
        plugins: 'image media link',
        toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | image media',
        file_picker_types: 'image media',
        file_picker_callback: this.filePickerCallback,
      },
      editorInstance: null,
      fileNames: [], // Array to store file names
    };
  },
  async created() {
    const config = useRuntimeConfig();
    this.apiKey = config.public.tinyMCEKey;
  },
  methods: {
    handleEditorInit(editor) {
      this.editorInstance = editor.target;
    },
    filePickerCallback(callback, value, meta) {
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.setAttribute('accept', meta.filetype === 'image' ? 'image/*' : 'video/*');
      input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        this.fileNames.push(file.name); // Store the file name

        reader.addEventListener('load', () => {
          const id = 'blobid' + (new Date()).getTime();
          const blobCache = tinymce.activeEditor.editorUpload.blobCache;
          const base64 = reader.result.split(',')[1];
          const blobInfo = blobCache.create(id, file, base64);
          blobCache.add(blobInfo);
          if (meta.filetype === 'image') {
            callback(blobInfo.blobUri());
          } else if (meta.filetype === 'media') {
            callback(blobInfo.blobUri(), { controls: true });
          }
        });

        reader.readAsDataURL(file);
      });
      input.click();
    },
  },
};
</script>

<style scoped>
/* Styling for the title input */

</style>

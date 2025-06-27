---
title: "Complete Rich Text Editor Integration"
type: task
status: planned
created: 2025-01-05T12:41:19
updated: 2025-01-05T12:41:19
id: TASK-005
priority: medium
memory_types: [procedural, semantic]
dependencies: [TASK-001]
tags: [rich-text-editor, tinymce, frontend, content]
---

# Complete Rich Text Editor Integration

## Description

Complete the TinyMCE rich text editor integration for recipe instructions and educational content. The components exist but are not fully integrated and functional.

## Objectives

1. Complete TinyMCE integration in recipe creation forms
2. Integrate rich text editor in educational content management
3. Configure TinyMCE with appropriate plugins and settings
4. Test rich text content creation and editing
5. Ensure proper content sanitization and security
6. Add content formatting options suitable for the application

## Steps

### 1. Recipe Instructions Editor
- [ ] Complete TinyMCE integration in `frontend/pages/admin/add-recipe.vue`
- [ ] Replace placeholder comment with working editor component
- [ ] Configure editor for recipe instruction formatting
- [ ] Add cooking-specific formatting options (ingredients lists, steps)
- [ ] Test recipe creation with rich text instructions

### 2. Educational Content Editor
- [ ] Complete TinyMCE integration in educational content forms
- [ ] Replace placeholder in `frontend/components/CustomDish/Popup.vue`
- [ ] Configure editor for article/educational content
- [ ] Add features like headings, lists, links, images
- [ ] Test educational content creation and editing

### 3. TinyMCE Configuration
- [ ] Configure TinyMCE with appropriate plugins
- [ ] Set up proper toolbar with relevant options
- [ ] Configure content filtering and sanitization
- [ ] Add custom styling to match application theme
- [ ] Ensure mobile responsiveness of editor

### 4. Content Management Features
- [ ] Add content preview functionality
- [ ] Implement save draft functionality
- [ ] Add content versioning if needed
- [ ] Create content templates for common formats
- [ ] Add spell check and grammar checking

### 5. Security and Validation
- [ ] Implement proper HTML sanitization
- [ ] Prevent XSS attacks through content injection
- [ ] Validate content length and structure
- [ ] Add content moderation features if needed
- [ ] Test security with malicious content

### 6. Backend Content Handling
- [ ] Ensure backend properly stores rich text content
- [ ] Add content validation on server side
- [ ] Implement content search functionality
- [ ] Add content export features if needed
- [ ] Test content retrieval and display

## Progress

- [ ] Recipe instructions editor integrated
- [ ] Educational content editor working
- [ ] TinyMCE properly configured
- [ ] Content management features added
- [ ] Security measures implemented
- [ ] Backend content handling complete
- [ ] End-to-end content creation tested

## Dependencies

- TASK-001: Database setup (for storing content)
- TinyMCE API key (already configured in nuxt.config.ts)

## Notes

### Current Issues Identified

1. **Recipe Instructions Editor** (Incomplete)
   ```html
   <!-- TODO: Put your rich text editior here -->
   ```
   Located in `frontend/pages/admin/add-recipe.vue:179`

2. **Custom Dish Content Editor** (Incomplete)
   ```html
   <!-- TODO: Put your rich text editior here -->
   ```
   Located in `frontend/components/CustomDish/Popup.vue:178`

3. **TinyMCE Configuration**
   - API key is configured: `tinyMCEKey: "5xd0rqlwc0evl0pm1xyxcy0ztd40yr061ss8azv8um8694bu"`
   - Component exists: `@tinymce/tinymce-vue` is installed
   - Integration is incomplete

### TinyMCE Configuration Options

#### For Recipe Instructions
```javascript
{
  height: 300,
  menubar: false,
  plugins: [
    'advlist', 'autolink', 'lists', 'link', 'charmap', 'preview',
    'searchreplace', 'visualblocks', 'code', 'fullscreen',
    'insertdatetime', 'table', 'wordcount'
  ],
  toolbar: 'undo redo | blocks | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | removeformat | help',
  content_style: 'body { font-family: Overpass, sans-serif; font-size: 14px }',
  placeholder: 'Enter cooking instructions step by step...'
}
```

#### For Educational Content
```javascript
{
  height: 400,
  menubar: true,
  plugins: [
    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
    'insertdatetime', 'media', 'table', 'wordcount', 'help'
  ],
  toolbar: 'undo redo | blocks | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | link image media table | code | help',
  content_style: 'body { font-family: Overpass, sans-serif; font-size: 16px }',
  placeholder: 'Write your educational content here...'
}
```

### Implementation Approach

1. **Component Integration**
   ```vue
   <template>
     <div>
       <Editor
         api-key="5xd0rqlwc0evl0pm1xyxcy0ztd40yr061ss8azv8um8694bu"
         :init="editorConfig"
         v-model="content"
       />
     </div>
   </template>

   <script>
   import { Editor } from '@tinymce/tinymce-vue';
   
   export default {
     components: { Editor },
     data() {
       return {
         content: '',
         editorConfig: {
           // Configuration options here
         }
       }
     }
   }
   </script>
   ```

2. **Content Sanitization**
   - Use DOMPurify for client-side sanitization
   - Implement server-side validation
   - Whitelist allowed HTML tags and attributes

3. **Content Storage**
   - Store as HTML in database JSON fields
   - Implement content versioning if needed
   - Add metadata (word count, creation date, etc.)

### Content Types to Support

#### Recipe Instructions
- Step-by-step numbered lists
- Ingredient highlighting
- Cooking time indicators
- Temperature and measurement formatting

#### Educational Content
- Article-style formatting
- Headings and subheadings
- Images and media embeds
- Links to external resources
- Bullet points and numbered lists

### Testing Scenarios
1. **Content Creation**: Test creating new content
2. **Content Editing**: Test editing existing content
3. **Content Display**: Verify proper rendering
4. **Security**: Test with malicious HTML
5. **Performance**: Test with large content

### Browser Compatibility
- Ensure editor works in all major browsers
- Test mobile responsiveness
- Verify accessibility features
- Test with screen readers

## Next Steps

After rich text editor completion:
1. Test content creation workflows
2. Verify content displays correctly in frontend
3. Move to TASK-006: Enhance analytics dashboard
4. Ensure content security is properly implemented 
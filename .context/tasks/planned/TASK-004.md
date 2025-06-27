---
title: "Complete Image Upload System"
type: task
status: planned
created: 2025-01-05T12:41:19
updated: 2025-01-05T12:41:19
id: TASK-004
priority: high
memory_types: [procedural, semantic]
dependencies: [TASK-001]
tags: [image-upload, storage, firebase, files]
---

# Complete Image Upload System

## Description

Complete the partially implemented image upload system for recipes and other content. This includes fixing the TODO in recipe service, configuring Firebase storage properly, and ensuring proper file validation and processing.

## Objectives

1. Complete the image upload logic in recipe service
2. Configure Firebase storage or ensure local storage works
3. Add proper file validation and security
4. Implement image processing and thumbnail generation
5. Test file upload functionality end-to-end
6. Add error handling for upload failures

## Steps

### 1. Complete Recipe Image Upload Logic
- [ ] Fix TODO in `backend/src/recipe/recipe.service.ts` (line 93)
- [ ] Implement proper image processing in `addRecipe` method
- [ ] Add validation for image file types and sizes
- [ ] Ensure images are linked to recipes correctly
- [ ] Test recipe creation with image uploads

### 2. Storage Configuration
- [ ] Choose between Firebase or local storage approach
- [ ] Configure Firebase credentials if using Firebase
- [ ] Set up local storage directory structure properly
- [ ] Ensure proper permissions for file operations
- [ ] Test both storage options work correctly

### 3. File Validation and Security
- [ ] Implement file type validation (JPEG, PNG, etc.)
- [ ] Add file size limits to prevent abuse
- [ ] Validate image dimensions and format
- [ ] Sanitize file names to prevent security issues
- [ ] Add virus scanning if needed for production

### 4. Image Processing Enhancement
- [ ] Implement thumbnail generation for recipes
- [ ] Optimize image sizes for web display
- [ ] Add image compression to reduce storage costs
- [ ] Create multiple image sizes if needed
- [ ] Ensure proper image metadata handling

### 5. Storage Service Improvements
- [ ] Complete the storage service implementation
- [ ] Add proper error handling for storage operations
- [ ] Implement file deletion functionality
- [ ] Add support for batch uploads
- [ ] Test storage service with real files

### 6. Frontend Integration
- [ ] Test frontend file upload components
- [ ] Ensure proper progress indicators for uploads
- [ ] Add drag-and-drop functionality if missing
- [ ] Test image preview functionality
- [ ] Handle upload errors gracefully in UI

## Progress

- [ ] Recipe image upload TODO resolved
- [ ] Storage configuration completed
- [ ] File validation implemented
- [ ] Image processing working
- [ ] Storage service complete
- [ ] Frontend integration tested
- [ ] End-to-end upload flow verified

## Dependencies

- TASK-001: Database setup (for storing file references)
- Firebase project setup (if using Firebase)
- File system permissions (if using local storage)

## Notes

### Current Issues Identified

1. **Recipe Service TODO** (Critical)
   ```typescript
   // TODO: Add image upload logic here
   return [await transactionalEntityManager.save(new_recipe), is_custom];
   ```
   Located in `backend/src/recipe/recipe.service.ts:93`

2. **Firebase Configuration**
   - Placeholder values in environment variables
   - Firebase credentials need proper setup
   - Storage bucket configuration incomplete

3. **Storage Service Implementation**
   - Basic framework exists but needs completion
   - File validation needs enhancement
   - Error handling needs improvement

### Storage Options

#### Option 1: Firebase Storage
**Pros:**
- Scalable cloud storage
- CDN integration
- Built-in security rules
- Automatic backups

**Cons:**
- Requires Firebase project setup
- Additional configuration complexity
- External dependency

#### Option 2: Local Storage
**Pros:**
- No external dependencies
- Simpler configuration
- Full control over files
- No additional costs

**Cons:**
- Not scalable for production
- Backup complexity
- Server storage limitations

### Firebase Setup Required (if chosen)
1. Create Firebase project
2. Enable Storage service
3. Configure storage rules
4. Generate service account credentials
5. Update environment variables

### File Validation Rules
- **Allowed Types**: JPEG, PNG, WebP
- **Max Size**: 5MB per file
- **Max Dimensions**: 2048x2048 pixels
- **Security**: Scan for malicious content

### Image Processing Pipeline
1. **Upload**: Receive and validate file
2. **Process**: Resize and optimize
3. **Thumbnail**: Generate smaller versions
4. **Store**: Save to chosen storage
5. **Reference**: Update database with file paths

### Recipe Service Implementation
```typescript
// In addRecipe method after recipe creation
if (recipeDTO.hasImage && uploadData) {
  const storagePath = this.getStoragePath(user?.user_id, new_recipe.id);
  const uploadResult = await this.storageService.uploadFile(
    storagePath, 
    uploadData, 
    transactionalEntityManager
  );
  
  new_recipe.storage_links = {
    thumbnail: uploadResult.thumbnailId,
    content: uploadResult.imageId
  };
  
  await transactionalEntityManager.save(new_recipe);
}
```

### Testing Scenarios
1. **Valid Upload**: Test with proper image files
2. **Invalid Files**: Test with non-image files
3. **Size Limits**: Test with oversized files
4. **Storage Failures**: Test error handling
5. **Multiple Uploads**: Test batch operations

## Next Steps

After image upload completion:
1. Test recipe creation with images works
2. Verify image display in frontend
3. Move to TASK-005: Complete rich text editor
4. Ensure all file operations are secure 

---
title: "Implement Dietitian Role Dashboard and Functionality"
type: task
status: planned
created: 2025-01-28T12:41:19
updated: 2025-01-28T12:41:19
id: TASK-004
priority: medium
memory_types: [procedural, semantic]
dependencies: [TASK-003]
tags: [frontend, role-based-access, dietitian, dashboard, user-management]
---

## Description

Create specialized dietitian dashboard and role-based functionality to differentiate dietitians from patients and admins. Currently, dietitians are treated the same as patients and redirect to the patient home page.

## Objectives

- [ ] Create dedicated `/dietitian` route and dashboard page
- [ ] Implement dietitian-specific header component
- [ ] Design dietitian interface with appropriate tools and features
- [ ] Add patient management capabilities for dietitians
- [ ] Implement meal plan creation tools for assigned patients
- [ ] Add nutrition analysis and reporting features
- [ ] Create patient progress tracking dashboard

## Steps

1. **Create Dietitian Dashboard Page**
   - Design `/dietitian` route with specialized layout
   - Create DietitianHeader component similar to AdminHeader
   - Implement dietitian-specific navigation and branding

2. **Patient Management Interface**
   - List of assigned patients
   - Patient profile viewing capabilities
   - Patient meal history and progress tracking

3. **Meal Planning Tools**
   - Create meal plans for specific patients
   - Nutrition goal setting and tracking
   - Recipe recommendation system

4. **Analytics and Reporting**
   - Patient progress reports
   - Nutrition compliance analytics
   - Export capabilities for patient data

5. **Access Control**
   - Ensure dietitians can only access their assigned patients
   - Implement appropriate RBAC guards on backend

## Progress

- [x] Backend role enum includes Dietitian
- [x] Registration allows Dietitian selection
- [x] Sign-in logic updated to handle Dietitian role
- [ ] Dietitian dashboard page creation
- [ ] Role-specific functionality implementation

## Dependencies

- TASK-003 (Mock Data Creation) - Need working authentication and user roles
- Core patient and recipe functionality must be stable
- Admin dashboard patterns to follow for consistency

## Notes

- User prioritized core functionality first, so this is backlogged
- Sign-in logic updated but will redirect to non-existent `/dietitian` page until implemented
- Should follow similar patterns as admin dashboard for consistency
- Consider patient-dietitian assignment system in backend

## Next Steps

1. Wait for core functionality completion
2. Design dietitian user experience and workflows
3. Implement dietitian dashboard infrastructure
4. Add patient management capabilities
5. Implement specialized dietitian tools 
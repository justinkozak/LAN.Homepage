# Drag and Drop Reordering Feature

## Overview
The manage page now supports drag-and-drop reordering of server entries. This allows you to visually reorganize your servers by simply dragging them to a new position.

## How to Use

1. **Navigate to Manage Page**
   - Click "Manage" link in the bottom right corner of the homepage
   - Or go directly to `http://localhost:3000/manage.html`

2. **Drag to Reorder**
   - Hover over any server entry
   - Click and hold on the drag handle (three horizontal lines icon) on the left
   - Drag the entry up or down to the desired position
   - Release to drop it in the new location

3. **Automatic Save**
   - The new order is automatically saved when you drop the item
   - A success message will appear confirming the save
   - The order persists across page refreshes and is reflected on the homepage

## Visual Feedback

- **Drag Handle**: Three horizontal lines icon on the left of each entry
  - Appears with the cursor changing to a "grab" icon on hover
  - Changes to "grabbing" when actively dragging

- **Dragging State**: While dragging an item
  - The dragged item becomes semi-transparent (50% opacity)
  - The item slightly shrinks (scale 0.98)
  - Border color changes to highlight the dragged item

- **Drop Target**: When hovering over a drop location
  - A purple line appears at the top of the target item
  - Shows exactly where the item will be placed

## Technical Details

### New API Endpoint
- **POST** `/api/servers/reorder`
- **Body**: `{ servers: [...] }` - Complete array of servers in new order
- **Response**: `{ success: true }`

### Files Modified
1. **manage.html**
   - Added drag-and-drop event handlers
   - Added drag handle icon to each server item
   - Implemented `saveServerOrder()` function

2. **styles.css**
   - Added `.dragging` class for visual feedback
   - Added `.drag-over` class for drop target indication
   - Added `.drag-handle` styling for the grab icon
   - Added `.drag-hint` for the instruction text

3. **server.js**
   - Added `/api/servers/reorder` endpoint
   - Handles complete server array replacement

## Browser Compatibility
Drag-and-drop works on all modern browsers that support the HTML5 Drag and Drop API:
- Chrome/Edge ✓
- Firefox ✓
- Safari ✓
- Opera ✓

## Notes
- The order only affects the manage page and homepage display
- Drag-and-drop is disabled on the main homepage (intentionally, to keep it clean)
- The entire server entry is draggable, not just the drag handle
- Order is preserved when adding, editing, or deleting servers


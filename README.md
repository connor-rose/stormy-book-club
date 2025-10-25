# Stormy Book Club

A simple, elegant book management website for tracking your reading list. Built with vanilla HTML, CSS, and JavaScript, designed to be hosted on GitHub Pages.

## Features

- **Book Search**: Search for books using the Google Books API
- **Reading List Management**: Add, reorder, and delete books from your list
- **Status Tracking**: Mark books as reading or completed
- **Star Ratings**: Rate books from 1-5 stars
- **Archiving**: Archive books to hide them from your main list
- **Filtering**: Filter books by status (All, Reading, Completed, Archived)
- **Persistent Storage**: All data is saved locally in your browser
- **Responsive Design**: Works great on desktop and mobile devices

## How to Use

1. **Search for Books**: Use the search bar to find books you want to read
2. **Add Books**: Click "Add to List" on any search result
3. **Manage Your List**: 
   - Use the up/down arrows to reorder books
   - Click stars to rate books (1-5 stars)
   - Mark books as completed when you finish reading
   - Archive books you want to hide
   - Delete books you no longer want
4. **Filter Views**: Use the filter buttons to view different categories

## Setup for GitHub Pages

1. **Push to GitHub**: Push this repository to your GitHub account
2. **Enable GitHub Pages**:
   - Go to your repository settings
   - Scroll down to "Pages" section
   - Select "Deploy from a branch"
   - Choose "main" branch and "/ (root)" folder
   - Click "Save"
3. **Access Your Site**: Your site will be available at `https://yourusername.github.io/stormy-book-club`

## File Structure

```
stormy-book-club/
├── index.html          # Main HTML file
├── styles.css          # CSS styles
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## Technical Details

- **API**: Uses Google Books API for book search (no API key required)
- **Storage**: Uses browser localStorage for data persistence
- **Styling**: Modern CSS with gradients, shadows, and responsive design
- **Icons**: Font Awesome icons for UI elements
- **No Dependencies**: Pure vanilla JavaScript, no frameworks required

## Browser Compatibility

Works in all modern browsers that support:
- ES6+ JavaScript features
- CSS Grid and Flexbox
- localStorage API
- Fetch API

## Customization

You can easily customize the appearance by modifying `styles.css`:
- Change colors by updating CSS custom properties
- Modify the layout by adjusting grid/flexbox properties
- Add new features by extending the JavaScript in `script.js`

Enjoy managing your reading list! 📚

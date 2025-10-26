// Book management application
class BookManager {
    constructor() {
        this.books = this.loadBooks();
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderBooks();
        this.setupSearch();
    }

    setupEventListeners() {
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.renderBooks();
            });
        });

        // Modal close
        document.querySelector('.close').addEventListener('click', () => {
            document.getElementById('bookModal').style.display = 'none';
        });

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('bookModal');
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    setupSearch() {
        const searchBtn = document.getElementById('searchBtn');
        const searchInput = document.getElementById('searchInput');
        let searchTimeout;

        searchBtn.addEventListener('click', () => this.searchBooks());
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchBooks();
            }
        });

        // Real-time search as user types
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            
            // Clear previous timeout
            clearTimeout(searchTimeout);
            
            if (query.length >= 2) {
                // Debounce search - wait 300ms after user stops typing
                searchTimeout = setTimeout(() => {
                    this.searchBooks();
                }, 300);
            } else if (query.length === 0) {
                // Hide dropdown if search is empty
                this.hideSearchDropdown();
            }
        });
    }

    async searchBooks() {
        const query = document.getElementById('searchInput').value.trim();
        if (!query || query.length < 2) {
            this.hideSearchDropdown();
            return;
        }

        try {
            const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=12`);
            const data = await response.json();
            
            if (data.items) {
                this.displaySearchResults(data.items);
            } else {
                this.displaySearchResults([]);
            }
        } catch (error) {
            console.error('Error searching books:', error);
            alert('Error searching for books. Please try again.');
        }
    }

    displaySearchResults(books) {
        const searchDropdown = document.getElementById('searchDropdown');
        const searchResultsList = document.getElementById('searchResultsList');
        
        if (books.length === 0) {
            searchResultsList.innerHTML = '<div class="empty-state"><i class="fas fa-search"></i><h3>No books found</h3><p>Try a different search term</p></div>';
        } else {
            searchResultsList.innerHTML = books.map(book => this.createSearchResultHTML(book)).join('');
        }
        
        // Position dropdown below search bar
        const searchContainer = document.querySelector('.search-container');
        const searchRect = searchContainer.getBoundingClientRect();
        searchDropdown.style.top = (searchRect.bottom + window.scrollY + 10) + 'px';
        searchDropdown.style.display = 'block';
        
        // Add event listeners to add buttons
        searchResultsList.querySelectorAll('.add-book-btn-small').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const bookId = e.target.closest('.add-book-btn-small').dataset.bookId;
                const book = books.find(b => b.id === bookId);
                this.addBook(book);
                this.hideSearchDropdown();
                document.getElementById('searchInput').value = '';
            });
        });

        // Hide dropdown when clicking outside
        setTimeout(() => {
            document.addEventListener('click', this.handleOutsideClick.bind(this));
        }, 100);
    }

    handleOutsideClick(e) {
        const searchContainer = document.querySelector('.search-container');
        if (!searchContainer.contains(e.target)) {
            this.hideSearchDropdown();
        }
    }

    hideSearchDropdown() {
        const searchDropdown = document.getElementById('searchDropdown');
        searchDropdown.style.display = 'none';
        document.removeEventListener('click', this.handleOutsideClick.bind(this));
    }

    createSearchResultHTML(book) {
        const volumeInfo = book.volumeInfo;
        const coverUrl = volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/150x200?text=No+Cover';
        
        return `
            <div class="search-result-item">
                <img src="${coverUrl}" alt="${volumeInfo.title}" class="search-result-cover">
                <div class="search-result-info">
                    <div class="search-result-title">${volumeInfo.title || 'Unknown Title'}</div>
                    <div class="search-result-author">${volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Unknown Author'}</div>
                </div>
                <button class="add-book-btn-small" data-book-id="${book.id}">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
        `;
    }

    addBook(bookData) {
        const volumeInfo = bookData.volumeInfo;
        const newBook = {
            id: bookData.id,
            title: volumeInfo.title || 'Unknown Title',
            author: volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Unknown Author',
            coverUrl: volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/150x200?text=No+Cover',
            status: 'reading',
            rating: 0,
            archived: false,
            dateAdded: new Date().toISOString(),
            iconType: 'frog' // Default to frog
        };

        this.books.push(newBook);
        this.saveBooks();
        this.renderBooks();
    }

    renderBooks() {
        const bookList = document.getElementById('bookList');
        const filteredBooks = this.getFilteredBooks();

        if (filteredBooks.length === 0) {
            bookList.innerHTML = this.getEmptyStateHTML();
            return;
        }

        bookList.innerHTML = filteredBooks.map((book, index) => this.createBookHTML(book, index)).join('');
        this.setupBookEventListeners();
        
        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    getFilteredBooks() {
        switch (this.currentFilter) {
            case 'reading':
                return this.books.filter(book => book.status === 'reading' && !book.archived);
            case 'completed':
                return this.books.filter(book => book.status === 'completed' && !book.archived);
            case 'archived':
                return this.books.filter(book => book.archived);
            default:
                return this.books.filter(book => !book.archived);
        }
    }

    getEmptyStateHTML() {
        const messages = {
            all: { icon: 'fas fa-book', title: 'No books yet', text: 'Start by searching for books to add to your list!' },
            reading: { icon: 'fas fa-book-open', title: 'No books in progress', text: 'Add some books to start reading!' },
            completed: { icon: 'fas fa-check-circle', title: 'No completed books', text: 'Finish reading some books to see them here!' },
            archived: { icon: 'fas fa-archive', title: 'No archived books', text: 'Archive books you want to hide from your main list.' }
        };

        const message = messages[this.currentFilter];
        return `
            <div class="empty-state">
                <i class="${message.icon}"></i>
                <h3>${message.title}</h3>
                <p>${message.text}</p>
            </div>
        `;
    }

    createBookHTML(book, index) {
        const statusClass = book.archived ? 'archived' : book.status;
        const statusBadge = this.getStatusBadge(book.status);
        const stars = this.createStarRating(book.rating);

        return `
            <div class="book-item ${statusClass}" data-book-id="${book.id}" draggable="true">
                <div class="drag-handle">
                    <i class="fas fa-grip-vertical"></i>
                </div>
                <img src="${book.coverUrl}" alt="${book.title}" class="book-cover">
                <div class="book-info">
                    <div class="book-title">${book.title}</div>
                    <div class="book-author">${book.author}</div>
                    <div class="book-status">
                        <span class="status-badge status-${book.status}">${statusBadge}</span>
                        <div class="rating">${stars}</div>
                    </div>
                    <div class="book-dates">
                        <div class="book-date-added">Added: ${this.formatDate(book.dateAdded)}</div>
                        ${book.dateCompleted ? `<div class="book-date-completed">Completed: ${this.formatDate(book.dateCompleted)}</div>` : ''}
                    </div>
                    <div class="book-icon-picker">
                        <button class="icon-btn ${book.iconType === 'frog' ? 'active' : ''}" data-icon="frog" data-book-id="${book.id}">
                            <i data-lucide="zap"></i>
                        </button>
                        <button class="icon-btn ${book.iconType === 'elephant' ? 'active' : ''}" data-icon="elephant" data-book-id="${book.id}">
                            <i data-lucide="heart"></i>
                        </button>
                    </div>
                </div>
                <div class="book-actions">
                    ${book.status === 'reading' ? `
                        <button class="action-btn btn-complete" data-action="complete" data-book-id="${book.id}">
                            <i class="fas fa-check"></i> Complete
                        </button>
                    ` : ''}
                    ${book.status === 'completed' ? `
                        <button class="action-btn btn-complete" data-action="uncomplete" data-book-id="${book.id}">
                            <i class="fas fa-undo"></i> Mark Reading
                        </button>
                    ` : ''}
                    <button class="action-btn ${book.archived ? 'btn-complete' : 'btn-archive'}" data-action="${book.archived ? 'unarchive' : 'archive'}" data-book-id="${book.id}">
                        <i class="fas fa-${book.archived ? 'box-open' : 'archive'}"></i> ${book.archived ? 'Unarchive' : 'Archive'}
                    </button>
                    <button class="action-btn btn-delete" data-action="delete" data-book-id="${book.id}">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `;
    }

    getStatusBadge(status) {
        const badges = {
            reading: 'Reading',
            completed: 'Completed',
            archived: 'Archived'
        };
        return badges[status] || 'Reading';
    }

    createStarRating(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            const activeClass = i <= rating ? 'active' : '';
            stars += `<i class="fas fa-star star ${activeClass}" data-rating="${i}"></i>`;
        }
        return stars;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    setupBookEventListeners() {
        // Action buttons
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.closest('.action-btn').dataset.action;
                const bookId = e.target.closest('.action-btn').dataset.bookId;

                switch (action) {
                    case 'complete':
                        this.updateBookStatus(bookId, 'completed');
                        break;
                    case 'uncomplete':
                        this.updateBookStatus(bookId, 'reading');
                        break;
                    case 'archive':
                        this.archiveBook(bookId, true);
                        break;
                    case 'unarchive':
                        this.archiveBook(bookId, false);
                        break;
                    case 'delete':
                        this.deleteBook(bookId);
                        break;
                }
            });
        });

        // Drag and drop functionality
        this.setupDragAndDrop();

        // Star ratings
        document.querySelectorAll('.star').forEach(star => {
            star.addEventListener('click', (e) => {
                const rating = parseInt(e.target.dataset.rating);
                const bookId = e.target.closest('.book-item').dataset.bookId;
                this.updateBookRating(bookId, rating);
            });
        });

        // Icon picker
        document.querySelectorAll('.icon-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const iconType = e.target.closest('.icon-btn').dataset.icon;
                const bookId = e.target.closest('.icon-btn').dataset.bookId;
                this.updateBookIcon(bookId, iconType);
            });
        });
    }

    setupDragAndDrop() {
        const bookList = document.getElementById('bookList');
        let draggedElement = null;

        // Drag start
        bookList.addEventListener('dragstart', (e) => {
            if (e.target.closest('.book-item')) {
                draggedElement = e.target.closest('.book-item');
                draggedElement.style.opacity = '0.5';
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/html', draggedElement.outerHTML);
            }
        });

        // Drag end
        bookList.addEventListener('dragend', (e) => {
            if (draggedElement) {
                draggedElement.style.opacity = '1';
                draggedElement = null;
            }
        });

        // Drag over
        bookList.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            
            const afterElement = this.getDragAfterElement(bookList, e.clientY);
            if (afterElement == null) {
                bookList.appendChild(draggedElement);
            } else {
                bookList.insertBefore(draggedElement, afterElement);
            }
        });

        // Drop
        bookList.addEventListener('drop', (e) => {
            e.preventDefault();
            if (draggedElement) {
                this.updateBookOrder();
            }
        });
    }

    getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.book-item:not(.dragging)')];
        
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    updateBookOrder() {
        const bookList = document.getElementById('bookList');
        const bookElements = bookList.querySelectorAll('.book-item');
        const newOrder = [];
        
        bookElements.forEach(element => {
            const bookId = element.dataset.bookId;
            const book = this.books.find(b => b.id === bookId);
            if (book) {
                newOrder.push(book);
            }
        });
        
        this.books = newOrder;
        this.saveBooks();
    }

    updateBookStatus(bookId, status) {
        const book = this.books.find(b => b.id === bookId);
        if (book) {
            book.status = status;
            if (status === 'completed' && !book.dateCompleted) {
                book.dateCompleted = new Date().toISOString();
            }
            this.saveBooks();
            this.renderBooks();
        }
    }

    updateBookRating(bookId, rating) {
        const book = this.books.find(b => b.id === bookId);
        if (book) {
            book.rating = rating;
            this.saveBooks();
            this.renderBooks();
        }
    }

    updateBookIcon(bookId, iconType) {
        const book = this.books.find(b => b.id === bookId);
        if (book) {
            book.iconType = iconType;
            this.saveBooks();
            this.renderBooks();
        }
    }

    archiveBook(bookId, archived) {
        const book = this.books.find(b => b.id === bookId);
        if (book) {
            book.archived = archived;
            this.saveBooks();
            this.renderBooks();
        }
    }

    deleteBook(bookId) {
        if (confirm('Are you sure you want to delete this book?')) {
            this.books = this.books.filter(book => book.id !== bookId);
            this.saveBooks();
            this.renderBooks();
        }
    }

    saveBooks() {
        localStorage.setItem('stormyBookClub', JSON.stringify(this.books));
    }

    loadBooks() {
        const saved = localStorage.getItem('stormyBookClub');
        return saved ? JSON.parse(saved) : [];
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BookManager();
});

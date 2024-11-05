import { books, authors, genres, BOOKS_PER_PAGE } from './data.js'

let page = 1;
let matches = books

// function that contains all the DOM elements
const DOMElements = {
    listItems: document.querySelector('[data-list-items]'),
    searchOverlay: document.querySelector('[data-search-overlay]'),
    settingsOverlay: document.querySelector('[data-settings-overlay]'),
    listButton: document.querySelector('[data-list-button]'),
    searchTitle: document.querySelector('[data-search-title]'),
    listMessage: document.querySelector('[data-list-message]'),
    settingsForm: document.querySelector('[data-settings-form]'),
    searchForm: document.querySelector('[data-search-form]'),
    headerSearch: document.querySelector('[data-header-search]'),
    headerSettings: document.querySelector('[data-header-settings]'),
    listActive: document.querySelector('[data-list-active]'),
    listBlur: document.querySelector('[data-list-blur]'),
    listImage: document.querySelector('[data-list-image]'),
    listTitle: document.querySelector('[data-list-title]'),
    listSubtitle: document.querySelector('[data-list-subtitle]'),
    listDescription: document.querySelector('[data-list-description]'),
};

//function that Creates DOM Elements
const createElement = (tag, className, attributes = {}, innerHTML = '') => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
    element.innerHTML = innerHTML;
    return element;
};

// Create Book Preview Button Function
const createBookPreviewButton = ({ author, id, image, title }) => {
    return createElement('button', 'preview', { 'data-preview': id }, `
        <img class="preview__image" src="${image}" />
        <div class="preview__info">
            <h3 class="preview__title">${title}</h3>
            <div class="preview__author">${authors[author]}</div>
        </div>
    `);
};

//Render Books Function
const renderBooks = (booksToRender) => {
    const fragment = document.createDocumentFragment();
    booksToRender.forEach(book => {
        fragment.appendChild(createBookPreviewButton(book));
    });
    DOMElements.listItems.appendChild(fragment);
};

// GEnere and Author Setup Function
const setupGenresAndAuthors = (type, data) => {
    const fragment = document.createDocumentFragment();
    const firstElement = createElement('option', '', { value: 'any' }, `All ${type.charAt(0).toUpperCase() + type.slice(1)}`);
    fragment.appendChild(firstElement);
    Object.entries(data).forEach(([id, name]) => {
        const option = createElement('option', '', { value: id }, name);
        fragment.appendChild(option);
    });
    document.querySelector(`[data-search-${type}]`).appendChild(fragment);
};

// Create Options for Select Elements
const createOptions = (data, type) => {
    const fragment = document.createDocumentFragment();
    const firstElement = createElement('option', '', { value: 'any' }, `All ${type.charAt(0).toUpperCase() + type.slice(1)}`);
    fragment.appendChild(firstElement);
    Object.entries(data).forEach(([id, name]) => {
        const option = createElement('option', '', { value: id }, name);
        fragment.appendChild(option);
    });
    return fragment;
};

// Search Books Function
const searchBooks = (filters) => {
    return books.filter(book => {
        const genreMatch = filters.genre === 'any' || book.genres.includes(filters.genre);
        const titleMatch = filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase());
        const authorMatch = filters.author === 'any' || book.author === filters.author;
        return titleMatch && authorMatch && genreMatch;
    });
};

// Update Show More Button Function
const updateShowMoreButton = () => {
    const remaining = matches.length - (page * BOOKS_PER_PAGE);
    DOMElements.listButton.innerHTML = `
        <span>Show more</span>
        <span class="list__remaining"> (${remaining > 0 ? remaining : 0})</span>
    `;
    DOMElements.listButton.disabled = remaining < 1;
};
//Apply Theme Settings Function
const applyTheme = (theme) => {
    if (theme === 'night') {
        document.documentElement.style.setProperty('--color-dark', '255, 255, 255');
        document.documentElement.style.setProperty('--color-light', '10, 10, 20');
    } else {
        document.documentElement.style.setProperty('--color-dark', '10, 10, 20');
        document.documentElement.style.setProperty('--color-light', '255, 255, 255');
    }
};

const GenreOptions = () => {
    const starting = document.createDocumentFragment()

    document.querySelector('[data-list-items]').appendChild(starting)

    const genreHtml = document.createDocumentFragment()
    const firstGenreElement = document.createElement('option')
    firstGenreElement.value = 'any'
    firstGenreElement.innerText = 'All Genres'
    genreHtml.appendChild(firstGenreElement)

    for (const [id, name] of Object.entries(genres)) {
        const element = document.createElement('option')
        element.value = id
        element.innerText = name
        genreHtml.appendChild(element)
    }

    document.querySelector('[data-search-genres]').appendChild(genreHtml)

    const authorsHtml = document.createDocumentFragment()
    const firstAuthorElement = document.createElement('option')
    firstAuthorElement.value = 'any'
    firstAuthorElement.innerText = 'All Authors'
    authorsHtml.appendChild(firstAuthorElement)

    for (const [id, name] of Object.entries(authors)) {
        const element = document.createElement('option')
        element.value = id
        element.innerText = name
        authorsHtml.appendChild(element)
    }

    document.querySelector('[data-search-authors]').appendChild(authorsHtml)

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.querySelector('[data-settings-theme]').value = 'night'
        applyTheme('night')
    } else {
        document.querySelector('[data-settings-theme]').value = 'day'
        applyTheme('day')
    }

    document.querySelector('[data-list-button]').innerText = `Show more (${books.length - BOOKS_PER_PAGE})`
    document.querySelector('[data-list-button]').disabled = (matches.length - (page * BOOKS_PER_PAGE)) > 0

    document.querySelector('[data-list-button]').innerHTML = `
        <span>Show more</span>
        <span class="list__remaining"> (${(matches.length - (page * BOOKS_PER_PAGE)) > 0 ? (matches.length - (page * BOOKS_PER_PAGE)) : 0})</span>
    `
    }

// Initial setup
const init = () => {
    DOMElements.listItems.appendChild(createOptions(genres, 'genres'));
    DOMElements.listItems.appendChild(createOptions(authors, 'authors'));
    GenreOptions()
    renderBooks(matches.slice(0, BOOKS_PER_PAGE));
    setupGenresAndAuthors('genres', genres);
    setupGenresAndAuthors('authors', authors);
    applyTheme(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day');
    updateShowMoreButton();
};


// Event Listeners
DOMElements.listButton.addEventListener('click', () => {
    renderBooks(matches.slice(page * BOOKS_PER_PAGE, (page + 1) * BOOKS_PER_PAGE));
    page += 1;
    updateShowMoreButton();
});

DOMElements.searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const filters = {
        title: DOMElements.searchTitle.value,
        author: DOMElements.searchForm.elements.author.value,
        genre: DOMElements.searchForm.elements.genre.value,
    };
    matches = searchBooks(filters);
    page = 1;
    DOMElements.listItems.innerHTML = '';
    renderBooks(matches.slice(0, BOOKS_PER_PAGE));
    updateShowMoreButton();
});

document.querySelector('[data-search-cancel]').addEventListener('click', () => {
    document.querySelector('[data-search-overlay]').open = false;
});

document.querySelector('[data-settings-cancel]').addEventListener('click', () => {
    document.querySelector('[data-settings-overlay]').open = false;
});

document.querySelector('[data-header-search]').addEventListener('click', () => {
    document.querySelector('[data-search-overlay]').open = true;
    DOMElements.searchTitle.focus();
});

document.querySelector('[data-header-settings]').addEventListener('click', () => {
    document.querySelector('[data-settings-overlay]').open = true;
});

document.querySelector('[data-list-close]').addEventListener('click', () => {
    document.querySelector('[data-list-active]').open = false;
});

document.querySelector('[data-settings-form]').addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const { theme } = Object.fromEntries(formData);
    applyTheme(theme);
    document.querySelector('[data-settings-overlay]').open = false;
});
    
    if (active) {
        document.querySelector('[data-list-active]').open = true
        document.querySelector('[data-list-blur]').src = active.image
        document.querySelector('[data-list-image]').src = active.image
        document.querySelector('[data-list-title]').innerText = active.title
        document.querySelector('[data-list-subtitle]').innerText = `${authors[active.author]} (${new Date(active.published).getFullYear()})`
        document.querySelector('[data-list-description]').innerText = active.description
    }
})

// initializing
init();
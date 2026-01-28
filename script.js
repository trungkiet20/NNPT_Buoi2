let allProducts = [];

// Fetch data from API
async function fetchProducts() {
    try {
        const response = await fetch('https://api.escuelajs.co/api/v1/products');
        allProducts = await response.json();
        displayProducts(allProducts);
    } catch (error) {
        console.error('Error fetching products:', error);
        document.querySelector('.products-grid tbody').innerHTML = 
            '<tr><td colspan="7" class="error">Error loading products. Please try again later.</td></tr>';
    }
}

// Filter and sort products
function filterAndSort() {
    let filtered = [...allProducts];
    
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;
    const sort = document.getElementById('sortFilter').value;

    // Search filter
    if (searchTerm) {
        filtered = filtered.filter(p => 
            p.title.toLowerCase().includes(searchTerm) ||
            p.description.toLowerCase().includes(searchTerm)
        );
    }

    // Category filter
    if (category) {
        filtered = filtered.filter(p => p.category && p.category.name === category);
    }

    // Sorting
    if (sort === 'price-low') {
        filtered.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
        filtered.sort((a, b) => b.price - a.price);
    } else if (sort === 'name') {
        filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    displayProducts(filtered);
}

// Convert data and display products
function displayProducts(products) {
    const tbody = document.querySelector('.products-grid tbody');
    const countEl = document.getElementById('productCount');
    
    tbody.innerHTML = '';
    countEl.textContent = `Showing ${products.length} products`;

    if (products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="error">No products found</td></tr>';
        return;
    }

    products.forEach(product => {
        const row = createProductRow(product);
        tbody.appendChild(row);
    });
}

// Create product row element
function createProductRow(product) {
    const row = document.createElement('tr');
    
    let imageUrl = 'https://via.placeholder.com/100x100?text=No+Image';
    
    if (product.images && product.images[0]) {
        imageUrl = product.images[0];
    } else if (product.category && product.category.image) {
        imageUrl = product.category.image;
    }

    row.innerHTML = `
        <td class="col-checkbox">
            <input type="checkbox" class="product-checkbox">
        </td>
        <td class="col-name">
            <strong>${product.title}</strong>
        </td>
        <td class="col-slug">
            <span class="slug">${product.slug}</span>
        </td>
        <td class="col-price">
            <span class="price">$${product.price}</span>
        </td>
        <td class="col-description">
            <span class="description">${product.description}</span>
        </td>
        <td class="col-category">
            <span class="category-badge">${product.category ? product.category.name : 'Unknown'}</span>
        </td>
        <td class="col-image">
            <img src="${imageUrl}" alt="${product.title}" class="product-thumb" onerror="this.src='https://via.placeholder.com/100x100?text=No+Image'" loading="lazy">
        </td>
    `;

    return row;
}

// Add event listeners
function setupListeners() {
    document.getElementById('searchInput').addEventListener('input', filterAndSort);
    document.getElementById('categoryFilter').addEventListener('change', filterAndSort);
    document.getElementById('sortFilter').addEventListener('change', filterAndSort);
}

// Fetch products when page loads
window.addEventListener('load', () => {
    fetchProducts();
    setupListeners();
});

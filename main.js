let allProducts = [];

// Main App Initialization
class ProductManager {
    constructor() {
        this.isLoading = false;
        this.init();
    }

    init() {
        this.setupListeners();
        this.fetchProducts();
    }

    // Fetch data from API
    async fetchProducts() {
        if (this.isLoading) return;
        this.isLoading = true;

        try {
            const response = await fetch('https://api.escuelajs.co/api/v1/products');
            allProducts = await response.json();
            this.displayProducts(allProducts);
        } catch (error) {
            console.error('Error fetching products:', error);
            document.querySelector('.products-grid tbody').innerHTML = 
                '<tr><td colspan="7" class="error">Error loading products. Please try again later.</td></tr>';
        } finally {
            this.isLoading = false;
        }
    }

    // Filter and sort products
    filterAndSort() {
        let filtered = [...allProducts];
        
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const category = document.getElementById('categoryFilter').value;
        const sort = document.getElementById('sortFilter').value;

        if (searchTerm) {
            filtered = filtered.filter(p => 
                p.title.toLowerCase().includes(searchTerm) ||
                p.description.toLowerCase().includes(searchTerm)
            );
        }

        if (category) {
            filtered = filtered.filter(p => p.category && p.category.name === category);
        }

        if (sort === 'price-low') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sort === 'price-high') {
            filtered.sort((a, b) => b.price - a.price);
        } else if (sort === 'name') {
            filtered.sort((a, b) => a.title.localeCompare(b.title));
        }

        this.displayProducts(filtered);
    }

    // Display products in table
    displayProducts(products) {
        const tbody = document.querySelector('.products-grid tbody');
        const countEl = document.getElementById('productCount');
        
        tbody.innerHTML = '';
        countEl.textContent = `Showing ${products.length} products`;

        if (products.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="error">No products found</td></tr>';
            return;
        }

        const fragment = document.createDocumentFragment();
        products.forEach(product => {
            const row = this.createProductRow(product);
            fragment.appendChild(row);
        });
        tbody.appendChild(fragment);
    }

    // Create product row element
    createProductRow(product) {
        const row = document.createElement('tr');
        const imageUrl = this.getImageUrl(product);

        const title = this.escapeHtml(product.title || '');
        const slug = this.escapeHtml(product.slug || 'N/A');
        const price = parseFloat(product.price || 0).toFixed(2);
        const description = this.escapeHtml(product.description || 'No description');
        const category = product.category ? this.escapeHtml(product.category.name) : 'Unknown';

        row.innerHTML = `
            <td class="col-checkbox"><input type="checkbox" class="product-checkbox"></td>
            <td class="col-name"><strong>${title}</strong></td>
            <td class="col-slug"><span class="slug">${slug}</span></td>
            <td class="col-price"><span class="price">$${price}</span></td>
            <td class="col-description"><span class="description">${description}</span></td>
            <td class="col-category"><span class="category-badge">${category}</span></td>
            <td class="col-image">
                <img src="${imageUrl}" alt="${title}" class="product-thumb" onerror="this.src='https://via.placeholder.com/100x100/cccccc/999999?text=No+Image'" loading="lazy">
            </td>
        `;

        return row;
    }

    // Get image URL - Simple version
    getImageUrl(product) {
        // Thử ảnh sản phẩm trước
        if (product.images && product.images.length > 0 && product.images[0]) {
            return product.images[0];
        }

        // Thử ảnh category
        if (product.category && product.category.image) {
            return product.category.image;
        }

        // Ảnh mặc định theo category
        const categoryImages = {
            'Clothes': 'https://via.placeholder.com/100x100/4a90e2/ffffff?text=Clothes',
            'Electronics': 'https://via.placeholder.com/100x100/f39c12/ffffff?text=Electronics',
            'Shoes': 'https://via.placeholder.com/100x100/e74c3c/ffffff?text=Shoes',
            'Miscellaneous': 'https://via.placeholder.com/100x100/95a5a6/ffffff?text=Other'
        };

        const categoryName = product.category ? product.category.name : 'Miscellaneous';
        return categoryImages[categoryName] || categoryImages['Miscellaneous'];
    }

    // Escape HTML to prevent XSS
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Add event listeners
    setupListeners() {
        const searchInput = document.getElementById('searchInput');
        const categoryFilter = document.getElementById('categoryFilter');
        const sortFilter = document.getElementById('sortFilter');

        if (searchInput) searchInput.addEventListener('input', () => this.filterAndSort());
        if (categoryFilter) categoryFilter.addEventListener('change', () => this.filterAndSort());
        if (sortFilter) sortFilter.addEventListener('change', () => this.filterAndSort());
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ProductManager();
    });
} else {
    new ProductManager();
}


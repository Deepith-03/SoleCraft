package com.sneakerhead.backend.service;

import com.sneakerhead.backend.dto.ProductRequest;
import com.sneakerhead.backend.exception.ResourceNotFoundException;
import com.sneakerhead.backend.model.Product;
import com.sneakerhead.backend.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> getProducts(String search, Integer page, Integer size) {
        if (search != null && !search.isBlank()) {
            return productRepository.findByNameContainingIgnoreCaseOrBrandContainingIgnoreCaseOrCategoryContainingIgnoreCase(
                    search,
                    search,
                    search
            );
        }

        if (page != null && size != null) {
            if (page < 0 || size <= 0) {
                throw new IllegalArgumentException("Page must be >= 0 and size must be > 0");
            }
            Pageable pageable = PageRequest.of(page, size);
            Page<Product> productPage = productRepository.findAll(pageable);
            return productPage.getContent();
        }

        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }

    public Product createProduct(ProductRequest request) {
        Product product = mapRequestToProduct(new Product(), request);
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, ProductRequest request) {
        Product existing = getProductById(id);
        Product updated = mapRequestToProduct(existing, request);
        return productRepository.save(updated);
    }

    public void deleteProduct(Long id) {
        Product existing = getProductById(id);
        productRepository.delete(existing);
    }

    private Product mapRequestToProduct(Product target, ProductRequest request) {
        target.setName(request.getName());
        target.setBrand(request.getBrand());
        target.setDescription(request.getDescription());
        target.setCategory(request.getCategory());
        target.setPrice(request.getPrice());
        target.setImage(request.getImage());
        target.setColor(request.getColor());
        target.setStockQuantity(request.getStockQuantity());
        target.setFeatured(request.getFeatured());
        target.setRating(request.getRating());
        return target;
    }
}

package com.bookstore.controller;

import com.bookstore.dto.ApiResponse;
import com.bookstore.model.Product;
import com.bookstore.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api")
public class ProductController {

    @Autowired
    private ProductService productService;

    // Public - get all products
    @GetMapping("/products")
    public ResponseEntity<ApiResponse<List<Product>>> getAllProducts() {
        return ResponseEntity.ok(ApiResponse.ok("Products fetched", productService.getAllProducts()));
    }

    // Public - get limited products for home page
    @GetMapping("/products/featured")
    public ResponseEntity<ApiResponse<List<Product>>> getFeaturedProducts() {
        return ResponseEntity.ok(ApiResponse.ok("Featured products", productService.getFeaturedProducts()));
    }

    // Admin - add product
    @PostMapping("/admin/products")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Product>> addProduct(
            @RequestParam("name") String name,
            @RequestParam("price") Integer price,
            @RequestParam("image") MultipartFile image) throws IOException {
        Product product = productService.addProduct(name, price, image);
        return ResponseEntity.ok(ApiResponse.ok("Product added successfully!", product));
    }

    // Admin - update product
    @PutMapping("/admin/products/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Product>> updateProduct(
            @PathVariable Long id,
            @RequestParam("name") String name,
            @RequestParam("price") Integer price,
            @RequestParam(value = "image", required = false) MultipartFile image) throws IOException {
        Product product = productService.updateProduct(id, name, price, image);
        return ResponseEntity.ok(ApiResponse.ok("Product updated!", product));
    }

    // Admin - delete product
    @DeleteMapping("/admin/products/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Long id) throws IOException {
        productService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.ok("Product deleted!"));
    }
}

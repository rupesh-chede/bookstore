package com.bookstore.service;

import com.bookstore.model.Product;
import com.bookstore.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Value("${app.upload.dir}")
    private String uploadDir;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public List<Product> getFeaturedProducts() {
        return productRepository.findAll(PageRequest.of(0, 6)).getContent();
    }

    public Product addProduct(String name, Integer price, MultipartFile image) throws IOException {
        if (productRepository.existsByName(name)) {
            throw new RuntimeException("Product already exists!");
        }

        String imageName = saveImage(image);

        Product product = new Product();
        product.setName(name);
        product.setPrice(price);
        product.setImage(imageName);

        return productRepository.save(product);
    }

    public Product updateProduct(Long id, String name, Integer price, MultipartFile image) throws IOException {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setName(name);
        product.setPrice(price);

        if (image != null && !image.isEmpty()) {
            deleteImageFile(product.getImage());
            String imageName = saveImage(image);
            product.setImage(imageName);
        }

        return productRepository.save(product);
    }

    public void deleteProduct(Long id) throws IOException {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        deleteImageFile(product.getImage());
        productRepository.deleteById(id);
    }

    private String saveImage(MultipartFile file) throws IOException {
        if (file.getSize() > 5_000_000) {
            throw new RuntimeException("Image size too large (max 5MB)");
        }

        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String originalName = file.getOriginalFilename();
        String ext = (originalName != null && originalName.contains("."))
                ? originalName.substring(originalName.lastIndexOf("."))
                : ".jpg";
        String fileName = UUID.randomUUID() + ext;

        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return fileName;
    }

    private void deleteImageFile(String imageName) throws IOException {
        Path filePath = Paths.get(uploadDir).resolve(imageName);
        Files.deleteIfExists(filePath);
    }
}

package com.bookstore.controller;

import com.bookstore.dto.AddToCartRequest;
import com.bookstore.dto.ApiResponse;
import com.bookstore.model.Cart;
import com.bookstore.service.CartService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Cart>>> getCart(@AuthenticationPrincipal UserDetails userDetails) {
        Long userId = cartService.getUserIdFromEmail(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok("Cart fetched", cartService.getCartItems(userId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Cart>> addToCart(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody AddToCartRequest request) {
        Long userId = cartService.getUserIdFromEmail(userDetails.getUsername());
        Cart cart = cartService.addToCart(userId, request);
        return ResponseEntity.ok(ApiResponse.ok("Product added to cart!", cart));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Cart>> updateCart(
            @PathVariable Long id,
            @RequestParam Integer quantity) {
        Cart cart = cartService.updateCartItem(id, quantity);
        return ResponseEntity.ok(ApiResponse.ok("Cart updated!", cart));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCartItem(@PathVariable Long id) {
        cartService.deleteCartItem(id);
        return ResponseEntity.ok(ApiResponse.ok("Item removed from cart!"));
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> clearCart(@AuthenticationPrincipal UserDetails userDetails) {
        Long userId = cartService.getUserIdFromEmail(userDetails.getUsername());
        cartService.clearCart(userId);
        return ResponseEntity.ok(ApiResponse.ok("Cart cleared!"));
    }
}

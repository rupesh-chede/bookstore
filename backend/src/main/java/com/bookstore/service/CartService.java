package com.bookstore.service;

import com.bookstore.dto.AddToCartRequest;
import com.bookstore.model.Cart;
import com.bookstore.repository.CartRepository;
import com.bookstore.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CartService {

    @Autowired private CartRepository cartRepository;
    @Autowired private UserRepository userRepository;

    public Long getUserIdFromEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();
    }

    public List<Cart> getCartItems(Long userId) {
        return cartRepository.findByUserId(userId);
    }

    public Cart addToCart(Long userId, AddToCartRequest request) {
        if (cartRepository.existsByUserIdAndName(userId, request.getName())) {
            throw new RuntimeException("Already added to cart!");
        }

        Cart cart = new Cart();
        cart.setUserId(userId);
        cart.setName(request.getName());
        cart.setPrice(request.getPrice());
        cart.setQuantity(request.getQuantity() != null ? request.getQuantity() : 1);
        cart.setImage(request.getImage());

        return cartRepository.save(cart);
    }

    public Cart updateCartItem(Long cartId, Integer quantity) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
        cart.setQuantity(quantity);
        return cartRepository.save(cart);
    }

    public void deleteCartItem(Long cartId) {
        cartRepository.deleteById(cartId);
    }

    @Transactional
    public void clearCart(Long userId) {
        cartRepository.deleteByUserId(userId);
    }
}

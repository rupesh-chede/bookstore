package com.bookstore.service;

import com.bookstore.dto.PlaceOrderRequest;
import com.bookstore.model.Cart;
import com.bookstore.model.Order;
import com.bookstore.repository.CartRepository;
import com.bookstore.repository.OrderRepository;
import com.bookstore.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired private OrderRepository orderRepository;
    @Autowired private CartRepository cartRepository;
    @Autowired private UserRepository userRepository;

    public Long getUserIdFromEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();
    }

    public List<Order> getUserOrders(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByIdDesc();
    }

    @Transactional
    public Order placeOrder(Long userId, PlaceOrderRequest request) {
        List<Cart> cartItems = cartRepository.findByUserId(userId);

        if (cartItems.isEmpty()) {
            throw new RuntimeException("Your cart is empty!");
        }

        int totalPrice = cartItems.stream()
                .mapToInt(c -> c.getPrice() * c.getQuantity())
                .sum();

        String totalProducts = cartItems.stream()
                .map(c -> c.getName() + " (" + c.getQuantity() + ")")
                .collect(Collectors.joining(", "));

        String placedOn = LocalDate.now().format(DateTimeFormatter.ofPattern("dd-MMM-yyyy"));

        Order order = new Order();
        order.setUserId(userId);
        order.setName(request.getName());
        order.setNumber(request.getNumber());
        order.setEmail(request.getEmail());
        order.setMethod(request.getMethod());
        order.setAddress(request.getAddress());
        order.setTotalProducts(totalProducts);
        order.setTotalPrice(totalPrice);
        order.setPlacedOn(placedOn);
        order.setPaymentStatus("pending");

        Order savedOrder = orderRepository.save(order);

        // Clear cart after placing order
        cartRepository.deleteByUserId(userId);

        return savedOrder;
    }

    public Order updatePaymentStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setPaymentStatus(status);
        return orderRepository.save(order);
    }

    public void deleteOrder(Long orderId) {
        orderRepository.deleteById(orderId);
    }
}

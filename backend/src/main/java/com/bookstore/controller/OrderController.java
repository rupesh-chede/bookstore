package com.bookstore.controller;

import com.bookstore.dto.ApiResponse;
import com.bookstore.dto.PlaceOrderRequest;
import com.bookstore.model.Order;
import com.bookstore.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class OrderController {

    @Autowired
    private OrderService orderService;

    // User: get own orders
    @GetMapping("/orders")
    public ResponseEntity<ApiResponse<List<Order>>> getMyOrders(@AuthenticationPrincipal UserDetails userDetails) {
        Long userId = orderService.getUserIdFromEmail(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok("Orders fetched", orderService.getUserOrders(userId)));
    }

    // User: place order
    @PostMapping("/orders")
    public ResponseEntity<ApiResponse<Order>> placeOrder(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody PlaceOrderRequest request) {
        Long userId = orderService.getUserIdFromEmail(userDetails.getUsername());
        Order order = orderService.placeOrder(userId, request);
        return ResponseEntity.ok(ApiResponse.ok("Order placed successfully!", order));
    }

    // Admin: get all orders
    @GetMapping("/admin/orders")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<Order>>> getAllOrders() {
        return ResponseEntity.ok(ApiResponse.ok("All orders", orderService.getAllOrders()));
    }

    // Admin: update payment status
    @PutMapping("/admin/orders/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Order>> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        Order order = orderService.updatePaymentStatus(id, status);
        return ResponseEntity.ok(ApiResponse.ok("Status updated!", order));
    }

    // Admin: delete order
    @DeleteMapping("/admin/orders/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
        return ResponseEntity.ok(ApiResponse.ok("Order deleted!"));
    }
}

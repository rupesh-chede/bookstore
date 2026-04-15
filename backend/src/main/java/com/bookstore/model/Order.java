package com.bookstore.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 12)
    private String number;

    @Column(nullable = false, length = 100)
    private String email;

    @Column(nullable = false, length = 50)
    private String method;

    @Column(nullable = false, length = 500)
    private String address;

    @Column(name = "total_products", nullable = false, length = 1000)
    private String totalProducts;

    @Column(name = "total_price", nullable = false)
    private Integer totalPrice;

    @Column(name = "placed_on", nullable = false, length = 50)
    private String placedOn;

    @Column(name = "payment_status", length = 20)
    private String paymentStatus = "pending";
}

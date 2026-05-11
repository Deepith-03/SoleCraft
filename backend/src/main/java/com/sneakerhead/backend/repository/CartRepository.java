package com.sneakerhead.backend.repository;

import com.sneakerhead.backend.model.CartItem;
import com.sneakerhead.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUser(User user);
    Optional<CartItem> findByUserAndProductId(User user, Long productId);
    long countByUser(User user);
    List<CartItem> findAllByUser(User user);
}

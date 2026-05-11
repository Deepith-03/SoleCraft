package com.sneakerhead.backend.repository;

import com.sneakerhead.backend.model.User;
import com.sneakerhead.backend.model.WishlistItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WishlistRepository extends JpaRepository<WishlistItem, Long> {
    List<WishlistItem> findByUser(User user);
    Optional<WishlistItem> findByUserAndProductId(User user, Long productId);
    long countByUser(User user);
}

package com.sneakerhead.backend.service;

import com.sneakerhead.backend.exception.ResourceNotFoundException;
import com.sneakerhead.backend.model.Product;
import com.sneakerhead.backend.model.User;
import com.sneakerhead.backend.model.WishlistItem;
import com.sneakerhead.backend.repository.ProductRepository;
import com.sneakerhead.backend.repository.UserRepository;
import com.sneakerhead.backend.repository.WishlistRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public WishlistService(WishlistRepository wishlistRepository,
                           ProductRepository productRepository,
                           UserRepository userRepository) {
        this.wishlistRepository = wishlistRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    public List<WishlistItem> getWishlist(Authentication authentication) {
        User user = getCurrentUser(authentication);
        return wishlistRepository.findByUser(user);
    }

    public WishlistItem addToWishlist(Long productId, Authentication authentication) {
        User user = getCurrentUser(authentication);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        return wishlistRepository.findByUserAndProductId(user, productId)
                .orElseGet(() -> wishlistRepository.save(new WishlistItem(null, user, product)));
    }

    public void removeFromWishlist(Long wishlistItemId, Authentication authentication) {
        User user = getCurrentUser(authentication);
        WishlistItem wishlistItem = wishlistRepository.findById(wishlistItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Wishlist item not found with id: " + wishlistItemId));

        if (!wishlistItem.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("You are not allowed to modify this wishlist item");
        }

        wishlistRepository.delete(wishlistItem);
    }

    public long getWishlistCount(Authentication authentication) {
        User user = getCurrentUser(authentication);
        return wishlistRepository.countByUser(user);
    }

    private User getCurrentUser(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + authentication.getName()));
    }
}

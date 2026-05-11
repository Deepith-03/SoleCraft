package com.sneakerhead.backend.service;

import com.sneakerhead.backend.exception.ResourceNotFoundException;
import com.sneakerhead.backend.model.CartItem;
import com.sneakerhead.backend.model.Product;
import com.sneakerhead.backend.model.User;
import com.sneakerhead.backend.repository.CartRepository;
import com.sneakerhead.backend.repository.ProductRepository;
import com.sneakerhead.backend.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public CartService(CartRepository cartRepository, ProductRepository productRepository, UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    public List<CartItem> getCart(Authentication authentication) {
        User user = getCurrentUser(authentication);
        return cartRepository.findByUser(user);
    }

    public CartItem addToCart(Long productId, Authentication authentication) {
        User user = getCurrentUser(authentication);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        CartItem cartItem = cartRepository.findByUserAndProductId(user, productId)
                .orElse(new CartItem(null, user, product, 0));

        cartItem.setQuantity(cartItem.getQuantity() + 1);
        return cartRepository.save(cartItem);
    }

    public CartItem updateQuantity(Long cartItemId, Integer quantity, Authentication authentication) {
        if (quantity == null || quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than 0");
        }

        User user = getCurrentUser(authentication);
        CartItem cartItem = cartRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id: " + cartItemId));

        ensureOwnership(user, cartItem.getUser().getId(), "cart item");
        cartItem.setQuantity(quantity);
        return cartRepository.save(cartItem);
    }

    public void removeFromCart(Long cartItemId, Authentication authentication) {
        User user = getCurrentUser(authentication);
        CartItem cartItem = cartRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id: " + cartItemId));

        ensureOwnership(user, cartItem.getUser().getId(), "cart item");
        cartRepository.delete(cartItem);
    }

    public long getCartCount(Authentication authentication) {
        User user = getCurrentUser(authentication);
        return cartRepository.findAllByUser(user).stream()
                .mapToLong(CartItem::getQuantity)
                .sum();
    }

    private User getCurrentUser(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + authentication.getName()));
    }

    private void ensureOwnership(User user, Long ownerId, String resourceName) {
        if (!user.getId().equals(ownerId)) {
            throw new IllegalArgumentException("You are not allowed to modify this " + resourceName);
        }
    }
}

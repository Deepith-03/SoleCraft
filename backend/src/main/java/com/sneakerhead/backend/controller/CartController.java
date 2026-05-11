package com.sneakerhead.backend.controller;

import com.sneakerhead.backend.dto.CountResponse;
import com.sneakerhead.backend.model.CartItem;
import com.sneakerhead.backend.service.CartService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public List<CartItem> getCart(Authentication authentication) {
        return cartService.getCart(authentication);
    }

    @GetMapping("/count")
    public CountResponse getCartCount(Authentication authentication) {
        return new CountResponse(cartService.getCartCount(authentication));
    }

    @PostMapping("/{id}")
    public CartItem addToCart(@PathVariable Long id, Authentication authentication) {
        return cartService.addToCart(id, authentication);
    }

    @PutMapping("/{id}")
    public CartItem updateQuantity(@PathVariable Long id, @RequestParam Integer quantity, Authentication authentication) {
        return cartService.updateQuantity(id, quantity, authentication);
    }

    @DeleteMapping("/{id}")
    public void removeFromCart(@PathVariable Long id, Authentication authentication) {
        cartService.removeFromCart(id, authentication);
    }
}

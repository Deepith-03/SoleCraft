package com.sneakerhead.backend.controller;

import com.sneakerhead.backend.dto.CountResponse;
import com.sneakerhead.backend.model.WishlistItem;
import com.sneakerhead.backend.service.WishlistService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    private final WishlistService wishlistService;

    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    @GetMapping
    public List<WishlistItem> getWishlist(Authentication authentication) {
        return wishlistService.getWishlist(authentication);
    }

    @GetMapping("/count")
    public CountResponse getWishlistCount(Authentication authentication) {
        return new CountResponse(wishlistService.getWishlistCount(authentication));
    }

    @PostMapping("/{id}")
    public WishlistItem addToWishlist(@PathVariable Long id, Authentication authentication) {
        return wishlistService.addToWishlist(id, authentication);
    }

    @DeleteMapping("/{id}")
    public void removeFromWishlist(@PathVariable Long id, Authentication authentication) {
        wishlistService.removeFromWishlist(id, authentication);
    }
}

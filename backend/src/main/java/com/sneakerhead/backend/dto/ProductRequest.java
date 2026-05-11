package com.sneakerhead.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductRequest {

    @NotBlank
    private String name;

    @NotBlank
    private String brand;

    @NotBlank
    private String description;

    @NotBlank
    private String category;

    @NotNull
    private Double price;

    @NotBlank
    private String image;

    @NotBlank
    private String color;

    @NotNull
    private Integer stockQuantity;

    @NotNull
    private Boolean featured;

    @NotNull
    private Double rating;
}

package com.sneakerhead.backend.config;

import com.sneakerhead.backend.model.Product;
import com.sneakerhead.backend.model.Role;
import com.sneakerhead.backend.model.User;
import com.sneakerhead.backend.repository.ProductRepository;
import com.sneakerhead.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner loadData(ProductRepository productRepository, UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            if (!userRepository.existsByEmail("admin@sneakerhead.com")) {
                User admin = new User();
                admin.setUsername("Admin");
                admin.setEmail("admin@sneakerhead.com");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole(Role.ADMIN);
                userRepository.save(admin);
            }

            if (!userRepository.existsByEmail("deepithgyadav.07@gmail.com")) {
                User admin2 = new User();
                admin2.setUsername("Deepith");
                admin2.setEmail("deepithgyadav.07@gmail.com");
                admin2.setPassword(passwordEncoder.encode("12345"));
                admin2.setRole(Role.ADMIN);

                userRepository.save(admin2);
            }

            if (productRepository.count() == 0) {
                productRepository.saveAll(List.of(
                        new Product(null, "Nike Air Max 270", "Nike",
                                "Breathable daily runner with responsive cushioning.", "Running", 129.99,
                                "https://images.unsplash.com/photo-1542291026-7eec264c27ff", "Red", 25, true, 4.7),
                        new Product(null, "Nike ZoomX Invincible 3", "Nike",
                                "High-stack foam for long-distance comfort.", "Running", 189.99,
                                "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519", "Blue", 18, true, 4.8),
                        new Product(null, "Nike Dunk Low Retro", "Nike", "Street-ready low-top classic.", "Lifestyle",
                                119.99, "https://images.unsplash.com/photo-1608231387042-66d1773070a5", "White", 30,
                                false, 4.6),
                        new Product(null, "Adidas Ultraboost Light", "Adidas",
                                "Energy-returning boost with lightweight knit upper.", "Running", 179.99,
                                "https://images.unsplash.com/photo-1460353581641-37baddab0fa2", "Black", 22, true, 4.7),
                        new Product(null, "Adidas Samba OG", "Adidas", "Timeless terrace style with premium suede.",
                                "Lifestyle", 109.99, "https://images.unsplash.com/photo-1556906781-9a412961c28c",
                                "White", 35, true, 4.9),
                        new Product(null, "Adidas NMD_R1", "Adidas", "Urban silhouette with modern cushioning.",
                                "Lifestyle", 139.99, "https://images.unsplash.com/photo-1588361861040-ac9b1018f6d5",
                                "Grey", 16, false, 4.5),
                        new Product(null, "Puma RS-X Efekt", "Puma", "Chunky retro runner with bold overlays.",
                                "Lifestyle", 124.99, "https://images.unsplash.com/photo-1595341888016-a392ef81b7de",
                                "Orange", 20, false, 4.4),
                        new Product(null, "Puma Deviate Nitro 2", "Puma", "Fast tempo shoe with nitrogen-infused foam.",
                                "Running", 159.99, "https://images.unsplash.com/photo-1543508282-6319a3e2621f", "Green",
                                14, true, 4.6),
                        new Product(null, "New Balance 550", "New Balance",
                                "Vintage basketball-inspired everyday sneaker.", "Lifestyle", 119.99,
                                "https://images.unsplash.com/photo-1560769629-975ec94e6a86", "Cream", 28, true, 4.8),
                        new Product(null, "New Balance 9060", "New Balance",
                                "Futuristic profile with plush cushioning.", "Lifestyle", 149.99,
                                "https://images.unsplash.com/photo-1514996937319-344454492b37", "Beige", 21, false,
                                4.5),
                        new Product(null, "New Balance Fresh Foam X 1080v13", "New Balance",
                                "Soft and smooth premium running shoe.", "Running", 169.99,
                                "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111", "Navy", 17, true, 4.7),
                        new Product(null, "Air Jordan 1 Retro High", "Jordan",
                                "Iconic high-top with heritage court design.", "Basketball", 179.99,
                                "https://images.unsplash.com/photo-1552346154-21d32810aba3", "Black", 24, true, 4.9),
                        new Product(null, "Air Jordan 4 Retro", "Jordan", "Classic hoops silhouette with visible air.",
                                "Basketball", 209.99, "https://images.unsplash.com/photo-1575537302964-96cd47c06b1b",
                                "White", 12, true, 4.8),
                        new Product(null, "Jordan Luka 2", "Jordan", "Performance basketball shoe for quick cuts.",
                                "Basketball", 139.99, "https://images.unsplash.com/photo-1511556532299-8f662fc26c06",
                                "Purple", 15, false, 4.5),
                        new Product(null, "Converse Chuck Taylor All Star", "Converse",
                                "Legendary canvas high-top for casual wear.", "Casual", 69.99,
                                "https://images.unsplash.com/photo-1512374382149-233c42b6a83b", "Black", 40, false,
                                4.6),
                        new Product(null, "Converse Run Star Hike", "Converse",
                                "Platform outsole with bold street attitude.", "Casual", 109.99,
                                "https://images.unsplash.com/photo-1562183241-b937e95585b6", "White", 19, false, 4.4),
                        new Product(null, "Reebok Club C 85", "Reebok", "Clean leather tennis-inspired classic.",
                                "Lifestyle", 89.99, "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a",
                                "White", 29, false, 4.5),
                        new Product(null, "Reebok Nano X4", "Reebok", "Stable trainer built for gym sessions.",
                                "Training", 139.99, "https://images.unsplash.com/photo-1465453869711-7e174808ace9",
                                "Grey", 13, false, 4.4),
                        new Product(null, "Nike Air Force 1 '07", "Nike",
                                "All-time street icon with crisp leather finish.", "Lifestyle", 124.99,
                                "https://images.unsplash.com/photo-1605348532760-6753d2c43329", "White", 33, true, 4.8),
                        new Product(null, "Adidas Forum Low", "Adidas",
                                "Basketball heritage sneaker with modern comfort.", "Lifestyle", 119.99,
                                "https://images.unsplash.com/photo-1491553895911-0055eca6402d", "Blue", 18, false, 4.3),
                        new Product(null, "Puma Suede Classic XXI", "Puma", "Soft suede upper and timeless profile.",
                                "Casual", 84.99, "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77",
                                "Green", 26, false, 4.3),
                        new Product(null, "New Balance 574 Core", "New Balance",
                                "Everyday retro runner with ENCAP support.", "Lifestyle", 99.99,
                                "https://images.unsplash.com/photo-1539185441755-769473a23570", "Grey", 31, false,
                                4.6)));
            }

            Map<String, String> productImages = new HashMap<>();
            productImages.put("Nike Air Max 270", "https://images.unsplash.com/photo-1542291026-7eec264c27ff");
            productImages.put("Nike ZoomX Invincible 3",
                    "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519");
            productImages.put("Nike Dunk Low Retro", "https://images.unsplash.com/photo-1608231387042-66d1773070a5");
            productImages.put("Adidas Ultraboost Light",
                    "https://images.unsplash.com/photo-1460353581641-37baddab0fa2");
            productImages.put("Adidas Samba OG", "https://images.unsplash.com/photo-1556906781-9a412961c28c");
            productImages.put("Adidas NMD_R1", "https://images.unsplash.com/photo-1588361861040-ac9b1018f6d5");
            productImages.put("Puma RS-X Efekt", "https://images.unsplash.com/photo-1595341888016-a392ef81b7de");
            productImages.put("Puma Deviate Nitro 2", "https://images.unsplash.com/photo-1543508282-6319a3e2621f");
            productImages.put("New Balance 550", "https://images.unsplash.com/photo-1560769629-975ec94e6a86");
            productImages.put("New Balance 9060", "https://images.unsplash.com/photo-1514996937319-344454492b37");
            productImages.put("New Balance Fresh Foam X 1080v13",
                    "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111");
            productImages.put("Air Jordan 1 Retro High", "https://images.unsplash.com/photo-1552346154-21d32810aba3");
            productImages.put("Air Jordan 4 Retro", "https://images.unsplash.com/photo-1575537302964-96cd47c06b1b");
            productImages.put("Jordan Luka 2", "https://images.unsplash.com/photo-1511556532299-8f662fc26c06");
            productImages.put("Converse Chuck Taylor All Star",
                    "https://images.unsplash.com/photo-1512374382149-233c42b6a83b");
            productImages.put("Converse Run Star Hike", "https://images.unsplash.com/photo-1562183241-b937e95585b6");
            productImages.put("Reebok Club C 85", "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a");
            productImages.put("Reebok Nano X4", "https://images.unsplash.com/photo-1465453869711-7e174808ace9");
            productImages.put("Nike Air Force 1 '07", "https://images.unsplash.com/photo-1605348532760-6753d2c43329");
            productImages.put("Adidas Forum Low", "https://images.unsplash.com/photo-1491553895911-0055eca6402d");
            productImages.put("Puma Suede Classic XXI", "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77");
            productImages.put("New Balance 574 Core", "https://images.unsplash.com/photo-1539185441755-769473a23570");

            List<Product> products = productRepository.findAll();
            boolean hasChanges = false;
            for (Product product : products) {
                String mappedImage = productImages.get(product.getName());
                if (mappedImage != null && !mappedImage.equals(product.getImage())) {
                    product.setImage(mappedImage);
                    hasChanges = true;
                }
            }
            if (hasChanges) {
                productRepository.saveAll(products);
            }
        };
    }
}

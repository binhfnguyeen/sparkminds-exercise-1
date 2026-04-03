package com.heulwen.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class Exercise1Application {

    public static void main(String[] args) {
        SpringApplication.run(Exercise1Application.class, args);
    }

}

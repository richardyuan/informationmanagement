package com.ictlab.execute;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@ComponentScan("com.ictlab.controller")
@SpringBootApplication
public class Execute {

    public static void main(String[] args) {
        SpringApplication.run(Execute.class, args);
    }
}
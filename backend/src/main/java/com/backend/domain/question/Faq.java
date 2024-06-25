package com.backend.domain.question;

import lombok.Data;

@Data
public class Faq {
    private Integer id;
    private String category;
    private String title;
    private String content;
}

package com.backend.domain.user;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserFile {
    private String fileName;
    private String src;
}

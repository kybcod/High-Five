package com.backend.domain.Product;

import lombok.Data;

@Data
public class auctionDomain {
    private Integer productId;
    private Integer userId;
    private Integer bidPrice;
    private Boolean status;
}

package com.backend.domain.product;

import lombok.Data;

@Data
public class BidList {
    private Integer productId;
    private Integer userId;
    private Integer bidPrice;
    private Boolean status;
}

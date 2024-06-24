package com.backend.domain.auction;

import com.backend.domain.product.Product;
import lombok.Data;

@Data
public class BidList {
    private Integer id;
    private Integer productId;
    private Integer userId;
    private Integer bidPrice;
    private Boolean bidStatus;
    private Product product;
}

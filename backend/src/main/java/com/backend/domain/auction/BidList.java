package com.backend.domain.auction;

import lombok.Data;

@Data
public class BidList {
    private Integer id;
    private Integer productId;
    private Integer userId;
    private Integer bidPrice;
    private Boolean bidStatus;
}

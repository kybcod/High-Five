package com.backend.util;

import lombok.Data;
import org.springframework.data.domain.Page;

@Data
public class PageInfo {
    private int currentPageNumber;
    private int lastPageNumber;
    private int leftPageNumber;
    private int rightPageNumber;
    private int firstPageNumber;
    private int nextPageNumber;
    private int prevPageNumber;

    public PageInfo setting(Page page) {
        int currentPageNumber = page.getNumber(); // 페이지 1부터
        int lastPageNumber = page.getTotalPages(); //  총 페이지 수 = 마지막 페이지 번호

        int leftPageNumber = ((currentPageNumber - 1) / 10) * 10 + 1;
        int rightPageNumber = Math.min(leftPageNumber + 9, lastPageNumber);
        int nextPageNumber = Math.min(currentPageNumber + 1, lastPageNumber);
        int prevPageNumber = Math.max(currentPageNumber - 1, 1);


        this.currentPageNumber = currentPageNumber;
        this.lastPageNumber = lastPageNumber;
        this.leftPageNumber = leftPageNumber;
        this.rightPageNumber = rightPageNumber;
        this.firstPageNumber = 1;
        this.nextPageNumber = nextPageNumber;
        this.prevPageNumber = prevPageNumber;

        return this;
    }
}

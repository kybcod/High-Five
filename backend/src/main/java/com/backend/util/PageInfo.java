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
        int currentPageNumber = page.getNumber(); // 현재 페이지 번호(0부터 시작)
        int lastPageNumber = page.getTotalPages(); //  총 페이지 수

        int leftPageNumber = ((currentPageNumber) / 10) * 10 + 1;
        int prevPageNumber = Math.max(leftPageNumber - 10, 1);

        int rightPageNumber = Math.min(leftPageNumber + 10, lastPageNumber);
        int nextPageNumber = rightPageNumber;


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

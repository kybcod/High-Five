package com.backend.service.product;

import com.backend.mapper.product.ProductLikeMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class ProductLikeService {

    private final ProductLikeMapper mapper;

    public Map<String, Object> like(Map<String, Object> likeInfo, Authentication authentication) {

        Map<String, Object> result = new HashMap<>();
        result.put("like", false);

        Integer productId = (Integer) likeInfo.get("productId");
        Integer userId = Integer.valueOf(authentication.getName());

        // 이미 좋아요가 되어 있다면 delete(count=1)
        int count = mapper.deleteLikeByProductIdAndUserId(productId, userId);

        // 좋아요 안했으면 insert
        if (count == 0) {
            mapper.insertLikeByProductIdAndUserId(productId, userId);
            result.put("like", true);
        }
        result.put("count", mapper.selectCountLikeByProductId(productId));

        return result;
    }

    public List<Integer> getLike(Integer userId) {
        return mapper.selectLikeByUserId(userId);
    }
}




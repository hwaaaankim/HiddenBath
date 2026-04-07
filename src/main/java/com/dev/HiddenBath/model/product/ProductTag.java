package com.dev.HiddenBath.model.product;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name="tb_product_tag")
@Data
public class ProductTag {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="PRODUCT_TAG_ID")
	private Long id;
	
	@Column(name="PRODUCT_TAG_TEXT")
	private String productTagText;
	
	@ManyToMany(mappedBy = "productTags", fetch = FetchType.EAGER)
    private List<Product> products;
	
	@Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ProductTag)) return false;
        ProductTag that = (ProductTag) o;
        return id != null && id.equals(that.getId());
    }

    @Override
    public int hashCode() {
        return id != null ? id.hashCode() : 0;
    }
	
}

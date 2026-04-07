package com.dev.HiddenBath.model.order;

import com.dev.HiddenBath.model.Client;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@DiscriminatorValue("SLIDE")
public class SlideOrder extends Client {

}

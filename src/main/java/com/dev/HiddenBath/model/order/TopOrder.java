package com.dev.HiddenBath.model.order;

import com.dev.HiddenBath.model.Client;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@DiscriminatorValue("TOP")
@Data
@EqualsAndHashCode(callSuper = true)
public class TopOrder extends Client {

    @Column(name="TOP_DOOR_COUNT")
    private String topDoor;
    
    @Column(name="TOP_DOOR_DIRECTION")
    private String topDoorDirection;
}

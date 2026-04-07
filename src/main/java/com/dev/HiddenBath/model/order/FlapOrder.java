package com.dev.HiddenBath.model.order;

import com.dev.HiddenBath.model.Client;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@DiscriminatorValue("FLAP")
@Data
@EqualsAndHashCode(callSuper = true)
public class FlapOrder extends Client {

    @Column(name="FLAP_DOOR_DIRECTION")
    private String flapDoorDirection;

}

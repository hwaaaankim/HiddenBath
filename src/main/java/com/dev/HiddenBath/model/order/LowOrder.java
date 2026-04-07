package com.dev.HiddenBath.model.order;

import com.dev.HiddenBath.model.Client;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@DiscriminatorValue("LOW")
@Data
@EqualsAndHashCode(callSuper = true)
public class LowOrder extends Client {

    @Column(name="LOW_FORM")
    private String lowForm;

    @Column(name="LOW_MARBLE_COLOR")
    private String lowMarbleColor;
    
    @Column(name="LOW_WASHSTAND")
    private String lowWashstand;
    
    @Column(name="LOW_WASHSTAND_TOPBALL")
    private String lowWashstandTopball;
    
    @Column(name="LOW_WASHSTAND_DIRECTION")
    private String lowWashstandDirection;
    
    @Column(name="LOW_DOOR")
    private String lowDoor;
    
    @Column(name="LOW_DOOR_COUNT")
    private String lowDoorCount;
    
    @Column(name="LOW_HANDLE")
    private String lowHandle;
    
    @Column(name="LOW_HANDLE_COLOR")
    private String lowHandleColor;

    // LowOrder에 특화된 필드 추가
}

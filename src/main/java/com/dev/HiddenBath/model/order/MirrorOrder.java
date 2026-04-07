package com.dev.HiddenBath.model.order;

import com.dev.HiddenBath.model.Client;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@DiscriminatorValue("MIRROR")
@Data
@EqualsAndHashCode(callSuper = true)
public class MirrorOrder extends Client {

    @Column(name="MIRROR_FRAME")
    private String mirrorFrame;

    @Column(name="MIRROR_FRAME_STYLE")
    private String mirrorFrameStyle;
    
    @Column(name="MIRROR_FRAME_COLOR")
    private String mirrorFrameColor;

    @Column(name="MIRROR_LED_METHOD")
    private String mirrorLedMethod;
    
    @Column(name="MIRROR_LED_FORM")
    private String mirrorLedForm;

}

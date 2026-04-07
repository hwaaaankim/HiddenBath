package com.dev.HiddenBath.model;

import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorColumn;
import jakarta.persistence.DiscriminatorType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name="tb_client")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "ORDER_TYPE", discriminatorType = DiscriminatorType.STRING)
@Data
public class Client {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="CLIENT_ID")
    private Long id;
    
    @Column(name="CLIENT_NAME", nullable = false)  // 고객 이름은 반드시 있어야 한다
    private String name;
    
    @Column(name="CLIENT_EMAIL", nullable = false)  // 이메일도 필수
    private String email;
    
    @Column(name="CLIENT_PHONE", nullable = false)  // 전화번호도 필수
    private String phone;
    
    @Column(name="CLIENT_DATE", nullable = true)
    private Date joinDate;
    
    @Column(name="CLIENT_CHECK_DATE", nullable = true)
    private Date checkDate;
    
    @Column(name="CLIENT_SUBJECT", nullable = true)
    private String subject;
    
    @Column(name="CLIENT_CONTACT", nullable = true)
    private Boolean contact;
    
    @Column(name="CLIENT_MESSAGE", nullable = true)
    private String message;

    // 공통 필드
    @Column(name="MODEL", nullable = true)
    private String model;

    @Column(name="COLOR", nullable = true)
    private String color;

    @Column(name="WIDTH", nullable = true)
    private String width;

    @Column(name="HEIGHT", nullable = true)
    private String height;

    @Column(name="DEPTH", nullable = true)
    private String depth;

    @Column(name="LED", nullable = true)
    private String led;

    @Column(name="LED_COLOR", nullable = true)
    private String ledColor;

    @Column(name="CONCENT", nullable = true)
    private String concent;

    @Column(name="CONCENT_POSITION", nullable = true)
    private String concentPosition;
}
























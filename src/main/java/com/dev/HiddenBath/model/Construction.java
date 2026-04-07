package com.dev.HiddenBath.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name="tb_construction")
public class Construction {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="CONSTRUCTION_ID")
	private Long id;
	
	@Column(name="CONSTRUCTION_PATH")
	private String path;
	
	@Column(name="CONSTRUCTION_NAME")
	private String name;
	
	@Column(name="CONSTRUCTION_ROAD")
	private String road;
	
	@Column(name="CONSTRUCTION_THUMB_PATH")
	private String thumbPath;
	
	@Column(name="CONSTRUCTION_THUMB_ROAD")
	private String thumbRoad;
	
	@Column(name="CONSTRUCTION_THUMB_NAME")
	private String thumbName;
	
}















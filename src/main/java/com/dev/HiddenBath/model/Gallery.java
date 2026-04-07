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
@Table(name="tb_gallery")
public class Gallery {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="GALLERY_ID")
	private Long id;
	
	@Column(name="GALLERY_PATH")
	private String path;
	
	@Column(name="GALLERY_NAME")
	private String name;
	
	@Column(name="GALLERY_ROAD")
	private String road;
	
	@Column(name="GALLERY_THUMB_PATH")
	private String thumbPath;
	
	@Column(name="GALLERY_THUMB_ROAD")
	private String thumbRoad;
	
	@Column(name="GALLERY_THUMB_NAME")
	private String thumbName;
	
}















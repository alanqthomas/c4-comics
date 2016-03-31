package com.maximumgreen.c4;

import java.util.List;

import javax.jdo.annotations.*;

@PersistenceCapable(identityType = IdentityType.APPLICATION)
public class Tag {
	//Automatically generate a unique id for each tag
	@PrimaryKey
	@Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
	private Long id;
	
	//Name of tag, which should be unique across the datastore
	@Persistent
	@Unique
	private String name;
	
	//List of COMIC ids tagged with this tag
	@Persistent
	private List<Long> comicsWithTag;
	
	//empty constructor
	public Tag(){
	}

	//Getters and setters
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public List<Long> getComicsWithTag() {
		return comicsWithTag;
	}

	public void setComicsWithTag(List<Long> comicsWithTag) {
		this.comicsWithTag = comicsWithTag;
	}
		
}